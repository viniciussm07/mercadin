import { MarketProduct } from "@services/products/types";

export interface ShoppingListItem {
  id: string;
  listId: string;
  marketProductId: string;
  quantity: number;
  marketProduct?: MarketProduct;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  items: ShoppingListItem[];
}

export interface FindShoppingListsParams {
  signal?: AbortSignal;
}

export interface FindShoppingListParams {
  id: string;
  signal?: AbortSignal;
}

export interface CreateShoppingListPayload {
  name: string;
}

export interface UpdateShoppingListPayload {
  name?: string;
}

export interface AddItemToShoppingListsPayload {
  listIds: string[];
  marketProductId: string;
  quantity?: number;
}

export interface UpdateShoppingListItemQuantityPayload {
  marketProductId: string;
  quantity: number;
}
