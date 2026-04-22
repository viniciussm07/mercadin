import { Module } from "@nestjs/common";
import { ScrapingOrchestratorService } from "./scraping-orchestrator.service";
import { JauserveScraper } from "./scrapers/jauserve.scraper";
import { SCRAPERS } from "./tokens";
import type { IMarketScraper } from "./interfaces/market-scraper.interface";

@Module({
  providers: [
    JauserveScraper,
    {
      provide: SCRAPERS,
      useFactory: (...scrapers: IMarketScraper[]) => scrapers,
      inject: [JauserveScraper],
    },
    ScrapingOrchestratorService,
  ],
  exports: [ScrapingOrchestratorService],
})
export class ScrapingModule {}
