import { Icon } from "@components/icon";
import { Text } from "@components/text";
import { AddToListsBottomSheet } from "@components/add-to-lists-bottom-sheet";
import { Promotion } from "@services/promotions/types";
import { formatCurrency } from "@utils/currency";
import { Image, View } from "react-native";

export const PromotionItem = ({ promotion }: { promotion: Promotion }) => {
  const imageUrl = promotion.masterProduct.imageUrl?.trim();

  return (
    <View className="flex-row items-center gap-4">
      <View className="size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-accent">
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="size-14"
            resizeMode="cover"
            accessibilityLabel={promotion.masterProduct.name}
          />
        ) : (
          <Icon name="Package" size={22} className="text-muted-foreground" />
        )}
      </View>

      <View className="min-w-0 flex-1 gap-1">
        <Text numberOfLines={1} className="font-semibold text-foreground">
          {promotion.masterProduct.name}
        </Text>
        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="text-xl font-bold text-primary">
            {formatCurrency(promotion.endPrice)}
          </Text>
          <View className="rounded-full bg-green-700/10 px-2 py-1">
            <Text className="font-questrial text-[10px] uppercase text-green-700">
              {promotion.market.name}
            </Text>
          </View>
          <View className="rounded-full bg-primary/10 px-2 py-1">
            <Text className="font-questrial text-[10px] uppercase text-primary">
              -{promotion.dropPercentage.toLocaleString("pt-BR")}%
            </Text>
          </View>
        </View>
      </View>

      <AddToListsBottomSheet
        product={{
          id: promotion.marketProductId,
          nameInMarket: promotion.nameInMarket,
        }}
      />
    </View>
  );
};
