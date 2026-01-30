"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  ClipboardList,
  TrendingUp,
  Calendar,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { AssessmentCard } from "@/components/dashboard/AssessmentCard";
import { ScoreChart } from "@/components/dashboard/ScoreChart";

interface AssessmentResult {
  id: string;
  assessment_type: string;
  score: number;
  band: string;
  created_at: string;
  dimensions: Array<{
    title: string;
    score: number;
    benchmark: number;
  }>;
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        const response = await fetch("/api/assessments");
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
        } else {
          setError("Failed to load assessments");
        }
      } catch (err) {
        setError("Failed to load assessments");
      } finally {
        setIsLoading(false);
      }
    }

    if (isLoaded) {
      fetchResults();
    }
  }, [isLoaded]);

  const latestResult = results[0];
  const previousResult = results[1];
  const scoreTrend = latestResult && previousResult
    ? latestResult.score - previousResult.score
    : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
        </h1>
        <p className="mt-1 text-gray-500">
          Track your AI readiness journey and view your assessment history.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Assessments</p>
              <p className="text-2xl font-bold text-gray-900">{results.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Latest Score</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900">
                  {latestResult?.score ?? "-"}<span className="text-sm text-gray-400">/50</span>
                </p>
                {scoreTrend !== null && (
                  <span className={`text-sm font-medium ${scoreTrend >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {scoreTrend >= 0 ? "+" : ""}{scoreTrend}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Assessment</p>
              <p className="text-2xl font-bold text-gray-900">
                {latestResult
                  ? new Date(latestResult.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {results.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClipboardList className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-heading font-bold text-gray-900 mb-2">
            No Assessments Yet
          </h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Take your first AI Readiness Assessment to establish a baseline and get personalized recommendations.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
          >
            Start Assessment
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Latest Result Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Latest Assessment</h2>
              <Link
                href={`/dashboard/results/${latestResult.id}`}
                className="text-sm text-accent hover:text-amber-600 font-medium"
              >
                View Details
              </Link>
            </div>
            <ScoreChart
              score={latestResult.score}
              band={latestResult.band}
              dimensions={latestResult.dimensions}
            />
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/assessment"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ClipboardList className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium text-gray-700">Retake Assessment</span>
                </Link>
                <a
                  href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Calendar className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium text-gray-700">Book Strategy Call</span>
                </a>
              </div>
            </div>

            {/* Recent Trend */}
            {results.length > 1 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Score Trend</h2>
                <div className="space-y-3">
                  {results.slice(0, 3).map((result, i) => (
                    <div key={result.id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {new Date(result.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="font-semibold text-gray-900">{result.score}/50</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assessment History */}
      {results.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Assessment History</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result) => (
              <AssessmentCard key={result.id} result={result} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
