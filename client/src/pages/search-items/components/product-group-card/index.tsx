import { Card, CardContent, CardHeader } from "@components/card";
import { Icon } from "@components/icon";
import { Text } from "@components/text";
import { ProductGroup } from "@services/products/types";
import { Image, View } from "react-native";
import { AddToListsBottomSheet } from "./components/add-to-lists-bottom-sheet";
import { cn } from "@utils/cn";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const formatPrice = (price: number) => currencyFormatter.format(price);

export const ProductGroupCard = ({ group }: { group: ProductGroup }) => {
  const imageUrl = group.masterProduct.imageUrl?.trim();
  const brand = group.masterProduct.brand?.trim();

  return (
    <Card className="gap-0 border-0 bg-white py-0 shadow-sm">
      <CardHeader className="border-b border-border py-5">
        <View className="flex-row gap-4">
          <View className="size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-accent">
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                className="size-16"
                resizeMode="cover"
                accessibilityLabel={group.masterProduct.name}
              />
            ) : (
              <Icon name="Package" size={24} className="text-muted-foreground" />
            )}
          </View>

          <View className="min-w-0 flex-1 gap-2">
            <View className="gap-1">
              <Text numberOfLines={2} className="font-semibold text-foreground">
                {group.masterProduct.name}
              </Text>
              {brand ? (
                <Text className="font-questrial text-xs uppercase text-muted-foreground">
                  {brand}
                </Text>
              ) : null}
            </View>

            <View className="flex-row flex-wrap items-center justify-between gap-3">
              <View className="rounded-full bg-primary/10 px-2 py-1">
                <Text className="font-questrial text-[10px] uppercase text-primary">
                  {group.items.length} {group.items.length === 1 ? "mercado" : "mercados"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </CardHeader>

      <CardContent className="gap-0 py-2">
        {group.items.map((offer, index) => (
          <View
            key={offer.id}
            className={cn(
              "flex-row items-center gap-3 border-t border-border/60 py-3",
              index === 0 && "border-t-0",
            )}
          >
            <View className="min-w-0 flex-1 gap-1">
              <View className="flex-row flex-wrap items-center gap-2">
                <Text className="font-semibold text-foreground">{offer.market.name}</Text>
                {group.items.length !== 1 && index === 0 ? (
                  <View className="rounded-full bg-green-700/10 px-2 py-1">
                    <Text className="font-questrial text-[10px] uppercase text-green-700">
                      Melhor preço
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text numberOfLines={1} className="font-questrial text-sm text-muted-foreground">
                {offer.nameInMarket}
              </Text>
            </View>

            <View className="flex-col sm:flex-row gap-3 sm:items-center">
              <View className="items-end gap-2">
                <Text className="text-xl font-bold text-primary">
                  {formatPrice(offer.currentPrice)}
                </Text>
              </View>
              <AddToListsBottomSheet product={offer} />
            </View>
          </View>
        ))}
      </CardContent>
    </Card>
  );
};
