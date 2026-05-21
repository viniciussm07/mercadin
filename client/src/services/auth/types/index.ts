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

export interface UpdateEmailPayload {
  email: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export interface SignInResponse {
  session?: {
    access_token: string;
    expires_at?: number | null;
    refresh_token?: string;
    token_type?: string;
  } | null;
}

export interface SuccessResponse {
  success: boolean;
}
