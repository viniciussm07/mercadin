import { Button } from "@components/button";
import { Icon } from "@components/icon";
import { Text } from "@components/text";
import { View } from "react-native";

type QuantityCounterProps = {
  onDecrease: () => void;
  onIncrease: () => void;
  quantity: number;
  disabled?: boolean;
  description?: string;
  minimumAction?: {
    accessibilityLabel: string;
    disabled?: boolean;
    iconName: "Trash2";
    onPress: () => void;
    variant?: "destructive" | "outline";
  };
};

export const QuantityCounter = ({
  disabled,
  onDecrease,
  onIncrease,
  quantity,
  description,
  minimumAction,
}: QuantityCounterProps) => {
  const canDecrease = quantity > 1 && !disabled;
  const showMinimumAction = quantity <= 1 && minimumAction;
  const decreaseDisabled = showMinimumAction ? disabled || minimumAction.disabled : !canDecrease;
  const decreaseIconName = showMinimumAction ? minimumAction.iconName : "Minus";
  const decreaseVariant = showMinimumAction ? (minimumAction.variant ?? "outline") : "outline";
  const decreaseIconClassName =
    decreaseVariant === "destructive" ? "text-white" : "text-foreground";
  const onDecreasePress = showMinimumAction ? minimumAction.onPress : onDecrease;

  return (
    <View className="flex-row items-center justify-between gap-3 rounded-lg border border-border bg-white p-3">
      <View className="min-w-0 flex-1">
        <Text className="font-semibold text-foreground">Quantidade</Text>
        {description ? (
          <Text className="font-questrial text-sm text-muted-foreground">{description}</Text>
        ) : null}
      </View>

      <View className="flex-row items-center gap-3">
        <Button
          size="icon"
          variant={decreaseVariant}
          disabled={decreaseDisabled}
          onPress={onDecreasePress}
          className="size-9"
          accessibilityLabel={showMinimumAction ? minimumAction.accessibilityLabel : undefined}
        >
          <Icon name={decreaseIconName} size={16} className={decreaseIconClassName} />
        </Button>
        <Text className="min-w-8 text-center text-lg font-bold text-foreground">{quantity}</Text>
        <Button
          size="icon"
          variant="outline"
          disabled={disabled}
          onPress={onIncrease}
          className="size-9"
        >
          <Icon name="Plus" size={16} className="text-foreground" />
        </Button>
      </View>
    </View>
  );
};
