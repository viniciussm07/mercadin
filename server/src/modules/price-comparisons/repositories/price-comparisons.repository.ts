import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { priceComparisonItemInclude } from "../types";

@Injectable()
export class PriceComparisonsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findListByIdForUser(id: string, userId: string) {
    return this.prisma.shoppingList.findFirst({
      where: { id, userId },
      select: { id: true },
    });
  }

  findItemsWithVariants(listId: string) {
    return this.prisma.shoppingListItem.findMany({
      where: { listId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: priceComparisonItemInclude,
    });
  }
}
