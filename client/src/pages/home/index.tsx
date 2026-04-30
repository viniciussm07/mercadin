import { ScrollView, View } from "react-native";
import { Text } from "@components/text";
import { cn } from "@utils/cn";
import { ActiveListsSection } from "./components/active-lists-section";
import { MetricCard } from "./components/metric-card";
import { TrendingProductsSection } from "./components/trending-products-section";
import { mobileContentContainerStyle, wideContentContainerStyle } from "./constants";
import { useHome } from "./hooks";

export const Home = () => {
  const { isWide, welcomeName } = useHome();

  return (
    <ScrollView
      className="flex-1 bg-background px-4 lg:px-8"
      contentContainerStyle={isWide ? wideContentContainerStyle : mobileContentContainerStyle}
    >
      <View className="w-full max-w-7xl self-center gap-6 lg:flex-row lg:gap-8">
        <View className="min-w-0 flex-1 gap-8">
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground lg:text-4xl">
              Bem-vinda {welcomeName}!
            </Text>
            <Text className="font-questrial text-base text-muted-foreground">
              Aqui está o seu resumo inteligente de compras.
            </Text>
          </View>

          <MetricCard />
          <ActiveListsSection />
        </View>

        <View className={cn("gap-6", isWide && "w-[360px]")}>
          <TrendingProductsSection />
        </View>
      </View>
    </ScrollView>
  );
};
