"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Sidebar from "@/components/Sidebar";
import { Role } from "@/lib/types";

export default function AppShell({
  children,
  allow,
}: {
  children: ReactNode;
  allow?: Role[];
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (allow && !allow.includes(user.role)) {
      router.replace("/dashboard");
    }
  }, [user, loading, allow, router]);

  if (loading || !user || (allow && !allow.includes(user.role))) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-on-surface-variant">
        <div className="flex items-center gap-sm font-body-md">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          Loading secure session…
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      <Sidebar />
      <div className="ml-72 flex-grow flex flex-col min-h-screen">{children}</div>
    </div>
  );
}
