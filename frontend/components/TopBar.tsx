"use client";

import { useAuth } from "@/lib/auth-context";

export default function TopBar({
  title,
  showSearch = true,
  showExport = true,
  onExport,
}: {
  title: string;
  showSearch?: boolean;
  showExport?: boolean;
  onExport?: () => void;
}) {
  const { user } = useAuth();
  const initials = (user?.name ?? "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-40 border-b border-outline-variant flex justify-between items-center w-full px-margin h-16 flex-shrink-0">
      <div className="flex items-center gap-md">
        <h1 className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-lg">
        {showSearch && (
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: 18 }}>
              search
            </span>
            <input
              className="bg-surface-container border border-outline-variant rounded-DEFAULT py-xs pl-xl pr-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none w-64 placeholder-on-surface-variant transition-colors"
              placeholder="Search patient ID..."
              type="text"
            />
          </div>
        )}
        <div className="flex items-center gap-sm">
          <button className="p-xs text-on-surface-variant hover:text-primary transition-all rounded-DEFAULT hover:bg-surface-container-high" title="Share">
            <span className="material-symbols-outlined">ios_share</span>
          </button>
          <button className="p-xs text-on-surface-variant hover:text-primary transition-all rounded-DEFAULT hover:bg-surface-container-high" title="Settings">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
        {showExport && (
          <button
            onClick={onExport}
            className="bg-primary text-on-primary px-md py-xs rounded-DEFAULT font-body-md font-medium hover:opacity-90 transition-opacity flex items-center gap-xs"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              download
            </span>
            Export
          </button>
        )}
        <div className="w-9 h-9 rounded-full bg-surface-container-highest border border-outline-variant overflow-hidden flex items-center justify-center text-xs font-bold text-primary">
          {initials}
        </div>
      </div>
    </header>
  );
}
