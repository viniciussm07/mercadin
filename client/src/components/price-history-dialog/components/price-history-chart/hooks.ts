import { PriceHistoryPoint } from "@services/products/types";
import { LayoutChangeEvent } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { PriceChartDatum } from "./types";
import { formatShortDate } from "./utils";

const MINIMUM_CHART_WIDTH = 240;
const Y_AXIS_RESERVED_WIDTH = 58;
const SCROLL_POINT_SPACING = 48;
const CHART_HORIZONTAL_INSET = 16;
const CHART_END_SPACING = 8;
const TOOLTIP_EDGE_SHIFT = 48;
const TOOLTIP_SHIFT_ABOVE = -68;
const TOOLTIP_SHIFT_BELOW = 18;

export const usePriceHistoryChart = (points: PriceHistoryPoint[]) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setSelectedIndex(null);
  }, [points]);

  const maximumPrice = Math.max(...points.map(point => point.price), 1) * 1.15;
  const chartData = useMemo<PriceChartDatum[]>(() => {
    const labelInterval = Math.max(1, Math.ceil(points.length / 4));

    return points.map((point, index) => ({
      value: point.price,
      label:
        index === points.length - 1 || index % labelInterval === 0
          ? formatShortDate(point.timestamp)
          : "",
      point,
      dataPointLabelShiftX:
        points.length === 1
          ? 0
          : index === 0
            ? TOOLTIP_EDGE_SHIFT
            : index === points.length - 1
              ? -TOOLTIP_EDGE_SHIFT
              : 0,
      dataPointLabelShiftY:
        point.price / maximumPrice > 0.7 ? TOOLTIP_SHIFT_BELOW : TOOLTIP_SHIFT_ABOVE,
    }));
  }, [maximumPrice, points]);

  const chartWidth = Math.max(containerWidth - Y_AXIS_RESERVED_WIDTH, MINIMUM_CHART_WIDTH);
  const shouldScroll = points.length > 8;
  const spacing =
    points.length > 1
      ? shouldScroll
        ? SCROLL_POINT_SPACING
        : (chartWidth - CHART_HORIZONTAL_INSET * 2) / (points.length - 1)
      : undefined;

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const clearPoint = (index: number) => {
    setSelectedIndex(current => (current === index ? null : current));
  };

  const selectPoint = (index: number) => {
    setSelectedIndex(index);
  };

  const togglePoint = (index: number) => {
    setSelectedIndex(current => (current === index ? null : index));
  };

  return {
    chartData,
    chartWidth,
    clearPoint,
    endSpacing: CHART_END_SPACING,
    handleLayout,
    initialSpacing: points.length === 1 ? chartWidth / 2 : CHART_HORIZONTAL_INSET,
    maximumPrice,
    selectPoint,
    selectedIndex,
    shouldScroll,
    spacing,
    togglePoint,
    containerWidth,
  };
};
