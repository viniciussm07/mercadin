import { Text } from "@components/text";
import { PriceHistoryPoint } from "@services/products/types";
import { LineChart } from "react-native-gifted-charts";
import { View } from "react-native";
import { InteractiveDataPoint } from "./components/interactive-data-point";
import { PricePointTooltip } from "./components/price-point-tooltip";
import { usePriceHistoryChart } from "./hooks";
import { PriceChartDatum } from "./types";
import { formatAxisPrice } from "./utils";

const CHART_COLOR = "#ff5e00";
const AXIS_COLOR = "#d9d3ce";
const LABEL_COLOR = "#756a62";
const AXIS_TEXT_STYLE = { color: LABEL_COLOR, fontSize: 10 };

interface PriceHistoryChartProps {
  points: PriceHistoryPoint[];
}

export const PriceHistoryChart = ({ points }: PriceHistoryChartProps) => {
  const {
    chartData,
    chartWidth,
    clearPoint,
    endSpacing,
    handleLayout,
    initialSpacing,
    maximumPrice,
    selectPoint,
    selectedIndex,
    shouldScroll,
    spacing,
    togglePoint,
    containerWidth,
  } = usePriceHistoryChart(points);

  return (
    <View className="gap-3">
      <View
        className="min-h-[300px] overflow-hidden rounded-xl border border-border bg-white px-1 pt-8"
        onLayout={handleLayout}
      >
        {containerWidth > 0 ? (
          <LineChart
            areaChart
            key={chartWidth}
            isAnimated
            animateOnDataChange
            color={CHART_COLOR}
            customDataPoint={(_: PriceChartDatum, index: number) => (
              <InteractiveDataPoint
                index={index}
                selected={selectedIndex === index}
                onClear={clearPoint}
                onSelect={selectPoint}
                onToggle={togglePoint}
              />
            )}
            curved={chartData.length > 2}
            data={chartData}
            dataPointLabelComponent={(datum: PriceChartDatum) => (
              <PricePointTooltip point={datum.point} />
            )}
            dataPointLabelWidth={128}
            dataPointsHeight={16}
            dataPointsColor={CHART_COLOR}
            dataPointsRadius={5}
            dataPointsWidth={16}
            disableScroll={!shouldScroll}
            endFillColor={CHART_COLOR}
            endOpacity={0.02}
            endSpacing={endSpacing}
            focusEnabled
            focusedDataPointIndex={selectedIndex ?? -1}
            focusedDataPointColor={CHART_COLOR}
            focusedDataPointRadius={7}
            formatYLabel={formatAxisPrice}
            height={210}
            initialSpacing={initialSpacing}
            maxValue={maximumPrice}
            noOfSections={4}
            rulesColor={AXIS_COLOR}
            rulesThickness={1}
            showDataPointLabelOnFocus
            showScrollIndicator={shouldScroll}
            showStripOnFocus
            scrollAnimation={false}
            scrollToEnd={shouldScroll}
            spacing={spacing}
            startFillColor={CHART_COLOR}
            startOpacity={0.18}
            stripColor={CHART_COLOR}
            stripOpacity={0.2}
            thickness={3}
            width={chartWidth}
            xAxisColor={AXIS_COLOR}
            xAxisLabelTextStyle={AXIS_TEXT_STYLE}
            yAxisColor={AXIS_COLOR}
            yAxisLabelWidth={54}
            yAxisTextStyle={AXIS_TEXT_STYLE}
          />
        ) : null}
      </View>

      <Text className="text-center font-questrial text-xs text-muted-foreground">
        Passe o mouse ou toque em um ponto para visualizar o preço e a data.
      </Text>
    </View>
  );
};
