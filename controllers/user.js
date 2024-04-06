import { failureLabel, successLabel } from "../constants.js";
import { userRepo } from "../repository/index.js";

export class UserController {
  constructor() {
    this.userRepo = userRepo;
  }

  register = async (req, res) => {
    const reqPayload = {
      name: res.locals.firebaseEntity.name,
      username: req.body.username,
      email: res.locals.firebaseEntity.email,
      firebaseUID: res.locals.uid,
      phone: req.body.phone,
      address: req.body.address,
      bio: req.body.bio,
      profilePic: res.locals.firebaseEntity.picture,
      showcasePics: req.body.showcasePics,
    };

    const { serverFlag, resFlag, msg, user } = await this.userRepo.onboardUser(
      reqPayload
    );

    if (!serverFlag)
      return res
        .status(500)
        .json({ status: failureLabel, message: "Internal Server Error" });

    if (!resFlag)
      return res.status(409).json({ status: failureLabel, message: msg });

    return res.status(201).json({
      status: successLabel,
      message: "User Onboarded successfully",
      user,
    });
  };

  getProfile = async (req, res) => {
    const { serverFlag, resFlag, msg, profile } =
      await this.userRepo.getProfile(res.locals.uid);

    if (!serverFlag)
      return res
        .status(500)
        .json({ status: failureLabel, message: "Internal Server Error" });

    if (!resFlag)
      return res
        .status(404)
        .json({ status: failureLabel, message: "User not found" });

    return res.status(200).json({
      status: successLabel,
      message: "User Profile Fetched",
      profile,
    });
  };
}
