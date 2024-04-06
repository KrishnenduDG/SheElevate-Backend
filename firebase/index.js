import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";

import fs from "fs";
import path from "path";
import { __dirname } from "../globals.js";

const creds = JSON.parse(
  fs.readFileSync(path.join(__dirname, "firebase", "credentials.json"), "utf-8")
);

export const firebaseApp = initializeApp({
  credential: admin.credential.cert(creds),
});
