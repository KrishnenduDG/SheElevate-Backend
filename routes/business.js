import express from "express";
import { businessController } from "../controllers/index.js";
import { firebaseAuth, regCheck } from "../middlewares/index.js";

const router = express.Router();

router
  .get("/", firebaseAuth, regCheck, businessController.getProfile)
  .post("/register", firebaseAuth, businessController.register);
export default router;
