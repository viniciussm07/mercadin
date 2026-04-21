import { Module } from "@nestjs/common";
import { MarketsController } from "./controllers/markets.controller";
import { MarketsRepository } from "./repositories/markets.repository";
import { PrismaService } from "@/database/prisma.service";

@Module({
  controllers: [MarketsController],
  providers: [MarketsRepository, PrismaService],
  exports: [MarketsRepository],
})
export class MarketsModule {}
