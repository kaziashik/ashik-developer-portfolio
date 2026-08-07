# Required Backend Additions

Your frontend (this project) needs **two small additions** to the backend you already have running. Neither touches your existing `firebase-login` bridge or anything else you've customized — both are isolated to the `project` module.

---

## 1. Add `isPublic` to the Project schema

This powers the "Show Project to Visitors" toggle. Without it, the field gets silently dropped by Mongoose (schemas strip unknown fields by default), and the toggle button will look like it works but never actually persist.

**File:** `src/modules/project/project.model.js`

Add one line to the schema:
```js
const projectSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);
```

## 2. Split public vs admin project listing

Right now, `GET /api/projects` is fully public and returns everything. We need:
- The **public** route to always exclude `isPublic: false` projects — so hidden projects can never leak to visitors, no matter what query params someone sends
- A new **admin-only** route that returns everything (including hidden), so your inline dashboard controls can see and toggle them

**File:** `src/modules/project/project.service.js`

Replace `getAllProject` with two functions:
```js
const getAllProject = async (query) => {
  const filter = { isPublic: { $ne: false } }; // visitors never see hidden projects
  if (query.visibility !== undefined) filter.visibility = query.visibility;
  if (query.featured !== undefined) filter.featured = query.featured === "true";
  return Project.find(filter).sort({ startDate: -1 });
};

const getAllProjectForAdmin = async (query) => {
  const filter = {}; // admin sees everything, hidden or not
  if (query.visibility !== undefined) filter.visibility = query.visibility;
  if (query.featured !== undefined) filter.featured = query.featured === "true";
  return Project.find(filter).sort({ startDate: -1 });
};
```
Add `getAllProjectForAdmin` to the exported `projectService` object at the bottom of the file.

**File:** `src/modules/project/project.controller.js`

Add a matching controller function:
```js
const getAllProjectForAdmin = catchAsync(async (req, res) => {
  const items = await projectService.getAllProjectForAdmin(req.query);
  sendResponse(res, { statusCode: 200, message: "All projects retrieved", data: items });
});
```
Add it to the exported `projectController` object.

**File:** `src/modules/project/project.routes.js`

Add the new route **above** the existing `/:id` route (order matters — otherwise Express tries to match `admin` as an `:id`):
```js
router.get("/admin", auth(), projectController.getAllProjectForAdmin); // ← ADD THIS
router.get("/", projectController.getAllProject);
router.get("/:id", projectController.getProjectById);
router.post("/", auth(), projectController.createProject);
router.patch("/:id", auth(), projectController.updateProject);
router.delete("/:id", auth(), projectController.deleteProject);
```

---

## 3. Same additions for Experience and Education

The Experience and Education sections now have the identical admin controls as Projects — Add, Update, Delete, and a "Show/Hide from Visitors" toggle. They need the same two changes as Projects, applied to their own modules.

### `src/modules/experience/experience.model.js`
```js
const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    category: { type: String, enum: ["Research", "Industry", "Teaching"] },
    highlights: [{ type: String }],
    isPublic: { type: Boolean, default: true }, // ← ADD THIS LINE
    visibility: [{ type: String, enum: ["job", "academic", "personal"] }],
  },
  { timestamps: true }
);
```

### `src/modules/experience/experience.service.js`
```js
const getAllExperience = async (query) => {
  const filter = { isPublic: { $ne: false } };
  if (query.visibility !== undefined) filter.visibility = query.visibility;
  if (query.category !== undefined) filter.category = query.category;
  return Experience.find(filter).sort({ startDate: -1 });
};

const getAllExperienceForAdmin = async (query) => {
  const filter = {};
  if (query.visibility !== undefined) filter.visibility = query.visibility;
  if (query.category !== undefined) filter.category = query.category;
  return Experience.find(filter).sort({ startDate: -1 });
};
```
Add `getAllExperienceForAdmin` to the exported `experienceService` object.

### `src/modules/experience/experience.controller.js`
```js
const getAllExperienceForAdmin = catchAsync(async (req, res) => {
  const items = await experienceService.getAllExperienceForAdmin(req.query);
  sendResponse(res, { statusCode: 200, message: "All experience retrieved", data: items });
});
```
Add it to the exported `experienceController` object.

### `src/modules/experience/experience.routes.js`
```js
router.get("/admin", auth(), experienceController.getAllExperienceForAdmin); // ← ADD, above "/"
router.get("/", experienceController.getAllExperience);
router.get("/:id", experienceController.getExperienceById);
router.post("/", auth(), experienceController.createExperience);
router.patch("/:id", auth(), experienceController.updateExperience);
router.delete("/:id", auth(), experienceController.deleteExperience);
```

---

Repeat the exact same four edits for `src/modules/education/` (`education.model.js`, `education.service.js`, `education.controller.js`, `education.routes.js`) — same `isPublic` field, same `getAllEducationForAdmin` function, same `/admin` route added above `/`. The shape is identical; only the model/variable names change from `Experience` → `Education`.

---

That's it — restart your backend (`npm run dev`) after these edits, and `isPublic` + the three `/admin` routes (`projects`, `experiences`, `education`) will all work exactly as this frontend expects.
