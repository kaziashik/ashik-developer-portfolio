import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL,
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "dev_access_secret_change_me",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "dev_refresh_secret_change_me",
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1d",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  adminName: process.env.ADMIN_NAME || "Admin",
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,

 emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS, 
  firebaseServiceKey: process.env.FIREBASE_SERVISE_KEY, // 👈 added


  clientUrls: (process.env.CLIENT_URLS || "http://localhost:5173,http://localhost:3000,https://ashikportfolio-auth.web.app")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
};



export default config;
