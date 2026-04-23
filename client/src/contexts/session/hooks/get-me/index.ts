import { SESSION_QUERY_KEY } from "@contexts/session/keys";
import { usersService } from "@services/users";
import { useQuery } from "@tanstack/react-query";

interface Props {
  enabled?: boolean;
  token: string | null;
}

export const useGetMe = ({ enabled, token }: Props) => {
  const me = useQuery({
    queryKey: [...SESSION_QUERY_KEY, token],
    queryFn: usersService.me,
    enabled: enabled,
  });

  return { me };
};
