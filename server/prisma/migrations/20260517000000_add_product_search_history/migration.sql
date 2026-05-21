-- CreateTable
CREATE TABLE "ProductSearchHistory" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "normalizedQuery" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductSearchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductSearchHistory_userId_normalizedQuery_key" ON "ProductSearchHistory"("userId", "normalizedQuery");

-- CreateIndex
CREATE INDEX "ProductSearchHistory_userId_updatedAt_idx" ON "ProductSearchHistory"("userId", "updatedAt");

-- AddForeignKey
ALTER TABLE "ProductSearchHistory" ADD CONSTRAINT "ProductSearchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
