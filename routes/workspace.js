import express from "express";
import { businessLabel, userLabel } from "../constants.js";
import { workspaceController } from "../controllers/index.js";
import { firebaseAuth, regCheck, rolesRequired } from "../middlewares/index.js";

const router = express.Router();

/* 
  "/" => For an User to get all of their workspace
  "/get" => For businesses to get all of their category-matched workspace

*/
router
  .get(
    "/",
    firebaseAuth,
    regCheck,
    (req, res, next) => rolesRequired(req, res, next, [userLabel]),
    workspaceController.getUserWorkspaces
  )
  .get(
    "/:username/:workspaceName",
    firebaseAuth,
    regCheck,
    workspaceController.getWorkspaceDetails
  )
  .post(
    "/",
    firebaseAuth,
    regCheck,
    (req, res, next) => rolesRequired(req, res, next, [userLabel]),
    workspaceController.createWorkspace
  )
  .delete(
    "/",
    firebaseAuth,
    regCheck,
    (req, res, next) => rolesRequired(req, res, next, [userLabel]),
    workspaceController.deleteWorkspace
  )
  .get(
    "/get",
    firebaseAuth,
    regCheck,
    (req, res, next) => rolesRequired(req, res, next, [businessLabel]),
    workspaceController.getCategoryWiseWorkspace
  );

export default router;
