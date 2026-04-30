import { useUpdateShoppingListItemQuantity } from "@hooks/use-shopping-lists";
import { getHttpErrorMessage } from "@services/http";
import { ShoppingListItem } from "@services/shopping-lists/types";
import { useEffect, useState } from "react";

const UPDATE_QUANTITY_DEBOUNCE_MS = 500;

type UseShoppingListItemCardParams = {
  item: ShoppingListItem;
  listId: string;
};

export const useShoppingListItemCard = ({ item, listId }: UseShoppingListItemCardParams) => {
  const { isPending, mutate } = useUpdateShoppingListItemQuantity(listId);
  const [quantity, setQuantity] = useState(item.quantity);
  const [quantityError, setQuantityError] = useState<string | null>(null);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  useEffect(() => {
    if (quantity === item.quantity) {
      return;
    }

    const timeout = setTimeout(() => {
      mutate(
        {
          marketProductId: item.marketProductId,
          quantity,
        },
        {
          onError: async error => {
            setQuantity(item.quantity);
            setQuantityError(
              await getHttpErrorMessage(error, "Não foi possível atualizar a quantidade."),
            );
          },
          onSuccess: () => {
            setQuantityError(null);
          },
        },
      );
    }, UPDATE_QUANTITY_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [item.marketProductId, item.quantity, mutate, quantity]);

  const decreaseQuantity = () => {
    setQuantityError(null);
    setQuantity(current => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    setQuantityError(null);
    setQuantity(current => current + 1);
  };

  return {
    decreaseQuantity,
    increaseQuantity,
    isUpdatingQuantity: isPending,
    quantity,
    quantityError,
  };
};
