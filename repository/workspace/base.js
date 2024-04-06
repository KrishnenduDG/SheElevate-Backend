import { PrismaClient } from "@prisma/client";
import { categoryRepo } from "../category/index.js";
import { relnMappingRepo } from "../map_repo/index.js";
import { productImageRepo } from "../product_image/index.js";

export class WorkspaceBaseRepo {
  constructor() {
    this.prisma = new PrismaClient();

    this.categoryRepo = categoryRepo;
    this.relnMappingRepo = relnMappingRepo;
    this.productImageRepo = productImageRepo;

    this.productImageRepo = this.nameLabel = "name";
  }

  find = async (propName, value) => {
    let existingWS;

    try {
      switch (propName) {
        case this.nameLabel: {
          existingWS = await this.prisma.workspace.findFirst({
            where: { name: value },
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
