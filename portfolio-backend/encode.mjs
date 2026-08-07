// encode.mjs  (or encode.cjs if you prefer require)
import fs from "fs";

const key = fs.readFileSync("./src/config/ashikportfolio-auth-firebase-adminsdk-service-account.json", "utf8");
const base64 = Buffer.from(key).toString("base64");
// console.log(base64);