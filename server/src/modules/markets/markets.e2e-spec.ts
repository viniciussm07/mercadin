import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { MarketsController } from "./controllers/markets.controller";
import { MarketsRepository } from "./repositories/markets.repository";
import { createTestApp } from "../../../test/helpers/create-test-app";

describe("Market endpoints", () => {
  let app: INestApplication;
  const markets = {
    findAll: jest.fn(),
  };

  beforeAll(async () => {
    app = await createTestApp({
      controllers: [MarketsController],
      providers: [{ provide: MarketsRepository, useValue: markets }],
    });
  });

  afterAll(async () => app.close());

  it("lists markets without requiring authentication", async () => {
    const result = [
      { id: "market-1", name: "Jaú Serve", slug: "JAU_SERVE", url: "https://example.com" },
    ];
    markets.findAll.mockResolvedValueOnce(result);

    await request(app.getHttpServer()).get("/markets").expect(200).expect(result);

    expect(markets.findAll).toHaveBeenCalledTimes(1);
  });
});
