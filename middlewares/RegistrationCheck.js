import { businessLabel, failureLabel, superadminLabel } from "../constants.js";
import { businessRepo, userRepo } from "../repository/index.js";

export const regCheck = async (req, res, next) => {
  const uid = res.locals.uid;

  const userRes = await userRepo.findByFirebaseUID(uid);
  const businessRes = await businessRepo.findByFirebaseUID(uid);

  if (!userRes.serverFlag || !businessRes.serverFlag)
    return res
      .status(500)
      .json({ status: failureLabel, message: "Internal Server Error" });

  if (!userRes.resFlag && !businessRes.resFlag) {
    return res
      .status(403)
      .json({ status: failureLabel, message: "Access denied. Not registered" });
  }

  if (userRes.resFlag) {
    res.locals.signedInEntity = userRes.user;
    res.locals.role = superadminLabel;
  }

  if (businessRes.resFlag) {
    res.locals.signedInEntity = businessRes.business;
    res.locals.role = businessLabel;
  }

  next();
};
