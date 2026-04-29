import { Card, CardContent } from "@components/card";
import { Icon } from "@components/icon";
import { Text } from "@components/text";
import { View } from "react-native";

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <Card className="border-0 bg-white py-6 shadow-sm">
      <CardContent className="items-center gap-3 py-6">
        <View className="size-12 items-center justify-center rounded-full bg-primary/10">
          <Icon name="Search" size={22} className="text-primary" />
        </View>
        <View className="max-w-xl items-center gap-1">
          <Text className="text-center text-xl font-bold text-foreground">{title}</Text>
          <Text className="text-center font-questrial text-sm text-muted-foreground">
            {description}
          </Text>
        </View>
      </CardContent>
    </Card>
  );
};
