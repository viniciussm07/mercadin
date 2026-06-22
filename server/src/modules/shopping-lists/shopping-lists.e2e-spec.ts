import request from "supertest";
import { authHeader, TEST_USER } from "../../../test/helpers/create-test-app";
import { createShoppingListsTestContext } from "../../../test/helpers/create-shopping-lists-test-context";

describe("Shopping list endpoints", () => {
  let context: Awaited<ReturnType<typeof createShoppingListsTestContext>>;

  beforeAll(async () => {
    context = await createShoppingListsTestContext();
  });

  afterAll(async () => context.app.close());

  it("requires authentication", async () => {
    const { app, lists } = context;
    await request(app.getHttpServer()).get("/shopping-lists").expect(401);
    expect(lists.findAll).not.toHaveBeenCalled();
  });

  it("lists the authenticated user's lists", async () => {
    const { app, lists } = context;
    const result = [{ id: "list-1", name: "Monthly" }];
    lists.findAll.mockResolvedValueOnce(result);

    await request(app.getHttpServer())
      .get("/shopping-lists")
      .set(authHeader)
      .expect(200)
      .expect(result);

    expect(lists.findAll).toHaveBeenCalledWith(TEST_USER.id);
  });

  it("returns one list", async () => {
    const { app, lists } = context;
    lists.findOne.mockResolvedValueOnce({ id: "list-1" });

    await request(app.getHttpServer()).get("/shopping-lists/list-1").set(authHeader).expect(200);

    expect(lists.findOne).toHaveBeenCalledWith("list-1", TEST_USER.id);
  });

  it("creates a list", async () => {
    const { app, lists } = context;
    lists.create.mockResolvedValueOnce({ id: "list-1", name: "Weekly" });

    await request(app.getHttpServer())
      .post("/shopping-lists")
      .set(authHeader)
      .send({ name: "Weekly" })
      .expect(201);

    expect(lists.create).toHaveBeenCalledWith(TEST_USER.id, { name: "Weekly" });
  });

  it("rejects an empty list name", async () => {
    const { app } = context;
    await request(app.getHttpServer())
      .post("/shopping-lists")
      .set(authHeader)
      .send({ name: "" })
      .expect(400);
  });

  it("updates a list", async () => {
    const { app, lists } = context;
    lists.update.mockResolvedValueOnce({ id: "list-1", name: "Updated" });

    await request(app.getHttpServer())
      .patch("/shopping-lists/list-1")
      .set(authHeader)
      .send({ name: "Updated" })
      .expect(200);

    expect(lists.update).toHaveBeenCalledWith("list-1", TEST_USER.id, { name: "Updated" });
  });

  it("removes one list and all user lists", async () => {
    const { app, lists } = context;
    lists.remove.mockResolvedValueOnce({ id: "list-1" });
    lists.removeAll.mockResolvedValueOnce({ count: 1 });

    await request(app.getHttpServer()).delete("/shopping-lists/list-1").set(authHeader).expect(200);
    await request(app.getHttpServer()).delete("/shopping-lists").set(authHeader).expect(200);

    expect(lists.remove).toHaveBeenCalledWith("list-1", TEST_USER.id);
    expect(lists.removeAll).toHaveBeenCalledWith(TEST_USER.id);
  });
});
