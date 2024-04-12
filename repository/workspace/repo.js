import { WorkspaceBaseRepo } from "./base.js";

export class WorkspaceRepo extends WorkspaceBaseRepo {
  /**
   * Check if "${username}/${workspaceName}" is unique or not
   */
  findWorkspaceByUser = async (username, workspaceName) => {
    try {
      const targetWorkspace = await this.prisma.workspace.findFirst({
        where: { name: workspaceName, user: { username: username } },
        include: {
          WorkspaceCategoryMapping: {
            include: {
              category: true,
            },
          },
        },
      });

      if (!targetWorkspace)
        return {
          serverFlag: true,
          resFlag: false,
          msg: "Workspace not found",
          workspace: null,
        };

      const targetUser = await this.userRepo.findByUID(targetWorkspace.uid);
      if (!targetUser.serverFlag)
        return {
          serverFlag: false,
          resFlag: false,
          msg: "Internal Server Error",
          workspace: null,
        };

      const resWorkspace = {};
      resWorkspace["wid"] = targetWorkspace.wid;
      resWorkspace["name"] = targetWorkspace.name;
      resWorkspace["description"] = targetWorkspace.description;
      resWorkspace["coverPic"] = targetWorkspace.coverPic;
      resWorkspace["productPics"] = targetWorkspace.productPics;

      resWorkspace["categories"] = targetWorkspace.WorkspaceCategoryMapping.map(
        (wcm) => wcm.category
      );

      resWorkspace["user"] = targetUser.user;

      return {
        serverFlag: true,
        resFlag: true,
        msg: "Workspace found",
        workspace: resWorkspace,
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

  /**
   * Creating a Workspace
   */
  addWorkspace = async (wsPayload, userObj) => {
    try {
      // Creating the new workspace
      const newWorkspace = await this.prisma.workspace.create({
        data: {
          name: wsPayload.name,
          description: wsPayload.desc,
          coverPic: wsPayload.coverPic,
          productPics: wsPayload.productPics,
          uid: userObj.uid,
        },
      });

      // Mapping the Categories
      for (let category of wsPayload.categories) {
        const { serverFlag, resFlag, msg } =
          await this.relnMappingRepo.mapWorkspaceToCategory(
            newWorkspace,
            category
          );
      }
      return {
        serverFlag: true,
        msg: "Workspace successfully created",
        workspace: newWorkspace,
      };
    } catch (error) {
      return {
        serverFlag: false,
        msg: "Internal Server Error",
        workspace: null,
      };
    }
  };

  /**
   * Deleting a Workspace
   */
  deleteWorkspace = async (wid) => {
    try {
      await this.prisma.workspace.delete({ where: { wid } });

      return {
        serverFlag: true,
        resFlag: true,
        msg: "Workspace Successfully deleted",
      };
    } catch (error) {
      return {
        serverFlag: false,
        resFlag: false,
        msg: "Internal Server Error",
      };
    }
  };

  /**
   * Getting all workspaces for a user
   */
  getUserWokspaces = async (uid) => {
    try {
      const targetWorkspaces = await this.prisma.workspace.findMany({
        where: { uid },
        include: {
          WorkspaceCategoryMapping: {
            include: {
              category: true,
            },
          },
        },
      });

      const resWorkspaces = targetWorkspaces.map((workspace) => {
        const resWorkspace = {};
        resWorkspace["wid"] = workspace.wid;
        resWorkspace["name"] = workspace.name;
        resWorkspace["description"] = workspace.description;
        resWorkspace["coverPic"] = workspace.coverPic;
        resWorkspace["productPics"] = workspace.productPics;

        resWorkspace["categories"] = workspace.WorkspaceCategoryMapping.map(
          (wcm) => wcm.category
        );

        return resWorkspace;
      });

      return {
        serverFlag: true,
        msg: "Workspaces fetched for the user",
        workspaces: resWorkspaces,
      };
    } catch (error) {
      return {
        serverFlag: false,
        msg: "Internal Server Error",
        workspaces: null,
      };
    }
  };

  /*
    Getting all workspaces by categories
    
    categoryArray => [categoryName]
  */
  getWorkspaceByCategory = async (categoryArray) => {
    try {
      let targetWorkspaces = [];

      for (let category of categoryArray) {
        const workspaces = await this.prisma.workspaceCategoryMapping.findMany({
          where: { category: { name: category.name } },
          include: {
            category: true,
            workspace: {
              include: {
                WorkspaceCategoryMapping: { include: { category: true } },
              },
            },
          },
        });

        const newWorkspaces = await Promise.all(
          workspaces.map(async (ws) => {
            const resWorkspace = {};
            resWorkspace["wid"] = ws.workspace.wid;
            resWorkspace["name"] = ws.workspace.name;
            resWorkspace["description"] = ws.workspace.description;
            resWorkspace["coverPic"] = ws.workspace.coverPic;
            resWorkspace["createdAt"] = ws.workspace.createdAt;
            resWorkspace["productPics"] = ws.workspace.productPics;

            const { serverFlag, resFlag, msg, user } =
              await this.userRepo.findByUID(ws.workspace.uid);
            resWorkspace["user"] = { username: user.username };

            resWorkspace["categories"] =
              ws.workspace.WorkspaceCategoryMapping.map(
                (mapping) => mapping.category
              );
            return resWorkspace;
          })
        );

        targetWorkspaces = [...targetWorkspaces, ...newWorkspaces];
      }
      return {
        serverFlag: true,
        msg: "Workspaces fetched",
        workspaces: targetWorkspaces,
      };
    } catch (error) {
      return {
        serverFlag: false,
        msg: "Internal Server Error",
        workspaces: null,
      };
    }
  };
}
