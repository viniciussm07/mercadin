import { ShoppingListSummaryCard } from "@components/shopping-list-summary-card";
import { ShoppingList } from "@services/shopping-lists/types";

interface ShoppingListCardProps {
  isDeleting: boolean;
  list: ShoppingList;
  onDelete: (list: ShoppingList) => void;
  onOpen: (listId: string) => void;
}

export const ShoppingListCard = ({ isDeleting, list, onDelete, onOpen }: ShoppingListCardProps) => {
  return (
    <ShoppingListSummaryCard
      isDeleting={isDeleting}
      list={list}
      onDelete={onDelete}
      onOpen={onOpen}
      variant="active"
    />
  );
};
