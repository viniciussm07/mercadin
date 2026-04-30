import { env } from "@utils/environment";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "./components/empty-state";
import { MarketFilters } from "./components/market-filters";
import { ProductGroupCard } from "./components/product-group-card";
import { ProductResultSkeleton } from "./components/product-result-skeleton";
import { SearchInput } from "./components/search-input";
import { useSearchProducts } from "./hooks";

const wideContentContainerStyle = { paddingBottom: 120, paddingTop: 56 };
const FLOATING_SEARCH_HEIGHT = 96;

export const SearchItemsPage = () => {
  const { debouncedQuery, hasValidQuery, products } = useSearchProducts();
  const productGroups = useMemo(() => products.data?.items ?? [], [products.data?.items]);
  const { top } = useSafeAreaInsets();
  const mobileContentContainerStyle = useMemo(
    () => ({
      paddingBottom: 120,
      paddingTop: top + FLOATING_SEARCH_HEIGHT,
    }),
    [top],
  );

  return (
    <View className="flex-1 bg-background">
      {!env.isWeb ? (
        <View
          className="absolute left-0 right-0 z-20 border-b border-border bg-background px-4 pb-3"
          style={{ paddingTop: top + 12 }}
        >
          <View className="w-full max-w-4xl self-center">
            <SearchInput />
          </View>
        </View>
      ) : null}

      <ScrollView
        className="flex-1 px-4 lg:px-8"
        contentContainerStyle={env.isWeb ? wideContentContainerStyle : mobileContentContainerStyle}
      >
        <View className="w-full max-w-4xl self-center gap-6">
          <MarketFilters />

          {!hasValidQuery ? (
            <EmptyState
              title="Procure por um produto"
              description="Digite pelo menos 2 caracteres para começar a comparar os preços."
            />
          ) : null}

          {hasValidQuery && products.isPending ? (
            <View className="gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <ProductResultSkeleton key={index} />
              ))}
            </View>
          ) : null}

          {hasValidQuery && products.isError ? (
            <EmptyState
              title="Não foi possível buscar"
              description="Tente novamente em alguns instantes."
            />
          ) : null}

          {hasValidQuery && products.isSuccess && productGroups.length === 0 ? (
            <EmptyState
              title="Nenhum produto encontrado"
              description={`Não encontramos resultados para "${debouncedQuery}".`}
            />
          ) : null}

          {productGroups.length > 0 ? (
            <View className="gap-3">
              {productGroups.map(group => (
                <ProductGroupCard key={group.ean} group={group} />
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};
