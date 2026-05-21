import { Global, Module } from "@nestjs/common";
import { SupabaseJwtService } from "./services/supabase-jwt.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { UsersModule } from "../users/users.module";
import { AuthUserSyncService } from "./services/auth-user-sync.service";
import { AuthAccountService } from "./services/auth-account.service";

@Global()
@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    SupabaseJwtService,
    JwtAuthGuard,
    AuthService,
    AuthUserSyncService,
    AuthAccountService,
  ],
  exports: [SupabaseJwtService, JwtAuthGuard, AuthService],
})
export class AuthModule {}
