"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import MetricCard from "@/components/MetricCard";
import Modal from "@/components/Modal";
import { api, ApiError } from "@/lib/api";
import { AuditEntry, Role, SystemUser } from "@/lib/types";

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrator",
  pathologist: "Pathologist",
  lab_tech: "Lab Technician",
  researcher: "Researcher",
};

export default function AdminControlPage() {
  const [tab, setTab] = useState<"users" | "audit" | "compliance">("users");
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", password: "", role: "pathologist" as Role, institution: "" });
  const [inviteError, setInviteError] = useState("");
  const [inviting, setInviting] = useState(false);

  const loadUsers = async () => {
    try {
      const res = await api.get<{ users: SystemUser[] }>("/api/users");
      setUsers(res.users);
    } catch {
      // AppShell will redirect if unauthorized
    }
  };

  const loadAudit = async () => {
    try {
      const res = await api.get<{ audit: AuditEntry[] }>("/api/audit");
      setAudit(res.audit);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    Promise.all([loadUsers(), loadAudit()]).finally(() => setLoading(false));
  }, []);

  const changeRole = async (id: string, role: Role) => {
    try {
      const res = await api.patch<{ user: SystemUser }>(`/api/users/${id}/role`, { role });
      setUsers((prev) => prev.map((u) => (u.id === id ? res.user : u)));
      loadAudit();
    } catch {
      // no-op; select will just revert on next load
    }
  };

  const toggleStatus = async (u: SystemUser) => {
    const next = u.status === "Deactivated" ? "Active" : "Deactivated";
    try {
      const res = await api.patch<{ user: SystemUser }>(`/api/users/${u.id}/status`, { status: next });
      setUsers((prev) => prev.map((x) => (x.id === u.id ? res.user : x)));
      loadAudit();
    } catch {
      // no-op
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.email || !inviteForm.password) {
      setInviteError("Name, email, and a temporary password are required.");
      return;
    }
    setInviteError("");
    setInviting(true);
    try {
      await api.post("/api/users", inviteForm);
      setInviteOpen(false);
      setInviteForm({ name: "", email: "", password: "", role: "pathologist", institution: "" });
      loadUsers();
      loadAudit();
    } catch (err) {
      setInviteError(err instanceof ApiError ? err.message : "Failed to invite user.");
    } finally {
      setInviting(false);
    }
  };

  return (
    <AppShell allow={["admin"]}>
      <TopBar title="Admin Control" showExport={false} />
      <main className="flex-grow p-xl overflow-y-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
            <MetricCard label="Total Users" value={users.length} icon="group" footnote={`Across ${new Set(users.map((u) => u.role)).size} roles`} tone="primary" />
            <MetricCard label="Active Users" value={users.filter((u) => u.status === "Active").length} icon="wifi_tethering" footnote="Currently enabled" tone="secondary" />
            <MetricCard label="Pending Invites" value={users.filter((u) => u.status === "Invited").length} icon="mail" footnote="Awaiting first login" tone="neutral" />
            <MetricCard label="AI Engine" value="v1.0" icon="verified_user" footnote="Heuristic CV pipeline" tone="secondary" />
          </div>

          <div className="flex gap-2 border-b border-outline-variant">
            {[
              { id: "users" as const, label: "User Management", icon: "manage_accounts" },
              { id: "audit" as const, label: "Audit Log", icon: "history" },
              { id: "compliance" as const, label: "Compliance & Policy", icon: "policy" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-md py-sm font-medium text-sm border-b-2 -mb-px transition-colors ${
                  tab === t.id ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {tab === "users" && (
            <section className="bg-surface-container-lowest rounded-xl border border-surface-container-highest overflow-hidden">
              <div className="flex justify-between items-center p-lg border-b border-outline-variant">
                <h2 className="font-headline-sm">Team Members</h2>
                <button
                  onClick={() => setInviteOpen(true)}
                  className="flex items-center gap-1 text-sm bg-primary text-on-primary rounded-DEFAULT px-md py-sm font-medium hover:bg-primary-fixed transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person_add</span>
                  Invite User
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant text-on-surface-variant font-label-caps uppercase tracking-wider">
                      <th className="p-md font-medium">Name</th>
                      <th className="p-md font-medium">Email</th>
                      <th className="p-md font-medium">Role</th>
                      <th className="p-md font-medium">Status</th>
                      <th className="p-md font-medium">Last Login</th>
                      <th className="p-md font-medium text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-md">
                    {!loading && users.length === 0 && (
                      <tr><td colSpan={6} className="p-md text-center text-on-surface-variant text-sm">No users found.</td></tr>
                    )}
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-low transition-colors">
                        <td className="p-md font-medium text-on-surface">{u.name}</td>
                        <td className="p-md text-on-surface-variant font-data-mono text-sm">{u.email}</td>
                        <td className="p-md">
                          <select
                            value={u.role}
                            onChange={(e) => changeRole(u.id, e.target.value as Role)}
                            className="bg-surface-container border border-outline-variant rounded px-2 py-1 text-sm text-on-surface"
                          >
                            {Object.entries(ROLE_LABEL).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-md">
                          <span className={`text-xs font-data-mono px-2 py-1 rounded ${u.status === "Active" ? "text-secondary bg-secondary/10" : "text-on-surface-variant bg-surface-variant"}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-md text-on-surface-variant font-data-mono text-sm">{u.lastLogin ?? "Never"}</td>
                        <td className="p-md text-center">
                          <button
                            onClick={() => toggleStatus(u)}
                            className="text-on-surface-variant hover:text-error transition-colors"
                            title={u.status === "Deactivated" ? "Reactivate" : "Deactivate"}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                              {u.status === "Deactivated" ? "person_check" : "person_remove"}
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tab === "audit" && (
            <section className="bg-surface-container-lowest rounded-xl border border-surface-container-highest overflow-hidden">
              <div className="p-lg border-b border-outline-variant">
                <h2 className="font-headline-sm">Audit Trail</h2>
                <p className="text-on-surface-variant text-sm mt-1">Immutable log of clinically significant actions across the platform.</p>
              </div>
              <ul className="flex flex-col">
                {audit.length === 0 && <li className="p-md text-center text-on-surface-variant text-sm">No audit entries yet.</li>}
                {audit.map((l) => (
                  <li key={l.id} className="p-md border-b border-outline-variant last:border-0 flex justify-between items-center hover:bg-surface-container-low transition-colors">
                    <div>
                      <p className="text-on-surface font-medium">{l.action}</p>
                      <p className="text-on-surface-variant text-sm">
                        {l.actor} · <span className="font-data-mono">{l.target}</span>
                      </p>
                    </div>
                    <span className="text-outline text-xs font-data-mono">{l.time}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tab === "compliance" && (
            <section className="bg-surface-container-lowest rounded-xl border border-surface-container-highest p-lg flex flex-col gap-md">
              <h2 className="font-headline-sm mb-2">Compliance & Policy</h2>
              {[
                { label: "JWT-based session authentication (12h expiry)", enabled: true },
                { label: "Role-based access control enforced on every API route", enabled: true },
                { label: "Require reviewer sign-off before report export", enabled: true },
                { label: "Tumor board share links expire automatically (72h)", enabled: true },
                { label: "Full audit trail of clinically significant actions", enabled: true },
              ].map((p) => (
                <div key={p.label} className="flex items-center justify-between border-b border-outline-variant py-sm last:border-0">
                  <span className="text-on-surface">{p.label}</span>
                  <span className="text-secondary text-sm font-data-mono flex items-center gap-1">
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                    Enforced
                  </span>
                </div>
              ))}
              <p className="text-xs text-on-surface-variant font-data-mono mt-2">
                Note: this is a demo/academic build. Production HIPAA compliance would additionally require encryption at rest, BAAs with hosting providers, and formal access review processes.
              </p>
            </section>
          )}
        </div>
      </main>
      <Footer />

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite User" icon="person_add">
        {inviteError && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-error/40 bg-error-container/10 px-3 py-2 text-sm text-error">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
            {inviteError}
          </div>
        )}
        <form className="flex flex-col gap-md" onSubmit={handleInvite}>
          <label className="flex flex-col gap-1">
            <span className="font-label-caps text-on-surface-variant">Full Name</span>
            <input className="input-outline bg-surface border border-outline-variant rounded px-md py-sm text-on-surface" value={inviteForm.name} onChange={(e) => setInviteForm((f) => ({ ...f, name: e.target.value }))} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-label-caps text-on-surface-variant">Email</span>
            <input type="email" className="input-outline bg-surface border border-outline-variant rounded px-md py-sm text-on-surface" value={inviteForm.email} onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-label-caps text-on-surface-variant">Temporary Password</span>
            <input type="text" className="input-outline bg-surface border border-outline-variant rounded px-md py-sm text-on-surface font-data-mono" value={inviteForm.password} onChange={(e) => setInviteForm((f) => ({ ...f, password: e.target.value }))} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-label-caps text-on-surface-variant">Role</span>
            <select className="input-outline bg-surface border border-outline-variant rounded px-md py-sm text-on-surface" value={inviteForm.role} onChange={(e) => setInviteForm((f) => ({ ...f, role: e.target.value as Role }))}>
              {Object.entries(ROLE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-label-caps text-on-surface-variant">Institution (optional)</span>
            <input className="input-outline bg-surface border border-outline-variant rounded px-md py-sm text-on-surface" value={inviteForm.institution} onChange={(e) => setInviteForm((f) => ({ ...f, institution: e.target.value }))} />
          </label>
          <button type="submit" disabled={inviting} className="w-full bg-primary text-on-primary rounded-DEFAULT py-sm font-headline-sm hover:bg-primary-fixed transition-colors disabled:opacity-60">
            {inviting ? "Inviting…" : "Send Invite"}
          </button>
        </form>
      </Modal>
    </AppShell>
  );
}
