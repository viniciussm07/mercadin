import { Global, Module } from "@nestjs/common";
import { AuthSyncService } from "./services/auth-sync.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { PrismaService } from "@/database/prisma.service";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthSyncService, JwtAuthGuard, PrismaService, AuthService],
  exports: [AuthSyncService, JwtAuthGuard, AuthService],
})
export class AuthModule {}
