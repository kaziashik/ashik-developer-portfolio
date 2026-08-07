// Run once after setting ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD in .env:
//   npm run seed:admin
// There is no public registration endpoint on purpose — this is the only
// way an admin account gets created.

import mongoose from "mongoose";
import config from "../src/config/index.js";
import { Admin } from "../src/modules/admin/admin.model.js";

const run = async () => {
  if (!config.databaseUrl) {
    console.error("DATABASE_URL is not set in .env — add your MongoDB Atlas connection string first.");
    process.exit(1);
  }
  if (!config.adminEmail || !config.adminPassword) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env before seeding.");
    process.exit(1);
  }

  await mongoose.connect(config.databaseUrl);
  console.log("Connected to MongoDB Atlas");

  const existing = await Admin.findOne({ email: config.adminEmail.toLowerCase().trim() });
  if (existing) {
    // console.log(`Admin already exists for ${config.adminEmail} — nothing to do.`);
  } else {
    const admin = await Admin.create({
      name: config.adminName,
      email: config.adminEmail,
      password: config.adminPassword, // hashed automatically by the pre-save hook
    });
    // console.log(`Admin created: ${admin.email} (id: ${admin._id})`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exit(1);
});
