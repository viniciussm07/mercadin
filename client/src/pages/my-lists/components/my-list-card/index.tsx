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

interface MyListCardProps {
  isDeleting: boolean;
  list: ShoppingList;
  onDelete: (list: ShoppingList) => void;
  onOpen: (listId: string) => void;
}

export const MyListCard = ({ isDeleting, list, onDelete, onOpen }: MyListCardProps) => {
  return (
    <Pressable onPress={() => onOpen(list.id)}>
      <Card className="gap-0 border-0 bg-white py-0 shadow-sm">
        <CardContent className="gap-4 py-5">
          <View className="flex-row items-start justify-between gap-3">
            <Pressable className="min-w-0 flex-1 gap-1">
              <Text numberOfLines={1} className="text-lg font-bold text-foreground">
                {list.name}
              </Text>
              <Text className="font-questrial text-sm text-muted-foreground">
                {formatUpdatedAt(list.updatedAt)}
              </Text>
            </Pressable>

            <DropdownMenu>
              <DropdownMenuTrigger className="size-9 items-center justify-center rounded-full bg-primary/10">
                <Icon name="Ellipsis" size={16} className="text-primary" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom" sideOffset={8}>
                <DropdownMenuItem
                  disabled={isDeleting}
                  variant="destructive"
                  onPress={() => onDelete(list)}
                >
                  <Icon name="Trash2" size={16} className="text-destructive" />
                  <Text>{isDeleting ? "Excluindo..." : "Excluir lista"}</Text>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </View>

          <Pressable className="flex-row items-center justify-between gap-3">
            <View className="flex-row items-center gap-2">
              <Icon name="Package" size={18} className="text-muted-foreground" />
              <Text className="font-questrial text-sm text-muted-foreground">
                {list.items.length} {list.items.length === 1 ? "item" : "itens"}
              </Text>
            </View>
          </Pressable>
        </CardContent>
      </Card>
    </Pressable>
  );
};
