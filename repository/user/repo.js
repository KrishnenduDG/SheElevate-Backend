import { relnMappingRepo } from "../map_repo/index.js";
import { UserBaseRepo } from "./base.js";

export class UserRepo extends UserBaseRepo {
  constructor() {
    super();
    this.relnMappingRepo = relnMappingRepo;
  }

  findByUID = async (uid) => await this.find(this.UIDLabel, uid);
  findByName = async (name) => await this.find(this.nameLabel, name);
  findByEmail = async (email) => await this.find(this.emailLabel, email);
  findByPhone = async (phone) => await this.find(this.phoneLabel, phone);
  findByUsername = async (username) =>
    await this.find(this.usernameLabel, username);
  findByFirebaseUID = async (uid) => await this.find(this.firebaseUID, uid);

  onboardUser = async (userPayload) => {
    const nameRes = await this.findByName(userPayload.name);
    const emailRes = await this.findByName(userPayload.email);
    const phoneRes = await this.findByName(userPayload.phone);
    const usernameRes = await this.findByName(userPayload.username);
    const firebaseUIDRes = await this.findByFirebaseUID(
      userPayload.firebaseUID
    );

    if (
      !nameRes.serverFlag ||
      !emailRes.serverFlag ||
      !phoneRes.serverFlag ||
      !usernameRes.serverFlag ||
      !firebaseUIDRes.serverFlag
    )
      return {
        serverFlag: false,
        resFlag: false,
        msg: "Internal Server error",
        business: null,
      };

    if (
      nameRes.resFlag ||
      emailRes.resFlag ||
      phoneRes.resFlag ||
      usernameRes.resFlag ||
      firebaseUIDRes.resFlag
    )
      return {
        serverFlag: true,
        resFlag: false,
        msg: `User with same ${
          nameRes.resFlag
            ? "name"
            : emailRes.resFlag
            ? "email"
            : phoneRes.resFlag
            ? "phone"
            : firebaseUIDRes.resFlag
            ? "Firebase UID"
            : "username"
        } already exists`,
        user:
          nameRes.user || emailRes.user || phoneRes.user || usernameRes.user,
      };

    try {
      // Creating the Business
      const newUser = await this.prisma.user.create({
        data: {
          name: userPayload.name,
          username: userPayload.username,
          email: userPayload.email,
          firebase_uid: userPayload.firebaseUID,
          phoneNumber: userPayload.phone,
          address: userPayload.address,
          profilePic: userPayload.profilePic,
          bio: userPayload.bio,
          showcasePics: userPayload.showcasePics,
        },
      });

      return {
        serverFlag: true,
        resFlag: true,
        msg: "User succesfully created",
        user: newUser,
      };
    } catch (error) {
      console.log(error);
      return {
        serverFlag: false,
        resFlag: false,
        msg: "Internal Server error",
        user: null,
      };
    }
  };

  getProfile = async (username) => {
    try {
      const targetUser = await this.prisma.user.findFirst({
        where: {
          username,
        },
      });

      return {
        serverFlag: true,
        resFlag: targetUser ? true : false,
        msg: targetUser ? "User found" : "user not found",
        profile: targetUser,
      };
    } catch (error) {
      console.log(error);
      return {
        serverFlag: false,
        resFlag: false,
        msg: "Internal Server Error",
        profile: null,
      };
    }
  };
}
