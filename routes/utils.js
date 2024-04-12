import express from "express";
import { misclController } from "../controllers/index.js";
import { firebaseAuth, regCheck } from "../middlewares/index.js";

const router = express.Router();

router.get(
  "/check-registration",
  firebaseAuth,
  regCheck,
  misclController.checkRegistration
);
export default router;
