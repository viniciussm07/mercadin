import { Card, CardContent, CardHeader } from "@components/card";
import { Icon } from "@components/icon";
import { Select } from "@components/select";
import { Text } from "@components/text";
import { promotionPeriods, useTrendingProducts } from "@hooks/trending-products/hooks";
import { AddToListsBottomSheet } from "@components/add-to-lists-bottom-sheet";
import { PriceHistoryDialog } from "@components/price-history-dialog";
import { formatCurrency } from "@utils/currency";
import { Image, ScrollView, View } from "react-native";

const contentContainerStyle = { paddingBottom: 120, paddingTop: 56 };

export const Promotions = () => {
  const { promotions, periodDays, selectPeriod } = useTrendingProducts({ limit: 10 });

  return (
    <ScrollView className="flex-1 px-4 lg:px-8" contentContainerStyle={contentContainerStyle}>
      <View className="w-full max-w-4xl self-center">
        <View className="items-start gap-4">
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Promoções</Text>
            <Text className="font-questrial text-base text-muted-foreground">
              Fique de olho nas quedas de preço dos produtos.
            </Text>
          </View>

          <View className="self-end">
            <Select
              values={promotionPeriods}
              selectedValue={String(periodDays)}
              onValueChange={selectPeriod}
            />
          </View>

          <View className="w-full gap-4 grid grid-cols-3">
            {promotions.data?.items.map(item => (
              <Card key={item.marketProductId} className="w-full">
                <CardHeader className="items-center">
                  {item.masterProduct.imageUrl ? (
                    <Image
                      source={{ uri: item.masterProduct.imageUrl }}
                      className="size-32"
                      resizeMode="cover"
                      accessibilityLabel={item.masterProduct.name}
                    />
                  ) : (
                    <Icon name="Package" size={22} className="text-muted-foreground" />
                  )}
                </CardHeader>
                <CardContent>
                  <View className="flex-col items-start gap-3 py-3">
                    <View className="flex flex-row items-center w-full">
                      <View className="min-w-0 flex-1 gap-1">
                        <View className="flex-row flex-wrap items-center gap-2">
                          <Text className="font-semibold text-foreground">{item.market.name}</Text>
                        </View>
                        <Text
                          numberOfLines={1}
                          className="font-questrial text-sm text-muted-foreground"
                        >
                          {item.nameInMarket}
                        </Text>
                      </View>
                      <View className="flex-row gap-2 self-end">
                        <AddToListsBottomSheet
                          product={{ id: item.marketProductId, nameInMarket: item.nameInMarket }}
                        />
                      </View>
                    </View>

                    <View className="flex flex-row w-full justify-between">
                      <View className="flex items-start gap-1">
                        <Text className="text-xl font-bold text-primary">
                          {formatCurrency(item.endPrice)}
                        </Text>
                        <View className="rounded-full bg-primary/10 px-2 py-1">
                          <Text className="font-questrial text-[10px] uppercase text-primary">
                            -{item.dropPercentage.toLocaleString("pt-BR")}%
                          </Text>
                        </View>
                      </View>
                      <View>
                        <PriceHistoryDialog
                          id={item.marketProductId}
                          nameInMarket={item.nameInMarket}
                          marketName={item.market.name}
                        />
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
