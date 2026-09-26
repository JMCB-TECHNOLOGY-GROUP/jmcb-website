"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { ROUTES, STEP_META, isStepDone, progress, type LabStudentView } from "@/lib/lab-shared";
import { ONBOARDING_STEPS } from "@/lib/lab-types";

// Lab roster: every Proof of Work student, where they are in onboarding, and
// their weekly submissions. Same ADMIN_PASSWORD gate as /admin.

type AdminStudent = LabStudentView & {
  invited_at: string | null;
  last_seen_at: string | null;
  admin_notes: string | null;
  payment_ref: string | null;
};
interface AdminSubmission {
  id: string;
  student_id: string;
  week: number;
  track: string;
  url: string | null;
  body: string | null;
  feedback: string | null;
  reviewed_at: string | null;
  created_at: string;
}

const PW_KEY = "jmcb-admin-pw";
const cell = "px-3 py-2 text-sm align-top";
const small = "px-2 py-1 text-xs rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50";

export default function AdminLabPage() {
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState("");
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [subs, setSubs] = useState<AdminSubmission[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(PW_KEY);
      if (saved) setAuth(saved);
    } catch {}
  }, []);

  const call = useCallback(
    async (body?: Record<string, unknown>) => {
      setBusy(true);
      setMsg("");
      try {
        const res = await fetch("/api/admin/lab", {
          method: body ? "POST" : "GET",
          headers: { Authorization: `Bearer ${auth}`, "Content-Type": "application/json" },
          body: body ? JSON.stringify(body) : undefined,
        });
        const data = await res.json();
        if (res.status === 401) {
          setAuth("");
          try { sessionStorage.removeItem(PW_KEY); } catch {}
          throw new Error("Wrong password");
        }
        if (!res.ok) throw new Error(data.error || "Failed");
        setStudents(data.students);
        setSubs(data.submissions);
        return data;
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "Failed");
        return null;
      } finally {
        setBusy(false);
      }
    },
    [auth]
  );

  useEffect(() => {
    if (auth) call();
  }, [auth, call]);

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form className="bg-white p-8 rounded-xl border space-y-3 w-80"
          onSubmit={(e) => {
            e.preventDefault();
            try { sessionStorage.setItem(PW_KEY, password); } catch {}
            setAuth(password);
          }}>
          <h1 className="font-bold text-lg">Lab admin</h1>
          <input type="password" className="w-full border rounded px-3 py-2" placeholder="Admin password"
            value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn-primary w-full">Sign in</button>
          {msg && <p className="text-sm text-red-600">{msg}</p>}
        </form>
      </div>
    );
  }

  const active = students.filter((s) => s.status !== "withdrawn");
  const stepCounts = ONBOARDING_STEPS.map((st) => ({ st, n: active.filter((s) => isStepDone(s, st)).length }));

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-500"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="text-2xl font-bold">Proof of Work Lab: Cohort 1</h1>
          </div>
          <div className="flex gap-2">
            <button className={small} disabled={busy} onClick={async () => {
              const d = await call({ action: "seed" });
              if (d) setMsg(`Imported ${d.seeded} new applicant(s).`);
            }}>Import applicants</button>
            <button className={small} disabled={busy} onClick={() => call()}><RefreshCw className="w-3.5 h-3.5 inline" /> Refresh</button>
          </div>
        </div>
        {msg && <p className="mb-4 text-sm bg-white border rounded p-3 break-all">{msg}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
          {stepCounts.map(({ st, n }) => (
            <div key={st} className="bg-white border rounded-lg p-3">
              <p className="text-2xl font-bold">{n}<span className="text-sm text-gray-400">/{active.length}</span></p>
              <p className="text-xs text-gray-600">{STEP_META[st].title}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className={cell}>Student</th><th className={cell}>Setup</th><th className={cell}>Route</th>
                <th className={cell}>GitHub</th><th className={cell}>Paid</th><th className={cell}>JMCB address</th>
                <th className={cell}>Work</th><th className={cell}>Seen</th><th className={cell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const p = progress(s);
                const mine = subs.filter((x) => x.student_id === s.id);
                const unreviewed = mine.filter((x) => !x.reviewed_at).length;
                return (
                  <Fragment key={s.id}>
                    <tr className={`border-t ${s.status === "withdrawn" ? "opacity-40" : ""}`}>
                      <td className={cell}>
                        <button className="font-semibold text-left" onClick={() => setOpen(open === s.id ? null : s.id)}>
                          {s.first_name} {s.last_name}
                        </button>
                        <div className="text-xs text-gray-500">{s.email}</div>
                        <div className={`text-xs ${s.phone ? "text-gray-500" : "text-red-600"}`}>{s.phone || "no phone"}{s.timezone ? ` · ${s.timezone}` : ""}</div>
                      </td>
                      <td className={cell}>{p.done}/{p.total}<div className="text-xs text-gray-500">{p.next ? `next: ${STEP_META[p.next].title}` : "done"}</div></td>
                      <td className={cell}>{s.route ? ROUTES[s.route].exam : "—"}</td>
                      <td className={cell}>{s.github_username ? <a className="text-accent" href={`https://github.com/${s.github_username}`} target="_blank" rel="noreferrer">{s.github_username}</a> : "—"}</td>
                      <td className={cell}>{s.paid_at ? new Date(s.paid_at).toLocaleDateString() : "—"}</td>
                      <td className={cell}>{s.jmcb_address || (s.address_request ? <span className="text-amber-700">wants {s.address_request}@</span> : "—")}</td>
                      <td className={cell}>{mine.length}{unreviewed > 0 && <span className="text-xs text-amber-700"> ({unreviewed} to review)</span>}</td>
                      <td className={cell}>{s.last_seen_at ? new Date(s.last_seen_at).toLocaleDateString() : s.invited_at ? "invited" : "—"}</td>
                      <td className={`${cell} space-y-1`}>
                        <div className="flex gap-1 flex-wrap">
                          <button className={small} disabled={busy} onClick={async () => {
                            if (!window.confirm(`Email ${s.first_name} a new Lab link? Any earlier link stops working.`)) return;
                            const d = await call({ action: "invite", studentId: s.id, send: true });
                            if (d) setMsg(`Sent. Link for ${s.first_name}: ${d.link}`);
                          }}>{s.invited_at ? "Re-invite" : "Invite"}</button>
                          <button className={small} disabled={busy} onClick={async () => {
                            if (!window.confirm(`Make a new link for ${s.first_name} without emailing? Any earlier link stops working.`)) return;
                            const d = await call({ action: "invite", studentId: s.id, send: false });
                            if (d) setMsg(`Link for ${s.first_name} (text it): ${d.link}`);
                          }}>Link only</button>
                        </div>
                      </td>
                    </tr>
                    {open === s.id && (
                      <tr className="bg-gray-50 border-t">
                        <td colSpan={9} className="p-4">
                          <StudentDetail s={s} subs={mine} call={call} busy={busy} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StudentDetail({ s, subs, call, busy }: { s: AdminStudent; subs: AdminSubmission[]; call: (b?: Record<string, unknown>) => Promise<unknown>; busy: boolean }) {
  const [ref, setRef] = useState("");
  const [addr, setAddr] = useState(s.address_request ? `${s.address_request}@jmcbtech.com` : "");
  const [notes, setNotes] = useState(s.admin_notes ?? "");
  const [fb, setFb] = useState<Record<string, string>>({});
  return (
    <div className="grid lg:grid-cols-2 gap-6 text-sm">
      <div className="space-y-2">
        <p><strong>Contact:</strong> {s.phone || "no phone"} · {s.timezone || "no time zone"} · prefers {s.preferred_contact || "—"} · texts {s.sms_ok ? "OK" : "not OK"}{s.contact_confirmed_at ? "" : " (not confirmed yet)"}</p>
        <p><strong>Task:</strong> {s.real_task || "—"}</p>
        <p><strong>Intro:</strong> <span className="whitespace-pre-wrap">{s.intro || "—"}</span></p>
        <p><strong>Target role:</strong> {s.target_role || "—"}</p>
        {s.role_postings.map((p) => <p key={p.url} className="pl-3">· <a className="text-accent" href={p.url} target="_blank" rel="noreferrer">{p.title}, {p.company}</a></p>)}
        <p><strong>Skills seen:</strong> {s.role_skills || "—"}</p>
        <p><strong>Route reason:</strong> {s.route_reason || "—"}</p>
        {s.linkedin && <p><a className="text-accent" href={s.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></p>}
        <div className="flex gap-2 items-center pt-2">
          <input className="border rounded px-2 py-1 flex-1" placeholder="Payment ref (Zelle, cash, waived…)" value={ref} onChange={(e) => setRef(e.target.value)} />
          <button className={small} disabled={busy || !ref || Boolean(s.paid_at)} onClick={() => call({ action: "mark_paid", studentId: s.id, ref })}>Mark paid</button>
        </div>
        <div className="flex gap-2 items-center">
          <input className="border rounded px-2 py-1 flex-1" placeholder="first.last@jmcbtech.com" value={addr} onChange={(e) => setAddr(e.target.value)} />
          <button className={small} disabled={busy || !addr} onClick={() => call({ action: "issue_address", studentId: s.id, address: addr })}>Record issued address</button>
        </div>
        <div className="flex gap-2 items-center">
          <span>Status:</span>
          {(["invited", "active", "completed", "withdrawn"] as const).map((st) => (
            <button key={st} className={`${small} ${s.status === st ? "bg-gray-900 text-white" : ""}`} disabled={busy} onClick={() => call({ action: "set_status", studentId: s.id, status: st })}>{st}</button>
          ))}
        </div>
        <textarea className="border rounded px-2 py-1 w-full" rows={3} placeholder="Private notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button className={small} disabled={busy} onClick={() => call({ action: "notes", studentId: s.id, notes })}>Save notes</button>
      </div>
      <div className="space-y-3">
        <p className="font-semibold">Submissions</p>
        {subs.length === 0 && <p className="text-gray-500">None yet.</p>}
        {subs.map((x) => (
          <div key={x.id} className="bg-white border rounded p-3 space-y-1">
            <p className="text-xs text-gray-500">Week {x.week} · {x.track} · {new Date(x.created_at).toLocaleDateString()}</p>
            {x.url && <a className="text-accent break-all" href={x.url} target="_blank" rel="noreferrer">{x.url}</a>}
            {x.body && <p className="whitespace-pre-wrap">{x.body}</p>}
            <textarea className="border rounded px-2 py-1 w-full" rows={2} placeholder="Feedback (the student sees this)"
              value={fb[x.id] ?? x.feedback ?? ""} onChange={(e) => setFb({ ...fb, [x.id]: e.target.value })} />
            <button className={small} disabled={busy} onClick={() => call({ action: "feedback", submissionId: x.id, feedback: fb[x.id] ?? x.feedback ?? "" })}>
              {x.reviewed_at ? "Update feedback" : "Send feedback"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
