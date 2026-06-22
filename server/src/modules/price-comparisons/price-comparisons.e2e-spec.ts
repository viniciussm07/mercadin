import { INestApplication, NotFoundException } from "@nestjs/common";
import request from "supertest";
import { PriceComparisonsController } from "@/modules/price-comparisons/controllers/price-comparisons.controller";
import { PriceComparisonsService } from "@/modules/price-comparisons/services/price-comparisons.service";
import { authHeader, createTestApp, TEST_USER } from "../../../test/helpers/create-test-app";

describe("Price comparison endpoints", () => {
  let app: INestApplication;
  const comparisons = {
    compare: jest.fn(),
  };

  beforeAll(async () => {
    app = await createTestApp({
      controllers: [PriceComparisonsController],
      providers: [{ provide: PriceComparisonsService, useValue: comparisons }],
    });
  });

  afterAll(async () => app.close());

  it("requires authentication", async () => {
    await request(app.getHttpServer()).get("/price-comparisons/lists/list-1").expect(401);
    expect(comparisons.compare).not.toHaveBeenCalled();
  });

  it("compares prices for an authenticated user's list", async () => {
    const result = {
      listId: "list-1",
      byMarket: [],
      superCart: { items: [], total: 0, isComplete: true },
      cheapestSingleMarketId: null,
      savings: null,
    };
    comparisons.compare.mockResolvedValueOnce(result);

    await request(app.getHttpServer())
      .get("/price-comparisons/lists/list-1")
      .set(authHeader)
      .expect(200)
      .expect(result);

    expect(comparisons.compare).toHaveBeenCalledWith("list-1", TEST_USER.id);
  });

  it("returns 404 when the list does not exist", async () => {
    comparisons.compare.mockRejectedValueOnce(new NotFoundException("List not found"));

    await request(app.getHttpServer())
      .get("/price-comparisons/lists/missing")
      .set(authHeader)
      .expect(404);
  });
});
