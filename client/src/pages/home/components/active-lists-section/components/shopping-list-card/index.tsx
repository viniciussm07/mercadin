import { View } from "react-native";
import { Card, CardContent } from "@components/card";
import { Icon } from "@components/icon";
import { Text } from "@components/text";
import { ShoppingList } from "@services/shopping-lists/types";
import { formatUpdatedAt } from "../../../../utils";

export const ShoppingListCard = ({ list }: { list: ShoppingList }) => {
  return (
    <Card className="min-h-[150px] flex-1 justify-between border-0 bg-white py-5 shadow-sm">
      <CardContent className="flex-1 justify-between gap-5">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text numberOfLines={1} className="text-lg font-bold text-foreground">
              {list.name}
            </Text>
            <Text className="font-questrial text-sm text-muted-foreground">
              {formatUpdatedAt(list.updatedAt)}
            </Text>
          </View>

          <View className="size-8 items-center justify-center rounded-full bg-primary/10">
            <Icon name="Ellipsis" size={16} className="text-primary" />
          </View>
        </View>

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
              {list.items.length} {list.items.length === 1 ? "item" : "itens"}
            </Text>
          </View>
        </View>
      </CardContent>
    </Card>
  );
};
