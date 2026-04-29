import { endpoints } from "@services/endpoints";
import { apiClient } from "@services/http";

export interface ShoppingListItem {
  id: string;
  listId: string;
  marketProductId: string;
  quantity: number;
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

export const shoppingListsService = {
  findAll: () => apiClient.get(endpoints.shoppingLists.root).json<ShoppingList[]>(),
};
