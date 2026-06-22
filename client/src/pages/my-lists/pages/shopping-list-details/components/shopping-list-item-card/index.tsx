import { Card, CardContent } from "@components/card";
import { Icon } from "@components/icon";
import { QuantityCounter } from "@components/quantity-counter";
import { Text } from "@components/text";
import { ShoppingListItem } from "@services/shopping-lists/types";
import { formatCurrency } from "@utils/currency";
import { Image, View } from "react-native";
import { useShoppingListItemCard } from "./hooks";

type ShoppingListItemCardProps = {
  item: ShoppingListItem;
  listId: string;
};

export const ShoppingListItemCard = ({ item, listId }: ShoppingListItemCardProps) => {
  const {
    decreaseQuantity,
    increaseQuantity,
    isRemovingItem,
    isUpdatingQuantity,
    quantity,
    quantityError,
    removeListItem,
  } = useShoppingListItemCard({ item, listId });
  const product = item.marketProduct;
  const imageUrl = product?.masterProduct.imageUrl?.trim();
  const productName = product?.masterProduct.name ?? "Produto indisponível";
  const marketName = product?.market.name ?? "Mercado não informado";

  return (
    <Card className="gap-0 bg-white py-0">
      <CardContent className="pb-4 px-4">
        <View className="flex-row items-start gap-4 py-4">
          <View className="size-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-accent">
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                className="size-28"
                resizeMode="cover"
                accessibilityLabel={productName}
              />
            ) : (
              <Icon name="Package" size={24} className="text-muted-foreground" />
            )}
          </View>
          <View className="min-w-0 flex-1 flex-col items-start">
            <View className="gap-1 w-full min-w-0">
              <Text
                numberOfLines={2}
                className="font-semibold text-foreground text-ellipsis line-clamp-2"
              >
                {productName}
              </Text>
              <Text numberOfLines={1} className="font-questrial text-sm text-muted-foreground">
                {marketName}
              </Text>
            </View>

            {product ? (
              <View className="items-end">
                <Text className="text-lg font-bold text-primary">
                  {formatCurrency(product.currentPrice)}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <QuantityCounter
          quantity={quantity}
          onDecrease={decreaseQuantity}
          onIncrease={increaseQuantity}
          minimumAction={{
            accessibilityLabel: "Remover item da lista",
            disabled: isRemovingItem || isUpdatingQuantity,
            iconName: "Trash2",
            onPress: removeListItem,
            variant: "destructive",
          }}
        />
        {quantityError ? (
          <Text className="font-questrial text-sm text-destructive">{quantityError}</Text>
        ) : null}
      </CardContent>
    </Card>
  );
};
