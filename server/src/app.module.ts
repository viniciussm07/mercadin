import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard";
import { UsersModule } from "./modules/users/users.module";
import { MarketsModule } from "./modules/markets/markets.module";
import { ScrapingModule } from "./modules/scraping/scraping.module";
import { ProductsModule } from "./modules/products/products.module";
import { ShoppingListsModule } from "./modules/shopping-lists/shopping-lists.module";
import { PriceComparisonsModule } from "./modules/price-comparisons/price-comparisons.module";
import { PromotionsModule } from "./modules/promotions/promotions.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    MarketsModule,
    ScrapingModule,
    ProductsModule,
    ShoppingListsModule,
    PriceComparisonsModule,
    PromotionsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
