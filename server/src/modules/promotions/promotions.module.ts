import { Module } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { PromotionsController } from "./controllers/promotions.controller";
import { PromotionsRepository } from "./repositories/promotions.repository";
import { PromotionsService } from "./services/promotions.service";

@Module({
  controllers: [PromotionsController],
  providers: [PromotionsService, PromotionsRepository, PrismaService],
})
export class PromotionsModule {}
