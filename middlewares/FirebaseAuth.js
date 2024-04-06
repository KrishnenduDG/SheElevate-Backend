import { getAuth } from "firebase-admin/auth";
import { failureLabel } from "../constants.js";
import { firebaseApp } from "../firebase/index.js";

export const firebaseAuth = async (req, res, next) => {
  // Getting the Token from headers
  const firebaseToken = req.headers["x-firebase-token"];

  if (!firebaseToken)
    return res.status(401).json({
      status: failureLabel,
      message: "Firebase Token missing in x-firebase-token header",
    });

  try {
    const decodedFirebaseToken = await getAuth(firebaseApp).verifyIdToken(
      firebaseToken
    );
    res.locals.uid = decodedFirebaseToken.uid;
    res.locals.firebaseEntity = decodedFirebaseToken;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: failureLabel,
      message: "Firebase Token Error",
    });
  }
};
