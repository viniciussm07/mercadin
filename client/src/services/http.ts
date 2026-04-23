import ky, { HTTPError } from "ky";

const DEFAULT_API_URL = "http://localhost:3050";

let accessToken: string | null = null;

export const setApiAccessToken = (token: string | null) => {
  accessToken = token;
};

export const apiClient = ky.create({
  prefixUrl: (process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_URL).replace(/\/$/, ""),
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      request => {
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
  },
});

export const isUnauthorizedError = (error: unknown) =>
  error instanceof HTTPError && (error.response.status === 401 || error.response.status === 403);

export const getHttpErrorMessage = async (
  error: unknown,
  fallback = "Não foi possível concluir a requisição.",
) => {
  // if (error instanceof HTTPError) {
  //   try {
  //     const data = (await error.response.clone().json()) as { message?: string | string[] };
  //     if (Array.isArray(data.message)) {
  //       return data.message.join(", ");
  //     }

  //     if (typeof data.message === "string" && data.message.length > 0) {
  //       return data.message;
  //     }
  //   } catch {
  //     // Ignora erro de parse e tenta o texto bruto abaixo.
  //   }

  //   try {
  //     const text = await error.response.clone().text();
  //     if (text.length > 0) {
  //       return text;
  //     }
  //   } catch {
  //     // Ignora erro de leitura e usa o fallback abaixo.
  //   }
  // }

  // if (error instanceof Error && error.message.length > 0) {
  //   return error.message;
  // }

  console.error(error);
  return fallback;
};
