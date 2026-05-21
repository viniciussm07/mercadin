import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { AuthenticatedUser } from "@/common/decorators/current-user.decorator";
import { UsersService } from "@/modules/users/services/users.service";
import { UpdateEmailDto } from "../dtos/update-email.dto";
import { UpdatePasswordDto } from "../dtos/update-password.dto";

@Injectable()
export class AuthAccountService {
  private readonly supabase: SupabaseClient;
  private readonly supabaseAdmin: SupabaseClient;

  constructor(
    private readonly config: ConfigService,
    private readonly users: UsersService,
  ) {
    const supabaseUrl = this.config.get<string>("SUPABASE_URL");
    const supabaseKey = this.config.get<string>("SUPABASE_ANON_KEY");
    const supabaseServiceRoleKey = this.config.get<string>("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey || !supabaseServiceRoleKey) {
      throw new Error(
        "SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are required for AuthAccountService",
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

  async updateEmail(userId: string, dto: UpdateEmailDto) {
    const email = dto.email.trim().toLowerCase();
    await this.users.assertEmailAvailable(userId, email);

    const { data, error } = await this.supabaseAdmin.auth.admin.updateUserById(userId, {
      email,
      email_confirm: true,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!data.user?.email) {
      throw new BadRequestException("Não foi possível atualizar o e-mail do usuário");
    }

    return this.users.updateEmail(userId, data.user.email);
  }

  async updatePassword(user: AuthenticatedUser, dto: UpdatePasswordDto) {
    if (dto.newPassword !== dto.newPasswordConfirmation) {
      throw new BadRequestException("A confirmação da nova senha não confere");
    }

    const { error: signInError } = await this.supabase.auth.signInWithPassword({
      email: user.email,
      password: dto.currentPassword,
    });

    if (signInError) {
      throw new UnauthorizedException("A senha atual está incorreta");
    }

    const { error } = await this.supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: dto.newPassword,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { success: true };
  }

  async deleteAccount(userId: string) {
    const { error } = await this.supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      throw new BadRequestException(error.message);
    }

    await this.users.deleteAccount(userId);

    return { success: true };
  }
}
