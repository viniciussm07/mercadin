import { Card, CardContent } from "@components/card";
import { Icon } from "@components/icon";
import { Text } from "@components/text";
import { ByMarketCart, PriceComparison } from "@services/price-comparisons/types";
import { View } from "react-native";
import { formatCurrency } from "../../utils";

interface ComparisonSummaryCardProps {
  cheapestSingleMarket: ByMarketCart | null;
  comparison: PriceComparison;
  hasSavings: boolean;
}

const SummaryMetric = ({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "primary";
}) => (
  <View className="min-w-[120px] flex-1 gap-1 rounded-lg bg-accent px-3 py-3">
    <Text className="font-questrial text-xs text-muted-foreground">{label}</Text>
    <Text
      numberOfLines={1}
      className={tone === "primary" ? "text-lg font-bold text-primary" : "text-lg font-bold"}
    >
      {value}
    </Text>
  </View>
);

export const ComparisonSummaryCard = ({
  cheapestSingleMarket,
  comparison,
  hasSavings,
}: ComparisonSummaryCardProps) => {
  if (!cheapestSingleMarket) {
    return (
      <Card className="border-0 bg-white py-5 shadow-sm">
        <CardContent className="gap-4">
          <View className="flex-row items-start gap-3">
            <View className="size-10 items-center justify-center rounded-full bg-primary/10">
              <Icon name="BadgeDollarSign" size={18} className="text-primary" />
            </View>
            <View className="min-w-0 flex-1 gap-1">
              <Text className="text-xl font-bold text-foreground">Total</Text>
            </View>
          </View>

          <SummaryMetric
            label="Total estimado"
            value={formatCurrency(comparison.superCart.total)}
            tone="primary"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white py-5 shadow-sm">
      <CardContent className="gap-4">
        <View className="flex-row items-start gap-3">
          <View className="size-10 items-center justify-center rounded-full bg-primary/10">
            <Icon name="BadgeDollarSign" size={18} className="text-primary" />
          </View>
          <View className="min-w-0 flex-1 gap-1">
            <Text className="text-xl font-bold text-foreground">Comparação de economia</Text>
            <Text className="font-questrial text-sm text-muted-foreground">
              Compare comprar tudo em um mercado com menores preços em cada mercado.
            </Text>
          </View>
        </View>

        <View className="gap-3 sm:flex-row">
          <SummaryMetric
            label="Tudo em um mercado"
            value={formatCurrency(cheapestSingleMarket.total)}
          />
          <SummaryMetric
            label="Menores preços"
            value={formatCurrency(comparison.superCart.total)}
          />
          <SummaryMetric
            label="Economia estimada"
            value={hasSavings ? formatCurrency(comparison.savings ?? 0) : "Sem economia"}
            tone="primary"
          />
        </View>
      </CardContent>
    </Card>
  );
};
