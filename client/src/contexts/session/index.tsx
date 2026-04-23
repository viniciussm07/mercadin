import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getHttpErrorMessage, isUnauthorizedError, setApiAccessToken } from "@services/http";
import { sessionTokenStorage } from "@services/session-storage";
import { SessionUser, usersService } from "@services/users";
import { useGetMe } from "./hooks/get-me";
import { SESSION_QUERY_KEY } from "./keys";
import { authService, SignInPayload } from "@services/auth";

interface SessionContextValue {
  session: {
    user: SessionUser | null;
    token: string | null;
    isAuthenticated: boolean;
    signIn: (credentials: SignInPayload) => Promise<void>;
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
    const hydrateSession = async () => {
      try {
        const storedToken = await sessionTokenStorage.getToken();
        setApiAccessToken(storedToken);
        setToken(storedToken);
      } finally {
        setIsHydratingToken(false);
      }
    };

    void hydrateSession();
  }, []);

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

  const signIn = useCallback(
    async (credentials: SignInPayload) => {
      const response = await authService.signIn(credentials);
      const nextToken = response.session?.access_token;

      if (!nextToken) {
        throw new Error("A autenticação foi concluída sem retornar um token válido.");
      }

      await sessionTokenStorage.setToken(nextToken);
      setApiAccessToken(nextToken);
      setToken(nextToken);

      try {
        const nextUser = await queryClient.fetchQuery({
          queryKey: [...SESSION_QUERY_KEY, nextToken],
          queryFn: usersService.me,
          retry: false,
        });

        setUser(nextUser);
      } catch (error) {
        await clearSession();
        throw new Error(await getHttpErrorMessage(error, "Não foi possível carregar sua sessão."));
      }
    },
    [clearSession, queryClient],
  );

  const signOut = useCallback(async () => {
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
    () => ({ token, user, isAuthenticated: Boolean(token && user), signIn, signOut, refetchMe }),
    [token, user],
  );

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      clearSession,
      isLoadingSession: isHydratingToken || (Boolean(token) && me.isPending),
    }),
    [isHydratingToken, me.isPending, token, user],
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
