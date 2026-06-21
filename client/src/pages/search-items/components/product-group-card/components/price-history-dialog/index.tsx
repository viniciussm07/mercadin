import { Button } from "@components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/dialog";
import { Icon } from "@components/icon";
import { Skeleton } from "@components/skeleton";
import { Text } from "@components/text";
import { MarketProduct } from "@services/products/types";
import { View } from "react-native";
import { PriceHistoryChart } from "./components/price-history-chart";
import { usePriceHistoryDialog } from "./hooks";

interface PriceHistoryDialogProps {
  product: MarketProduct;
}

export const PriceHistoryDialog = ({ product }: PriceHistoryDialogProps) => {
  const { onOpenChange, open, priceHistory } = usePriceHistoryDialog(product.id);
  const points = priceHistory.data?.points ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 px-3"
          accessibilityLabel={`Ver histórico de preço de ${product.nameInMarket} no ${product.market.name}`}
        >
          <Icon name="ChartLine" size={14} className="text-primary" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] sm:w-[42rem]">
        <DialogHeader>
          <DialogTitle>Histórico de preço</DialogTitle>
          <DialogDescription numberOfLines={3}>
            {product.nameInMarket} no {product.market.name} · Últimos 30 dias
          </DialogDescription>
        </DialogHeader>

        {priceHistory.isPending ? (
          <View className="gap-3">
            <Skeleton className="h-16 w-40" />
            <Skeleton className="h-[270px] w-full rounded-xl" />
          </View>
        ) : null}

        {priceHistory.isError ? (
          <View className="items-center gap-4 rounded-xl border border-border bg-white p-6">
            <Icon name="TriangleAlert" size={28} className="text-destructive" />
            <Text className="text-center font-questrial text-muted-foreground">
              Não foi possível carregar o histórico de preço.
            </Text>
            <Button variant="outline" onPress={() => void priceHistory.refetch()}>
              <Icon name="RefreshCw" size={16} className="text-foreground" />
              <Text>Tentar novamente</Text>
            </Button>
          </View>
        ) : null}

        {priceHistory.isSuccess && points.length <= 1 ? (
          <View className="items-center gap-3 rounded-xl border border-border bg-white p-8">
            <Icon name="ChartLine" size={32} className="text-muted-foreground" />
            <Text className="text-center font-questrial text-muted-foreground">
              Ainda não há alterações de preço registradas nos últimos 30 dias.
            </Text>
          </View>
        ) : null}

        {priceHistory.isSuccess && points.length > 1 ? <PriceHistoryChart points={points} /> : null}
      </DialogContent>
    </Dialog>
  );
};
