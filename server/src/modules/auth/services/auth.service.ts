import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SignUpDto } from "../dtos/sign-up.dto";
import { SignInDto } from "../dtos/sign-in.dto";
import { SignInWithTokenDto } from "../dtos/sign-in-with-token.dto";
import { UsersService } from "@/modules/users/services/users.service";
import { AuthUserSyncService } from "./auth-user-sync.service";

@Injectable()
export class AuthService {
  private readonly supabase: SupabaseClient;
  private readonly supabaseAdmin: SupabaseClient;

  constructor(
    private readonly config: ConfigService,
    private readonly users: UsersService,
    private readonly userSync: AuthUserSyncService,
  ) {
    const supabaseUrl = this.config.get<string>("SUPABASE_URL");
    const supabaseKey = this.config.get<string>("SUPABASE_ANON_KEY");
    const supabaseServiceRoleKey = this.config.get<string>("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey || !supabaseServiceRoleKey) {
      throw new Error(
        "SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are required for AuthService",
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  async signUp(dto: SignUpDto) {
    const { data, error } = await this.supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!data.user) {
      throw new BadRequestException("Não foi possível criar o usuário no Supabase");
    }

    try {
      await this.users.syncUser({
        id: data.user.id,
        email: dto.email,
        name: dto.name,
        avatarUrl: dto.avatarUrl,
      });
    } catch (syncError) {
      const { error: rollbackError } = await this.supabaseAdmin.auth.admin.deleteUser(data.user.id);

      if (rollbackError) {
        throw new InternalServerErrorException(
          "O cadastro local falhou e o rollback do usuário no Supabase não foi concluído",
          { cause: syncError },
        );
      }

      throw new InternalServerErrorException(
        "Não foi possível criar o usuário no banco de dados da aplicação",
        { cause: syncError },
      );
    }

    return data;
  }

  async signIn(dto: SignInDto) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return data;
  }

  async signInWithToken(dto: SignInWithTokenDto) {
    const { data, error } = await this.supabase.auth.signInWithIdToken({
      provider: dto.provider,
      token: dto.token,
      access_token: dto.accessToken,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    if (!data.user) {
      throw new UnauthorizedException("Não foi possível autenticar com o token informado");
    }

    await this.userSync.syncLocalUser(data.user);

    return data;
  }

  async syncSession(userId: string) {
    const { data, error } = await this.supabaseAdmin.auth.admin.getUserById(userId);

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    if (!data.user) {
      throw new UnauthorizedException("Usuário autenticado não encontrado no Supabase");
    }

    return this.userSync.syncLocalUser(data.user);
  }
}
