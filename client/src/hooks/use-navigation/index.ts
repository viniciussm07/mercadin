import { useNavigation } from "@react-navigation/native";

export const useMercadinNavigation = <TNavigation extends object>() => {
  const navigation = useNavigation<TNavigation>();

  return navigation;
};
