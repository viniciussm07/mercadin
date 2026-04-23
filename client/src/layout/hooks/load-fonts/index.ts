import {
  Fraunces_400Regular,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
  Fraunces_800ExtraBold,
  Fraunces_900Black,
  Fraunces_400Regular_Italic,
  Fraunces_500Medium_Italic,
  Fraunces_600SemiBold_Italic,
  Fraunces_700Bold_Italic,
  Fraunces_800ExtraBold_Italic,
  Fraunces_900Black_Italic,
  useFonts,
} from "@expo-google-fonts/fraunces";

export const loadFonts = () => {
  const [fontsLoaded] = useFonts({
    Fraunces_400Regular,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Fraunces_800ExtraBold,
    Fraunces_900Black,
    Fraunces_400Regular_Italic,
    Fraunces_500Medium_Italic,
    Fraunces_600SemiBold_Italic,
    Fraunces_700Bold_Italic,
    Fraunces_800ExtraBold_Italic,
    Fraunces_900Black_Italic,
  });

  return { fontsLoaded };
};
