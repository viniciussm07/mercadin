import { MARKET_SLUGS } from "@constants/market-slugs";
import { Text } from "@components/text";
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from "@components/toggle-group";
import { useProductSearchStore } from "@stores/product-search";
import { View } from "react-native";

const MARKET_FILTERS = [
  { value: MARKET_SLUGS.JAU_SERVE, label: "Jaú Serve" },
  { value: MARKET_SLUGS.TENDA_ATACADO, label: "Tenda" },
  { value: MARKET_SLUGS.SAVEGNAGO, label: "Savegnago" },
] as const;

export const MarketFilters = () => {
  const selectedMarkets = useProductSearchStore(state => state.selectedMarkets);
  const setSelectedMarkets = useProductSearchStore(state => state.setSelectedMarkets);

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="font-questrial text-sm text-muted-foreground">Mercados</Text>
        <Text className="font-questrial text-xs text-muted-foreground">
          {selectedMarkets.length === 0 ? "Todos" : `${selectedMarkets.length} selecionado(s)`}
        </Text>
      </View>

      <ToggleGroup
        type="multiple"
        value={selectedMarkets}
        onValueChange={nextMarkets => setSelectedMarkets(nextMarkets as MARKET_SLUGS[])}
        variant="outline"
        className="w-full flex-wrap items-stretch"
      >
        {MARKET_FILTERS.map((market, index) => (
          <ToggleGroupItem
            key={market.value}
            value={market.value}
            isFirst={index === 0}
            isLast={index === MARKET_FILTERS.length - 1}
            className="min-w-[116px] flex-1 px-3"
          >
            <ToggleGroupIcon name="Store" size={14} />
            <Text className="font-questrial text-sm">{market.label}</Text>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </View>
  );
};
