import { Award, Building2, GraduationCap, ShieldCheck } from "lucide-react";

const credentials = [
  { icon: Building2, text: "Enterprise Program Leadership", sub: "$2B+ Technology Programs Managed" },
  { icon: GraduationCap, text: "Johns Hopkins University", sub: "Ward Infinity AI Safety Fellow" },
  { icon: Award, text: "Howard University", sub: "M.S. Molecular Genetics" },
  { icon: ShieldCheck, text: "Responsible AI", sub: "Governance-First Methodology" },
];

export default function TrustBar() {
  return (
    <section className="py-8 px-4 border-y border-gray-100 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {credentials.map((cred) => (
            <div key={cred.text} className="flex items-center gap-3">
              <cred.icon className="w-8 h-8 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-gray-900 leading-tight">{cred.text}</div>
                <div className="text-xs text-gray-500">{cred.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
