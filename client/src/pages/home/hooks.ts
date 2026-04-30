import { useWindowDimensions } from "react-native";
import { useSession } from "@contexts/session";
import { useShoppingLists } from "@hooks/use-shopping-lists";
import { getFirstName } from "./utils";

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
  const shoppingLists = useShoppingLists();

  return { shoppingLists };
};
