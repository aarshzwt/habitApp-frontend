import React from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface PieChartProps {
    labels: string[];
    series: number[];
    title?: string;
    tooltipFormatter?: (val: number) => string
}

export default function PieChart({ labels, series, title, tooltipFormatter= (val: number) => `${val} actions` }: PieChartProps) {
    const options: ApexCharts.ApexOptions = {
        labels,
        legend: {
            position: 'bottom'
        },
        tooltip: {
            y: {
                formatter: tooltipFormatter
            }
        },
        ...(title && {
            title: {
                text: title,
                align: 'center',
                offsetY: 10,
                style: {
                    fontSize: '16px'
                }
            }
        }),

        colors: ['#FFCE56', '#9966FF', '#00B8D9', '#FF6384', '#FF9F40', '#4BC0C0'],
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 300
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        ]
    };

    return <Chart options={options} series={series} type="pie" height={350} />;
}
