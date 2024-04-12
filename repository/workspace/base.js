import { PrismaClient } from "@prisma/client";
import { categoryRepo } from "../category/index.js";
import { relnMappingRepo } from "../map_repo/index.js";
import { userRepo } from "../user/index.js";

export class WorkspaceBaseRepo {
  constructor() {
    this.prisma = new PrismaClient();

    this.categoryRepo = categoryRepo;
    this.relnMappingRepo = relnMappingRepo;
    this.userRepo = userRepo;

    this.widLabel = "wid";
  }

  find = async (propName, value) => {
    let existingWS;

    try {
      switch (propName) {
        case this.widLabel: {
          existingWS = await this.prisma.workspace.findFirst({
            where: { wid: value },
          });

          break;
        }
        default: {
          return {
            serverFlag: true,
            resFlag: false,
            msg: "Invalid search keyword",
            workspace: null,
          };
        }
      }

      return {
        serverFlag: true,
        resFlag: existingWS ? true : false,
        msg: existingWS ? "Workspace found" : "Workspace not found",
        workspace: existingWS || null,
      };
    } catch (error) {
      return {
        serverFlag: false,
        resFlag: false,
        msg: "Internal Server Error",
        workspace: null,
      };
    }
  };
}
