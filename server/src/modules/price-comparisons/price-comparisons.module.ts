import { Module } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { PriceComparisonsController } from "./controllers/price-comparisons.controller";
import { PriceComparisonsRepository } from "./repositories/price-comparisons.repository";
import { PriceComparisonsService } from "./services/price-comparisons.service";

@Module({
  controllers: [PriceComparisonsController],
  providers: [PriceComparisonsService, PriceComparisonsRepository, PrismaService],
})
export class PriceComparisonsModule {}
