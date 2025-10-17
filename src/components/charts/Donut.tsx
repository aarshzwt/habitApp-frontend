// components/charts/DonutChart.tsx
import dynamic from "next/dynamic";
import React from "react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface DonutChartProps {
  series: number[];
  labels: string[];
  height?: number;
  legendPosition?: "top" | "bottom" | "left" | "right";
  tooltipFormatter?: (val: number) => string;
}

export default function Donut({
  series,
  labels,
  height = 250,
  legendPosition = "bottom",
  tooltipFormatter = (val: number) => `${val} actions`
}: DonutChartProps) {
  return (
    <Chart
      type="donut"
      height={height}
      series={series}
      options={{
        labels,
        tooltip: {
          y: {
            formatter: tooltipFormatter
          }
        },
        legend: {
          position: legendPosition
        }
      }}
    />
  );
}
