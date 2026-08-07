// Reusable scaffolding tool. Run with: node scripts/generateModules.mjs
// Add a new entry to MODULES below to scaffold a 13th (or 14th...) collection later —
// it writes model.js / service.js / controller.js / routes.js in one shot.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODULES_ROOT = path.join(__dirname, "..", "src", "modules");

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const MODULES = [
  {
    name: "experience",
    modelName: "Experience",
    schema: `{
    role: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    category: { type: String, enum: ["Research", "Industry", "Teaching"] },
    highlights: [{ type: String }],
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  }`,
    filterFields: ["visibility", "category"],
    booleanFields: [],
    sort: "{ startDate: -1 }",
  },
  {
    name: "education",
    modelName: "Education",
    schema: `{
    degree: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    gpa: { type: String, trim: true },
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  }`,
    filterFields: ["visibility"],
    booleanFields: [],
    sort: "{ startDate: -1 }",
  },
  {
    name: "project",
    modelName: "Project",
    schema: `{
    title: { type: String, required: true, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    toolsUsed: [{ type: String }],
    details: [{ type: String }],
    imageUrls: [{ type: String }],
    links: {
      github: { type: String, default: "" },
      live: { type: String, default: "" },
      paper: { type: String, default: "" },
    },
    featured: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: true }, // ← ADD THIS LINE
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  }`,
    filterFields: ["visibility"],
    booleanFields: ["featured"],
    sort: "{ startDate: -1 }",
  },
  {
    name: "publication",
    modelName: "Publication",
    schema: `{
    idTag: { type: String, trim: true },
    type: { type: String, enum: ["Journal", "Conference", "Thesis", "Patent", "In Submission"], required: true },
    title: { type: String, required: true, trim: true },
    authors: { type: String, trim: true },
    venue: { type: String, trim: true },
    publicationDate: { type: String, trim: true },
    status: { type: String, enum: ["Published", "In Submission", "Under Review"], default: "Published" },
    indexing: { type: String, trim: true },
    metrics: {
      citeScore: { type: Number },
      impactFactor: { type: Number },
    },
    doiOrLink: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  }`,
    filterFields: ["visibility", "type", "status"],
    booleanFields: ["featured"],
    sort: "{ publicationDate: -1 }",
  },
  {
    name: "award",
    modelName: "Award",
    schema: `{
    title: { type: String, required: true, trim: true },
    issuer: { type: String, trim: true },
    year: { type: Number },
    prize: { type: String, default: "" },
    description: { type: String, default: "" },
    certificateUrl: { type: String, default: "" },
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  }`,
    filterFields: ["visibility"],
    booleanFields: [],
    sort: "{ year: -1 }",
  },
  {
    name: "certification",
    modelName: "Certification",
    schema: `{
    title: { type: String, required: true, trim: true },
    issuer: { type: String, trim: true },
    date: { type: String, trim: true },
    credentialUrl: { type: String, default: "" },
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  }`,
    filterFields: ["visibility"],
    booleanFields: [],
    sort: "{ date: -1 }",
  },
  {
    name: "membership",
    modelName: "Membership",
    schema: `{
    title: { type: String, required: true, trim: true },
    membershipId: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  }`,
    filterFields: ["visibility"],
    booleanFields: [],
    sort: "{ startDate: -1 }",
  },
  {
    name: "leadership",
    modelName: "Leadership",
    schema: `{
    role: { type: String, required: true, trim: true },
    organization: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    details: [{ type: String }],
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  }`,
    filterFields: ["visibility"],
    booleanFields: [],
    sort: "{ startDate: -1 }",
  },
  {
    name: "volunteer",
    modelName: "Volunteer",
    schema: `{
    role: { type: String, required: true, trim: true },
    organization: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    details: [{ type: String }],
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  }`,
    filterFields: ["visibility"],
    booleanFields: [],
    sort: "{ startDate: -1 }",
  },
  {
    name: "reference",
    modelName: "Reference",
    schema: `{
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    institution: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    relationship: { type: String, trim: true },
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  }`,
    filterFields: ["visibility"],
    booleanFields: [],
    sort: "{ createdAt: -1 }",
    protectRead: true, // GET routes require auth — contact info shouldn't be fully public
  },
  {
    name: "post",
    modelName: "Post",
    schema: `{
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: ["hobby", "script", "note", "story"], default: "note" },
    content: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },
    tags: [{ type: String }],
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  }`,
    filterFields: ["visibility", "category"],
    booleanFields: [],
    sort: "{ createdAt: -1 }",
  },
];

const modelTemplate = ({ modelName, schema }) => `import mongoose from "mongoose";

const ${modelName.toLowerCase()}Schema = new mongoose.Schema(
  ${schema.trim()},
  { timestamps: true }
);

export const ${modelName} = mongoose.model("${modelName}", ${modelName.toLowerCase()}Schema);
export default ${modelName};
`;

const serviceTemplate = ({ name, modelName, filterFields, booleanFields, sort }) => {
  const Name = cap(name);
  const filterLines = filterFields
    .map((f) => {
      if (booleanFields.includes(f)) {
        return `  if (query.${f} !== undefined) filter.${f} = query.${f} === "true";`;
      }
      return `  if (query.${f} !== undefined) filter.${f} = query.${f};`;
    })
    .join("\n");

  return `import { ${modelName} } from "./${name}.model.js";
import { AppError } from "../../utils/AppError.js";

const getAll${Name} = async (query) => {
  const filter = {};
${filterLines || "  // no filterable query params for this collection"}
  return ${modelName}.find(filter).sort(${sort});
};

const get${Name}ById = async (id) => {
  const item = await ${modelName}.findById(id);
  if (!item) throw new AppError("${Name} not found", 404);
  return item;
};

const create${Name} = async (payload) => {
  return ${modelName}.create(payload);
};

const update${Name} = async (id, payload) => {
  const item = await ${modelName}.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!item) throw new AppError("${Name} not found", 404);
  return item;
};

const delete${Name} = async (id) => {
  const item = await ${modelName}.findByIdAndDelete(id);
  if (!item) throw new AppError("${Name} not found", 404);
  return item;
};

export const ${name}Service = {
  getAll${Name},
  get${Name}ById,
  create${Name},
  update${Name},
  delete${Name},
};

export default ${name}Service;
`;
};

const controllerTemplate = ({ name }) => {
  const Name = cap(name);
  return `import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { ${name}Service } from "./${name}.service.js";

const getAll${Name} = catchAsync(async (req, res) => {
  const items = await ${name}Service.getAll${Name}(req.query);
  sendResponse(res, { statusCode: 200, message: "${Name} list retrieved", data: items });
});

const get${Name}ById = catchAsync(async (req, res) => {
  const item = await ${name}Service.get${Name}ById(req.params.id);
  sendResponse(res, { statusCode: 200, message: "${Name} retrieved", data: item });
});

const create${Name} = catchAsync(async (req, res) => {
  const item = await ${name}Service.create${Name}(req.body);
  sendResponse(res, { statusCode: 201, message: "${Name} created", data: item });
});

const update${Name} = catchAsync(async (req, res) => {
  const item = await ${name}Service.update${Name}(req.params.id, req.body);
  sendResponse(res, { statusCode: 200, message: "${Name} updated", data: item });
});

const delete${Name} = catchAsync(async (req, res) => {
  const item = await ${name}Service.delete${Name}(req.params.id);
  sendResponse(res, { statusCode: 200, message: "${Name} deleted", data: item });
});

export const ${name}Controller = {
  getAll${Name},
  get${Name}ById,
  create${Name},
  update${Name},
  delete${Name},
};

export default ${name}Controller;
`;
};

const routesTemplate = ({ name, protectRead }) => {
  const Name = cap(name);
  const getAllAuth = protectRead ? "auth(), " : "";
  const getOneAuth = protectRead ? "auth(), " : "";
  return `import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { ${name}Controller } from "./${name}.controller.js";

const router = Router();

router.get("/", ${getAllAuth}${name}Controller.getAll${Name});
router.get("/:id", ${getOneAuth}${name}Controller.get${Name}ById);
router.post("/", auth(), ${name}Controller.create${Name});
router.patch("/:id", auth(), ${name}Controller.update${Name});
router.delete("/:id", auth(), ${name}Controller.delete${Name});

export default router;
`;
};

for (const mod of MODULES) {
  const dir = path.join(MODULES_ROOT, mod.name);
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(path.join(dir, `${mod.name}.model.js`), modelTemplate(mod));
  fs.writeFileSync(path.join(dir, `${mod.name}.service.js`), serviceTemplate(mod));
  fs.writeFileSync(path.join(dir, `${mod.name}.controller.js`), controllerTemplate(mod));
  fs.writeFileSync(path.join(dir, `${mod.name}.routes.js`), routesTemplate(mod));

  // console.log(`Generated module: ${mod.name}`);
}

// console.log("\nAll modules generated.");
