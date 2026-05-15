import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { priceComparisonsQueryKeys } from "@hooks/use-price-comparison";
import { shoppingListsService } from "@services/shopping-lists";
import { showToast } from "@utils/toast";
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
      showToast({ title: "Lista criada" });
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
      showToast({ title: "Produto adicionado" });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: shoppingListsQueryKeys.all }),
        ...payload.listIds.map(listId =>
          queryClient.invalidateQueries({ queryKey: shoppingListsQueryKeys.detail(listId) }),
        ),
        ...payload.listIds.map(listId =>
          queryClient.invalidateQueries({ queryKey: priceComparisonsQueryKeys.list(listId) }),
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
        queryClient.invalidateQueries({ queryKey: priceComparisonsQueryKeys.list(id) }),
      ]);
    },
  });
};

export const useRemoveShoppingListItem = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => shoppingListsService.removeItem(id, itemId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: shoppingListsQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: shoppingListsQueryKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: priceComparisonsQueryKeys.list(id) }),
      ]);
    },
  });
};

export const useRemoveShoppingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => shoppingListsService.remove(id),
    onSuccess: async (_, id) => {
      showToast({ title: "Lista excluída" });
      queryClient.removeQueries({ queryKey: shoppingListsQueryKeys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: shoppingListsQueryKeys.all });
    },
  });
};
