import { CategoryBaseRepo } from "./base.js";

export default class CategoryRepo extends CategoryBaseRepo {
  constructor() {
    super();
  }

  findCategoryByCid = async (cid) => await this.find(this.cidLabel, cid);

  findCategoryByName = async (name) => await this.find(this.nameLabel, name);

  getAllCategories = async () => {
    try {
      const categories = await this.prisma.category.findMany();
      return {
        serverFlag: true,
        msg: "Categories fetched",
        categories,
      };
    } catch (error) {
      return {
        serverFlag: false,
        msg: "Internal Server Error",
        categories: null,
      };
    }
  };
  createCategory = async (catPayload) => {
    const nameRes = await this.findCategoryByName(catPayload.name);

    if (!nameRes.serverFlag)
      return {
        serverFlag: false,
        resFlag: false,
        msg: "Internal Server error",
        category: null,
      };

    if (nameRes.resFlag)
      return {
        serverFlag: true,
        resFlag: false,
        msg: "Category with same name exists already",
        category: nameRes.category,
      };

    try {
      const newCategory = await this.prisma.category.create({
        data: {
          name: catPayload.name,
          description: catPayload.desc,
        },
      });

      return {
        serverFlag: true,
        resFlag: true,
        msg: "Category created",
        category: newCategory,
      };
    } catch (error) {
      return {
        serverFlag: false,
        resFlag: false,
        msg: "Internal Server error",
        category: null,
      };
    }
  };

  deleteCategory = async (name) => {
    const { serverFlag, resFlag, msg, category } =
      await this.findCategoryByName(name);

    if (!serverFlag) return { serverFlag, resFlag, msg };

    if (!resFlag) return { serverFlag, resFlag, msg };

    try {
      const deleteRes = await this.prisma.category.delete({ where: { name } });

      return {
        serverFlag: true,
        resFlag: deleteRes ? true : false,
        msg: deleteRes
          ? "Category deleted successfully"
          : "Category could not be deleted",
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
