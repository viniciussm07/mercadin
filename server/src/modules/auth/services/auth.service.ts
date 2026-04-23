import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SignUpDto } from "../dtos/sign-up.dto";
import { SignInDto } from "../dtos/sign-in.dto";
import { PrismaService } from "@/database/prisma.service";
import { SignInWithToken } from "../dtos/sign-in-with-token.dto";

@Injectable()
export class AuthService {
  private readonly supabase: SupabaseClient;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const supabaseUrl = this.config.get<string>("SUPABASE_URL");
    const supabaseKey = this.config.get<string>("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required for AuthService");
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async signUp(dto: SignUpDto) {
    const { data, error } = await this.supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (data.user) {
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
