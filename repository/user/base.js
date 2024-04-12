import { PrismaClient } from "@prisma/client";

export class UserBaseRepo {
  constructor() {
    this.prisma = new PrismaClient();

    this.nameLabel = "name";
    this.usernameLabel = "username";
    this.emailLabel = "email";
    this.phoneLabel = "phone";
    this.firebaseUID = "firebase_uid";
    this.UIDLabel = "uid";
  }

  find = async (propName, value) => {
    let existingUser;

    try {
      switch (propName) {
        case this.UIDLabel: {
          existingUser = await this.prisma.user.findFirst({
            where: { uid: value },
          });
          break;
        }

        case this.nameLabel: {
          existingUser = await this.prisma.user.findFirst({
            where: { name: value },
          });
          break;
        }

        case this.usernameLabel: {
          existingUser = await this.prisma.user.findFirst({
            where: { username: value },
          });
          break;
        }

        case this.emailLabel: {
          existingUser = await this.prisma.user.findFirst({
            where: { email: value },
          });
          break;
        }

        case this.phoneLabel: {
          existingUser = await this.prisma.user.findFirst({
            where: { phoneNumber: value },
          });
          break;
        }

        case this.firebaseUID: {
          existingUser = await this.prisma.user.findFirst({
            where: { firebase_uid: value },
          });
          break;
        }
        default: {
          return {
            serverFlag: true,
            resFlag: false,
            msg: "Invalid search keyword",
            user: null,
          };
        }
      }

      return {
        serverFlag: true,
        resFlag: existingUser ? true : false,
        msg: existingUser ? "User found" : "User not found",
        user: existingUser || null,
      };
    } catch (error) {
      return {
        serverFlag: false,
        resFlag: false,
        msg: "Internal Server Error",
        user: null,
      };
    }
  };
}
