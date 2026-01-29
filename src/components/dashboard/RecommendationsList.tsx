import { CheckCircle } from "lucide-react";

interface Recommendation {
  title: string;
  details: string;
}

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  return (
    <div className="space-y-3">
      {recommendations.map((rec, i) => (
        <div
          key={i}
          className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
        >
          <span className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {i + 1}
          </span>
          <div>
            <p className="font-semibold text-gray-900">{rec.title}</p>
            <p className="text-sm text-gray-500 mt-1">{rec.details}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
