import { PrismaClient } from "@prisma/client";

export class BusinessBaseRepo {
  constructor() {
    this.prisma = new PrismaClient();

    this.nameLabel = "name";
    this.usernameLabel = "username";
    this.emailLabel = "email";
    this.phoneLabel = "phone";
    this.firebaseUIDLabel = "firebase_uid";
  }

  find = async (propName, value) => {
    let existingBusiness;

    try {
      switch (propName) {
        case this.nameLabel: {
          existingBusiness = await this.prisma.business.findFirst({
            where: { name: value },
          });
          break;
        }

        case this.usernameLabel: {
          existingBusiness = await this.prisma.business.findFirst({
            where: { username: value },
          });
          break;
        }

        case this.emailLabel: {
          existingBusiness = await this.prisma.business.findFirst({
            where: { email: value },
          });
          break;
        }

        case this.phoneLabel: {
          existingBusiness = await this.prisma.business.findFirst({
            where: { phoneNumber: value },
          });
          break;
        }

        case this.firebaseUIDLabel: {
          existingBusiness = await this.prisma.business.findFirst({
            where: { firebase_uid: value },
          });

          break;
        }
        default: {
          return {
            serverFlag: true,
            resFlag: false,
            msg: "Invalid search keyword",
            business: null,
          };
        }
      }

      return {
        serverFlag: true,
        resFlag: existingBusiness ? true : false,
        msg: existingBusiness ? "Business found" : "Business not found",
        business: existingBusiness || null,
      };
    } catch (error) {
      return {
        serverFlag: false,
        resFlag: false,
        msg: "Internal Server Error",
        business: null,
      };
    }
  };
}
