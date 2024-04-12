import { BusinessController } from "./business.js";
import { UserController } from "./user.js";
import { MisclController } from "./utils.js";
import { WorkspaceController } from "./workspace.js";

export const userController = new UserController();
export const businessController = new BusinessController();
export const misclController = new MisclController();
export const workspaceController = new WorkspaceController();
