import { successLabel } from "../constants.js";

export class MisclController {
  constructor() {}

  checkRegistration = async (req, res) => {
    return res
      .status(200)
      .json({ status: successLabel, msg: "Registered", type: res.locals.role });
  };
}
