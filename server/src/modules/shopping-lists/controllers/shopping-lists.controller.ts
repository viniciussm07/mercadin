import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ShoppingListsService } from "../services/shopping-lists.service";
import { PriceCombinationService } from "../services/price-combination.service";
import { CreateListDto } from "../dtos/create-list.dto";
import { UpdateListDto } from "../dtos/update-list.dto";
import { AddItemDto } from "../dtos/add-item.dto";
import { AddItemToListsDto } from "../dtos/add-item-to-lists.dto";
import { UpdateItemQuantityDto } from "../dtos/update-item-quantity.dto";
import { CurrentUser, AuthenticatedUser } from "@/common/decorators/current-user.decorator";

@Controller("shopping-lists")
export class ShoppingListsController {
  constructor(
    private readonly lists: ShoppingListsService,
    private readonly combination: PriceCombinationService,
  ) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.lists.findAll(user.id);
  }

  @Get(":id")
  findOne(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.lists.findOne(id, user.id);
  }

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateListDto) {
    return this.lists.create(user.id, dto);
  }

  @Patch(":id")
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: UpdateListDto,
  ) {
    return this.lists.update(id, user.id, dto);
  }

  @Delete(":id")
  remove(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.lists.remove(id, user.id);
  }

  @Delete()
  removeAll(@CurrentUser() user: AuthenticatedUser) {
    return this.lists.removeAll(user.id);
  }

  @Post("items/bulk")
  addItemToLists(@CurrentUser() user: AuthenticatedUser, @Body() dto: AddItemToListsDto) {
    return this.lists.addItemToLists(user.id, dto);
  }

  @Post(":id/items")
  addItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: AddItemDto,
  ) {
    return this.lists.addItem(id, user.id, dto);
  }

  @Patch(":id/items/quantity")
  updateItemQuantity(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: UpdateItemQuantityDto,
  ) {
    return this.lists.updateItemQuantity(id, user.id, dto);
  }

  @Delete(":id/items/:itemId")
  removeItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Param("itemId") itemId: string,
  ) {
    return this.lists.removeItem(id, itemId, user.id);
  }

  @Get(":id/combine")
  combine(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.combination.combine(id, user.id);
  }
}
