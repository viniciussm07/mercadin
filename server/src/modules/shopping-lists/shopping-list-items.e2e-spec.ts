import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { ShoppingListsController } from "@/modules/shopping-lists/controllers/shopping-lists.controller";
import { ShoppingListsService } from "@/modules/shopping-lists/services/shopping-lists.service";
import { authHeader, createTestApp, TEST_USER } from "../../../test/helpers/create-test-app";

describe("Shopping list item endpoints", () => {
  let app: INestApplication;
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

  beforeAll(async () => {
    app = await createTestApp({
      controllers: [ShoppingListsController],
      providers: [{ provide: ShoppingListsService, useValue: lists }],
    });
  });

  afterAll(async () => app.close());

  it("adds an item to a list", async () => {
    const dto = { marketProductId: "product-1", quantity: 2 };
    lists.addItem.mockResolvedValueOnce({ id: "item-1", ...dto });

    await request(app.getHttpServer())
      .post("/shopping-lists/list-1/items")
      .set(authHeader)
      .send(dto)
      .expect(201);

    expect(lists.addItem).toHaveBeenCalledWith("list-1", TEST_USER.id, dto);
  });

  it("adds an item to multiple lists", async () => {
    const dto = {
      listIds: ["list-1", "list-2"],
      marketProductId: "product-1",
      quantity: 1,
    };
    lists.addItemToLists.mockResolvedValueOnce([]);

    await request(app.getHttpServer())
      .post("/shopping-lists/items/bulk")
      .set(authHeader)
      .send(dto)
      .expect(201);

    expect(lists.addItemToLists).toHaveBeenCalledWith(TEST_USER.id, dto);
  });

  it("rejects invalid item quantities", async () => {
    await request(app.getHttpServer())
      .post("/shopping-lists/list-1/items")
      .set(authHeader)
      .send({ marketProductId: "product-1", quantity: 0 })
      .expect(400);

    expect(lists.addItem).not.toHaveBeenCalled();
  });

  it("updates an item quantity", async () => {
    const dto = { marketProductId: "product-1", quantity: 3 };
    lists.updateItemQuantity.mockResolvedValueOnce({ id: "item-1", quantity: 3 });

    await request(app.getHttpServer())
      .patch("/shopping-lists/list-1/items/quantity")
      .set(authHeader)
      .send(dto)
      .expect(200);

    expect(lists.updateItemQuantity).toHaveBeenCalledWith("list-1", TEST_USER.id, dto);
  });

  it("removes an item", async () => {
    lists.removeItem.mockResolvedValueOnce({ id: "item-1" });

    await request(app.getHttpServer())
      .delete("/shopping-lists/list-1/items/item-1")
      .set(authHeader)
      .expect(200);

    expect(lists.removeItem).toHaveBeenCalledWith("list-1", "item-1", TEST_USER.id);
  });
});
