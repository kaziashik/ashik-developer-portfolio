import mongoose from "mongoose";
import { GridFSBucket, ObjectId } from "mongodb";
import { Profile } from "./profile.model.js";
import { AppError } from "../../utils/AppError.js";

const RESUME_BUCKET = "resumes";

function getResumeBucket() {
  const db = mongoose.connection.db;
  if (!db) {
    throw new AppError("Database not connected", 503);
  }
  return new GridFSBucket(db, { bucketName: RESUME_BUCKET });
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

const DEFAULT_SOCIAL_LINKS = {
  github: "https://github.com/kaziashik",
  linkedin: "https://www.linkedin.com/in/kazi-ashik96",
};

function resumeFetchCandidates(url) {
  const candidates = [url.trim()];

  if (url.includes("/image/upload/")) {
    candidates.push(url.replace("/image/upload/", "/raw/upload/"));
  }

  return [...new Set(candidates)];
}

async function fetchResumeFile(url) {
  let lastStatus = 0;

  for (const candidate of resumeFetchCandidates(url)) {
    try {
      const response = await fetch(candidate);
      lastStatus = response.status;
      if (!response.ok) continue;

      const buffer = Buffer.from(await response.arrayBuffer());
      const contentType = response.headers.get("content-type") || "application/pdf";
      return { buffer, contentType };
    } catch {
      // try next candidate
    }
  }

  if (lastStatus === 401 || lastStatus === 403) {
    throw new AppError(
      "CV file is not publicly accessible. Please re-upload your CV from the admin Update CV button.",
      502
    );
  }

  throw new AppError("Could not fetch CV file", 502);
}

const SKILL_FIELD_MAP = { research: "researchSkills", development: "developmentSkills" };

const resolveSkillField = (type) => {
  const field = SKILL_FIELD_MAP[type];
  if (!field) {
    throw new AppError(`Invalid skills type "${type}". Use "research" or "development".`, 400);
  }
  return field;
};

// There is only ever one profile document. If it doesn't exist yet
// (first run, before you've filled anything in), create an empty one
// so GET /api/profile never 404s.
const getProfile = async () => {
  let profile = await Profile.findOne();
  if (!profile) {
    profile = await Profile.create({ links: { ...DEFAULT_SOCIAL_LINKS } });
    return profile.toObject();
  }

  let changed = false;
  profile.links = profile.links || {};
  if (!profile.links.github?.trim()) {
    profile.links.github = DEFAULT_SOCIAL_LINKS.github;
    changed = true;
  }
  if (!profile.links.linkedin?.trim()) {
    profile.links.linkedin = DEFAULT_SOCIAL_LINKS.linkedin;
    changed = true;
  }

  // Keep the public resume label/download name in sync with GridFS filename.
  if (!profile.resumeFileName?.trim() && profile.resumeFileId) {
    try {
      const bucket = getResumeBucket();
      const files = await bucket.find({ _id: new ObjectId(profile.resumeFileId) }).toArray();
      const storedName = files[0]?.filename?.trim();
      if (storedName) {
        profile.resumeFileName = storedName;
        changed = true;
      }
    } catch {
      // ignore sync errors; resume streaming still works
    }
  }

  if (changed) await profile.save();

  return profile.toObject();
};

const streamResume = async () => {
  const profile = await getProfile();

  if (profile.resumeFileId) {
    const bucket = getResumeBucket();
    const fileId = new ObjectId(profile.resumeFileId);
    const files = await bucket.find({ _id: fileId }).toArray();

    if (!files.length) {
      throw new AppError("No CV uploaded yet", 404);
    }

    const buffer = await streamToBuffer(bucket.openDownloadStream(fileId));
    return {
      buffer,
      contentType: files[0].contentType || "application/pdf",
      filename: profile.resumeFileName || files[0].filename || "Resume.pdf",
    };
  }

  const url = profile.resumePdfUrl?.trim();
  if (!url) {
    throw new AppError("No CV uploaded yet", 404);
  }

  const fetched = await fetchResumeFile(url);
  return {
    ...fetched,
    filename: profile.resumeFileName || "Resume.pdf",
  };
};

const saveResume = async (buffer, filename = "Resume.pdf") => {
  const bucket = getResumeBucket();
  const profile = await Profile.findOne();
  const safeName = String(filename || "Resume.pdf")
    .replace(/[/\\?%*:|"<>]/g, "-")
    .trim() || "Resume.pdf";

  if (profile?.resumeFileId) {
    try {
      await bucket.delete(new ObjectId(profile.resumeFileId));
    } catch {
      // Previous file may already be gone.
    }
  }

  const fileId = await new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(safeName, {
      contentType: "application/pdf",
    });

    uploadStream.on("error", reject);
    uploadStream.on("finish", () => resolve(uploadStream.id));
    uploadStream.end(buffer);
  });

  await Profile.findOneAndUpdate(
    {},
    {
      resumeFileId: fileId.toString(),
      resumePdfUrl: "",
      resumeFileName: safeName,
    },
    { upsert: true, new: true }
  );

  return { fileId: fileId.toString(), filename: safeName };
};

const updateProfile = async (payload) => {
  // Never allow the skills arrays to be overwritten wholesale through this
  // route — they're managed through the dedicated skills endpoints below,
  // so a partial PUT here can't accidentally wipe them out.
  const { researchSkills, developmentSkills, ...safePayload } = payload;

  const profile = await Profile.findOneAndUpdate({}, safePayload, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });
  return profile;
};

const addSkillCategory = async (type, { category, items, order }) => {
  const field = resolveSkillField(type);
  if (!category || !Array.isArray(items) || items.length === 0) {
    throw new AppError("category and a non-empty items array are required", 400);
  }

  const profile = await Profile.findOneAndUpdate(
    {},
    { $push: { [field]: { category, items, order: order ?? 0 } } },
    { new: true, upsert: true, runValidators: true }
  );
  return profile[field];
};

const updateSkillCategory = async (type, skillId, payload) => {
  const field = resolveSkillField(type);
  const setOps = {};
  if (payload.category !== undefined) setOps[`${field}.$.category`] = payload.category;
  if (payload.items !== undefined) setOps[`${field}.$.items`] = payload.items;
  if (payload.order !== undefined) setOps[`${field}.$.order`] = payload.order;

  if (Object.keys(setOps).length === 0) {
    throw new AppError("Provide at least one of category, items, or order to update", 400);
  }

  const profile = await Profile.findOneAndUpdate(
    { [`${field}._id`]: skillId },
    { $set: setOps },
    { new: true, runValidators: true }
  );
  if (!profile) throw new AppError("Skill category not found", 404);
  return profile[field].id(skillId);
};

const deleteSkillCategory = async (type, skillId) => {
  const field = resolveSkillField(type);
  const profile = await Profile.findOneAndUpdate(
    {},
    { $pull: { [field]: { _id: skillId } } },
    { new: true }
  );
  if (!profile) throw new AppError("Profile not found", 404);
  return profile[field];
};

const reorderSkills = async (type, orderPairs) => {
  const field = resolveSkillField(type);
  if (!Array.isArray(orderPairs) || orderPairs.length === 0) {
    throw new AppError("Body must be a non-empty array of { skillId, order } pairs", 400);
  }

  const profile = await Profile.findOne();
  if (!profile) throw new AppError("Profile not found", 404);

  orderPairs.forEach(({ skillId, order }) => {
    const item = profile[field].id(skillId);
    if (item) item.order = order;
  });

  await profile.save();
  return profile[field];
};

export const profileService = {
  getProfile,
  updateProfile,
  streamResume,
  saveResume,
  addSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  reorderSkills,
};

export default profileService;
