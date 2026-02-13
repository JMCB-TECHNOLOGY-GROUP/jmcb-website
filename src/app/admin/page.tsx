"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

interface Lead {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  organization: string;
  role: string;
  company_size: string;
  assessment_score: number;
  assessment_band: string;
  lead_score: "hot" | "warm" | "cold" | null;
  lead_score_reason: string;
  overall_score_v2: number;
  weakest_dimension: string;
  strongest_dimension: string;
  dimension_scores_v2: Record<string, number>;
  status: string;
  notes: string;
  nurture_emails_sent: number;
  created_at: string;
}

interface WeeklyStats {
  total_leads_this_week: number;
  hot_leads_this_week: number;
  warm_leads_this_week: number;
  cold_leads_this_week: number;
  booked_this_week: number;
  avg_score_this_week: number;
  partial_completions_this_week: number;
}

const scoreColors: Record<string, string> = {
  hot: "bg-red-100 text-red-700",
  warm: "bg-amber-100 text-amber-700",
  cold: "bg-gray-100 text-gray-600",
};

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  qualified: "bg-green-100 text-green-700",
  converted: "bg-purple-100 text-purple-700",
  unqualified: "bg-gray-100 text-gray-500",
};

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [filterScore, setFilterScore] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const headers = useCallback(
    () => ({ Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" }),
    [authToken]
  );

  const handleLogin = () => {
    setAuthToken(password);
    setAuthenticated(true);
  };

  const fetchLeads = useCallback(async () => {
    if (!authToken) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (filterScore) params.set("lead_score", filterScore);
      if (filterStatus) params.set("status", filterStatus);

      const res = await fetch(`/api/admin/leads?${params}`, { headers: headers() });
      if (res.status === 401) { setAuthenticated(false); return; }
      const data = await res.json();
      setLeads(data.leads || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  }, [authToken, page, filterScore, filterStatus, headers]);

  const fetchStats = useCallback(async () => {
    if (!authToken) return;
    try {
      const res = await fetch("/api/admin/leads?action=weekly_stats", { headers: headers() });
      const data = await res.json();
      setStats(data.stats || null);
    } catch (err) {
      console.error("Stats error:", err);
    }
  }, [authToken, headers]);

  useEffect(() => {
    if (authenticated) { fetchLeads(); fetchStats(); }
  }, [authenticated, fetchLeads, fetchStats]);

  const handleAction = async (leadId: string, action: string, details?: string) => {
    try {
      await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: headers(),
        body: JSON.stringify({ leadId, action, details }),
      });
      fetchLeads();
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  // ── LOGIN ──
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="bg-navy-dark border border-gray-800 rounded-2xl p-10 w-full max-w-sm">
          <h1 className="text-white text-xl font-bold mb-1">JMCB Admin</h1>
          <p className="text-gray-500 text-sm mb-6">Assessment Lead Dashboard</p>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm mb-4 outline-none focus:border-blue-500"
          />
          <button onClick={handleLogin} className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ──
  return (
    <div className="min-h-screen bg-navy text-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-xl font-bold text-white">Lead Dashboard</h1>
            <p className="text-xs text-gray-500">JMCB AI Assessment Pipeline</p>
          </div>
        </div>
        <button onClick={() => { fetchLeads(); fetchStats(); }} className="flex items-center gap-2 px-4 py-2 text-sm text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: "This Week", val: stats.total_leads_this_week, color: "text-blue-400" },
            { label: "Hot", val: stats.hot_leads_this_week, color: "text-red-400" },
            { label: "Warm", val: stats.warm_leads_this_week, color: "text-amber-400" },
            { label: "Qualified", val: stats.booked_this_week, color: "text-green-400" },
            { label: "Avg Score", val: stats.avg_score_this_week ? Math.round(stats.avg_score_this_week) : "N/A", color: "text-purple-400" },
            { label: "Partials", val: stats.partial_completions_this_week, color: "text-gray-400" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <select value={filterScore} onChange={(e) => { setFilterScore(e.target.value); setPage(1); }} className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300">
          <option value="">All Lead Scores</option>
          <option value="hot">Hot</option>
          <option value="warm">Warm</option>
          <option value="cold">Cold</option>
        </select>
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300">
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="unqualified">Unqualified</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {["Lead", "Name", "Organization", "Size", "AI Score", "Weakest", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-500">Loading...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-500">No leads found</td></tr>
              ) : leads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer" onClick={() => setSelectedLead(lead)}>
                  <td className="px-4 py-3">
                    {lead.lead_score ? (
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${scoreColors[lead.lead_score] || "bg-gray-100 text-gray-500"}`}>
                        {lead.lead_score}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-600">--</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{lead.first_name} {lead.last_name}</td>
                  <td className="px-4 py-3 text-gray-400">{lead.organization}</td>
                  <td className="px-4 py-3 text-gray-500">{lead.company_size}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${(lead.overall_score_v2 || 0) >= 60 ? "text-green-400" : (lead.overall_score_v2 || 0) >= 40 ? "text-amber-400" : "text-red-400"}`}>
                      {lead.overall_score_v2 || lead.assessment_score || "--"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-red-300 text-xs">{lead.weakest_dimension || "--"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[lead.status] || "bg-gray-100 text-gray-500"}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{new Date(lead.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1">
                      <button onClick={() => handleAction(lead.id, "mark_contacted")} className="px-2 py-1 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded hover:bg-amber-500/20">
                        Contacted
                      </button>
                      <button onClick={() => handleAction(lead.id, "mark_qualified")} className="px-2 py-1 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded hover:bg-green-500/20">
                        Qualified
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-800">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 text-sm bg-gray-800 border border-gray-700 rounded text-gray-400 disabled:opacity-50">
              Prev
            </button>
            <span className="px-3 py-1 text-sm text-gray-500">Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 text-sm bg-gray-800 border border-gray-700 rounded text-gray-400 disabled:opacity-50">
              Next
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedLead(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">{selectedLead.first_name} {selectedLead.last_name}</h2>
                <p className="text-sm text-gray-500">{selectedLead.role} at {selectedLead.organization} ({selectedLead.company_size})</p>
              </div>
              {selectedLead.lead_score && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${scoreColors[selectedLead.lead_score]}`}>
                  {selectedLead.lead_score}
                </span>
              )}
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-400">{selectedLead.overall_score_v2 || selectedLead.assessment_score || "--"}</div>
                <div className="text-xs text-gray-500">Score</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-sm font-semibold text-red-400">{selectedLead.weakest_dimension || "--"}</div>
                <div className="text-xs text-gray-500">Weakest</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-sm font-semibold text-green-400">{selectedLead.strongest_dimension || "--"}</div>
                <div className="text-xs text-gray-500">Strongest</div>
              </div>
            </div>

            {/* Lead score reason */}
            {selectedLead.lead_score_reason && (
              <div className="bg-gray-800 rounded-lg p-3 mb-4">
                <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Why {selectedLead.lead_score}</div>
                <p className="text-sm text-gray-300">{selectedLead.lead_score_reason}</p>
              </div>
            )}

            {/* Dimension scores */}
            {selectedLead.dimension_scores_v2 && (
              <div className="mb-5">
                <div className="text-xs text-gray-500 font-semibold mb-2">ALL DIMENSIONS</div>
                {Object.entries(selectedLead.dimension_scores_v2).sort(([, a], [, b]) => a - b).map(([dim, score]) => (
                  <div key={dim} className="flex justify-between py-1.5 border-b border-gray-800/50 text-sm">
                    <span className="text-gray-400">{dim}</span>
                    <span className={`font-semibold ${score <= 2 ? "text-red-400" : score <= 3 ? "text-amber-400" : "text-green-400"}`}>{score}/5</span>
                  </div>
                ))}
              </div>
            )}

            {/* Contact */}
            <div className="mb-5">
              <a href={`mailto:${selectedLead.email}`} className="text-blue-400 text-sm hover:underline">{selectedLead.email}</a>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap mb-4">
              {[
                { action: "mark_contacted", label: "Contacted", cls: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                { action: "mark_qualified", label: "Qualified", cls: "text-green-400 bg-green-500/10 border-green-500/20" },
                { action: "mark_converted", label: "Converted", cls: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
                { action: "mark_unqualified", label: "Unqualified", cls: "text-gray-400 bg-gray-500/10 border-gray-500/20" },
              ].map((btn) => (
                <button
                  key={btn.action}
                  onClick={() => { handleAction(selectedLead.id, btn.action); setSelectedLead({ ...selectedLead, status: btn.action.replace("mark_", "") }); }}
                  className={`px-3 py-2 text-sm font-medium border rounded-lg ${btn.cls}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <button onClick={() => setSelectedLead(null)} className="w-full py-2 bg-gray-800 text-gray-400 rounded-lg text-sm hover:bg-gray-700 transition">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
