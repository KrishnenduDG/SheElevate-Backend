import { categoryRepo } from "../category/index.js";
import { relnMappingRepo } from "../map_repo/index.js";
import { BusinessBaseRepo } from "./base.js";

export class BusinessRepo extends BusinessBaseRepo {
  constructor() {
    super();
    this.categoryRepo = categoryRepo;
    this.relnMappingRepo = relnMappingRepo;
  }

  findByName = async (name) => await this.find(this.nameLabel, name);
  findByEmail = async (email) => await this.find(this.emailLabel, email);
  findByPhone = async (phone) => await this.find(this.phoneLabel, phone);
  findByUsername = async (username) =>
    await this.find(this.usernameLabel, username);
  findByFirebaseUID = async (uid) =>
    await this.find(this.firebaseUIDLabel, uid);

  getBusinessCategories = async (bid) => {
    try {
      const targetBusinessCategoryMappings =
        await this.prisma.businessCategoryMapping.findMany({
          where: { bid },
          include: {
            category: true,
          },
        });

      const reqdCategories = targetBusinessCategoryMappings.map(
        (categoryMaps) => categoryMaps.category
      );

      return {
        serverFlag: true,
        msg: "Categories fetched",
        categories: reqdCategories,
      };
    } catch (error) {
      return {
        serverFlag: false,
        msg: "Internal Server error",
        categories: null,
      };
    }
  };

  onboardBusiness = async (businessPayload) => {
    const nameRes = await this.findByName(businessPayload.name);
    const emailRes = await this.findByEmail(businessPayload.email);
    const phoneRes = await this.findByPhone(businessPayload.phone);
    const usernameRes = await this.findByUsername(businessPayload.username);
    const firebaseUIDRes = await this.findByFirebaseUID(
      businessPayload.firebaseUID
    );

    console.log(emailRes);

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
        msg: `Business with same ${
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
        business:
          nameRes.business ||
          emailRes.business ||
          phoneRes.business ||
          usernameRes.business,
      };

    try {
      // Creating the Business
      const newBusiness = await this.prisma.business.create({
        data: {
          name: businessPayload.name,
          username: businessPayload.username,
          email: businessPayload.email,
          firebase_uid: businessPayload.firebaseUID,
          phoneNumber: businessPayload.phone,
          coverPic: businessPayload.coverPic,
          address: businessPayload.address,
          profilePic: businessPayload.profilePic,
          bio: businessPayload.bio,
          productPics: businessPayload.productPics,
          establishedAt: businessPayload.establishedAt,
        },
      });

      // Handling the Categories
      const categoryArray = [];
      for (let cat of businessPayload.categories) {
        const { serverFlag, resFlag, msg, category } =
          await this.categoryRepo.createCategory({
            name: cat.name,
            desc: cat.desc,
          });
        if (serverFlag) categoryArray.push(category);
      }

      // Mapping the Categories
      for (let categoryObj of categoryArray) {
        const { serverFlag, resFlag, msg } =
          this.relnMappingRepo.mapBusinessToCategory(newBusiness, categoryObj);
      }

      return {
        serverFlag: true,
        resFlag: true,
        msg: "Business succesfully created",
        business: { ...newBusiness, categories: categoryArray },
      };
    } catch (error) {
      console.log(error);
      return {
        serverFlag: false,
        resFlag: false,
        msg: "Internal Server error",
        business: null,
      };
    }
  };

  deleteBusiness = async (username) => {
    const { serverFlag, resFlag, msg, business } = await this.findByUsername(
      username
    );

    if (!serverFlag)
      return {
        serverFlag: false,
        resFlag: false,
        msg: "Internal Server error",
      };

    if (!resFlag)
      return {
        serverFlag: true,
        resFlag: false,
        msg: "Business not found",
      };

    try {
      await this.prisma.business.delete({ where: { username } });

      // Category mapping deleted using onCascade //

      return {
        serverFlag: true,
        resFlag: true,
        msg: "Business deleted successfully",
      };
    } catch (error) {
      console.log(error);
      return {
        serverFlag: false,
        resFlag: false,
        msg: "Internal Server error",
      };
    }
  };

  getProfile = async (username) => {
    try {
      const targetBusiness = await this.prisma.business.findFirst({
        where: {
          username: username,
        },
        include: {
          BusinessCategoryMapping: {
            include: {
              category: true,
            },
          },
        },
      });

      if (!targetBusiness)
        return {
          serverFlag: true,
          resFlag: false,
          msg: "Business not found",
          profile: null,
        };

      let catArray = [];
      for (let cat of targetBusiness.BusinessCategoryMapping) {
        catArray.push({
          name: cat.category.name,
          desc: cat.category.description,
        });
      }
      const resBusiness = {
        firebase_uid: targetBusiness.firebase_uid,
        name: targetBusiness.name,
        username: targetBusiness.username,
        email: targetBusiness.email,
        phoneNumber: targetBusiness.phoneNumber,
        address: targetBusiness.address,
        profile_pic: targetBusiness.profilePic,
        cover_pic: targetBusiness.coverPic,
        bio: targetBusiness.bio,
        product_pics: targetBusiness.productPics,
        established_at: targetBusiness.establishedAt,
        joined_at: targetBusiness.joinedAt,
        categories: catArray,
      };

      return {
        serverFlag: true,
        resFlag: true,
        msg: "Business found",
        profile: resBusiness,
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

  getBusinessByCategories = async (categories = []) => {};
}
