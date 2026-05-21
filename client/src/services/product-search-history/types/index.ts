export interface ProductSearchHistoryItem {
  id: string;
  query: string;
  normalizedQuery: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FindProductSearchHistoryParams {
  signal?: AbortSignal;
}

export interface SaveProductSearchHistoryPayload {
  query: string;
}
