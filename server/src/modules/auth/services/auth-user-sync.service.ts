import { BadRequestException, Injectable } from "@nestjs/common";
import { AuthUser } from "@supabase/supabase-js";
import { UsersService } from "@/modules/users/services/users.service";

@Injectable()
export class AuthUserSyncService {
  constructor(private readonly users: UsersService) {}

  syncLocalUser(user: AuthUser) {
    if (!user.email) {
      throw new BadRequestException("O usuário autenticado não possui e-mail");
    }

    const metadata = user.user_metadata;
    const name =
      this.getMetadataString(metadata, "name") ?? this.getMetadataString(metadata, "full_name");
    const avatarUrl =
      this.getMetadataString(metadata, "avatar_url") ?? this.getMetadataString(metadata, "picture");

    return this.users.syncUser({
      id: user.id,
      email: user.email,
      name,
      avatarUrl,
    });
  }

  private getMetadataString(metadata: Record<string, unknown>, key: string) {
    const value = metadata[key];
    return typeof value === "string" && value.length > 0 ? value : undefined;
  }
}
