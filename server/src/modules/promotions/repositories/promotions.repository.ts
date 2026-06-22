import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@/database/prisma.service";
import { FindRankedPromotionsParams, RankedPromotionRow, RankedPromotionsResult } from "../types";

const buildRankedPromotionsQuery = (params: FindRankedPromotionsParams) => {
  const marketFilter =
    params.marketSlugs && params.marketSlugs.length > 0
      ? Prisma.sql`AND market."slug" IN (${Prisma.join(params.marketSlugs)})`
      : Prisma.empty;

  return Prisma.sql`
    WITH price_boundaries AS (
      SELECT
        product."id" AS "marketProductId",
        product."nameInMarket",
        product."url",
        product."lastScrapedAt",
        master."id" AS "masterProductId",
        master."ean",
        master."name" AS "masterProductName",
        master."imageUrl",
        master."brand",
        market."id" AS "marketId",
        market."slug" AS "marketSlug",
        market."name" AS "marketName",
        COALESCE(starting_before."price", starting_inside."price") AS "startPrice",
        ending."price" AS "endPrice",
        ending."timestamp" AS "priceChangedAt"
      FROM "MarketProduct" product
      INNER JOIN "MasterProduct" master ON master."id" = product."masterProductId"
      INNER JOIN "Market" market ON market."id" = product."marketId"
      LEFT JOIN LATERAL (
        SELECT history."price"
        FROM "PriceHistory" history
        WHERE history."marketProductId" = product."id"
          AND history."timestamp" <= ${params.from}
        ORDER BY history."timestamp" DESC, history."id" DESC
        LIMIT 1
      ) starting_before ON TRUE
      LEFT JOIN LATERAL (
        SELECT history."price"
        FROM "PriceHistory" history
        WHERE history."marketProductId" = product."id"
          AND history."timestamp" >= ${params.from}
          AND history."timestamp" <= ${params.to}
        ORDER BY history."timestamp" ASC, history."id" ASC
        LIMIT 1
      ) starting_inside ON TRUE
      INNER JOIN LATERAL (
        SELECT history."price", history."timestamp"
        FROM "PriceHistory" history
        WHERE history."marketProductId" = product."id"
          AND history."timestamp" <= ${params.to}
        ORDER BY history."timestamp" DESC, history."id" DESC
        LIMIT 1
      ) ending ON TRUE
      WHERE product."isAvailable" = TRUE
        ${marketFilter}
    ),
    ranked_promotions AS (
      SELECT
        price_boundaries.*,
        ("startPrice" - "endPrice") AS "dropAmount",
        (("startPrice" - "endPrice") / "startPrice" * 100) AS "dropPercentage"
      FROM price_boundaries
      WHERE "startPrice" > "endPrice"
        AND "startPrice" > 0
    )
  `;
};

@Injectable()
export class PromotionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findRanked(params: FindRankedPromotionsParams): Promise<RankedPromotionsResult> {
    const rankedQuery = buildRankedPromotionsQuery(params);
    const [items, totals] = await this.prisma.$transaction([
      this.prisma.$queryRaw<RankedPromotionRow[]>(Prisma.sql`
        ${rankedQuery}
        SELECT *
        FROM ranked_promotions
        ORDER BY
          "dropPercentage" DESC,
          "dropAmount" DESC,
          "priceChangedAt" DESC,
          "marketProductId" ASC
        LIMIT ${params.limit}
        OFFSET ${params.offset}
      `),
      this.prisma.$queryRaw<{ total: bigint }[]>(Prisma.sql`
        ${rankedQuery}
        SELECT COUNT(*) AS "total"
        FROM ranked_promotions
      `),
    ]);

    return { items, total: Number(totals[0]?.total ?? 0) };
  }
}
