import { Module } from "@nestjs/common";
import { ProductsController } from "./controllers/products.controller";
import { ProductsService } from "./services/products.service";
import { ProductIngestService } from "./services/product-ingest.service";
import { ProductsRepository } from "./repositories/products.repository";
import { PrismaService } from "@/database/prisma.service";
import { ScrapingModule } from "@/modules/scraping/scraping.module";
import { MarketsModule } from "@/modules/markets/markets.module";
import { ProductSearchHistoryController } from "./controllers/product-search-history.controller";
import { ProductSearchHistoryService } from "./services/product-search-history.service";
import { ProductSearchHistoryRepository } from "./repositories/product-search-history.repository";
import { PriceHistoryRepository } from "./repositories/price-history.repository";
import { PriceHistoryService } from "./services/price-history.service";
import { ProductCatalogRepository } from "./repositories/product-catalog.repository";

@Module({
  imports: [ScrapingModule, MarketsModule],
  controllers: [ProductsController, ProductSearchHistoryController],
  providers: [
    ProductsService,
    ProductIngestService,
    ProductsRepository,
    ProductCatalogRepository,
    ProductSearchHistoryService,
    ProductSearchHistoryRepository,
    PriceHistoryService,
    PriceHistoryRepository,
    PrismaService,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
