import { failureLabel, successLabel } from "../constants.js";
import { categoryRepo } from "../repository/index.js";

export class MisclController {
  constructor() {
    this.categoryRepo = categoryRepo;
  }

  checkRegistration = async (req, res) => {
    return res.status(200).json({
      status: successLabel,
      msg: "Registered",
      type: res.locals.role,
      profile: { username: res.locals.signedInEntity.username },
    });
  };

  getAllCategories = async (req, res) => {
    const { serverFlag, msg, categories } =
      await categoryRepo.getAllCategories();

    if (!serverFlag)
      return res
        .status(500)
        .json({ status: failureLabel, msg: "Internal Server Error" });

    // patch
    const newCategories = categories.map((cat) => {
      return {
        name: cat.name,
        desc: cat.description,
      };
    });

    return res.status(200).json({
      status: successLabel,
      msg: "Categories fetched",
      categories: newCategories,
    });
  };
}
