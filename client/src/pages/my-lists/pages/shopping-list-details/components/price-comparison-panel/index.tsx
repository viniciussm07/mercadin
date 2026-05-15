import { Button } from "@components/button";
import { Card, CardContent } from "@components/card";
import { Icon } from "@components/icon";
import { Text } from "@components/text";
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from "@components/toggle-group";
import { View } from "react-native";
import { ComparisonSummaryCard } from "./components/comparison-summary-card";
import { SingleMarketCard } from "./components/single-market-card";
import { SuperMarketCard } from "./components/super-market-card";
import { PriceComparisonTab, usePriceComparisonPanel } from "./hooks";

interface PriceComparisonPanelProps {
  itemCount: number;
  listId: string;
}

const StateCard = ({
  action,
  description,
  iconName,
  title,
}: {
  action?: React.ReactNode;
  description: string;
  iconName: React.ComponentProps<typeof Icon>["name"];
  title: string;
}) => (
  <Card className="border-0 bg-white py-5 shadow-sm">
    <CardContent className="gap-3">
      <View className="flex-row items-start gap-3">
        <View className="size-10 items-center justify-center rounded-full bg-primary/10">
          <Icon name={iconName} size={18} className="text-primary" />
        </View>
        <View className="min-w-0 flex-1 gap-1">
          <Text className="text-xl font-bold text-foreground">{title}</Text>
          <Text className="font-questrial text-sm text-muted-foreground">{description}</Text>
        </View>
      </View>
      {action}
    </CardContent>
  </Card>
);

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

  return (
    <View className="gap-3">
      <ToggleGroup
        type="single"
        value={activeTab}
        onValueChange={nextTab => {
          if (nextTab) {
            setActiveTab(nextTab as PriceComparisonTab);
          }
        }}
        variant="outline"
        className="w-full flex-wrap items-stretch"
      >
        {availableTabs.map((tab, index) => (
          <ToggleGroupItem
            key={tab}
            value={tab}
            isFirst={index === 0}
            isLast={index === availableTabs.length - 1}
            className="flex-1 px-2"
          >
            <ToggleGroupIcon name={tabLabels[tab].icon} size={14} />
            <Text className="font-questrial text-xs">{tabLabels[tab].label}</Text>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {activeTab === "summary" ? (
        <ComparisonSummaryCard
          cheapestSingleMarket={cheapestSingleMarket}
          comparison={data}
          hasSavings={hasSavings}
        />
      ) : null}

      {activeTab === "same-market" && cheapestSingleMarket ? (
        <SingleMarketCard
          cheapestSingleMarket={cheapestSingleMarket}
          incompleteMarkets={incompleteMarkets}
        />
      ) : null}

      {activeTab === "best-prices" ? <SuperMarketCard superCart={data.superCart} /> : null}
    </View>
  );
};
