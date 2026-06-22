import { Text } from "@components/text";
import { PriceHistoryPoint } from "@services/products/types";
import { formatCurrency } from "@utils/currency";
import { View } from "react-native";
import { formatFullDate } from "../../utils";

interface PricePointTooltipProps {
  point: PriceHistoryPoint;
}

export const PricePointTooltip = ({ point }: PricePointTooltipProps) => (
  <View
    className="w-32 rounded-lg border border-primary/20 bg-white px-3 py-2 shadow-md shadow-black/10"
    accessibilityLiveRegion="polite"
  >
    <Text className="font-semibold text-primary">{formatCurrency(point.price)}</Text>
    <Text numberOfLines={2} className="font-questrial text-xs text-muted-foreground">
      {formatFullDate(point.timestamp)}
    </Text>
  </View>
);
