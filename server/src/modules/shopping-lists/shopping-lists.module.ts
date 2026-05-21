import { Module } from "@nestjs/common";
import { ShoppingListsController } from "./controllers/shopping-lists.controller";
import { ShoppingListsService } from "./services/shopping-lists.service";
import { ShoppingListsRepository } from "./repositories/shopping-lists.repository";
import { PrismaService } from "@/database/prisma.service";

@Module({
  controllers: [ShoppingListsController],
  providers: [ShoppingListsService, ShoppingListsRepository, PrismaService],
})
export class ShoppingListsModule {}
