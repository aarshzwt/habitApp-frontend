import dynamic from "next/dynamic";
import React from "react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AreaChartProps {
  seriesName: string;
  data: number[];
  categories: string[];
  yAxisLabel?: string;
  xAxisLabel?: string;
  colors?: string[];
}

export default function Area({
  seriesName,
  data,
  categories,
  yAxisLabel = "Value",
  xAxisLabel = "Category",
  colors = ["#0090FF"],
}: AreaChartProps) {
  const series = [{
    name: seriesName,
    data
  }];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories,
      title: { text: xAxisLabel },
      labels: { rotate: -45 }
    },
    yaxis: {
      title: { text: yAxisLabel }
    },
    tooltip: {
      y: {
        formatter: val => `${val.toFixed(2)}`
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    colors
  };

  return (
    <Chart options={options} series={series} type="area" height={350} />
  );
}
