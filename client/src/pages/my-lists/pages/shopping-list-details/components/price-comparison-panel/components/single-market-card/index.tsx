import { Card, CardContent } from "@components/card";
import { Icon } from "@components/icon";
import { Text } from "@components/text";
import { ByMarketCart } from "@services/price-comparisons/types";
import { View } from "react-native";
import { formatCurrency, formatMissingPreview, itemCountLabel } from "../../utils";

interface SingleMarketCardProps {
  cheapestSingleMarket: ByMarketCart;
  incompleteMarkets: ByMarketCart[];
}

const MarketRow = ({ cart }: { cart: ByMarketCart }) => (
  <View className="gap-2 rounded-lg border border-border px-3 py-3">
    <View className="flex-row items-center justify-between gap-3">
      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="font-semibold text-foreground">
          {cart.marketName}
        </Text>
        <Text numberOfLines={1} className="font-questrial text-xs text-muted-foreground">
          {cart.isComplete
            ? `${itemCountLabel(cart.picks.length)} encontrados`
            : `${itemCountLabel(cart.missing.length)} faltando`}
        </Text>
      </View>
      <Text className="font-bold text-foreground">{formatCurrency(cart.total)}</Text>
    </View>

    {!cart.isComplete ? (
      <Text numberOfLines={2} className="font-questrial text-xs text-muted-foreground">
        Faltando: {formatMissingPreview(cart.missing)}
      </Text>
    ) : null}
  </View>
);

export const SingleMarketCard = ({
  cheapestSingleMarket,
  incompleteMarkets,
}: SingleMarketCardProps) => (
  <Card className="border-0 bg-white py-5 shadow-sm">
    <CardContent className="gap-4">
      <View className="flex-row items-center gap-3">
        <View className="size-9 items-center justify-center rounded-full bg-primary/10">
          <Icon name="Store" size={17} className="text-primary" />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-lg font-bold text-foreground">Tudo em um mercado</Text>
          <Text className="font-questrial text-sm text-muted-foreground">
            Compra completa sem dividir a lista.
          </Text>
        </View>
      </View>

      <View className="gap-2 rounded-lg border border-primary bg-primary/5 px-3 py-3">
        <Text className="font-questrial text-xs uppercase text-primary">Melhor opção</Text>
        <MarketRow cart={cheapestSingleMarket} />
      </View>

      {incompleteMarkets.length > 0 ? (
        <View className="gap-2">
          <Text className="font-questrial text-xs uppercase text-muted-foreground">
            Mercados incompletos
          </Text>
          {incompleteMarkets.map(cart => (
            <MarketRow key={cart.marketId} cart={cart} />
          ))}
        </View>
      ) : null}
    </CardContent>
  </Card>
);
