import { endpoints } from "@services/endpoints";
import { apiClient } from "@services/http";
import {
  SignInPayload,
  SignInResponse,
  SignInWithTokenPayload,
  SignUpPayload,
  SuccessResponse,
  UpdateEmailPayload,
  UpdatePasswordPayload,
} from "./types";
import { SessionUser } from "@services/users/types";

export const authService = {
  signIn: (payload: SignInPayload) =>
    apiClient.post(endpoints.auth.signIn, { json: payload }).json<SignInResponse>(),
  signUp: (payload: SignUpPayload) =>
    apiClient.post(endpoints.auth.signUp, { json: payload }).json<SignInResponse>(),
  signInWithToken: (payload: SignInWithTokenPayload) =>
    apiClient.post(endpoints.auth.signInWithToken, { json: payload }).json<SignInResponse>(),
  syncSession: () => apiClient.post(endpoints.auth.syncSession).json(),
  updateEmail: (payload: UpdateEmailPayload) =>
    apiClient.patch(endpoints.auth.updateEmail, { json: payload }).json<SessionUser>(),
  updatePassword: (payload: UpdatePasswordPayload) =>
    apiClient.patch(endpoints.auth.updatePassword, { json: payload }).json<SuccessResponse>(),
  deleteMe: () => apiClient.delete(endpoints.auth.deleteMe).json<SuccessResponse>(),
};
