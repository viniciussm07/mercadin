import { BadRequestException, Injectable } from "@nestjs/common";
import { SaveProductSearchHistoryDto } from "../dtos/save-product-search-history.dto";
import { ProductSearchHistoryRepository } from "../repositories/product-search-history.repository";
import { normalizeSearchText } from "../utils/normalize-search-text";

const SEARCH_QUERY_MIN_LENGTH = 2;

@Injectable()
export class ProductSearchHistoryService {
  constructor(private readonly repo: ProductSearchHistoryRepository) {}

  findRecent(userId: string) {
    return this.repo.findRecent(userId);
  }

  save(userId: string, dto: SaveProductSearchHistoryDto) {
    const query = dto.query.trim();
    const normalizedQuery = normalizeSearchText(query);

    if (normalizedQuery.length < SEARCH_QUERY_MIN_LENGTH) {
      throw new BadRequestException("Search query must have at least 2 characters.");
    }

    return this.repo.save(userId, query, normalizedQuery);
  }
}
