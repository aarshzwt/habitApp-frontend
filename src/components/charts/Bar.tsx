import dynamic from "next/dynamic";
import React from "react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface BarChartProps {
  categories: string[];
  series: { name: string; data: number[] }[];
  onClickBar?: (index: number) => void;
  height?: number;
  colors?: string[];
  tooltipFormatter?: (val: number) => string;

}

export default function Bar({
  categories,
  series,
  onClickBar,
  height = 300,
  colors = ["#0090FF"],
  tooltipFormatter = (val: number) => `${val} actions`
}: BarChartProps) {
  return (
    <Chart
      type="bar"
      height={height}
      series={series}
      options={{
        chart: {
          events: {
            dataPointSelection: (event, chartContext, config) => {
              if (onClickBar) onClickBar(config.dataPointIndex);
            }
          }
        },
        xaxis: {
          categories
        },
        tooltip: {
          y: {
            formatter: tooltipFormatter
          }
        },
        colors
      }}
    />
  );
}
