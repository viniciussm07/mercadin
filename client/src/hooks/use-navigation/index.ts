import { useNavigation } from "@react-navigation/native";
import { RootNavigation } from "@routes/types";

export const useMercadinNavigation = <TNavigation extends object = RootNavigation>() => {
  const navigation = useNavigation<TNavigation>();

  return navigation;
};
