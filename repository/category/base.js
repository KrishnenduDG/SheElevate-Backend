import { PrismaClient } from "@prisma/client";

export class CategoryBaseRepo {
  constructor() {
    this.prisma = new PrismaClient();

    this.cidLabel = "cid";
    this.nameLabel = "name";
  }

  find = async (propName, value) => {
    let existingCategory;

    try {
      switch (value) {
        case this.cidLabel: {
          existingCategory = await this.prisma.category.findFirst({
            where: { cid: value },
          });
          break;
        }

        case this.nameLabel: {
          existingCategory = await this.prisma.category.findFirst({
            where: { name: value },
          });
          break;
        }

        default: {
          return {
            serverFlag: true,
            resFlag: false,
            msg: "Invalid search keyword",
            category: null,
          };
        }
      }

      return {
        serverFlag: true,
        resFlag: existingCategory ? true : false,
        msg: existingCategory ? "Category found" : "Category not found",
        category: existingCategory || null,
      };
    } catch (error) {
      return {
        serverFlag: false,
        resFlag: false,
        msg: "Internal Server Error",
        category: null,
      };
    }
  };
}
