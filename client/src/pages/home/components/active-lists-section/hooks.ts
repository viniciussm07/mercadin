import { useShoppingListActions } from "@hooks/use-shopping-list-actions";
import { useActiveShoppingLists } from "../../hooks";

export const useActiveListsSection = () => {
  const { shoppingLists } = useActiveShoppingLists();
  const listActions = useShoppingListActions();

  return {
    ...listActions,
    shoppingLists,
  };
};
