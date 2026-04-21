import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { Prisma } from "@prisma/client";

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

  findByIdForUser(id: string, userId: string, options?: Prisma.ShoppingListFindFirstArgs) {
    return this.prisma.shoppingList.findFirst({
      where: { id, userId },
      ...options,
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
