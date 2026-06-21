import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ShoppingListsRepository } from "../repositories/shopping-lists.repository";
import { ShoppingListsService } from "./shopping-lists.service";

describe("ShoppingListsService item operations", () => {
  const repo = {
    addItem: jest.fn(),
    addItemToLists: jest.fn(),
    findByIdForUser: jest.fn(),
    findListIdsByUser: jest.fn(),
    findListItemsByMarketProduct: jest.fn(),
    removeItem: jest.fn(),
    updateItemQuantity: jest.fn(),
  };
  let service: ShoppingListsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ShoppingListsService, { provide: ShoppingListsRepository, useValue: repo }],
    }).compile();
    service = moduleRef.get(ShoppingListsService);
  });

  beforeEach(() => jest.clearAllMocks());

  it("adds and removes items from an owned list", async () => {
    repo.findByIdForUser.mockResolvedValue({ id: "list-1" });

    await service.addItem("list-1", "user-1", { marketProductId: "product-1", quantity: 2 });
    await service.removeItem("list-1", "item-1", "user-1");

    expect(repo.addItem).toHaveBeenCalledWith("list-1", "product-1", 2);
    expect(repo.removeItem).toHaveBeenCalledWith("item-1");
  });

  it("deduplicates lists and skips lists that already contain the product", async () => {
    repo.findListIdsByUser.mockResolvedValueOnce([{ id: "list-1" }, { id: "list-2" }]);
    repo.findListItemsByMarketProduct.mockResolvedValueOnce([{ listId: "list-1" }]);
    repo.addItemToLists.mockResolvedValueOnce([{ id: "item-2" }]);

    await expect(
      service.addItemToLists("user-1", {
        listIds: ["list-1", "list-1", "list-2"],
        marketProductId: "product-1",
        quantity: 3,
      }),
    ).resolves.toEqual([{ id: "item-2" }]);
    expect(repo.findListIdsByUser).toHaveBeenCalledWith(["list-1", "list-2"], "user-1");
    expect(repo.addItemToLists).toHaveBeenCalledWith(["list-2"], "product-1", 3);
  });

  it("returns no items when every list already contains the product", async () => {
    repo.findListIdsByUser.mockResolvedValueOnce([{ id: "list-1" }]);
    repo.findListItemsByMarketProduct.mockResolvedValueOnce([{ listId: "list-1" }]);

    await expect(
      service.addItemToLists("user-1", {
        listIds: ["list-1"],
        marketProductId: "product-1",
        quantity: 1,
      }),
    ).resolves.toEqual([]);
    expect(repo.addItemToLists).not.toHaveBeenCalled();
  });

  it("rejects bulk insertion when any list is inaccessible", async () => {
    repo.findListIdsByUser.mockResolvedValueOnce([{ id: "list-1" }]);

    await expect(
      service.addItemToLists("user-1", {
        listIds: ["list-1", "list-2"],
        marketProductId: "product-1",
        quantity: 1,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("updates an existing item quantity", async () => {
    repo.findByIdForUser.mockResolvedValueOnce({ id: "list-1" });
    repo.updateItemQuantity.mockResolvedValueOnce({ id: "item-1", quantity: 4 });

    await expect(
      service.updateItemQuantity("list-1", "user-1", {
        marketProductId: "product-1",
        quantity: 4,
      }),
    ).resolves.toEqual({ id: "item-1", quantity: 4 });
  });

  it("throws when the item to update does not exist", async () => {
    repo.findByIdForUser.mockResolvedValueOnce({ id: "list-1" });
    repo.updateItemQuantity.mockResolvedValueOnce(null);

    await expect(
      service.updateItemQuantity("list-1", "user-1", {
        marketProductId: "product-1",
        quantity: 4,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
