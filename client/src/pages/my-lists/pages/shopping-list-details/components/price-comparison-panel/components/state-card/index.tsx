import { Card, CardContent } from "@components/card";
import { Icon } from "@components/icon";
import { Text } from "@components/text";
import { View } from "react-native";

interface StateCardProps {
  action?: React.ReactNode;
  description: string;
  iconName: React.ComponentProps<typeof Icon>["name"];
  title: string;
}

export const StateCard = ({ action, description, iconName, title }: StateCardProps) => (
  <Card className="border-0 bg-white py-5 shadow-sm">
    <CardContent className="gap-3">
      <View className="flex-row items-start gap-3">
        <View className="size-10 items-center justify-center rounded-full bg-primary/10">
          <Icon name={iconName} size={18} className="text-primary" />
        </View>
        <View className="min-w-0 flex-1 gap-1">
          <Text className="text-xl font-bold text-foreground">{title}</Text>
          <Text className="font-questrial text-sm text-muted-foreground">{description}</Text>
        </View>
      </View>
      {action}
    </CardContent>
  </Card>
);
