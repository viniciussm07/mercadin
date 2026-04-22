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

  findBySlug(slug: string) {
    return this.prisma.market.findUnique({ where: { slug } });
  }

  upsertBySlug(data: { name: string; url: string; slug: string }) {
    return this.prisma.market.upsert({
      where: { slug: data.slug },
      create: { name: data.name, url: data.url, slug: data.slug },
      update: { url: data.url },
    });
  }
}
