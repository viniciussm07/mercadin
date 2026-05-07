import { ShoppingListSummaryCard } from "@components/shopping-list-summary-card";
import { ShoppingList } from "@services/shopping-lists/types";

interface MyListCardProps {
  isDeleting: boolean;
  list: ShoppingList;
  onDelete: (list: ShoppingList) => void;
  onOpen: (listId: string) => void;
}

export const MyListCard = ({ isDeleting, list, onDelete, onOpen }: MyListCardProps) => {
  return (
    <ShoppingListSummaryCard
      isDeleting={isDeleting}
      list={list}
      onDelete={onDelete}
      onOpen={onOpen}
    />
  );
};
