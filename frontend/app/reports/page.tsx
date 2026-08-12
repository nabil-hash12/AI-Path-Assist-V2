"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { api, fileUrl } from "@/lib/api";

interface ReportRow {
  id: string;
  caseId: string;
  patientId: string;
  signedBy: string;
  date: string;
  status: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ reports: ReportRow[] }>("/api/reports")
      .then((res) => setReports(res.reports))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell allow={["admin", "pathologist"]}>
      <TopBar title="Diagnostic Reports" showSearch={false} />
      <main className="flex-grow p-xl overflow-y-auto">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-lg">
          <p className="text-on-surface-variant">Signed reports generated from the AI inference viewer.</p>
          <section className="bg-surface-container-lowest rounded-xl border border-surface-container-highest overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant text-on-surface-variant font-label-caps uppercase tracking-wider">
                  <th className="p-md font-medium">Report ID</th>
                  <th className="p-md font-medium">Case</th>
                  <th className="p-md font-medium">Signed By</th>
                  <th className="p-md font-medium">Date</th>
                  <th className="p-md font-medium">Status</th>
                  <th className="p-md font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody className="font-body-md">
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-low transition-colors">
                    <td className="p-md font-data-mono text-primary">{r.id}</td>
                    <td className="p-md font-data-mono">{r.caseId} · {r.patientId}</td>
                    <td className="p-md text-on-surface-variant">{r.signedBy}</td>
                    <td className="p-md text-on-surface-variant">{r.date}</td>
                    <td className="p-md">
                      <span className="text-xs font-data-mono px-2 py-1 rounded bg-secondary/10 text-secondary">{r.status}</span>
                    </td>
                    <td className="p-md text-center">
                      <a
                        href={fileUrl(`/files/reports/${r.id}.pdf`)}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:text-primary-container text-sm border border-primary/30 rounded px-2 py-1 transition-colors flex items-center gap-1 mx-auto w-fit"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
                        PDF
                      </a>
                    </td>
                  </tr>
                ))}
                {!loading && reports.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-lg text-center text-on-surface-variant">No signed reports yet. Generate one from the AI Inference Viewer.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </div>
      </main>
      <Footer />
    </AppShell>
  );
}
