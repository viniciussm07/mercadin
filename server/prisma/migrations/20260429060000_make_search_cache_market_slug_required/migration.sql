-- Collapse duplicate global cache rows before replacing NULL with the ALL sentinel.
DELETE FROM "SearchCache" stale
USING "SearchCache" fresh
WHERE stale."query" = fresh."query"
  AND stale."marketSlug" IS NULL
  AND fresh."marketSlug" IS NULL
  AND stale."lastScrapedAt" < fresh."lastScrapedAt";

DELETE FROM "SearchCache" duplicate
USING "SearchCache" keeper
WHERE duplicate."query" = keeper."query"
  AND duplicate."marketSlug" IS NULL
  AND keeper."marketSlug" IS NULL
  AND duplicate."lastScrapedAt" = keeper."lastScrapedAt"
  AND duplicate."id" > keeper."id";

UPDATE "SearchCache"
SET "marketSlug" = 'ALL'
WHERE "marketSlug" IS NULL;

ALTER TABLE "SearchCache" ALTER COLUMN "marketSlug" SET NOT NULL;
