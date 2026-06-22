import { Skeleton } from "@components/skeleton";
import { View } from "react-native";

export const PromotionListSkeleton = () => (
  <View className="gap-5">
    {Array.from({ length: 3 }).map((_, index) => (
      <View key={index} className="flex-row items-center gap-4">
        <Skeleton className="size-14 shrink-0 rounded-full" />
        <View className="min-w-0 flex-1 gap-2">
          <Skeleton className="h-4 w-4/5" />
          <View className="flex-row gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </View>
        </View>
        <Skeleton className="size-8 rounded-full" />
      </View>
    ))}
  </View>
);
