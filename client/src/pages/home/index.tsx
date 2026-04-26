import React from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { Card, CardContent, CardHeader } from "@components/card";
import { Icon } from "@components/icon";
import { Text } from "@components/text";
import { useSession } from "@contexts/session";
import { ShoppingList } from "@services/shopping-lists";
import { cn } from "@utils/cn";
import { useActiveShoppingLists } from "./hooks";

const TRENDING_PRODUCTS = [
  { id: "1", name: "Coca-Cola 2L Original", price: "R$ 7,99", market: "Savegnago" },
  { id: "2", name: "Sabão líquido Omo 5L", price: "R$ 38,90", market: "Jaú Serve" },
  { id: "3", name: "Cerveja Heineken Long Neck 330ml", price: "R$ 32,50", market: "Tenda" },
];

const mobileContentContainerStyle = { paddingBottom: 120, paddingTop: 24 };
const wideContentContainerStyle = { paddingBottom: 120, paddingTop: 56 };

const formatUpdatedAt = (updatedAt?: string) => {
  if (!updatedAt) {
    return "Atualizada recentemente";
  }

  const date = new Date(updatedAt);

  if (Number.isNaN(date.getTime())) {
    return "Atualizada recentemente";
  }

  return `Atualizada em ${new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(date)}`;
};

const getFirstName = (name?: string | null) => {
  if (!name) {
    return "de volta";
  }

  return `de volta, ${name.split(" ")[0]}`;
};

const MetricCard = () => {
  return (
    <Card className="gap-4 overflow-hidden border-0 bg-white py-5 shadow-sm">
      <CardContent className="gap-5">
        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            <Icon name="Sparkles" size={16} className="text-green-700" />
            <Text className="font-questrial text-xs uppercase text-muted-foreground">
              Economia total neste mês
            </Text>
          </View>
          <View className="flex-row flex-wrap items-end gap-2">
            <Text className="text-4xl font-bold text-green-700">R$ --,--</Text>
            <View className="rounded-full bg-green-700/10 px-2 py-1">
              <Text className="font-questrial text-xs text-green-700">Placeholder</Text>
            </View>
          </View>
        </View>

        <View className="h-px bg-border" />

        <View className="gap-2">
          <Text className="font-questrial text-sm text-muted-foreground">
            Mercado que mais contribuiu
          </Text>
          <View className="flex-row items-center gap-3">
            <View className="size-9 items-center justify-center rounded-full border border-border bg-accent">
              <Icon name="Store" size={18} className="text-primary" />
            </View>
            <View>
              <Text className="text-lg font-bold text-foreground">Em breve</Text>
              <Text className="font-questrial text-xs text-green-700">Dados futuros</Text>
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

const ShoppingListCard = ({ list }: { list: ShoppingList }) => {
  return (
    <Card className="min-h-[150px] flex-1 justify-between border-0 bg-white py-5 shadow-sm">
      <CardContent className="flex-1 justify-between gap-5">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text numberOfLines={1} className="text-lg font-bold text-foreground">
              {list.name}
            </Text>
            <Text className="font-questrial text-sm text-muted-foreground">
              {formatUpdatedAt(list.updatedAt)}
            </Text>
          </View>

          <View className="size-8 items-center justify-center rounded-full bg-primary/10">
            <Icon name="Ellipsis" size={16} className="text-primary" />
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            {list.items.slice(0, 3).map(item => (
              <View
                key={item.id}
                className="-mr-2 size-8 items-center justify-center rounded-full border-2 border-white bg-accent"
              >
                <Icon name="Package" size={14} className="text-muted-foreground" />
              </View>
            ))}
            {list.items.length === 0 ? (
              <Text className="font-questrial text-sm text-muted-foreground">Sem itens</Text>
            ) : null}
          </View>

          <View className="rounded-full bg-primary/10 px-2 py-1">
            <Text className="font-questrial text-[10px] uppercase text-primary">
              {list.items.length} {list.items.length === 1 ? "item" : "itens"}
            </Text>
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

const ActiveListsSection = () => {
  const { shoppingLists } = useActiveShoppingLists();
  const lists = shoppingLists.data ?? [];

  return (
    <View className="gap-4">
      <View>
        <Text className="text-2xl font-bold text-foreground">Suas listas ativas</Text>
      </View>

      {shoppingLists.isPending ? (
        <Card className="border-0 bg-white py-5">
          <CardContent>
            <Text className="font-questrial text-muted-foreground">Carregando suas listas...</Text>
          </CardContent>
        </Card>
      ) : null}

      {shoppingLists.isError ? (
        <Card className="border-0 bg-white py-5">
          <CardContent>
            <Text className="font-questrial text-muted-foreground">
              Não foi possível carregar suas listas agora.
            </Text>
          </CardContent>
        </Card>
      ) : null}

      {!shoppingLists.isPending && !shoppingLists.isError && lists.length === 0 ? (
        <Card className="border-0 bg-white py-5">
          <CardContent>
            <Text className="font-questrial text-muted-foreground">
              Você ainda não tem listas ativas.
            </Text>
          </CardContent>
        </Card>
      ) : null}

      {lists.length > 0 ? (
        <View className="gap-3 lg:flex-row">
          {lists.slice(0, 3).map(list => (
            <ShoppingListCard key={list.id} list={list} />
          ))}
        </View>
      ) : null}
    </View>
  );
};

const TrendingProductsSection = () => {
  return (
    <Card className="border-0 bg-white py-0 shadow-sm">
      <CardHeader className="border-b border-border py-5">
        <View className="flex-row items-center gap-2">
          <Icon name="Flame" size={18} className="text-primary" />
          <Text className="text-2xl font-bold text-foreground">Produtos em alta</Text>
        </View>
        <Text className="font-questrial text-xs uppercase text-primary">Placeholder</Text>
      </CardHeader>

      <CardContent className="gap-5 py-5">
        {TRENDING_PRODUCTS.map(product => (
          <View key={product.id} className="flex-row items-center gap-4">
            <View className="size-14 items-center justify-center rounded-full border border-border bg-accent">
              <Icon name="Package" size={22} className="text-muted-foreground" />
            </View>

            <View className="min-w-0 flex-1 gap-1">
              <Text numberOfLines={1} className="font-semibold text-foreground">
                {product.name}
              </Text>
              <View className="flex-row flex-wrap items-center gap-2">
                <Text className="text-xl font-bold text-primary">{product.price}</Text>
                <View className="rounded-full bg-green-700/10 px-2 py-1">
                  <Text className="font-questrial text-[10px] uppercase text-green-700">
                    {product.market}
                  </Text>
                </View>
              </View>
            </View>

            <View className="size-8 items-center justify-center rounded-full border border-border">
              <Icon name="Plus" size={16} className="text-muted-foreground" />
            </View>
          </View>
        ))}
      </CardContent>
    </Card>
  );
};

export const Home = () => {
  const { width } = useWindowDimensions();
  const {
    session: { user },
  } = useSession();
  const isWide = width >= 1024;

  return (
    <ScrollView
      className="flex-1 bg-background px-4 lg:px-8"
      contentContainerStyle={isWide ? wideContentContainerStyle : mobileContentContainerStyle}
    >
      <View className="w-full max-w-7xl self-center gap-6 lg:flex-row lg:gap-8">
        <View className="min-w-0 flex-1 gap-8">
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground lg:text-4xl">
              Bem-vinda {getFirstName(user?.name)}!
            </Text>
            <Text className="font-questrial text-base text-muted-foreground">
              Aqui está o seu resumo inteligente de compras.
            </Text>
          </View>

          <MetricCard />
          <ActiveListsSection />
        </View>

        <View className={cn("gap-6", isWide && "w-[360px]")}>
          <TrendingProductsSection />
        </View>
      </View>
    </ScrollView>
  );
};
