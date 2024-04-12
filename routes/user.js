import express from "express";
import { userController } from "../controllers/index.js";
import { firebaseAuth, regCheck } from "../middlewares/index.js";

const router = express.Router();

router
  .get("/:username", firebaseAuth, regCheck, userController.getProfile)
  .post("/register", firebaseAuth, userController.register);
export default router;
