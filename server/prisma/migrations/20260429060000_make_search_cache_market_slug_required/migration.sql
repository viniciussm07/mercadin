-- Collapse duplicates that would conflict after replacing NULL with the ALL sentinel.
DELETE FROM "SearchCache" duplicate
USING (
  SELECT "id"
  FROM (
    SELECT
      "id",
      ROW_NUMBER() OVER (
        PARTITION BY "query", COALESCE("marketSlug", 'ALL')
        ORDER BY "lastScrapedAt" DESC, "id" ASC
      ) AS row_number
    FROM "SearchCache"
  ) ranked
  WHERE ranked.row_number > 1
) stale
WHERE duplicate."id" = stale."id";

UPDATE "SearchCache"
SET "marketSlug" = 'ALL'
WHERE "marketSlug" IS NULL;

ALTER TABLE "SearchCache" ALTER COLUMN "marketSlug" SET NOT NULL;
