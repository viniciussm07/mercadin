import { Module } from "@nestjs/common";
import { ProductsController } from "./controllers/products.controller";
import { ProductsService } from "./services/products.service";
import { ProductIngestService } from "./services/product-ingest.service";
import { ProductsRepository } from "./repositories/products.repository";
import { PrismaService } from "@/database/prisma.service";
import { ScrapingModule } from "@/modules/scraping/scraping.module";
import { MarketsModule } from "@/modules/markets/markets.module";

@Module({
  imports: [ScrapingModule, MarketsModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductIngestService, ProductsRepository, PrismaService],
  exports: [ProductsService],
})
export class ProductsModule {}
