import { Icon } from "@components/icon";
import { Text } from "@components/text";
import { ShoppingList } from "@services/shopping-lists/types";
import { cn } from "@utils/cn";
import { Pressable, View } from "react-native";

type ListSelectorRowProps = {
  disabled: boolean;
  isSaving: boolean;
  list: ShoppingList;
  onPress: (list: ShoppingList) => void;
  selected: boolean;
};

export const ListSelectorRow = ({
  disabled,
  isSaving,
  list,
  onPress,
  selected,
}: ListSelectorRowProps) => {
  return (
    <Pressable
      disabled={disabled || isSaving}
      onPress={() => onPress(list)}
      className={cn(
        "flex-row items-center gap-3 rounded-lg border border-border bg-white p-4",
        selected && "border-primary bg-primary/5",
        disabled && "opacity-60",
      )}
    >
      <View
        className={cn(
          "size-6 items-center justify-center rounded-full border border-border",
          selected && "border-primary bg-primary",
          disabled && "bg-accent",
        )}
      >
        {selected ? <Icon name="Check" size={14} className="text-primary-foreground" /> : null}
        {disabled ? <Icon name="Check" size={14} className="text-muted-foreground" /> : null}
      </View>

      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="font-semibold text-foreground">
          {list.name}
        </Text>
        <Text className="font-questrial text-xs text-muted-foreground">
          {disabled ? "Já adicionado" : `${list.items.length} itens`}
        </Text>
      </View>
    </Pressable>
  );
};
