import { endpoints } from "@services/endpoints";
import { apiClient } from "@services/http";

export interface SignInPayload {
  email: string;
  password: string;
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
};
