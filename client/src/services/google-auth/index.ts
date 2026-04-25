import { Platform } from "react-native";

interface GoogleAuthTokens {
  idToken: string;
  accessToken?: string;
}

const getRequiredEnv = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`A variável ${key} não foi configurada.`);
  }

  return value;
};

export const googleAuthService = {
  async signIn(): Promise<GoogleAuthTokens> {
    if (Platform.OS === "web") {
      throw new Error("Use o fluxo OAuth do Supabase para login Google no web.");
    }

    const { GoogleSignin, isSuccessResponse } =
      await import("@react-native-google-signin/google-signin");

    GoogleSignin.configure({
      webClientId: getRequiredEnv("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID"),
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      scopes: ["email", "profile"],
    });

    if (Platform.OS === "android") {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    }

    const response = await GoogleSignin.signIn();

    if (!isSuccessResponse(response)) {
      throw new Error("Login com Google cancelado.");
    }

    const tokens = await GoogleSignin.getTokens();

    return {
      idToken: response.data.idToken ?? tokens.idToken,
      accessToken: tokens.accessToken,
    };
  },
};
