import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import type { User } from "@supabase/supabase-js";
import type { AuthenticatedUser } from "@/common/decorators/current-user.decorator";

@Injectable()
export class AuthSyncService {
  constructor(private readonly prisma: PrismaService) {}

  async ensureUser(user: User): Promise<AuthenticatedUser> {
    if (!user.email) {
      throw new UnauthorizedException("Token missing email claim");
    }

    const dbUser = await this.prisma.user.upsert({
      where: { id: user.id },
      create: { id: user.id, email: user.email },
      update: { email: user.email },
      select: { id: true, email: true },
    });
    return dbUser;
  }
}
