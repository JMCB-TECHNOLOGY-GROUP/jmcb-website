interface Dimension {
  title: string;
  score: number;
  benchmark: number;
}

interface ScoreChartProps {
  score: number;
  band: string;
  dimensions: Dimension[];
}

const bandInfo = {
  early: {
    color: "#DC2626",
    label: "Foundation Stage",
  },
  developing: {
    color: "#D97706",
    label: "Developing Stage",
  },
  advanced: {
    color: "#059669",
    label: "Advanced Stage",
  },
};

export function ScoreChart({ score, band, dimensions }: ScoreChartProps) {
  const info = bandInfo[band as keyof typeof bandInfo] || bandInfo.early;

  // Group dimensions by performance
  const strongAreas = dimensions.filter((d) => d.score >= 4);
  const improvementAreas = dimensions.filter((d) => d.score < 3);

  return (
    <div className="space-y-6">
      {/* Score Ring */}
      <div className="flex items-center gap-8">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#E5E7EB"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke={info.color}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(score / 50) * 352} 352`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{score}</span>
            <span className="text-xs text-gray-400">/ 50</span>
          </div>
        </div>

        <div>
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: info.color }}
          >
            {info.label}
          </p>
          <p className="text-sm text-gray-500 max-w-xs">
            {band === "advanced"
              ? "Strong AI readiness with mature governance and operations."
              : band === "developing"
              ? "Good foundations with opportunities to strengthen key areas."
              : "Early stage readiness. Focus on building core capabilities."}
          </p>
        </div>
      </div>

      {/* Dimension Bars */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Dimension Scores</p>
        {dimensions.map((dim, i) => {
          const pct = (dim.score / 5) * 100;
          const barColor =
            dim.score >= 4 ? "#059669" : dim.score >= 3 ? "#D97706" : "#DC2626";
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="w-28 text-xs text-gray-500 truncate" title={dim.title}>
                {dim.title}
              </div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: barColor }}
                />
              </div>
              <div
                className="w-6 text-xs font-medium text-right"
                style={{ color: barColor }}
              >
                {dim.score}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
            Strengths ({strongAreas.length})
          </p>
          {strongAreas.length > 0 ? (
            <ul className="space-y-1">
              {strongAreas.slice(0, 3).map((d, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  {d.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400">No strong areas yet</p>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
            Needs Focus ({improvementAreas.length})
          </p>
          {improvementAreas.length > 0 ? (
            <ul className="space-y-1">
              {improvementAreas.slice(0, 3).map((d, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  {d.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400">No critical gaps</p>
          )}
        </div>
      </div>
    </div>
  );
}
