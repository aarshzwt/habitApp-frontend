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
  visiblePoints?: number;
}

export default function Area({
  seriesName,
  data,
  categories,
  yAxisLabel = "Value",
  xAxisLabel = "Category",
  colors = ["#0090FF"],
  visiblePoints = 15,
}: AreaChartProps) {
  const series = [{
    name: seriesName,
    data
  }];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
       zoom: {
        enabled: true,
        type: "x",
        autoScaleYaxis: true,
      },
      toolbar: {
        show: true,
        tools: {
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
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
       labels: {
        rotate: -45,
        hideOverlappingLabels: true,
        trim: true,
      },
      tickAmount: visiblePoints,
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

   // Optional: Restrict initial visible range
  const end = Math.min(visiblePoints, data.length);
  const start = 0;
  const optionsWithZoom = {
    ...options,
    chart: {
      ...options.chart,
      events: {
        mounted: (chart:any) => {
          chart.zoomX(start, end - 1);
        },
      },
    },
  };

  return <Chart options={optionsWithZoom} series={series} type="area" height={350} />;
}
