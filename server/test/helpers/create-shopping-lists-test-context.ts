import { ShoppingListsController } from "@/modules/shopping-lists/controllers/shopping-lists.controller";
import { ShoppingListsService } from "@/modules/shopping-lists/services/shopping-lists.service";
import { createTestApp } from "./create-test-app";

export async function createShoppingListsTestContext() {
  const lists = {
    addItem: jest.fn(),
    addItemToLists: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    removeAll: jest.fn(),
    removeItem: jest.fn(),
    update: jest.fn(),
    updateItemQuantity: jest.fn(),
  };
  const app = await createTestApp({
    controllers: [ShoppingListsController],
    providers: [{ provide: ShoppingListsService, useValue: lists }],
  });

  return { app, lists };
}
