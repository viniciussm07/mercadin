import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shoppingListsService } from "@services/shopping-lists";
import {
  AddItemToShoppingListsPayload,
  CreateShoppingListPayload,
  UpdateShoppingListItemQuantityPayload,
  UpdateShoppingListPayload,
} from "@services/shopping-lists/types";

export const shoppingListsQueryKeys = {
  all: ["shopping-lists"] as const,
  detail: (id: string) => ["shopping-lists", id] as const,
};

export const useShoppingLists = () => {
  return useQuery({
    queryKey: shoppingListsQueryKeys.all,
    queryFn: ({ signal }) => shoppingListsService.findAll({ signal }),
  });
};

export const useShoppingList = (id: string) => {
  return useQuery({
    queryKey: shoppingListsQueryKeys.detail(id),
    queryFn: ({ signal }) => shoppingListsService.findOne({ id, signal }),
    enabled: id.length > 0,
  });
};

export const useCreateShoppingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateShoppingListPayload) => shoppingListsService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: shoppingListsQueryKeys.all });
    },
  });
};

export const useUpdateShoppingList = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateShoppingListPayload) => shoppingListsService.update(id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: shoppingListsQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: shoppingListsQueryKeys.detail(id) }),
      ]);
    },
  });
};

export const useAddItemToShoppingLists = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddItemToShoppingListsPayload) =>
      shoppingListsService.addItemToLists(payload),
    onSuccess: async (_, payload) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: shoppingListsQueryKeys.all }),
        ...payload.listIds.map(listId =>
          queryClient.invalidateQueries({ queryKey: shoppingListsQueryKeys.detail(listId) }),
        ),
      ]);
    },
  });
};

export const useUpdateShoppingListItemQuantity = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateShoppingListItemQuantityPayload) =>
      shoppingListsService.updateItemQuantity(id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: shoppingListsQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: shoppingListsQueryKeys.detail(id) }),
      ]);
    },
  });
};

export const useRemoveShoppingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => shoppingListsService.remove(id),
    onSuccess: async (_, id) => {
      queryClient.removeQueries({ queryKey: shoppingListsQueryKeys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: shoppingListsQueryKeys.all });
    },
  });
};
