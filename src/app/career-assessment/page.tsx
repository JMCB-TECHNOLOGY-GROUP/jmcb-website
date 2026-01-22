"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Target, Compass, Rocket, Users, Save } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import CareerLabHeader from "@/components/CareerLabHeader";
import CareerLabFooter from "@/components/CareerLabFooter";

// Career Assessment Questions
const questions = [
  {
    id: "clarity",
    category: "Direction",
    title: "Career Clarity",
    text: "I have a clear vision of where I want my career to be in 2-3 years and the specific steps to get there.",
  },
  {
    id: "positioning",
    category: "Brand",
    title: "Professional Positioning",
    text: "My resume, LinkedIn, and professional narrative effectively communicate my unique value and differentiate me from others in my field.",
  },
  {
    id: "networking",
    category: "Connections",
    title: "Strategic Networking",
    text: "I consistently build and maintain relationships with people who can open doors, provide insights, or advocate for my career growth.",
  },
  {
    id: "skills",
    category: "Growth",
    title: "Skill Development",
    text: "I am actively developing high-value skills that will increase my market value and open new opportunities.",
  },
  {
    id: "interviews",
    category: "Execution",
    title: "Interview Readiness",
    text: "I can confidently articulate my experience, handle tough questions, and negotiate offers effectively.",
  },
  {
    id: "blockers",
    category: "Mindset",
    title: "Overcoming Blockers",
    text: "I have identified and am actively working through the fears, limiting beliefs, or external factors holding me back.",
  },
  {
    id: "experimentation",
    category: "Action",
    title: "Career Experimentation",
    text: "I regularly test hypotheses about my career through side projects, informational interviews, or stretch assignments.",
  },
  {
    id: "support",
    category: "System",
    title: "Support System",
    text: "I have mentors, coaches, or accountability partners who challenge my thinking and hold me to my goals.",
  },
];

const scaleOptions = [
  { value: 1, label: "Not at all" },
  { value: 2, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Often" },
  { value: 5, label: "Always" },
];

const resultProfiles = {
  foundation: {
    color: "#DC2626",
    bgColor: "#FEF2F2",
    level: "Foundation",
    title: "Time to Build Your Career Foundation",
    summary: "You're at an early stage in taking control of your career trajectory. The good news? Awareness is the first step. You need structured guidance to clarify your direction, build your positioning, and create a systematic approach to career growth.",
    recommendation: "Career Strategy Intensive",
    recommendationDesc: "A deep-dive session to clarify your goals, identify your best next moves, and create a 90-day action plan.",
    icon: Compass,
    calendlyUrl: "https://calendly.com/jermaine-jmcbtech/free-review-career-lab-review",
  },
  developing: {
    color: "#D97706",
    bgColor: "#FFFBEB",
    level: "Developing",
    title: "Ready to Accelerate Your Growth",
    summary: "You have some foundations in place but gaps remain that are limiting your progress. You would benefit from focused coaching to sharpen your positioning, expand your network strategically, and build confidence in execution.",
    recommendation: "Career Coaching Package",
    recommendationDesc: "Ongoing 1:1 coaching sessions to work through specific challenges, build skills, and maintain momentum toward your goals.",
    icon: Target,
    calendlyUrl: "https://calendly.com/jermaine-jmcbtech/free-review-career-lab-review",
  },
  advanced: {
    color: "#059669",
    bgColor: "#F0FDF4",
    level: "Advanced",
    title: "Optimize and Execute",
    summary: "You have strong career fundamentals in place. Now it's about optimization and execution. Targeted support on specific challenges like interview prep, negotiation strategy, or transition planning will help you close the gap to your next level.",
    recommendation: "Targeted Prep Session",
    recommendationDesc: "Focused 1:1 sessions for interview preparation, offer negotiation, or strategic career decisions.",
    icon: Rocket,
    calendlyUrl: "https://calendly.com/jermaine-jmcbtech/free-review-career-lab-review",
  },
};

const CAREER_CALENDLY_URL = "https://calendly.com/jermaine-jmcbtech/free-review-career-lab-review";

type Screen = "intro" | "questions" | "capture" | "results";
type Band = "foundation" | "developing" | "advanced";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  currentRole: string;
  goal: string;
}

export default function CareerAssessmentPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [screen, setScreen] = useState<Screen>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    currentRole: "",
    goal: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedResultId, setSavedResultId] = useState<string | null>(null);

  // Pre-fill form data from Clerk user if signed in
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.emailAddresses[0]?.emailAddress || prev.email,
      }));
    }
  }, [isLoaded, isSignedIn, user]);

  const getScore = () => {
    let sum = 0;
    for (let i = 0; i < questions.length; i++) sum += answers[i] || 0;
    return sum;
  };

  const getBand = (score: number): Band => {
    if (score <= 16) return "foundation";
    if (score <= 28) return "developing";
    return "advanced";
  };

  const selectAnswer = (val: number) => {
    setAnswers({ ...answers, [currentQ]: val });
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        setScreen("capture");
      }
    }, 250);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const currentScore = getScore();
    const currentBand = getBand(currentScore);
    const currentProfile = resultProfiles[currentBand];

    try {
      // If user is signed in, save to database
      if (isSignedIn) {
        const saveResponse = await fetch("/api/assessments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assessment_type: "career",
            score: currentScore,
            band: currentBand,
            answers: answers,
            dimensions: questions.map((q, i) => ({
              title: q.title,
              score: answers[i] || 0,
              benchmark: 4, // Target score
            })),
            recommendations: [{
              title: currentProfile.recommendation,
              details: currentProfile.recommendationDesc,
            }],
            organization: formData.currentRole,
            role: formData.goal,
          }),
        });

        if (saveResponse.ok) {
          const { result } = await saveResponse.json();
          setIsSaved(true);
          setSavedResultId(result.id);
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
    }

    setIsSubmitting(false);
    setScreen("results");
  };

  const restart = () => {
    setCurrentQ(0);
    setAnswers({});
    setFormData({ firstName: "", lastName: "", email: "", currentRole: "", goal: "" });
    setScreen("intro");
  };

  const score = getScore();
  const band = getBand(score);
  const profile = resultProfiles[band];
  const pct = Math.round(((currentQ + 1) / questions.length) * 100);
  const IconComponent = profile.icon;

  return (
    <div className="min-h-screen bg-white">
      <CareerLabHeader />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* INTRO SCREEN */}
        {screen === "intro" && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold tracking-widest uppercase text-secondary mb-6">
                Career Lab
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
                Career Readiness<br />Assessment
              </h1>
              <p className="text-lg text-gray-500 max-w-lg mx-auto">
                Discover where you stand in your career journey and get a personalized recommendation for your next move.
              </p>
            </div>

            {/* What You'll Learn */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
              <p className="text-xs font-semibold tracking-widest uppercase text-secondary mb-4">
                What You&apos;ll Discover
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Compass, title: "Career Clarity", desc: "How clear is your direction?" },
                  { icon: Target, title: "Positioning", desc: "How well do you stand out?" },
                  { icon: Users, title: "Network Strength", desc: "Who's in your corner?" },
                  { icon: Rocket, title: "Execution Ready", desc: "Can you close the deal?" },
                ].map((item) => (
                  <div key={item.title} className="bg-white border border-gray-200 rounded-lg p-4">
                    <item.icon className="w-6 h-6 text-secondary mb-2" />
                    <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-8 flex-wrap">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">8</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Questions</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">2</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Minutes</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">Free</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Recommendation</div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setScreen("questions")}
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-white font-semibold rounded-lg hover:bg-primary transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Start Your Assessment
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="mt-6 text-sm text-gray-400">
                Based on the Laboratory Method from &quot;Skills Close the Deal&quot;
              </p>
            </div>
          </div>
        )}

        {/* QUESTIONS SCREEN */}
        {screen === "questions" && (
          <div className="animate-fade-in">
            {/* Progress */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500">
                  Question {currentQ + 1} of {questions.length}
                </span>
                <span className="text-sm font-semibold text-secondary">{pct}%</span>
              </div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-400"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
              <span className="inline-block px-3 py-1 bg-secondary/10 rounded text-xs font-semibold text-secondary uppercase tracking-wide mb-4">
                {questions[currentQ].category}
              </span>
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-3">
                {questions[currentQ].title}
              </h2>
              <p className="text-gray-500 leading-relaxed">
                {questions[currentQ].text}
              </p>
            </div>

            {/* Scale Options */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-6">
              {scaleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => selectAnswer(option.value)}
                  className={`p-3 sm:p-5 rounded-xl border-2 text-center transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    answers[currentQ] === option.value
                      ? "bg-navy border-navy"
                      : "bg-white border-gray-200 hover:border-secondary"
                  }`}
                >
                  <div
                    className={`text-xl sm:text-2xl font-bold mb-1 ${
                      answers[currentQ] === option.value ? "text-secondary" : "text-gray-900"
                    }`}
                  >
                    {option.value}
                  </div>
                  <div
                    className={`text-[8px] sm:text-[10px] font-medium uppercase tracking-tight ${
                      answers[currentQ] === option.value ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {option.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            {currentQ > 0 && (
              <button
                onClick={() => setCurrentQ(currentQ - 1)}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous Question
              </button>
            )}
          </div>
        )}

        {/* CAPTURE SCREEN */}
        {screen === "capture" && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-3">
                Assessment Complete
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Enter your details to see your personalized career recommendation.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Role *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Senior Software Engineer at Google"
                  value={formData.currentRole}
                  onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What&apos;s your biggest career goal right now? *
                </label>
                <select
                  required
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary appearance-none bg-white"
                >
                  <option value="">Select your primary goal...</option>
                  <option value="Get promoted">Get promoted at my current company</option>
                  <option value="Switch roles">Switch to a different role or function</option>
                  <option value="Change industries">Break into a new industry</option>
                  <option value="Land new job">Land a new job in the next 90 days</option>
                  <option value="Negotiate offer">Negotiate a better offer or raise</option>
                  <option value="Build clarity">Figure out what I actually want</option>
                  <option value="Start business">Transition to entrepreneurship</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-white font-semibold rounded-lg hover:bg-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    See My Results
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-400 mt-4">
                Your information is kept confidential.
              </p>
            </form>
          </div>
        )}

        {/* RESULTS SCREEN */}
        {screen === "results" && (
          <div className="animate-fade-in">
            {/* Score Display */}
            <div className="text-center mb-10">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: profile.bgColor }}
              >
                <IconComponent className="w-10 h-10" style={{ color: profile.color }} />
              </div>
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-2"
                style={{ color: profile.color }}
              >
                {profile.level} Stage
              </p>
              <div
                className="text-5xl font-heading font-bold mb-4"
                style={{ color: profile.color }}
              >
                {score}
                <span className="text-2xl opacity-60">/{questions.length * 5}</span>
              </div>
              <h1 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                {profile.title}
              </h1>
              <p className="text-gray-500 max-w-lg mx-auto">
                {profile.summary}
              </p>
            </div>

            {/* Breakdown */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
                Your Scores by Area
              </p>
              <div className="space-y-3">
                {questions.map((q, i) => {
                  const val = answers[i] || 0;
                  const barColor = val >= 4 ? "#059669" : val >= 3 ? "#D97706" : "#DC2626";
                  return (
                    <div
                      key={q.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{q.title}</div>
                        <div className="text-xs text-gray-400 mt-1">{q.category}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${(val / 5) * 100}%`, backgroundColor: barColor }}
                          />
                        </div>
                        <span
                          className="text-sm font-semibold min-w-[20px] text-right"
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

            {/* Save Status Banner */}
            {isSignedIn && isSaved ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Save className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Results Saved to Dashboard</p>
                    <p className="text-sm text-green-600">Access your results anytime from your dashboard</p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : !isSignedIn ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Save className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800">Save Your Results</p>
                    <p className="text-sm text-blue-600">Create a free account to save and track your progress over time</p>
                  </div>
                </div>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Free Account
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : null}

            {/* Recommendation */}
            <div
              className="rounded-2xl p-8 mb-8"
              style={{ backgroundColor: profile.bgColor, border: `2px solid ${profile.color}20` }}
            >
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: profile.color }}>
                Recommended For You
              </p>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                {profile.recommendation}
              </h3>
              <p className="text-gray-600 mb-6">
                {profile.recommendationDesc}
              </p>
              <Link
                href={profile.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-primary transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Book Your Free Session
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* General CTA */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                Not Sure Which Option is Right?
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Book a free 30-minute Career Strategy Session. We&apos;ll review your results together and map out your best path forward.
              </p>
              <Link
                href={CAREER_CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-white font-semibold rounded-lg hover:bg-primary transition-all hover:-translate-y-0.5 hover:shadow-lg mb-4"
              >
                Schedule a Free Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div>
                <button
                  onClick={restart}
                  className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake Assessment
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <CareerLabFooter />
    </div>
  );
}
