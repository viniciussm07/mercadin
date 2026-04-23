import { Platform, useWindowDimensions } from "react-native";

const MOBILE_NAV_BREAKPOINT = 768;

export const useShouldDockNavBar = () => {
  const { width } = useWindowDimensions();

  return Platform.OS !== "web" || width < MOBILE_NAV_BREAKPOINT;
};
