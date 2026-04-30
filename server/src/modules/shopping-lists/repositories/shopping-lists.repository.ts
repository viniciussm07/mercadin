import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class ShoppingListsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllByUser(userId: string) {
    return this.prisma.shoppingList.findMany({
      where: { userId },
      orderBy: { updatedAt: "asc" },
      include: {
        items: {
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        },
      },
    });
  }

  findByIdForUser(id: string, userId: string, options?: Prisma.ShoppingListFindFirstArgs) {
    return this.prisma.shoppingList.findFirst({
      where: { id, userId },
      ...options,
    });
  }

  findDetailsByIdForUser(id: string, userId: string) {
    return this.prisma.shoppingList.findFirst({
      where: { id, userId },
      include: {
        items: {
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          include: {
            marketProduct: {
              include: {
                market: true,
                masterProduct: true,
              },
            },
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

  findListIdsByUser(listIds: string[], userId: string) {
    return this.prisma.shoppingList.findMany({
      where: { id: { in: listIds }, userId },
      select: { id: true },
    });
  }

  findListItemsByMarketProduct(listIds: string[], marketProductId: string) {
    return this.prisma.shoppingListItem.findMany({
      where: { listId: { in: listIds }, marketProductId },
      select: { listId: true },
    });
  }

  addItemToLists(listIds: string[], marketProductId: string, quantity: number) {
    return this.prisma.$transaction(
      listIds.map(listId =>
        this.prisma.shoppingListItem.create({
          data: { listId, marketProductId, quantity },
        }),
      ),
    );
  }

  async updateItemQuantity(listId: string, marketProductId: string, quantity: number) {
    const item = await this.prisma.shoppingListItem.findFirst({
      where: { listId, marketProductId },
      select: { id: true },
    });

    if (!item) {
      return null;
    }

    return this.prisma.shoppingListItem.update({
      where: { id: item.id },
      data: { quantity },
    });
  }

  removeItem(itemId: string) {
    return this.prisma.shoppingListItem.delete({ where: { id: itemId } });
  }

  findItemsWithVariants(listId: string) {
    return this.prisma.shoppingListItem.findMany({
      where: { listId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
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
