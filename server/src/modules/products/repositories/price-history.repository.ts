import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";

@Injectable()
export class PriceHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  existsMarketProduct(marketProductId: string) {
    return this.prisma.marketProduct.findUnique({
      where: { id: marketProductId },
      select: { id: true },
    });
  }

  findByPeriod(params: { marketProductId: string; from: Date; to: Date; limit: number }) {
    return this.prisma.priceHistory.findMany({
      where: {
        marketProductId: params.marketProductId,
        timestamp: { gte: params.from, lte: params.to },
      },
      select: { price: true, timestamp: true },
      orderBy: [{ timestamp: "asc" }, { id: "asc" }],
      take: params.limit,
    });
  }
}
