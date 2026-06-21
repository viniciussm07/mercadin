import { Injectable, Logger } from "@nestjs/common";
import { MarketsRepository } from "@/modules/markets/repositories/markets.repository";
import type { ScrapedBatch } from "@/modules/scraping/scraping-orchestrator.service";
import { ProductsRepository } from "../repositories/products.repository";

@Injectable()
export class ProductIngestService {
  private readonly logger = new Logger(ProductIngestService.name);

  constructor(
    private readonly markets: MarketsRepository,
    private readonly products: ProductsRepository,
  ) {}

  async ingest(batch: ScrapedBatch): Promise<void> {
    const market = await this.markets.upsertBySlug({
      name: batch.marketName,
      url: batch.marketUrl,
      slug: batch.marketSlug,
    });

    for (const product of batch.products) {
      try {
        await this.products.ingestProduct(market.id, product);
      } catch (err) {
        this.logger.error(
          `Failed to ingest product ${product.ean} from ${batch.marketSlug}: ${String(err)}`,
        );
      }
    }
  }
}
