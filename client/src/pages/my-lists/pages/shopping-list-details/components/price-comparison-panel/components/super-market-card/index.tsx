import { Card, CardContent } from "@components/card";
import { Icon } from "@components/icon";
import { Text } from "@components/text";
import { SuperCart } from "@services/price-comparisons/types";
import { View } from "react-native";
import { formatCurrency, formatMissingPreview, marketCountLabel } from "../../utils";

interface SuperMarketCardProps {
  superCart: SuperCart;
}

export const SuperMarketCard = ({ superCart }: SuperMarketCardProps) => (
  <Card className="border-0 bg-white py-5 shadow-sm">
    <CardContent className="gap-4">
      <View className="flex-row items-center gap-3">
        <View className="size-9 items-center justify-center rounded-full bg-primary/10">
          <Icon name="ShoppingBasket" size={17} className="text-primary" />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-lg font-bold text-foreground">Menores preços</Text>
          <Text className="font-questrial text-sm text-muted-foreground">
            Itens distribuídos conforme o melhor preço encontrado.
          </Text>
        </View>
        <Text className="font-bold text-primary">{formatCurrency(superCart.total)}</Text>
      </View>

      <View className="rounded-lg bg-accent px-3 py-3">
        <Text className="font-questrial text-sm text-muted-foreground">
          {superCart.isComplete
            ? `Lista completa em ${marketCountLabel(superCart.marketsCount)}.`
            : `Faltando: ${formatMissingPreview(superCart.missing)}`}
        </Text>
      </View>

      <View className="gap-2">
        {superCart.picks.map(pick => (
          <View
            key={`${pick.masterProductId}-${pick.marketId}`}
            className="gap-2 rounded-lg border border-border px-3 py-3"
          >
            <View className="flex-row items-start justify-between gap-3">
              <View className="min-w-0 flex-1">
                <Text numberOfLines={2} className="font-semibold text-foreground">
                  {pick.masterProductName}
                </Text>
                <Text numberOfLines={1} className="font-questrial text-xs text-muted-foreground">
                  {pick.marketName} • {pick.quantity}x {formatCurrency(pick.unitPrice)}
                </Text>
              </View>
              <Text className="font-bold text-foreground">{formatCurrency(pick.subtotal)}</Text>
            </View>
          </View>
        ))}
      </View>
    </CardContent>
  </Card>
);
