import { Module } from "@nestjs/common";
import { ScrappingCronJobs } from "./services/scrapping-cron-jobs";
import { JauServeCronScraper } from "./services/jau-serve-cron.scraper";
import { PrismaService } from "@database/prisma.service";
import { TendaAtacadoCronScraper } from "./services/tenda-atacado-cron.scraper";

@Module({
  providers: [JauServeCronScraper, TendaAtacadoCronScraper, ScrappingCronJobs, PrismaService],
})
export class CronjobsModule {}