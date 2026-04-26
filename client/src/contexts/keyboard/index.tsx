import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

export function KeyboardProvider({ children }: { children: React.ReactNode }) {
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
