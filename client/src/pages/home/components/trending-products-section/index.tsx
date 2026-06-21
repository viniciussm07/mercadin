import { Button } from "@components/button";
import { Card, CardContent, CardHeader } from "@components/card";
import { Icon } from "@components/icon";
import { Text } from "@components/text";
import { View } from "react-native";
import { PromotionItem } from "./components/promotion-item";
import { PromotionListSkeleton } from "./components/promotion-list-skeleton";
import { promotionPeriods, useTrendingProducts } from "@hooks/trending-products/hooks";
import { Select } from "@components/select";
import { useMercadinNavigation } from "@hooks/use-navigation";
import { AuthenticatedNavigation, AuthenticatedRouteNames } from "@routes/types";

export const TrendingProductsSection = () => {
  const { periodDays, promotions, selectPeriod } = useTrendingProducts();
  const items = promotions.data?.items ?? [];
  const { navigate } = useMercadinNavigation<AuthenticatedNavigation>();

  return (
    <Card className="border-0 bg-white py-0 shadow-sm">
      <CardHeader className="border-b border-border py-5">
        <View className="flex-row items-center justify-between gap-3">
          <View className="min-w-0 flex-row items-center gap-2">
            <Icon name="Flame" size={24} className="shrink-0 text-primary" />
            <Text className="text-2xl font-bold text-foreground">Produtos em alta</Text>
          </View>

          <Select
            values={promotionPeriods}
            selectedValue={String(periodDays)}
            onValueChange={selectPeriod}
          />
        </View>
      </CardHeader>

      <CardContent className="gap-5 py-5">
        {promotions.isPending ? <PromotionListSkeleton /> : null}

        {promotions.isError ? (
          <View className="items-center gap-3 py-3">
            <Text className="text-center font-questrial text-sm text-muted-foreground">
              Não foi possível carregar os produtos em alta.
            </Text>
            <Button variant="outline" size="sm" onPress={() => void promotions.refetch()}>
              <Icon name="RefreshCw" size={14} className="text-foreground" />
              <Text>Tentar novamente</Text>
            </Button>
          </View>
        ) : null}

        {promotions.isSuccess && items.length === 0 ? (
          <Text className="py-3 text-center font-questrial text-sm text-muted-foreground">
            Nenhuma queda de preço encontrada nos últimos {periodDays} dias.
          </Text>
        ) : null}

        {items.map(promotion => (
          <PromotionItem key={promotion.marketProductId} promotion={promotion} />
        ))}

        <Button variant="outline" onPress={() => navigate(AuthenticatedRouteNames.PROMOTIONS)}>
          Ver mais
        </Button>
      </CardContent>
    </Card>
  );
};
