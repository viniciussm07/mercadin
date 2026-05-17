import { useState } from "react";
import { useWindowDimensions } from "react-native";

export type UserSettingsPanel = "settings" | "profile";

export const useUserSettings = () => {
  const { width } = useWindowDimensions();
  const [selectedPanel, setSelectedPanel] = useState<UserSettingsPanel>("settings");

  const onChangePanel = (nextPanel: string | string[] | undefined) => {
    if (nextPanel === "settings" || nextPanel === "profile") {
      setSelectedPanel(nextPanel);
    }
  };

  return {
    isWide: width >= 1024,
    onChangePanel,
    selectedPanel,
  };
};
