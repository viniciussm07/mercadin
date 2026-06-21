INSERT INTO "PriceHistory" ("id", "price", "timestamp", "marketProductId")
SELECT
  gen_random_uuid()::text,
  ROUND(product."currentPrice"::numeric, 2)::double precision,
  product."lastScrapedAt",
  product."id"
FROM "MarketProduct" product
LEFT JOIN LATERAL (
  SELECT history."price"
  FROM "PriceHistory" history
  WHERE history."marketProductId" = product."id"
  ORDER BY history."timestamp" DESC, history."id" DESC
  LIMIT 1
) latest ON true
WHERE latest."price" IS NULL
   OR ROUND(latest."price"::numeric, 2)
      IS DISTINCT FROM ROUND(product."currentPrice"::numeric, 2);

CREATE INDEX "PriceHistory_marketProductId_timestamp_idx"
ON "PriceHistory"("marketProductId", "timestamp");

ALTER TABLE "MarketProduct" DROP COLUMN "currentPrice";
