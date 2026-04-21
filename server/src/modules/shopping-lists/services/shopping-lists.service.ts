import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ShoppingListsRepository } from "../repositories/shopping-lists.repository";
import { CreateListDto } from "../dtos/create-list.dto";
import { UpdateListDto } from "../dtos/update-list.dto";
import { AddItemDto } from "../dtos/add-item.dto";

@Injectable()
export class ShoppingListsService {
  constructor(private readonly repo: ShoppingListsRepository) {}

  findAll(userId: string) {
    return this.repo.findAllByUser(userId);
  }

  async findOne(id: string, userId: string) {
    const list = await this.repo.findByIdForUser(id, userId);
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

  async addItem(listId: string, userId: string, dto: AddItemDto) {
    await this.assertOwnership(listId, userId);
    return this.repo.addItem(listId, dto.marketProductId, dto.quantity);
  }

  async removeItem(listId: string, itemId: string, userId: string) {
    await this.assertOwnership(listId, userId);
    return this.repo.removeItem(itemId);
  }

  private async assertOwnership(listId: string, userId: string) {
    const list = await this.repo.findByIdForUser(listId, userId);
    if (!list) throw new ForbiddenException("List not accessible");
  }
}
