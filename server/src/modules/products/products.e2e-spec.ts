import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { MARKET_SLUGS } from "@/common/constants/market-slugs.constant";
import { ProductsController } from "@/modules/products/controllers/products.controller";
import { PriceHistoryService } from "@/modules/products/services/price-history.service";
import { ProductsService } from "@/modules/products/services/products.service";
import { createTestApp } from "../../../test/helpers/create-test-app";

describe("Product endpoints", () => {
  let app: INestApplication;
  const products = {
    findAll: jest.fn(),
    search: jest.fn(),
  };
  const priceHistory = {
    findByMarketProduct: jest.fn(),
  };

  beforeAll(async () => {
    app = await createTestApp({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useValue: products },
        { provide: PriceHistoryService, useValue: priceHistory },
      ],
    });
  });

  afterAll(async () => app?.close());

  it("searches products without requiring authentication", async () => {
    const result = { source: "cache", items: [] };
    products.search.mockResolvedValueOnce(result);

    await request(app.getHttpServer())
      .get("/products/search")
      .query({ q: "arroz" })
      .expect(200)
      .expect(result);

    expect(products.search).toHaveBeenCalledWith("arroz", undefined);
  });

  it("passes unique selected markets to the service", async () => {
    products.search.mockResolvedValueOnce({ source: "cache", items: [] });

    await request(app.getHttpServer())
      .get("/products/search")
      .query({
        q: "arroz",
        market: [MARKET_SLUGS.JAU_SERVE, MARKET_SLUGS.JAU_SERVE, MARKET_SLUGS.SAVEGNAGO],
      })
      .expect(200);

    expect(products.search).toHaveBeenCalledWith("arroz", [
      MARKET_SLUGS.JAU_SERVE,
      MARKET_SLUGS.SAVEGNAGO,
    ]);
  });

  it("rejects a search query shorter than two characters", async () => {
    await request(app.getHttpServer()).get("/products/search").query({ q: "a" }).expect(400);

    expect(products.search).not.toHaveBeenCalled();
  });

  it("rejects an unknown market", async () => {
    await request(app.getHttpServer())
      .get("/products/search")
      .query({ q: "arroz", market: "UNKNOWN" })
      .expect(400);

    expect(products.search).not.toHaveBeenCalled();
  });
});
