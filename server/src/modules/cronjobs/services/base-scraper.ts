/* istanbul ignore file */
import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";

@Injectable()
export abstract class BaseScraper {
  protected abstract readonly logger: Logger;
  constructor(protected readonly prisma: PrismaService) {}

  protected async updateDatabase(product: any, scrapedData: any, marketSlug: string) {
    try {
      await this.prisma.$transaction(async tx => {
        if (scrapedData?.isBlocked) return;
        if (scrapedData?.isAvailable) {
          await tx.marketProduct.update({
            where: { id: product.id },
            data: { nameInMarket: scrapedData.name, isAvailable: true, lastScrapedAt: new Date() },
          });
          await tx.priceHistory.create({
            data: { price: scrapedData.price, timestamp: new Date(), marketProductId: product.id },
          });
          const logUrl = scrapedData.url || product.url || "sem url";
          this.logger.log(`ID: ${product.id}, Nome: ${scrapedData.name}, Url: ${logUrl} Preço atualizado: R$ ${scrapedData.price}`);
        } else {
          await tx.marketProduct.update({
            where: { id: product.id },
            data: { isAvailable: false, lastScrapedAt: new Date() },
          });
        }
      });
    } catch (error) {
      this.logger.error(`Erro BD ${product.id}:`, error);
    }
  }
}