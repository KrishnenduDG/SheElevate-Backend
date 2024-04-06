import { ProductImageBaseRepo } from "./base.js";

export class ProductImageRepo extends ProductImageBaseRepo {
  addProductImage = async (imgPayload, wid) => {
    try {
      const newProductImage = await this.prisma.productImage.create({
        data: {
          imgUrl: imgPayload.imgUrl,
          caption: imgPayload.caption,
          wid,
        },
      });

      return {
        serverFlag: true,
        resFlag: true,
        msg: "Product Image added successfully",
        image: newProductImage,
      };
    } catch (error) {
      return {
        serverFlag: false,
        resFlag: false,
        msg: "Internal Server Error",
        image: null,
      };
    }
  };
}
