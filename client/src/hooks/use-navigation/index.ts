import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@routes/types";

export const useMercadinNavigation = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return navigation;
};
