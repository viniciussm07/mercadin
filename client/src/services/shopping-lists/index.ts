import { endpoints } from "@services/endpoints";
import { apiClient } from "@services/http";
import { ShoppingList } from "./types";

export const shoppingListsService = {
  findAll: () => apiClient.get(endpoints.shoppingLists.root).json<ShoppingList[]>(),
};
