import { NativeOnlyAnimatedView } from "@components/native-only-animated-view";
import * as DialogPrimitive from "@rn-primitives/dialog";
import { cn } from "@utils/cn";
import * as React from "react";
import { Platform, View, type DimensionValue, type ViewProps } from "react-native";
import { FadeIn, FadeOut, SlideInDown, SlideOutDown } from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

const BottomSheet = DialogPrimitive.Root;

const BottomSheetTrigger = DialogPrimitive.Trigger;

const BottomSheetPortal = DialogPrimitive.Portal;

const BottomSheetClose = DialogPrimitive.Close;

const FullWindowOverlay = Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment;

function BottomSheetOverlay({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof DialogPrimitive.Overlay>, "asChild"> & {
  children?: React.ReactNode;
}) {
  return (
    <FullWindowOverlay>
      <DialogPrimitive.Overlay
        className={cn(
          "absolute bottom-0 left-0 right-0 top-0 flex justify-end bg-black/50",
          Platform.select({
            web: "animate-in fade-in-0 fixed cursor-default [&>*]:cursor-auto",
          }),
          className,
        )}
        {...props}
      >
        <NativeOnlyAnimatedView entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)}>
          <>{children}</>
        </NativeOnlyAnimatedView>
      </DialogPrimitive.Overlay>
    </FullWindowOverlay>
  );
}

function BottomSheetContent({
  className,
  portalHost,
  children,
  height,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  portalHost?: string;
  height?: DimensionValue;
}) {
  return (
    <BottomSheetPortal hostName={portalHost}>
      <BottomSheetOverlay closeOnPress>
        <NativeOnlyAnimatedView
          entering={SlideInDown.duration(240)}
          exiting={SlideOutDown.duration(200)}
        >
          <DialogPrimitive.Content
            className={cn(
              "bg-background border-border z-50 mx-auto flex w-full max-w-full flex-col gap-4 rounded-t-lg border p-6 shadow-lg shadow-black/5 sm:max-w-2xl",
              Platform.select({
                web: "animate-in slide-in-from-bottom-full duration-200",
              }),
              className,
            )}
            style={height ? { height } : undefined}
            {...props}
          >
            {children}
          </DialogPrimitive.Content>
        </NativeOnlyAnimatedView>
      </BottomSheetOverlay>
    </BottomSheetPortal>
  );
}

function BottomSheetHeader({ className, ...props }: ViewProps) {
  return <View className={cn("flex flex-col gap-2", className)} {...props} />;
}

function BottomSheetFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function BottomSheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-foreground text-lg font-semibold leading-none", className)}
      {...props}
    />
  );
}

function BottomSheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTrigger,
  BottomSheetTitle,
  BottomSheetDescription,
};
