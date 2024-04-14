import { failureLabel, successLabel } from "../constants.js";
import { businessRepo, workspaceRepo } from "../repository/index.js";
import { getDefaultWorkspaceCoverPic } from "../utils/index.js";

export class WorkspaceController {
  constructor() {
    this.workspaceRepo = workspaceRepo;
    this.businessRepo = businessRepo;
  }

  getUserWorkspaces = async (req, res) => {
    const { serverFlag, msg, workspaces } =
      await this.workspaceRepo.getUserWokspaces(res.locals.signedInEntity.uid);

    if (!serverFlag)
      return res
        .status(500)
        .json({ status: failureLabel, msg: "Internal Server Error" });

    return res
      .status(200)
      .json({ status: successLabel, msg: "Workspaces fetched", workspaces });
  };

  createWorkspace = async (req, res) => {
    const { name, desc, coverPic, productPics, categories } = req.body;
    const wsPayload = {
      name,
      desc,
      coverPic: coverPic || getDefaultWorkspaceCoverPic(),
      productPics,
      categories,
    };

    const targetWorkspace = await this.workspaceRepo.findWorkspaceByUser(
      res.locals.signedInEntity.username,
      name
    );
    if (!targetWorkspace.serverFlag)
      return res
        .status(500)
        .json({ status: failureLabel, msg: "Internal Server Error" });

    if (targetWorkspace.resFlag)
      return res.status(409).json({
        status: failureLabel,
        msg: "Workspace with same name already exists for the user",
      });

    const { serverFlag, msg, workspace } =
      await this.workspaceRepo.addWorkspace(
        wsPayload,
        res.locals.signedInEntity
      );

    if (!serverFlag)
      return res
        .status(500)
        .json({ status: failureLabel, msg: "Internal Server Error" });

    return res
      .status(201)
      .json({ status: successLabel, msg: "Workspace Created", workspace });
  };

  // Later
  deleteWorkspace = async (req, res) => {};

  // Later
  getCategoryWiseWorkspace = async (req, res) => {
    const { serverFlag, msg, categories } =
      await this.businessRepo.getBusinessCategories(
        res.locals.signedInEntity.bid
      );

    if (!serverFlag)
      return res
        .status(500)
        .json({ status: failureLabel, msg: "Internal Server Error" });

    const categorySearchRes = await this.workspaceRepo.getWorkspaceByCategory(
      categories
    );

    if (!categorySearchRes.serverFlag)
      return res
        .status(500)
        .json({ status: failureLabel, msg: "Internal Server Error" });

    return res.status(200).json({
      status: successLabel,
      msg: "Workspaces fetched",
      workspaces: categorySearchRes.workspaces,
    });
  };

  getWorkspaceDetails = async (req, res) => {
    const { username, workspaceName } = req.params;

    const { serverFlag, resFlag, msg, workspace } =
      await this.workspaceRepo.findWorkspaceByUser(username, workspaceName);

    if (!serverFlag)
      return res
        .status(500)
        .json({ status: failureLabel, msg: "Internal Server Error" });

    if (!resFlag)
      return res
        .status(404)
        .json({ status: failureLabel, msg: "Workspace does not exist" });

    return res
      .status(200)
      .json({ status: successLabel, msg: "Workspace fetched", workspace });
  };
}
