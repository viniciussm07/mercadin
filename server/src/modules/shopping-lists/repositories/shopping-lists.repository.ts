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
    return this.prisma.shoppingListItem.upsert({
      where: {
        listId_marketProductId: {
          listId,
          marketProductId,
        },
      },
      create: { listId, marketProductId, quantity },
      update: { quantity },
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
    return this.prisma.shoppingListItem.createManyAndReturn({
      data: listIds.map(listId => ({ listId, marketProductId, quantity })),
      skipDuplicates: true,
    });
  }

  async updateItemQuantity(listId: string, marketProductId: string, quantity: number) {
    try {
      return await this.prisma.shoppingListItem.update({
        where: {
          listId_marketProductId: {
            listId,
            marketProductId,
          },
        },
        data: { quantity },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null;
      }

      throw error;
    }
  }

  removeItem(itemId: string) {
    return this.prisma.shoppingListItem.delete({ where: { id: itemId } });
  }
}
