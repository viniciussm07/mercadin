import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ShoppingListsRepository } from "../repositories/shopping-lists.repository";
import { CreateListDto } from "../dtos/create-list.dto";
import { UpdateListDto } from "../dtos/update-list.dto";
import { AddItemDto } from "../dtos/add-item.dto";
import { AddItemToListsDto } from "../dtos/add-item-to-lists.dto";
import { UpdateItemQuantityDto } from "../dtos/update-item-quantity.dto";

@Injectable()
export class ShoppingListsService {
  constructor(private readonly repo: ShoppingListsRepository) {}

  findAll(userId: string) {
    return this.repo.findAllByUser(userId);
  }

  async findOne(id: string, userId: string) {
    const list = await this.repo.findDetailsByIdForUser(id, userId);
    if (!list) throw new NotFoundException("List not found");
    return list;
  }

  create(userId: string, dto: CreateListDto) {
    return this.repo.create(userId, dto.name);
  }

  async update(id: string, userId: string, dto: UpdateListDto) {
    await this.assertOwnership(id, userId);
    return this.repo.update(id, dto);
  }

  async remove(id: string, userId: string) {
    await this.assertOwnership(id, userId);
    return this.repo.delete(id);
  }

  removeAll(userId: string) {
    return this.repo.deleteAllByUser(userId);
  }

  async addItem(listId: string, userId: string, dto: AddItemDto) {
    await this.assertOwnership(listId, userId);
    return this.repo.addItem(listId, dto.marketProductId, dto.quantity);
  }

  async addItemToLists(userId: string, dto: AddItemToListsDto) {
    const listIds = Array.from(new Set(dto.listIds));
    const ownedLists = await this.repo.findListIdsByUser(listIds, userId);

    if (ownedLists.length !== listIds.length) {
      throw new ForbiddenException("List not accessible");
    }

    const existingItems = await this.repo.findListItemsByMarketProduct(
      listIds,
      dto.marketProductId,
    );
    const existingListIds = new Set(existingItems.map(item => item.listId));
    const targetListIds = listIds.filter(listId => !existingListIds.has(listId));

    if (targetListIds.length === 0) {
      return [];
    }

    return this.repo.addItemToLists(targetListIds, dto.marketProductId, dto.quantity);
  }

  async updateItemQuantity(listId: string, userId: string, dto: UpdateItemQuantityDto) {
    await this.assertOwnership(listId, userId);
    const item = await this.repo.updateItemQuantity(listId, dto.marketProductId, dto.quantity);

    if (!item) {
      throw new NotFoundException("List item not found");
    }

    return item;
  }

  async removeItem(listId: string, itemId: string, userId: string) {
    await this.assertOwnership(listId, userId);
    return this.repo.removeItem(itemId);
  }

  private async assertOwnership(listId: string, userId: string) {
    const list = await this.repo.findByIdForUser(listId, userId, { select: { id: true } });
    if (!list) throw new ForbiddenException("List not accessible");
  }
}
