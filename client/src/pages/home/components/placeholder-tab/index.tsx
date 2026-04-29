import { Card, CardContent, CardHeader } from "@components/card";
import { Text } from "@components/text";
import { ScrollView, View } from "react-native";

const contentContainerStyle = { flexGrow: 1, paddingBottom: 120, paddingTop: 24 };

interface PlaceholderTabProps {
  title: string;
  description: string;
}

export const PlaceholderTab = ({ title, description }: PlaceholderTabProps) => {
  return (
    <ScrollView className="flex-1 bg-background px-4" contentContainerStyle={contentContainerStyle}>
      <View className="w-full max-w-3xl self-center">
        <Card>
          <CardHeader>
            <Text className="text-2xl font-bold text-foreground">{title}</Text>
          </CardHeader>
          <CardContent>
            <Text className="font-questrial text-muted-foreground">{description}</Text>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
};
