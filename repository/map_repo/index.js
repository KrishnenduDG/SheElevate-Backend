import { PrismaClient } from "@prisma/client";

class RelnMappingRepo {
  constructor() {
    this.prisma = new PrismaClient();
  }
  mapBusinessToCategory = async (businessObj, catObj) => {
    try {
      const newMapping = await this.prisma.businessCategoryMapping.create({
        data: {
          bid: businessObj.bid,
          cid: catObj.cid,
        },
      });

      return {
        serverFlag: true,
        resFlag: newMapping ? true : false,
        msg: newMapping
          ? "Mapped Business to category successfully"
          : "Cannot map business to category",
      };
    } catch (error) {
      return {
        serverFlag: false,
        resFlag: false,
        msg: "Internal server Error",
      };
    }
  };

  mapWorkspaceToCategory = async (workspaceObj, catObj) => {
    try {
      const newMapping = await this.prisma.workspaceCategoryMapping.create({
        data: {
          wid: workspaceObj.wid,
          cid: catObj.cid,
        },
      });

      return {
        serverFlag: true,
        resFlag: newMapping ? true : false,
        msg: newMapping
          ? "Mapped Workspace to category successfully"
          : "Cannot map workspace to category",
      };
    } catch (error) {
      return {
        serverFlag: false,
        resFlag: false,
        msg: "Internal server Error",
      };
    }
  };
}

export const relnMappingRepo = new RelnMappingRepo();
