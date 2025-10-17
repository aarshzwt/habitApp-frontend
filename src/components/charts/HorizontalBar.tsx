// components/TopUsersBarChart.tsx
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface TopUser {
  username: string;
  count: number;
}

interface HorizontalBarProps {
  users: TopUser[];
  colors?: string[];
  series: { name: string; data: number[] }[];
  tooltipFormatter?: (val: number) => string;
}

export default function HorizontalBar({ users, colors = ['#00B8D9'], series, tooltipFormatter = (val: number) => `${val} actions` }: HorizontalBarProps) {
  return (
    <Chart
      type="bar"
      height={300}
      series={series}
      options={{
        chart: {
          type: 'bar',
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 4,
          },
        },
        dataLabels: {
          enabled: true,
        },
        xaxis: {
          categories: users.map((u) => u.username),
        },
        tooltip: {
          y: {
            formatter: tooltipFormatter,
          },
        },
        colors: colors,
      }}
    />
  );
}
