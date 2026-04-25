import { useLoadFonts } from "./hooks";
import { PropsWithChildren } from "react";

export const LoadFontsProvider = ({ children }: PropsWithChildren) => {
  const { fontsLoaded } = useLoadFonts();

  if (!fontsLoaded) return null;
  return children;
};
