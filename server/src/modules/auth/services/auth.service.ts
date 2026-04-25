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
import { PrismaService } from "@/database/prisma.service";
import { SignInWithToken } from "../dtos/sign-in-with-token.dto";

@Injectable()
export class AuthService {
  private readonly supabase: SupabaseClient;
  private readonly supabaseAdmin: SupabaseClient;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
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
      await this.prisma.user.upsert({
        where: { id: data.user.id },
        create: {
          id: data.user.id,
          email: dto.email,
          name: dto.name,
          avatarUrl: dto.avatarUrl,
        },
        update: {
          name: dto.name,
        },
      });
    } catch (prismaError) {
      const { error: rollbackError } = await this.supabaseAdmin.auth.admin.deleteUser(data.user.id);

      if (rollbackError) {
        throw new InternalServerErrorException(
          "O cadastro local falhou e o rollback do usuário no Supabase não foi concluído",
          { cause: prismaError },
        );
      }

      throw new InternalServerErrorException(
        "Não foi possível criar o usuário no banco de dados da aplicação",
        { cause: prismaError },
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

  async signInWithToken(dto: SignInWithToken) {
    const { data, error } = await this.supabase.auth.signInWithIdToken({
      provider: dto.provider,
      token: dto.token,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return data;
  }
}
