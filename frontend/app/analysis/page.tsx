"use client";

import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import StatusChip from "@/components/StatusChip";
import { usePatients } from "@/lib/patients-context";

export default function AnalysisListPage() {
  const router = useRouter();
  const { patients } = usePatients();

  return (
    <AppShell allow={["admin", "pathologist", "researcher"]}>
      <TopBar title="Analysis" showExport={false} />
      <main className="flex-grow p-xl overflow-y-auto">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-lg">
          <p className="text-on-surface-variant">Select a specimen to open the AI inference viewer and Grad-CAM explainability panel.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg">
            {patients.map((c) => (
              <button
                key={c.id}
                onClick={() => router.push(`/analysis/${c.id}`)}
                className="text-left flex flex-col gap-md bg-surface-container rounded-xl border border-surface-container-highest p-lg hover:border-primary/50 hover:bg-surface-container-high transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-data-mono text-primary text-sm">{c.id}</span>
                  <StatusChip status={c.status} />
                </div>
                <div>
                  <p className="font-semibold text-on-surface">{c.patientName}</p>
                  <p className="font-semibold text-on-surface">{c.patientId}</p>
                  <p className="text-on-surface-variant text-sm">{c.specimenType}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-on-surface-variant font-data-mono pt-2 border-t border-outline-variant">
                  <span>{c.dateAdded}</span>
                  <span className="flex items-center gap-1 text-primary">
                    Open viewer
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </AppShell>
  );
}
