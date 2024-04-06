import { getDefaultWorkspaceCoverPic } from "../../utils/index.js";
import { WorkspaceBaseRepo } from "./base.js";

export class WorkspaceRepo extends WorkspaceBaseRepo {
  findByName = async (name) => await this.find(this.nameLabel, name);

  addWorkspace = async (wsPayload, uid) => {
    const nameRes = await this.findByName(wsPayload.name);

    if (!nameRes.serverFlag)
      return {
        serverFlag: false,
        resFlag: false,
        msg: "Internal Server Error",
        workspace: null,
      };

    if (nameRes.resFlag)
      return {
        serverFlag: true,
        resFlag: false,
        msg: "Workspace with same name already exists",
        workspace: null,
      };

    try {
      const newWorkspace = await this.prisma.workspace.create({
        data: {
          name: wsPayload.name,
          description: wsPayload.desc,
          coverPic: wsPayload.coverPic || getDefaultWorkspaceCoverPic(),
        },
      });

      /* Creating the Categories (if needed) and mapping them to workspace */
      const categoryArray = [];
      for (let cat of wsPayload.categories) {
        const { serverFlag, resFlag, msg, category } =
          await this.categoryRepo.createCategory({
            name: cat.name,
            desc: cat.desc,
          });

        if (!serverFlag) categoryArray.push(category);
      }

      // Mapping the Categories
      for (let categoryObj of categoryArray) {
        const { serverFlag, resFlag, msg } =
          this.relnMappingRepo.mapWorkspaceToCategory(
            newWorkspace,
            categoryObj
          );
      }

      /* Creating the Product Images and also mapping them to workspace */
      const productImageArray = [];
      for (let img of wsPayload.productImages) {
        const { serverFlag, resFlag, msg, image } =
          await this.productImageRepo.addProductImage(img, newWorkspace.wid);
        if (!serverFlag) productImageArray.push(image);
      }

      return {
        serverFlag: true,
        resFlag: true,
        msg: "Workspace Created Successfully",
        workspace: {
          ...newWorkspace,
          category: categoryArray,
          productImages: productImageArray,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        serverFlag: false,
        resFlag: false,
        msg: "Internal Server Error",
        workspace: null,
      };
    }
  };

  deleteWorkspace = async (name) => {};
}
