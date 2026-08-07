import mongoose from "mongoose";
import config from "../src/config/index.js";
import { Profile } from "../src/modules/profile/profile.model.js";

const LINKS = {
  github: "https://github.com/kaziashik",
  linkedin: "https://www.linkedin.com/in/kazi-ashik96",
};

async function main() {
  if (!config.databaseUrl) {
    console.error("DATABASE_URL is not set in .env");
    process.exit(1);
  }
  await mongoose.connect(config.databaseUrl);
  const profile = await Profile.findOneAndUpdate(
    {},
    { $set: { "links.github": LINKS.github, "links.linkedin": LINKS.linkedin } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  console.log("Profile social links updated:", profile.links);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
