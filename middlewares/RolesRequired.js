import { failureLabel } from "../constants.js";

export const rolesRequired = (req, res, next, roles) => {
  const isLegitUser = roles.indexOf(res.locals.role) !== -1;

  if (!isLegitUser)
    return res.status(403).json({
      status: failureLabel,
      msg: "Access denied.. Insufficient permissions",
    });

  next();
};
