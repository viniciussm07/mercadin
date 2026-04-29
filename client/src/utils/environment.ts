import { Dimensions, Platform } from "react-native";

export const env = {
  isWeb: Platform.OS === "web" && Dimensions.get("window").width >= 768,
};
