// components/TopUsersBarChart.tsx
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface TopUser {
  username: string;
  streak: number;
  maxStreak: number;
  completedDays: number;
  totalDays: number;
  completionRate: number;
}


interface HorizontalBarProps {
  users: TopUser[];
  colors?: string[];
  series: { name: string; data: number[] }[];
  tooltipFormatter?: (val: number, opts: any) => string;
}

export default function HorizontalBar({
  users,
  colors = ['#00B8D9'],
  series,
  tooltipFormatter = (val: number, opts?: any) => {
    const index = opts?.dataPointIndex;
    const data = users[index];

    return `
      <div>
        ${data.maxStreak ? `
          <div style="font-size:12px;">
            <strong>Max Streak:</strong> ${data.maxStreak} 🔥
          </div>
        ` : ''}

        ${data.streak ? `
          <div style="font-size:12px; margin-top:2px;">
            <strong>Streak:</strong> ${data.streak} 🔥
          </div>
        ` : ''}

        ${data.completionRate ? `<div style="font-size:12px; margin-top:2px;">
          <strong>Completion Rate:</strong> ${data.completionRate}%
        </div>
        ` : ''}
      </div>
    `;
  },
}: HorizontalBarProps) {
  return (
    <Chart
      type="bar"
      height={300}
      series={series}
      options={{
        chart: { type: 'bar' },

        plotOptions: {
          bar: { horizontal: true, borderRadius: 4 },
        },

        xaxis: { categories: users.map((u) => u.username), tickAmount: users.length },

        tooltip: {
          y: {
            formatter: (value, opts) => tooltipFormatter(value, opts),
          },
        },

        colors,
      }}
    />
  );
}
