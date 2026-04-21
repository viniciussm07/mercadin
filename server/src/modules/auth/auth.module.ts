import { Global, Module } from "@nestjs/common";
import { SupabaseJwtService } from "./services/supabase-jwt.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { PrismaService } from "@/database/prisma.service";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";

@Global()
@Module({
  controllers: [AuthController],
  providers: [SupabaseJwtService, JwtAuthGuard, PrismaService, AuthService],
  exports: [SupabaseJwtService, JwtAuthGuard, AuthService],
})
export class AuthModule {}
