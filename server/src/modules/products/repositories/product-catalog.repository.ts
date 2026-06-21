import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { latestPriceQuery, withCurrentPrice } from "../utils/current-price";

@Injectable()
export class ProductCatalogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const products = await this.prisma.masterProduct.findMany({
      include: {
        variants: {
          include: {
            market: true,
            history: latestPriceQuery,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return products.map(product => ({
      ...product,
      variants: product.variants.map(withCurrentPrice),
    }));
  }
}
