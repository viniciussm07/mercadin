import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { getHttpErrorMessage, isUnauthorizedError, setApiAccessToken } from "@services/http";
import { sessionTokenStorage } from "@services/session-storage";
import { usersService } from "@services/users";
import { useGetMe } from "./hooks/get-me";
import { SESSION_QUERY_KEY } from "./keys";
import { authService } from "@services/auth";
import { googleAuthService } from "@services/google-auth";
import { getSupabaseClient, isSupabaseConfigured } from "@services/supabase";
import { SessionUser } from "@services/users/types";
import { SignInPayload } from "@services/auth/types";

interface SessionContextValue {
  session: {
    user: SessionUser | null;
    token: string | null;
    isAuthenticated: boolean;
    signIn: (credentials: SignInPayload) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    refetchMe: () => Promise<SessionUser | undefined>;
  };
  isLoadingSession: boolean;
  clearSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isHydratingToken, setIsHydratingToken] = useState(true);

  const { me } = useGetMe({ enabled: Boolean(token) && !isHydratingToken, token });

  const clearSession = useCallback(async () => {
    await sessionTokenStorage.clearToken();
    setApiAccessToken(null);
    setToken(null);
    setUser(null);
    queryClient.removeQueries({ queryKey: SESSION_QUERY_KEY });
  }, [queryClient]);

  useEffect(() => {
    if (me.data) {
      setUser(me.data);
    }
  }, [me.data]);

  useEffect(() => {
    if (!token || !me.error) {
      return;
    }

    if (isUnauthorizedError(me.error)) {
      void clearSession();
    }
  }, [clearSession, me.error, token]);

  const establishSession = useCallback(
    async (nextToken: string, options?: { syncLocalUser?: boolean }) => {
      setApiAccessToken(nextToken);

      try {
        if (options?.syncLocalUser) {
          await authService.syncSession();
        }

        const nextUser = await queryClient.fetchQuery({
          queryKey: [...SESSION_QUERY_KEY, nextToken],
          queryFn: usersService.me,
          retry: false,
        });

        await sessionTokenStorage.setToken(nextToken);
        setToken(nextToken);
        setUser(nextUser);
      } catch (error) {
        await clearSession();
        throw new Error(await getHttpErrorMessage(error, "Não foi possível carregar sua sessão."));
      }
    },
    [clearSession, queryClient],
  );

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const storedToken = await sessionTokenStorage.getToken();

        if (storedToken) {
          setApiAccessToken(storedToken);
          setToken(storedToken);
          return;
        }

        if (Platform.OS === "web" && isSupabaseConfigured()) {
          const { data } = await getSupabaseClient().auth.getSession();
          const nextToken = data.session?.access_token;

          if (nextToken) {
            await establishSession(nextToken, { syncLocalUser: true });
          }
        }
      } catch {
        await clearSession();
      } finally {
        setIsHydratingToken(false);
      }
    };

    void hydrateSession();
  }, [clearSession, establishSession]);

  const signIn = useCallback(
    async (credentials: SignInPayload) => {
      const response = await authService.signIn(credentials);
      const nextToken = response.session?.access_token;

      if (!nextToken) {
        throw new Error("A autenticação foi concluída sem retornar um token válido.");
      }

      await establishSession(nextToken);
    },
    [establishSession],
  );

  const signInWithGoogle = useCallback(async () => {
    if (Platform.OS === "web") {
      const redirectTo = window.location.origin;

      const { error } = await getSupabaseClient().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) {
        throw new Error(error.message);
      }

      return;
    }

    const tokens = await googleAuthService.signIn();
    const response = await authService.signInWithToken({
      provider: "google",
      token: tokens.idToken,
      accessToken: tokens.accessToken,
    });
    const nextToken = response.session?.access_token;

    if (!nextToken) {
      throw new Error("A autenticação com Google foi concluída sem retornar um token válido.");
    }

    await establishSession(nextToken);
  }, [establishSession]);

  const signOut = useCallback(async () => {
    if (Platform.OS === "web" && isSupabaseConfigured()) {
      await getSupabaseClient().auth.signOut();
    }

    await clearSession();
  }, [clearSession]);

  const refetchMe = useCallback(async () => {
    if (!token) {
      return undefined;
    }

    const nextUser = await queryClient.fetchQuery({
      queryKey: [...SESSION_QUERY_KEY, token],
      queryFn: usersService.me,
      retry: false,
    });

    setUser(nextUser);
    return nextUser;
  }, [queryClient, token]);

  const session = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      signIn,
      signInWithGoogle,
      signOut,
      refetchMe,
    }),
    [refetchMe, signIn, signInWithGoogle, signOut, token, user],
  );

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      clearSession,
      isLoadingSession: isHydratingToken || (Boolean(token) && me.isPending),
    }),
    [clearSession, isHydratingToken, me.isPending, session, token],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession deve ser usado dentro de SessionProvider.");
  }

  return context;
};
