import { Test } from "@nestjs/testing";
import { PrismaService } from "@/database/prisma.service";
import { MarketsRepository } from "./markets.repository";

describe("MarketsRepository", () => {
  const prisma = {
    market: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  };
  let repository: MarketsRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [MarketsRepository, { provide: PrismaService, useValue: prisma }],
    }).compile();
    repository = moduleRef.get(MarketsRepository);
  });

  beforeEach(() => jest.clearAllMocks());

  it("lists markets ordered by name", () => {
    repository.findAll();
    expect(prisma.market.findMany).toHaveBeenCalledWith({ orderBy: { name: "asc" } });
  });

  it("finds markets by name and slug", () => {
    repository.findByName("Market");
    repository.findBySlug("MARKET");

    expect(prisma.market.findUnique).toHaveBeenNthCalledWith(1, {
      where: { name: "Market" },
    });
    expect(prisma.market.findUnique).toHaveBeenNthCalledWith(2, {
      where: { slug: "MARKET" },
    });
  });

  it("upserts market identity and updates its URL", () => {
    repository.upsertBySlug({
      name: "Market",
      slug: "MARKET",
      url: "https://market.test",
    });

    expect(prisma.market.upsert).toHaveBeenCalledWith({
      where: { slug: "MARKET" },
      create: {
        name: "Market",
        slug: "MARKET",
        url: "https://market.test",
      },
      update: { url: "https://market.test" },
    });
  });
});
