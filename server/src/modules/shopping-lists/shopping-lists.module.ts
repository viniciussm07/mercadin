import { Module } from "@nestjs/common";
import { ShoppingListsController } from "./controllers/shopping-lists.controller";
import { ShoppingListsService } from "./services/shopping-lists.service";
import { PriceCombinationService } from "./services/price-combination.service";
import { ShoppingListsRepository } from "./repositories/shopping-lists.repository";
import { PrismaService } from "@/database/prisma.service";

@Module({
  controllers: [ShoppingListsController],
  providers: [
    ShoppingListsService,
    PriceCombinationService,
    ShoppingListsRepository,
    PrismaService,
  ],
})
export class ShoppingListsModule {}
