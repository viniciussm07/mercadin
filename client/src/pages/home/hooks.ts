import { useQuery } from "@tanstack/react-query";
import { shoppingListsService } from "@services/shopping-lists";

const SHOPPING_LISTS_QUERY_KEY = ["shopping-lists"] as const;

export const useActiveShoppingLists = () => {
  const shoppingLists = useQuery({
    queryKey: SHOPPING_LISTS_QUERY_KEY,
    queryFn: shoppingListsService.findAll,
  });

  return { shoppingLists };
};
