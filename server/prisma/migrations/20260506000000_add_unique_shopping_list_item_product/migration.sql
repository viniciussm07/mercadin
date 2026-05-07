DELETE FROM "ShoppingListItem" duplicate
USING (
  SELECT "id"
  FROM (
    SELECT
      "id",
      ROW_NUMBER() OVER (
        PARTITION BY "listId", "marketProductId"
        ORDER BY "createdAt" DESC, "id" ASC
      ) AS row_number
    FROM "ShoppingListItem"
  ) ranked
  WHERE ranked.row_number > 1
) stale
WHERE duplicate."id" = stale."id";

CREATE UNIQUE INDEX "ShoppingListItem_listId_marketProductId_key" ON "ShoppingListItem"("listId", "marketProductId");
