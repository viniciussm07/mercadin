import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { MarketsRepository } from "@/modules/markets/repositories/markets.repository";
import type { ScrapedBatch } from "@/modules/scraping/scraping-orchestrator.service";

@Injectable()
export class ProductIngestService {
  private readonly logger = new Logger(ProductIngestService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly markets: MarketsRepository,
  ) {}

  async ingest(batch: ScrapedBatch): Promise<void> {
    const market = await this.markets.upsertBySlug({
      name: batch.marketName,
      url: batch.marketUrl,
      slug: batch.marketSlug,
    });

    for (const product of batch.products) {
      try {
        await this.prisma.$transaction(async tx => {
          const master = await tx.masterProduct.upsert({
            where: { ean: product.ean },
            create: {
              ean: product.ean,
              name: product.name,
              imageUrl: product.imageUrl,
              brand: product.brand,
            },
            update: {
              name: product.name,
              imageUrl: product.imageUrl ?? undefined,
              brand: product.brand ?? undefined,
            },
          });

          const existing = await tx.marketProduct.findUnique({
            where: { marketId_sku: { marketId: market.id, sku: product.sku } },
          });

          const priceChanged = !existing || existing.currentPrice !== product.price;

          const updatedProduct = await tx.marketProduct.upsert({
            where: { marketId_sku: { marketId: market.id, sku: product.sku } },
            create: {
              sku: product.sku,
              nameInMarket: product.name,
              currentPrice: product.price,
              url: product.url,
              isAvailable: true,
              lastScrapedAt: new Date(),
              marketId: market.id,
              masterProductId: master.id,
            },
            update: {
              nameInMarket: product.name,
              currentPrice: product.price,
              url: product.url ?? undefined,
              isAvailable: true,
              lastScrapedAt: new Date(),
              masterProductId: master.id,
            },
          });

          if (priceChanged) {
            await tx.priceHistory.create({
              data: { marketProductId: updatedProduct.id, price: product.price },
            });
          }
        });
      } catch (err) {
        this.logger.error(
          `Failed to ingest product ${product.ean} from ${batch.marketSlug}: ${String(err)}`,
        );
      }
    }
  }
}
