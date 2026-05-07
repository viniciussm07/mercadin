import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/dropdown-menu";
import { Card, CardContent } from "@components/card";
import { Icon } from "@components/icon";
import { Text } from "@components/text";
import { formatUpdatedAt } from "@pages/home/utils";
import { ShoppingList } from "@services/shopping-lists/types";
import { Pressable, View } from "react-native";

interface ShoppingListSummaryCardProps {
  isDeleting: boolean;
  list: ShoppingList;
  onDelete: (list: ShoppingList) => void;
  onOpen: (listId: string) => void;
  variant?: "active" | "compact";
}

const itemLabel = (count: number) => `${count} ${count === 1 ? "item" : "itens"}`;

const ShoppingListMenu = ({
  isDeleting,
  list,
  onDelete,
  triggerClassName,
}: Pick<ShoppingListSummaryCardProps, "isDeleting" | "list" | "onDelete"> & {
  triggerClassName: string;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger className={triggerClassName}>
      <Icon name="Ellipsis" size={16} className="text-primary" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" side="bottom" sideOffset={8}>
      <DropdownMenuItem disabled={isDeleting} variant="destructive" onPress={() => onDelete(list)}>
        <Icon name="Trash2" size={16} className="text-destructive" />
        <Text>{isDeleting ? "Excluindo..." : "Excluir lista"}</Text>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const ActiveItemsPreview = ({ list }: Pick<ShoppingListSummaryCardProps, "list">) => (
  <View className="flex-row items-center justify-between">
    <View className="flex-row items-center">
      {list.items.slice(0, 3).map(item => (
        <View
          key={item.id}
          className="-mr-2 size-8 items-center justify-center rounded-full border-2 border-white bg-accent"
        >
          <Icon name="Package" size={14} className="text-muted-foreground" />
        </View>
      ))}
      {list.items.length === 0 ? (
        <Text className="font-questrial text-sm text-muted-foreground">Sem itens</Text>
      ) : null}
    </View>

    <View className="rounded-full bg-primary/10 px-2 py-1">
      <Text className="font-questrial text-[10px] uppercase text-primary">
        {itemLabel(list.items.length)}
      </Text>
    </View>
  </View>
);

const CompactItemsPreview = ({ list }: Pick<ShoppingListSummaryCardProps, "list">) => (
  <View className="flex-row items-center justify-between gap-3">
    <View className="flex-row items-center gap-2">
      <Icon name="Package" size={18} className="text-muted-foreground" />
      <Text className="font-questrial text-sm text-muted-foreground">
        {itemLabel(list.items.length)}
      </Text>
    </View>
  </View>
);

export const ShoppingListSummaryCard = ({
  isDeleting,
  list,
  onDelete,
  onOpen,
  variant = "compact",
}: ShoppingListSummaryCardProps) => {
  const isActiveVariant = variant === "active";
  const rootClassName = isActiveVariant ? "flex-1" : undefined;
  const cardClassName = isActiveVariant
    ? "min-h-[150px] justify-between border-0 bg-white py-5 shadow-sm"
    : "gap-0 border-0 bg-white py-0 shadow-sm";
  const contentClassName = isActiveVariant ? "flex-1 justify-between gap-5" : "gap-4 py-5";
  const triggerClassName = isActiveVariant
    ? "size-8 items-center justify-center rounded-full bg-primary/10"
    : "size-9 items-center justify-center rounded-full bg-primary/10";

  return (
    <Pressable onPress={() => onOpen(list.id)} className={rootClassName}>
      <Card className={cardClassName}>
        <CardContent className={contentClassName}>
          <View className="flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1 gap-1">
              <Text numberOfLines={1} className="text-lg font-bold text-foreground">
                {list.name}
              </Text>
              <Text className="font-questrial text-sm text-muted-foreground">
                {formatUpdatedAt(list.updatedAt)}
              </Text>
            </View>

            <ShoppingListMenu
              isDeleting={isDeleting}
              list={list}
              onDelete={onDelete}
              triggerClassName={triggerClassName}
            />
          </View>

          {isActiveVariant ? (
            <ActiveItemsPreview list={list} />
          ) : (
            <CompactItemsPreview list={list} />
          )}
        </CardContent>
      </Card>
    </Pressable>
  );
};
