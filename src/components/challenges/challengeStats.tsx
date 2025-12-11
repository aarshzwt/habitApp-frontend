import Area from "@/components/charts/Area";
import Bar from "@/components/charts/Bar";
import HorizontalBar from "@/components/charts/HorizontalBar";
import { fetcher } from "@/hooks/categoryHooks";
import useSWR from "swr";
import { ChallengeStatsResponse } from "./types";

export function ChallengeStats({ challengeId }: { challengeId: string }) {
  const { data, isLoading }: { data: ChallengeStatsResponse, isLoading: boolean } = useSWR(`/challenges/${challengeId}/stats`, fetcher);

  if (isLoading) return <p>Loading stats...</p>;

  const { leaderboard, overall, dailyStats, weeklyStats } = data;

  // DAILY AREA CHART
  const areaCategories = Object.keys(dailyStats);
  const areaData = Object.values(dailyStats).map(v => v);

  // WEEKLY BAR CHART (Multiple series)
  const weekNumbers = Object.keys(weeklyStats);

  const barCategories = weekNumbers.map(w => "Week " + w);

  const barCompleted = Object.values(weeklyStats).map(v => v.completed);
  const barTotal = Object.values(weeklyStats).map(v => v.total);

  const barSeries = [
    { name: "Completed", data: barCompleted },
    { name: "Total", data: barTotal }
  ];

  // LEADERBOARD HORIZONTAL BAR
  const leaderboardSeries = [
    {
      name: "Streak",
      data: leaderboard.map(u => u.streak),
    }
  ];

  return (
    <div className="mt-10 bg-white shadow-md rounded-2xl p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Challenge Stats</h3>

      {/* Overall Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Participants" value={overall.totalParticipants} />
        <StatCard label="Avg Completion" value={overall.avgCompletion + "%"} />
        <StatCard label="Avg Streak" value={overall.avgStreak + " days"} />
      </div>

      {/* DAILY STATS (AREA CHART) */}
      <h4 className="text-lg font-semibold mt-10 mb-2">Daily Activity</h4>
      <Area
        seriesName="Daily Activity"
        data={areaData}
        categories={areaCategories}
        yAxisLabel="Actions"
        xAxisLabel="Day"
        colors={["#0090FF"]}
      />

      {/* WEEKLY STATS (BAR CHART) — MULTI-SERIES */}
      <h4 className="text-lg font-semibold mt-10 mb-2">Weekly Summary</h4>
      <Bar
        categories={barCategories}
        series={barSeries}
        colors={["#00C49F", "#0088FE"]}
        height={350}
        tooltipFormatter={(v) => `${v} logs`}
      />

      {/* LEADERBOARD */}
      <h4 className="text-lg font-semibold mt-10 mb-2">Leaderboard</h4>
      <HorizontalBar
        users={leaderboard}
        series={leaderboardSeries}
        colors={["#FF8042"]}
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl text-center">
      <p className="text-xs text-purple-600">{label}</p>
      <p className="text-xl font-bold text-purple-800 mt-1">{value}</p>
    </div>
  );
}
