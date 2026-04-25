import * as icons from "lucide-react-native/icons";
import { Icon as I } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { ComponentProps, memo, useMemo } from "react";

export type IconName = keyof typeof icons;

interface Props extends Omit<ComponentProps<typeof I>, "iconNode"> {
  name: IconName;
}

export const Icon = memo((props: Props) => {
  const CustomIcon = useMemo(() => {
    const iconNode = icons[props.name];
    return cssInterop(iconNode, {
      className: {
        target: "style",
        nativeStyleToProp: {
          color: true,
          width: true,
          height: true,
        },
      },
    });
  }, [props.name]);

  return <CustomIcon {...props} />;
});
