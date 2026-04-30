import { View } from "react-native";
import { Card, CardContent, CardHeader } from "@components/card";
import { Icon } from "@components/icon";
import { Text } from "@components/text";
import { TRENDING_PRODUCTS } from "../../constants";

export const TrendingProductsSection = () => {
  return (
    <Card className="border-0 bg-white py-0 shadow-sm">
      <CardHeader className="border-b border-border py-5">
        <View className="flex-row items-center gap-2">
          <Icon name="Flame" size={18} className="text-primary" />
          <Text className="text-2xl font-bold text-foreground">Produtos em alta</Text>
        </View>
        <Text className="font-questrial text-xs uppercase text-primary">Placeholder</Text>
      </CardHeader>

      <CardContent className="gap-5 py-5">
        {TRENDING_PRODUCTS.map(product => (
          <View key={product.id} className="flex-row items-center gap-4">
            <View className="size-14 items-center justify-center rounded-full border border-border bg-accent">
              <Icon name="Package" size={22} className="text-muted-foreground" />
            </View>

            <View className="min-w-0 flex-1 gap-1">
              <Text numberOfLines={1} className="font-semibold text-foreground">
                {product.name}
              </Text>
              <View className="flex-row flex-wrap items-center gap-2">
                <Text className="text-xl font-bold text-primary">{product.price}</Text>
                <View className="rounded-full bg-green-700/10 px-2 py-1">
                  <Text className="font-questrial text-[10px] uppercase text-green-700">
                    {product.market}
                  </Text>
                </View>
              </View>
            </View>

            <View className="size-8 items-center justify-center rounded-full border border-border">
              <Icon name="Plus" size={16} className="text-muted-foreground" />
            </View>
          </View>
        ))}
      </CardContent>
    </Card>
  );
};
