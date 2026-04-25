import {
  Fraunces_400Regular,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
  useFonts,
} from "@expo-google-fonts/fraunces";
import { Questrial_400Regular } from "@expo-google-fonts/questrial";

export const loadFonts = () => {
  const [fontsLoaded] = useFonts({
    Fraunces_400Regular,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Questrial_400Regular,
  });

  return { fontsLoaded };
};
