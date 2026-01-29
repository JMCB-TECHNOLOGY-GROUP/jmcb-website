import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

interface AssessmentResult {
  id: string;
  assessment_type: string;
  score: number;
  band: string;
  created_at: string;
}

interface AssessmentCardProps {
  result: AssessmentResult;
}

const bandColors = {
  early: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-600",
    label: "Foundation",
  },
  developing: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-600",
    label: "Developing",
  },
  advanced: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-600",
    label: "Advanced",
  },
};

export function AssessmentCard({ result }: AssessmentCardProps) {
  const colors = bandColors[result.band as keyof typeof bandColors] || bandColors.early;
  const assessmentLabel = result.assessment_type === "ai_readiness"
    ? "AI Readiness"
    : "Career Assessment";

  return (
    <Link
      href={`/dashboard/results/${result.id}`}
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-accent hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={`inline-block px-2 py-1 ${colors.bg} ${colors.border} border rounded text-xs font-medium ${colors.text}`}>
            {colors.label}
          </span>
        </div>
        <div className="text-3xl font-bold text-gray-900">
          {result.score}
          <span className="text-sm text-gray-400 font-normal">/50</span>
        </div>
      </div>

      <p className="text-sm font-medium text-gray-900 mb-2">{assessmentLabel}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Calendar className="w-3 h-3" />
          {new Date(result.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <span className="text-accent text-sm font-medium flex items-center gap-1">
          View <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}
