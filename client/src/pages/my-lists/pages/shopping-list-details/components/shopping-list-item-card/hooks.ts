import {
  useRemoveShoppingListItem,
  useUpdateShoppingListItemQuantity,
} from "@hooks/use-shopping-lists";
import { getHttpErrorMessage } from "@services/http";
import { ShoppingListItem } from "@services/shopping-lists/types";
import { showToast } from "@utils/toast";
import { useEffect, useRef, useState } from "react";

const UPDATE_QUANTITY_DEBOUNCE_MS = 500;

type UseShoppingListItemCardParams = {
  item: ShoppingListItem;
  listId: string;
};

export const useShoppingListItemCard = ({ item, listId }: UseShoppingListItemCardParams) => {
  const { isPending, mutate } = useUpdateShoppingListItemQuantity(listId);
  const removeItem = useRemoveShoppingListItem(listId);
  const [quantity, setQuantity] = useState(item.quantity);
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  useEffect(() => {
    if (quantity === item.quantity) {
      return;
    }

    updateTimeoutRef.current = setTimeout(() => {
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

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
        updateTimeoutRef.current = null;
      }
    };
  }, [item.marketProductId, item.quantity, mutate, quantity]);

  const decreaseQuantity = () => {
    setQuantityError(null);
    setQuantity(current => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    setQuantityError(null);
    setQuantity(current => current + 1);
  };

  const removeListItem = async () => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
      updateTimeoutRef.current = null;
    }

    setQuantityError(null);

    try {
      await removeItem.mutateAsync(item.id);
      showToast({ title: "Item removido" });
    } catch (error) {
      const message = await getHttpErrorMessage(error, "Não foi possível remover o item.");
      setQuantityError(message);
      showToast({ title: "Não foi possível remover o item", message, type: "error" });
    }
  };

  return {
    decreaseQuantity,
    increaseQuantity,
    isRemovingItem: removeItem.isPending,
    isUpdatingQuantity: isPending,
    quantity,
    quantityError,
    removeListItem,
  };
};
