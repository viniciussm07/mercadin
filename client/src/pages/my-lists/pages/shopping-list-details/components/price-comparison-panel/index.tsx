import { Button } from "@components/button";
import { Icon } from "@components/icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/tabs";
import { Text } from "@components/text";
import { View } from "react-native";
import { ComparisonSummaryCard } from "./components/comparison-summary-card";
import { SingleMarketCard } from "./components/single-market-card";
import { StateCard } from "./components/state-card";
import { SuperMarketCard } from "./components/super-market-card";
import { PriceComparisonTab, usePriceComparisonPanel } from "./hooks";

interface PriceComparisonPanelProps {
  itemCount: number;
  listId: string;
}

const tabLabels: Record<
  PriceComparisonTab,
  { icon: React.ComponentProps<typeof Icon>["name"]; label: string }
> = {
  summary: { icon: "BadgeDollarSign", label: "Resumo" },
  "same-market": { icon: "Store", label: "Um mercado" },
  "best-prices": { icon: "ShoppingBasket", label: "Menores preços" },
};

export const PriceComparisonPanel = ({ itemCount, listId }: PriceComparisonPanelProps) => {
  const {
    activeTab,
    availableTabs,
    cheapestSingleMarket,
    completeMarketAlternatives,
    comparison,
    hasItems,
    hasSavings,
    incompleteMarkets,
    setActiveTab,
  } = usePriceComparisonPanel({ itemCount, listId });
  const data = comparison.data;

  if (!hasItems) {
    return (
      <StateCard
        iconName="BadgeDollarSign"
        title="Comparação de economia"
        description="Adicione itens à lista para comparar formas de fazer a compra."
      />
    );
  }

  if (comparison.isPending) {
    return (
      <StateCard
        iconName="LoaderCircle"
        title="Comparando preços..."
        description="Estamos calculando os cenários de compra para esta lista."
      />
    );
  }

  if (comparison.isError || !data) {
    return (
      <StateCard
        iconName="CircleAlert"
        title="Não foi possível comparar"
        description="Tente novamente em alguns instantes."
        action={
          <Button variant="outline" onPress={() => void comparison.refetch()}>
            <Icon name="RefreshCw" size={16} className="text-foreground" />
            <Text>Tentar novamente</Text>
          </Button>
        }
      />
    );
  }

  const handleTabChange = (nextTab: string) => {
    setActiveTab(nextTab as PriceComparisonTab);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="gap-3">
      <TabsList className="h-auto w-full flex-wrap items-stretch">
        {availableTabs.map(tab => (
          <TabsTrigger key={tab} value={tab} className="flex-1 px-2">
            <Icon name={tabLabels[tab].icon} size={14} />
            <Text className="font-questrial">{tabLabels[tab].label}</Text>
          </TabsTrigger>
        ))}
      </TabsList>

      {comparison.isRefetching ? (
        <View className="flex-row items-center gap-2 rounded-lg bg-accent px-3 py-2">
          <Icon name="RefreshCw" size={14} className="text-muted-foreground" />
          <Text className="font-questrial text-xs text-muted-foreground">
            Atualizando comparação...
          </Text>
        </View>
      ) : null}

      {cheapestSingleMarket ? (
        <TabsContent value="same-market">
          <SingleMarketCard
            cheapestSingleMarket={cheapestSingleMarket}
            completeMarketAlternatives={completeMarketAlternatives}
            incompleteMarkets={incompleteMarkets}
          />
        </TabsContent>
      ) : null}

      <TabsContent value="best-prices">
        <SuperMarketCard superCart={data.superCart} />
      </TabsContent>

      <TabsContent value="summary">
        <ComparisonSummaryCard
          cheapestSingleMarket={cheapestSingleMarket}
          comparison={data}
          hasSavings={hasSavings}
        />
      </TabsContent>
    </Tabs>
  );
};
