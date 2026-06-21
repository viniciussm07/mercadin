import { PriceHistoryPoint } from "@services/products/types";

export interface PriceChartDatum {
  value: number;
  label: string;
  point: PriceHistoryPoint;
  dataPointLabelShiftX: number;
  dataPointLabelShiftY: number;
}
