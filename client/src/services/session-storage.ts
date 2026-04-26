import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const SESSION_TOKEN_KEY = "mercadin-session-token";

export const sessionTokenStorage = {
  async getToken() {
    if (Platform.OS === "web") {
      if (typeof window === "undefined") {
        return null;
      }

      return window.localStorage.getItem(SESSION_TOKEN_KEY);
    }

    return SecureStore.getItemAsync(SESSION_TOKEN_KEY);
  },

  async setToken(token: string) {
    if (Platform.OS === "web") {
      if (typeof window === "undefined") {
        return;
      }

      window.localStorage.setItem(SESSION_TOKEN_KEY, token);
      return;
    }

    await SecureStore.setItemAsync(SESSION_TOKEN_KEY, token);
  },

  async clearToken() {
    if (Platform.OS === "web") {
      if (typeof window === "undefined") {
        return;
      }

      window.localStorage.removeItem(SESSION_TOKEN_KEY);
      return;
    }

    await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
  },
};
