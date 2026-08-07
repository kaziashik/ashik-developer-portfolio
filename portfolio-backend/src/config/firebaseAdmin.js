import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import config from "./index.js";

const decoded = Buffer.from(config.firebaseServiceKey, "base64").toString("utf8");
const serviceAccount = JSON.parse(decoded);

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const auth = getAuth();

export { auth };