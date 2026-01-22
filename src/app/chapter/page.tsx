import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Chapter | Skills Close the Deal",
  description:
    "Read the free introduction chapter from Skills Close the Deal by Jermaine Barker. Learn the Laboratory Method for hypothesis-driven career experimentation.",
};

export default function ChapterPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-primary text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <span className="inline-block bg-accent text-primary px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-6">
            Free Chapter
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-3">
            SKILLS CLOSE THE DEAL
          </h1>
          <p className="text-xl md:text-2xl text-white/90 italic mb-4">
            How to Bulletproof Your Career and Life
          </p>
          <p className="text-white/70">By Jermaine Barker</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Pull Quote */}
        <blockquote className="bg-light border-l-4 border-primary px-6 py-5 my-8 text-center">
          <p className="text-xl md:text-2xl italic text-primary">
            "Credentials open conversations. Skills close the deal."
          </p>
        </blockquote>

        {/* Chapter Content */}
        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mt-10 mb-6">
            Introduction: The Accidental Discovery
          </h2>

          <p className="text-gray-700 leading-relaxed mb-5">
            I was supposed to be a doctor.
          </p>

          <p className="text-gray-700 leading-relaxed mb-5">
            That was the plan. The only plan that made sense. President's
            College in Guyana. Howard University in three years instead of four.
            Research publications before graduation. A master's program in
            molecular genetics, mapping enzyme pathways, doing work that
            mattered.
          </p>

          <p className="text-gray-700 leading-relaxed mb-5">Then I dropped out.</p>

          {/* Caribbean Wisdom Box */}
          <div className="bg-cream border-2 border-accent rounded-xl p-6 my-8">
            <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
              Caribbean Wisdom
            </p>
            <p className="text-xl italic text-primary mb-2">
              "Big tree fall hard."
            </p>
            <p className="text-sm text-gray-500">
              Back home, we know that the higher you build your expectations,
              the more devastating the collapse. I had built very high.
            </p>
          </div>

          <p className="text-gray-700 leading-relaxed mb-5">
            What followed wasn't a pivot. It was a collapse in slow motion.
            Years of scrambling. Real estate when the market was good.
            Mortgages. Sales. A computer electronics store back in Guyana. I
            started a family. I made money when I could and survived when I
            couldn't.
          </p>

          <p className="text-gray-700 leading-relaxed mb-5">
            Then the global recession hit, and the scrambling stopped working.
          </p>

          <p className="text-gray-700 leading-relaxed mb-5">
            I took a job at the front desk of a Marriott. Night audit. Seven
            days a week, double shifts, barely making rent.
          </p>

          {/* Story Box */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 my-8">
            <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-4">
              The Moment I'd Rather Forget
            </p>
            <p className="text-gray-600 italic leading-relaxed mb-4">
              One night, a woman walked into the lobby. I recognized her
              immediately. We'd gone to Howard together. She was an account
              executive now. Management. A title. A future.
            </p>
            <p className="text-gray-600 italic leading-relaxed mb-4">
              I pretended not to know her. I couldn't say hello. I couldn't
              stand there in my uniform and explain how a Howard graduate,
              someone who was supposed to be a doctor, had ended up scanning
              keycards on the overnight shift.
            </p>
            <p className="text-gray-600 italic leading-relaxed">
              So I looked down. Let the moment pass. That's what shame does. It
              makes you disappear yourself before anyone else can.
            </p>
          </div>

          <p className="text-gray-700 leading-relaxed mb-5">
            Then the call came. One of my former lab colleagues was finishing up
            her PhD and reached out. She had always considered me her little
            brother. She was one of the first people who helped me get my hands
            dirty in real research.
          </p>

          <p className="text-gray-700 leading-relaxed mb-5">
            Her work focused on using plant rhizophores to decontaminate soil
            polluted with PCBs. Watching her run those experiments shaped how I
            thought about research. It eventually led to my own thesis on using
            white rot fungus to break down 2,4 DNT contamination in soil.
          </p>

          <p className="text-gray-700 leading-relaxed mb-5">
            Our professor was retiring. There was a small window to finish what
            I started. She wanted to see her little brother walk across that
            stage.
          </p>

          <p className="text-gray-700 leading-relaxed mb-5">
            Nearly seven years after walking away, I completed my master's in
            molecular genetics.
          </p>

          {/* Pull Quote */}
          <blockquote className="bg-light border-l-4 border-primary px-6 py-5 my-8 text-center">
            <p className="text-xl italic text-primary">
              That moment broke something open in me. I had spent years
              believing that credentials were the point. They weren't.
            </p>
          </blockquote>

          <p className="text-gray-700 leading-relaxed mb-5">
            Not long after, I went to a government-focused job fair.
          </p>

          <p className="text-gray-700 leading-relaxed mb-5">
            The recruiter glanced at my resume and stopped on one line:{" "}
            <strong className="text-primary">SharePoint</strong>.
          </p>

          <p className="text-gray-700 leading-relaxed mb-5">
            He didn't ask about molecular genetics. He didn't care about the
            seven years or the sacrifice or the credential I'd clawed back from
            the wreckage of my twenties.
          </p>

          <p className="text-gray-700 leading-relaxed mb-5">
            He cared about whether I could solve a problem. Right now. This
            week. In his department.
          </p>

          <p className="text-gray-700 leading-relaxed mb-5">
            I was hired as a SharePoint developer.
          </p>

          {/* Pull Quote */}
          <blockquote className="bg-light border-l-4 border-primary px-6 py-5 my-8 text-center">
            <p className="text-xl italic text-primary">
              Credentials open conversations. Skills close the deal.
            </p>
          </blockquote>

          <p className="text-gray-700 leading-relaxed mb-5">
            From that job, I became a Scrum Master. Then a Solution Architect.
            Then a Project Manager. Each move taught me the same lesson: the
            system doesn't care who you were supposed to become. It cares what
            you can do right now.
          </p>

          <p className="text-gray-700 leading-relaxed mb-5">
            <strong className="text-primary">
              This book is built on that truth.
            </strong>
          </p>

          <p className="text-gray-700 leading-relaxed mb-5">
            It's not about motivation. Motivation is weather. Nice when it's
            there, useless when it's not.
          </p>

          <p className="text-gray-700 leading-relaxed mb-5">
            It's about <strong className="text-primary">method</strong>. A
            systematic, evidence-based approach to building a career that
            compounds over time and survives the shocks that will inevitably
            come.
          </p>

          <p className="text-gray-700 leading-relaxed mb-5">
            I call it the Laboratory Method. The same discipline that guides
            scientific research can guide how you learn, test, and adapt in your
            work.
          </p>

          <p className="text-gray-700 leading-relaxed mb-5">
            You don't need to know exactly where you're going. You need a system
            that helps you learn faster than the world changes.
          </p>

          <p className="text-gray-700 leading-relaxed mb-5">
            <strong className="text-primary">
              This book will show you how to build one.
            </strong>
          </p>
        </article>

        {/* CTA Box */}
        <div className="bg-primary text-white rounded-2xl p-8 md:p-10 text-center my-12">
          <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4">
            Ready for the Full Method?
          </h3>
          <p className="text-white/90 mb-6">
            Get the complete book with all 10 chapters, visual frameworks, and
            the Laboratory Method toolkit.
          </p>
          <Link
            href="/products"
            className="inline-block bg-accent text-primary px-8 py-4 rounded-lg font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            GET THE FULL BOOK →
          </Link>
          <p className="text-sm text-white/60 mt-4">www.jmcbtech.com/products</p>
        </div>

        {/* TOC */}
        <div className="bg-gray-50 rounded-xl p-6 md:p-8 my-12">
          <h4 className="text-xl font-heading font-bold text-primary mb-6">
            What You'll Learn in the Full Book:
          </h4>
          <ul className="space-y-4">
            {[
              "Why Career Advice Fails: The three lies that keep professionals stuck",
              "The Laboratory Method: The 5-step flywheel for career experimentation",
              "Building Your Personal Lab: The 60/25/15 skill portfolio framework",
              "The 90-Day Sprint: A structured protocol for skill acquisition",
              "Hypothesis-Driven Skill Acquisition: Design experiments that teach you something",
              "Velocity vs. Progress: Stop being busy nowhere",
              "When Experiments Fail: The iteration loop that turns setbacks into comebacks",
              "From Contributor to Principal Investigator: Level up your career positioning",
              "Authority Through Reproducible Results: Build receipts, not just resumes",
              "The Collaboration Advantage: Multiply your results through partnership",
            ].map((chapter, index) => (
              <li
                key={index}
                className="pb-4 border-b border-gray-200 last:border-0 last:pb-0"
              >
                <span className="text-secondary font-bold font-sans">
                  Chapter {index + 1}:
                </span>{" "}
                <span className="text-gray-600">{chapter.split(": ")[1]}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Career CTA */}
        <div className="bg-secondary text-white rounded-2xl p-8 md:p-10 text-center my-12">
          <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4">
            Want Personalized Guidance?
          </h3>
          <p className="text-white/90 mb-6">
            Book a free 30-minute Career Strategy Session to discuss your
            specific situation.
          </p>
          <Link
            href="https://calendly.com/jermaine-jmcbtech/free-review-career-lab-review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-accent text-primary px-8 py-4 rounded-lg font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            SCHEDULE YOUR FREE CALL →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h4 className="text-lg font-heading font-bold text-primary mb-4">
            About the Author
          </h4>
          <p className="text-gray-600 mb-6">
            Jermaine Barker is a career strategist, AI systems architect, and
            founder of JMCB Technology Group. His journey from molecular
            genetics to the Marriott night shift to AI leadership taught him
            that credentials open conversations. But skills close the deal.
          </p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>
              <strong>AI Strategy & Consulting:</strong>{" "}
              <Link href="/" className="text-secondary hover:underline">
                www.jmcbtech.com
              </Link>
            </p>
            <p>
              <strong>LinkedIn:</strong>{" "}
              <Link
                href="https://linkedin.com/in/jermainebarker"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline"
              >
                linkedin.com/in/jermainebarker
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
