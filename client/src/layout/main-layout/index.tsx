import { PropsWithChildren } from "react";
import { View } from "react-native";
import { UnauthenticatedHeader } from "./components/header/unauthenticated";
import { AuthenticatedHeader } from "./components/header/authenticated";
import { NavBar } from "./components/nav-bar";
import { useShouldDockNavBar } from "./components/nav-bar/hooks";
import { useSession } from "@contexts/session";
import { loadFonts } from "@layout/hooks/load-fonts";
import { unauthenticatedNavBarItems } from "./utils";

export const MainLayout = ({ children }: PropsWithChildren) => {
  const {
    session: { isAuthenticated },
  } = useSession();
  const { fontsLoaded } = loadFonts();
  const shouldDockNavBar = useShouldDockNavBar();

  if (!fontsLoaded) return null;

  return (
    <View className="flex-1">
      {isAuthenticated ? (
        <AuthenticatedHeader />
      ) : (
        <UnauthenticatedHeader items={shouldDockNavBar ? [] : unauthenticatedNavBarItems} />
      )}
      {children}
      <NavBar items={shouldDockNavBar ? unauthenticatedNavBarItems : []} />
    </View>
  );
};
