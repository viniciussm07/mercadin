import { cn } from "@utils/cn";
import { Platform, Pressable } from "react-native";

interface InteractiveDataPointProps {
  index: number;
  selected: boolean;
  onClear: (index: number) => void;
  onSelect: (index: number) => void;
  onToggle: (index: number) => void;
}

export const InteractiveDataPoint = ({
  index,
  selected,
  onClear,
  onSelect,
  onToggle,
}: InteractiveDataPointProps) => (
  <Pressable
    accessibilityLabel="Exibir detalhes deste preço"
    className={cn(
      "size-3 rounded-full border-2 border-white bg-primary shadow-sm",
      selected && "size-4 border-primary bg-white",
    )}
    hitSlop={8}
    onHoverIn={() => onSelect(index)}
    onHoverOut={() => onClear(index)}
    onPress={Platform.OS === "web" ? undefined : () => onToggle(index)}
    role="button"
  />
);
