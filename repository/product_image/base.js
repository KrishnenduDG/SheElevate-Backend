import { PrismaClient } from "@prisma/client";

export class ProductImageBaseRepo {
  constructor() {
    this.prisma = new PrismaClient();
  }
}
