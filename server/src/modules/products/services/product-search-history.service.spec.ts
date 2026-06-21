import { BadRequestException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ProductSearchHistoryRepository } from "../repositories/product-search-history.repository";
import { ProductSearchHistoryService } from "./product-search-history.service";

describe("ProductSearchHistoryService", () => {
  const repo = {
    findRecent: jest.fn(),
    save: jest.fn(),
  };
  let service: ProductSearchHistoryService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductSearchHistoryService,
        { provide: ProductSearchHistoryRepository, useValue: repo },
      ],
    }).compile();
    service = moduleRef.get(ProductSearchHistoryService);
  });

  beforeEach(() => jest.clearAllMocks());

  it("returns recent searches for the user", () => {
    service.findRecent("user-1");
    expect(repo.findRecent).toHaveBeenCalledWith("user-1");
  });

  it("trims and normalizes a search before saving", () => {
    service.save("user-1", { query: "  Açúcar Cristal  " });

    expect(repo.save).toHaveBeenCalledWith("user-1", "Açúcar Cristal", "acucar cristal");
  });

  it("rejects searches that become too short after normalization", () => {
    expect(() => service.save("user-1", { query: " a " })).toThrow(BadRequestException);
    expect(repo.save).not.toHaveBeenCalled();
  });
});
