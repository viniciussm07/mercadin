import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { UpdateProfileDto } from "../dtos/update-profile.dto";

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  updateProfile(id: string, data: UpdateProfileDto) {
    return this.prisma.user.update({ where: { id }, data });
  }
}
