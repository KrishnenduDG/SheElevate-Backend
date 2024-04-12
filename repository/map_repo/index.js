import { PrismaClient } from "@prisma/client";
import { categoryRepo } from "../category/index.js";

class RelnMappingRepo {
  constructor() {
    this.prisma = new PrismaClient();
    this.categoryRepo = categoryRepo;
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

  mapWorkspaceToCategory = async (workspaceObj, catObj, canCreate = false) => {
    try {
      const targetCategory = await this.categoryRepo.findCategoryByName(
        catObj.name
      );
      if (!targetCategory.serverFlag)
        return {
          serverFlag: false,
          resFlag: false,
          msg: "Internal server Error",
        };

      let newCategory;
      if (!targetCategory.resFlag) {
        if (!canCreate)
          return {
            serverFlag: true,
            resFlag: false,
            msg: "Category not found",
          };

        const { serverFlag, resFlag, msg, category } =
          await this.categoryRepo.createCategory(catObj);

        if (!serverFlag)
          return {
            serverFlag: false,
            resFlag: false,
            msg: "Internal server Error",
          };
        newCategory = JSON.parse(JSON.stringify(category));
      }

      const newMapping = await this.prisma.workspaceCategoryMapping.create({
        data: {
          wid: workspaceObj.wid,
          cid: newCategory ? newCategory.cid : targetCategory.category.cid,
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
