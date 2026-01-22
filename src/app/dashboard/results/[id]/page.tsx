"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Mail,
  Calendar,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { RecommendationsList } from "@/components/dashboard/RecommendationsList";

interface AssessmentResult {
  id: string;
  assessment_type: string;
  score: number;
  band: "early" | "developing" | "advanced";
  created_at: string;
  answers: Record<number, number>;
  dimensions: Array<{
    title: string;
    score: number;
    benchmark: number;
  }>;
  recommendations: Array<{
    title: string;
    details: string;
  }> | null;
}

const bandInfo = {
  early: {
    color: "#DC2626",
    bgColor: "#FEF2F2",
    level: "Foundation",
    risk: "Higher Risk Profile",
    title: "Foundation Stage: Building AI Readiness",
  },
  developing: {
    color: "#D97706",
    bgColor: "#FFFBEB",
    level: "Developing",
    risk: "Moderate Risk Profile",
    title: "Developing Stage: Strengthening AI Capabilities",
  },
  advanced: {
    color: "#059669",
    bgColor: "#F0FDF4",
    level: "Advanced",
    risk: "Lower Risk Profile",
    title: "Advanced Stage: Optimizing AI Value",
  },
};

export default function ResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    async function fetchResult() {
      try {
        const response = await fetch("/api/assessments");
        if (response.ok) {
          const data = await response.json();
          const found = data.results?.find((r: AssessmentResult) => r.id === params.id);
          if (found) {
            setResult(found);
          } else {
            setError("Assessment not found");
          }
        } else {
          setError("Failed to load assessment");
        }
      } catch (err) {
        setError("Failed to load assessment");
      } finally {
        setIsLoading(false);
      }
    }

    fetchResult();
  }, [params.id]);

  const handleSendEmail = async () => {
    if (!result) return;

    setIsSendingEmail(true);
    try {
      const response = await fetch("/api/email/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId: result.id }),
      });

      if (response.ok) {
        setEmailSent(true);
      }
    } catch (error) {
      console.error("Email send error:", error);
    }
    setIsSendingEmail(false);
  };

  const getGapAnalysis = (score: number, benchmark: number) => {
    const diff = benchmark - score;
    if (diff <= 0) return { label: "On track", color: "#059669" };
    if (diff <= 1) return { label: "Minor gap", color: "#D97706" };
    if (diff <= 2) return { label: "Needs attention", color: "#DC2626" };
    return { label: "Critical gap", color: "#DC2626" };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">{error || "Assessment not found"}</p>
        <Link
          href="/dashboard"
          className="text-accent hover:text-amber-600 font-medium"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const profile = bandInfo[result.band];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSendEmail}
            disabled={isSendingEmail || emailSent}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Mail className="w-4 h-4" />
            {emailSent ? "Sent!" : isSendingEmail ? "Sending..." : "Email Report"}
          </button>
        </div>
      </div>

      {/* Score Display */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6 text-center">
        <p className="text-xs text-gray-400 mb-2">
          {new Date(result.created_at).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-4"
          style={{ color: profile.color }}
        >
          {profile.risk}
        </p>
        <div
          className="text-6xl font-heading font-bold mb-4"
          style={{ color: profile.color }}
        >
          {result.score}
          <span className="text-2xl opacity-60">/50</span>
        </div>
        <h1 className="text-xl font-heading font-bold text-gray-900">
          {profile.title}
        </h1>
      </div>

      {/* Dimensions Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Assessment Breakdown
        </h2>
        <div className="space-y-3">
          {result.dimensions.map((dim, i) => {
            const val = dim.score;
            const barColor = val >= 4 ? "#059669" : val >= 3 ? "#D97706" : "#DC2626";
            const gap = getGapAnalysis(val, dim.benchmark);
            return (
              <div
                key={i}
                className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-gray-900">{dim.title}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Benchmark: {dim.benchmark} |{" "}
                    <span style={{ color: gap.color }}>{gap.label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(val / 5) * 100}%`,
                        backgroundColor: barColor,
                      }}
                    />
                  </div>
                  <span
                    className="text-sm font-semibold min-w-[24px] text-right"
                    style={{ color: barColor }}
                  >
                    {val}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Key Recommendations
          </h2>
          <RecommendationsList recommendations={result.recommendations} />
        </div>
      )}

      {/* Actions */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
        <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
          Ready to Improve Your Score?
        </h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Schedule a strategy session to discuss your results and create a roadmap for improvement.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Book Strategy Call
          </a>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Assessment
          </Link>
        </div>
      </div>
    </div>
  );
}
