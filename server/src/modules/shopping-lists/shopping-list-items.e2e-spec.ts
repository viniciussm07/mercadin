import request from "supertest";
import { authHeader, TEST_USER } from "../../../test/helpers/create-test-app";
import { createShoppingListsTestContext } from "../../../test/helpers/create-shopping-lists-test-context";

describe("Shopping list item endpoints", () => {
  let context: Awaited<ReturnType<typeof createShoppingListsTestContext>>;

  beforeAll(async () => {
    context = await createShoppingListsTestContext();
  });

  afterAll(async () => context.app.close());

  it("adds an item to a list", async () => {
    const { app, lists } = context;
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
    const { app, lists } = context;
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
    const { app, lists } = context;
    await request(app.getHttpServer())
      .post("/shopping-lists/list-1/items")
      .set(authHeader)
      .send({ marketProductId: "product-1", quantity: 0 })
      .expect(400);

    expect(lists.addItem).not.toHaveBeenCalled();
  });

  it("updates an item quantity", async () => {
    const { app, lists } = context;
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
    const { app, lists } = context;
    lists.removeItem.mockResolvedValueOnce({ id: "item-1" });

    await request(app.getHttpServer())
      .delete("/shopping-lists/list-1/items/item-1")
      .set(authHeader)
      .expect(200);

    expect(lists.removeItem).toHaveBeenCalledWith("list-1", "item-1", TEST_USER.id);
  });
});
