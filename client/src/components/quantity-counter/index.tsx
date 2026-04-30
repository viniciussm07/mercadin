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
};

export const QuantityCounter = ({
  disabled,
  onDecrease,
  onIncrease,
  quantity,
  description,
}: QuantityCounterProps) => {
  const canDecrease = quantity > 1 && !disabled;

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
          variant="outline"
          disabled={!canDecrease}
          onPress={onDecrease}
          className="size-9"
        >
          <Icon name="Minus" size={16} className="text-foreground" />
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
