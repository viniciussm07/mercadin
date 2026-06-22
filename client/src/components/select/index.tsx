import { Button } from "@components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@components/dropdown-menu";
import { Icon } from "@components/icon";
import { Text } from "@components/text";

interface Props<T> {
  values: { label: string; value: T }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export const Select = <T,>({
  values,
  selectedValue,
  onValueChange,
  placeholder = "Selecione...",
}: Props<T>) => {
  const selectedLabel =
    values.find(value => String(value.value) === selectedValue)?.label ?? placeholder;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="px-3">
          <Text>{selectedLabel}</Text>
          <Icon name="ChevronDown" size={14} className="text-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="bottom" sideOffset={8} className="w-full">
        <DropdownMenuRadioGroup value={selectedValue} onValueChange={onValueChange}>
          {values.map(({ label, value }) => (
            <DropdownMenuRadioItem key={String(value)} value={String(value)}>
              <Text>{label}</Text>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
