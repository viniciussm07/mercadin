import { endpoints } from "@services/endpoints";
import { apiClient } from "@services/http";
import {
  AddItemToShoppingListsPayload,
  CreateShoppingListPayload,
  FindShoppingListParams,
  FindShoppingListsParams,
  ShoppingList,
  ShoppingListItem,
  DeleteShoppingListsResponse,
  UpdateShoppingListItemQuantityPayload,
  UpdateShoppingListPayload,
} from "./types";

export const shoppingListsService = {
  findAll: ({ signal }: FindShoppingListsParams = {}) =>
    apiClient.get(endpoints.shoppingLists.root, { signal }).json<ShoppingList[]>(),
  findOne: ({ id, signal }: FindShoppingListParams) =>
    apiClient.get(endpoints.shoppingLists.detail(id), { signal }).json<ShoppingList>(),
  create: (payload: CreateShoppingListPayload) =>
    apiClient.post(endpoints.shoppingLists.root, { json: payload }).json<ShoppingList>(),
  update: (id: string, payload: UpdateShoppingListPayload) =>
    apiClient.patch(endpoints.shoppingLists.detail(id), { json: payload }).json<ShoppingList>(),
  addItemToLists: (payload: AddItemToShoppingListsPayload) =>
    apiClient
      .post(endpoints.shoppingLists.addItemToLists, { json: payload })
      .json<ShoppingListItem[]>(),
  updateItemQuantity: (id: string, payload: UpdateShoppingListItemQuantityPayload) =>
    apiClient
      .patch(endpoints.shoppingLists.updateItemQuantity(id), { json: payload })
      .json<ShoppingListItem>(),
  removeItem: (id: string, itemId: string) =>
    apiClient.delete(endpoints.shoppingLists.removeItem(id, itemId)).json<ShoppingListItem>(),
  removeAll: () =>
    apiClient.delete(endpoints.shoppingLists.root).json<DeleteShoppingListsResponse>(),
  remove: (id: string) => apiClient.delete(endpoints.shoppingLists.detail(id)).json<ShoppingList>(),
};
