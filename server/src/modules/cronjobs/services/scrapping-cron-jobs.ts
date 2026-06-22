import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { JauServeCronScraper } from "./jau-serve-cron.scraper";
import { TendaAtacadoCronScraper } from "./tenda-atacado-cron.scraper";

@Injectable()
export class ScrappingCronJobs {
  private readonly logger = new Logger(ScrappingCronJobs.name);

  constructor(private readonly jauServeScraper: JauServeCronScraper, private readonly tendaAtacadoScrapper: TendaAtacadoCronScraper) {}

  @Cron(CronExpression.EVERY_30_SECONDS, {
    // Garante que seja executado no horário certo (considerando o fuso horário do Brasil)
    timeZone: "America/Sao_Paulo",
  })
  async handleDailyScraping() {
    this.logger.log("Executando a rotina de scraping");
    
    try {
      await this.jauServeScraper.run();
      await this.tendaAtacadoScrapper.run();
    } catch (error) {
      this.logger.error("Erro durante a execução do Cron Job:", error);
    }
  }
}