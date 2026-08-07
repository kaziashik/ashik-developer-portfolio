import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import config from "../src/config/index.js";
import { profileService } from "../src/modules/profile/profile.service.js";

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("Usage: node scripts/uploadResume.js <path-to-cv.pdf>");
    process.exit(1);
  }

  if (!config.databaseUrl) {
    console.error("DATABASE_URL is not set in .env");
    process.exit(1);
  }

  const resolved = path.resolve(filePath);
  const buffer = await fs.readFile(resolved);
  const filename = path.basename(resolved);

  await mongoose.connect(config.databaseUrl);
  const fileId = await profileService.saveResume(buffer, filename);
  console.log(`CV uploaded to MongoDB GridFS. resumeFileId=${fileId}`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
