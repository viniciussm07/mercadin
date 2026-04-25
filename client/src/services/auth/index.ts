import { endpoints } from "@services/endpoints";
import { apiClient } from "@services/http";

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface SignInWithTokenPayload {
  provider: "google";
  token: string;
  accessToken?: string;
}

export interface SignInResponse {
  session?: {
    access_token: string;
    expires_at?: number | null;
    refresh_token?: string;
    token_type?: string;
  } | null;
}

export const authService = {
  signIn: (payload: SignInPayload) =>
    apiClient.post(endpoints.auth.signIn, { json: payload }).json<SignInResponse>(),
  signUp: (payload: SignUpPayload) =>
    apiClient.post(endpoints.auth.signUp, { json: payload }).json<SignInResponse>(),
  signInWithToken: (payload: SignInWithTokenPayload) =>
    apiClient.post(endpoints.auth.signInWithToken, { json: payload }).json<SignInResponse>(),
  syncSession: () => apiClient.post(endpoints.auth.syncSession).json(),
};
