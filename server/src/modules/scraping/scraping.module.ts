import { Module } from "@nestjs/common";
import { ScrapingOrchestratorService } from "./scraping-orchestrator.service";
import { JauserveScraper } from "./scrapers/jauserve.scraper";
import { TendaAtacadoScraper } from "./scrapers/tenda-atacado.scraper";
import { SavegnagoScraper } from "./scrapers/savegnago.scraper";
import { SCRAPERS } from "./tokens";
import type { IMarketScraper } from "./interfaces/market-scraper.interface";

@Module({
  providers: [
    JauserveScraper,
    TendaAtacadoScraper,
    SavegnagoScraper,
    {
      provide: SCRAPERS,
      useFactory: (...scrapers: IMarketScraper[]) => scrapers,
      inject: [JauserveScraper, TendaAtacadoScraper, SavegnagoScraper],
    },
    ScrapingOrchestratorService,
  ],
  exports: [ScrapingOrchestratorService],
})
export class ScrapingModule {}
