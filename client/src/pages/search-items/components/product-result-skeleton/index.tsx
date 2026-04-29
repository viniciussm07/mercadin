import { Card, CardContent } from "@components/card";
import { Skeleton } from "@components/skeleton";
import { View } from "react-native";

export const ProductResultSkeleton = () => {
  return (
    <Card className="border-0 bg-white py-4 shadow-sm">
      <CardContent className="gap-4">
        <View className="flex-row gap-4">
          <Skeleton className="size-16 shrink-0 rounded-xl" />

          <View className="min-w-0 flex-1 gap-3">
            <View className="gap-2">
              <Skeleton className="h-5 w-4/5" />
              <View className="flex-row gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </View>
            </View>

            <View className="flex-row items-center justify-between gap-3">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-9 w-28 rounded-full" />
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  );
};
