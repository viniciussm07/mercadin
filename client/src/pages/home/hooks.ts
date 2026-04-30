import { useWindowDimensions } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@contexts/session";
import { shoppingListsService } from "@services/shopping-lists";
import { getFirstName } from "./utils";

const SHOPPING_LISTS_QUERY_KEY = ["shopping-lists"] as const;

export const useHome = () => {
  const { width } = useWindowDimensions();
  const {
    session: { user },
  } = useSession();

  return {
    isWide: width >= 1024,
    welcomeName: getFirstName(user?.name),
  };
};

export const useActiveShoppingLists = () => {
  const shoppingLists = useQuery({
    queryKey: SHOPPING_LISTS_QUERY_KEY,
    queryFn: shoppingListsService.findAll,
  });

  return { shoppingLists };
};
