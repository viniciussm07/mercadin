import { View } from "react-native";
import { Card, CardContent } from "@components/card";
import { Icon } from "@components/icon";
import { Text } from "@components/text";

export const MetricCard = () => {
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
