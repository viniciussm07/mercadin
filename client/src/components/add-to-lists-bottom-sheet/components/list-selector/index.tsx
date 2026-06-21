import { ShoppingList } from "@services/shopping-lists/types";
import { ScrollView } from "react-native";
import { ListSelectorRow } from "../list-selector-row";

type ListSelectorProps = {
  isListDisabled: (list: ShoppingList) => boolean;
  isListSelected: (listId: string) => boolean;
  isSaving: boolean;
  lists: ShoppingList[];
  onToggleList: (list: ShoppingList) => void;
};

export const ListSelector = ({
  isListDisabled,
  isListSelected,
  isSaving,
  lists,
  onToggleList,
}: ListSelectorProps) => {
  return (
    <ScrollView
      className="h-[300px]"
      contentContainerClassName="gap-3"
      showsVerticalScrollIndicator
    >
      {lists.map(list => (
        <ListSelectorRow
          key={list.id}
          disabled={isListDisabled(list)}
          isSaving={isSaving}
          list={list}
          selected={isListSelected(list.id)}
          onPress={onToggleList}
        />
      ))}
    </ScrollView>
  );
};
