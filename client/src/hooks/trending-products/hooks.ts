import { promotionsService } from "@services/promotions";
import { PromotionPeriodDays } from "@services/promotions/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const PROMOTIONS_QUERY_KEY = ["promotions", "ranked"] as const;
const PROMOTIONS_LIMIT = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

export const promotionPeriods: { label: string; value: PromotionPeriodDays }[] = [
  { label: "3 dias", value: 3 },
  { label: "7 dias", value: 7 },
  { label: "30 dias", value: 30 },
];

const isPromotionPeriod = (value: string): value is `${PromotionPeriodDays}` =>
  promotionPeriods.some(period => String(period.value) === value);

interface Props {
  limit?: number;
}

export const useTrendingProducts = ({ limit = PROMOTIONS_LIMIT }: Props = {}) => {
  const [periodDays, setPeriodDays] = useState<PromotionPeriodDays>(7);
  const promotions = useQuery({
    queryKey: [...PROMOTIONS_QUERY_KEY, limit, periodDays],
    queryFn: ({ signal }) => {
      const to = new Date();
      const from = new Date(to.getTime() - periodDays * DAY_MS);

      return promotionsService.findRanked({
        from: from.toISOString(),
        to: to.toISOString(),
        limit,
        offset: 0,
        signal,
      });
    },
    staleTime: 5 * 60 * 1000,
  });

  const selectPeriod = (value: string) => {
    if (isPromotionPeriod(value)) {
      setPeriodDays(Number(value) as PromotionPeriodDays);
    }
  };

  return {
    periodDays,
    promotions,
    selectPeriod,
  };
};
