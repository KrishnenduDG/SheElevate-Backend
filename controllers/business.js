import { failureLabel, successLabel } from "../constants.js";
import { businessRepo } from "../repository/index.js";

export class BusinessController {
  constructor() {
    this.businessRepo = businessRepo;
  }

  register = async (req, res) => {
    const reqPayload = {
      name: res.locals.firebaseEntity.name,
      username: req.body.username,
      email: res.locals.firebaseEntity.email,
      firebaseUID: res.locals.uid,
      phone: req.body.phone,
      coverPic: req.body.coverPic,
      address: req.body.address,
      bio: req.body.bio,
      establishedAt: parseInt(req.body.estdAt),
      profilePic: res.locals.firebaseEntity.picture,
      categories: req.body.categories,
      productPics: req.body.productPics,
    };

    const { serverFlag, resFlag, msg, business } =
      await this.businessRepo.onboardBusiness(reqPayload);

    if (!serverFlag)
      return res
        .status(500)
        .json({ status: failureLabel, message: "Internal Server Error" });

    if (!resFlag)
      return res.status(409).json({ status: failureLabel, message: msg });

    return res.status(201).json({
      status: successLabel,
      message: "Business Onboarded successfully",
      business,
    });
  };

  getProfile = async (req, res) => {
    const { serverFlag, resFlag, msg, profile } =
      await this.businessRepo.getProfile(res.locals.uid);

    if (!serverFlag)
      return res
        .status(500)
        .json({ status: failureLabel, message: "Internal Server Error" });

    if (!resFlag)
      return res
        .status(404)
        .json({ status: failureLabel, message: "Business not found" });

    return res.status(200).json({
      status: successLabel,
      message: "Business Profile Fetched",
      profile,
    });
  };
}
