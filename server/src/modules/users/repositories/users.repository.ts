import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { UpdateProfileDto } from "../dtos/update-profile.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  updateProfile(id: string, data: UpdateProfileDto) {
    return this.prisma.user.update({ where: { id }, data });
  }

  updateEmail(id: string, email: string) {
    return this.prisma.user.update({ where: { id }, data: { email } });
  }

  deleteAccount(id: string) {
    return this.prisma.$transaction(async tx => {
      await tx.shoppingList.deleteMany({ where: { userId: id } });
      await tx.user.delete({ where: { id } });
    });
  }

  upsert(data: Prisma.UserCreateInput) {
    return this.prisma.user.upsert({
      where: { id: data.id },
      create: data,
      update: {
        email: data.email,
        name: data.name,
        avatarUrl: data.avatarUrl,
      },
    });
  }
}
