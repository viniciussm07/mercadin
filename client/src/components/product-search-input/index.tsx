import { Icon } from "@components/icon";
import { Input } from "@components/input";
import { Text } from "@components/text";
import { Portal } from "@rn-primitives/portal";
import { cn } from "@utils/cn";
import { useCallback, useRef, useState } from "react";
import { Platform, Pressable, View } from "react-native";
import { useProductSearchInput } from "./hooks";

type ProductSearchInputProps = {
  active?: boolean;
  className?: string;
  inputClassName?: string;
  onChangeQuery?: (nextQuery: string) => void;
  onSubmitQuery?: (query: string) => void;
  placeholder?: string;
};

type AnchorLayout = {
  height: number;
  pageX: number;
  pageY: number;
  width: number;
};

export const ProductSearchInput = ({
  active,
  className,
  inputClassName,
  onChangeQuery,
  onSubmitQuery,
  placeholder = "Procure por arroz, leite, café...",
}: ProductSearchInputProps) => {
  const anchorRef = useRef<View>(null);
  const [anchorLayout, setAnchorLayout] = useState<AnchorLayout | null>(null);
  const {
    changeQuery,
    onBlur,
    onFocus: focusInput,
    query,
    selectSuggestion,
    showSuggestions,
    suggestions,
  } = useProductSearchInput({ onChangeQuery, onSubmitQuery });

  const measureAnchor = useCallback(() => {
    anchorRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
      setAnchorLayout({ height, pageX, pageY, width });
    });
  }, []);

  const onFocus = () => {
    measureAnchor();
    focusInput();
  };

  return (
    <View ref={anchorRef} onLayout={measureAnchor} className={cn("relative w-full", className)}>
      <Icon
        name="Search"
        size={18}
        className="absolute left-3 top-1/2 z-10 -mt-2 text-muted-foreground"
      />
      <Input
        value={query}
        onBlur={onBlur}
        onChangeText={changeQuery}
        onFocus={onFocus}
        placeholder={placeholder}
        returnKeyType="search"
        className={cn("pl-10", active && "border-ring ring-ring/50 ring-[3px]", inputClassName)}
      />

      {showSuggestions && anchorLayout ? (
        <Portal name="product-search-suggestions">
          <View
            pointerEvents="box-none"
            className={cn(
              "absolute bottom-0 left-0 right-0 top-0 z-[9999]",
              Platform.select({ web: "fixed" }),
            )}
          >
            <View
              className="absolute overflow-hidden rounded-2xl border border-border bg-white shadow-lg shadow-black/5"
              style={{
                left: anchorLayout.pageX,
                top: anchorLayout.pageY + anchorLayout.height + 8,
                width: anchorLayout.width,
              }}
            >
              {suggestions.map(item => (
                <Pressable
                  key={item.id}
                  className="flex-row items-center gap-2 border-b border-border px-3 py-3 last:border-b-0 active:bg-accent"
                  onPress={() => selectSuggestion(item.query)}
                >
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <Text numberOfLines={1} className="min-w-0 flex-1 font-questrial text-sm">
                    {item.query}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Portal>
      ) : null}
    </View>
  );
};
