import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";

@Injectable()
export class ShoppingListsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllByUser(userId: string) {
    return this.prisma.shoppingList.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: { items: true },
    });
  }

  findByIdForUser(id: string, userId: string) {
    return this.prisma.shoppingList.findFirst({
      where: { id, userId },
      include: {
        items: {
          include: {
            marketProduct: { include: { market: true, masterProduct: true } },
          },
        },
      },
    });
  }

  create(userId: string, name: string) {
    return this.prisma.shoppingList.create({ data: { userId, name } });
  }

  update(id: string, data: { name?: string }) {
    return this.prisma.shoppingList.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.shoppingList.delete({ where: { id } });
  }

  addItem(listId: string, marketProductId: string, quantity: number) {
    return this.prisma.shoppingListItem.create({
      data: { listId, marketProductId, quantity },
    });
  }

  removeItem(itemId: string) {
    return this.prisma.shoppingListItem.delete({ where: { id: itemId } });
  }

  findItemsWithVariants(listId: string) {
    return this.prisma.shoppingListItem.findMany({
      where: { listId },
      include: {
        marketProduct: {
          include: {
            masterProduct: {
              include: {
                variants: {
                  where: { isAvailable: true },
                  include: { market: true },
                },
              },
            },
          },
        },
      },
    });
  }
}
