import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";

@Injectable()
export class MarketsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.market.findMany({ orderBy: { name: "asc" } });
  }

  findByName(name: string) {
    return this.prisma.market.findUnique({ where: { name } });
  }

  upsertByName(data: { name: string; url?: string }) {
    return this.prisma.market.upsert({
      where: { name: data.name },
      create: { name: data.name, url: data.url },
      update: { url: data.url },
    });
  }
}
