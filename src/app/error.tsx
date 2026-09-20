"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, Terminal, ChevronDown, ChevronUp } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log the error to your analytics or error reporting service (e.g. Sentry)
    console.error("Planora Application Error:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-[calc(100vh-220px)] w-full items-center justify-center px-4 py-12">
      {/* Subtle Background Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Main Error Container */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl border-2 border-slate-900 bg-slate-950/90 p-8 text-center shadow-2xl shadow-slate-950 backdrop-blur-xl sm:p-10">
        {/* Glowing Warning Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-950/30 text-rose-400 shadow-lg shadow-rose-950/50">
          <AlertTriangle className="h-8 w-8 animate-pulse" />
        </div>

        {/* Header */}
        <div className="mt-6 space-y-2">
          <span className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 font-mono text-[11px] text-slate-400">
            Error Code: {error.digest || "500_INTERNAL_FAULT"}
          </span>
          <h1 className="font-playfair text-3xl font-bold text-white sm:text-4xl">
            Something went wrong
          </h1>
          <p className="text-sm text-slate-400">
            An unexpected error occurred while processing the architectural blueprint.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {/* Try Again Button */}
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:scale-[1.02] hover:from-cyan-400 hover:to-teal-500 active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </button>

          {/* Home Link */}
          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 rounded-xl border border-slate-800 bg-slate-900/80 px-6 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
          >
            <Home className="h-4 w-4 text-slate-400" />
            <span>Return Home</span>
          </Link>
        </div>

        {/* Developer Diagnostics Toggle (Helpful in Development) */}
        <div className="mt-8 border-t border-slate-900/80 pt-4">
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-500 transition hover:text-slate-300"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>{showDetails ? "Hide technical diagnostic" : "Show technical diagnostic"}</span>
            {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          {showDetails && (
            <div className="mt-3 rounded-xl border border-slate-900 bg-slate-900/60 p-4 text-left font-mono text-xs text-rose-300/90 shadow-inner overflow-x-auto max-h-40">
              <p className="font-semibold text-rose-400 mb-1">Error Message:</p>
              <p className="whitespace-pre-wrap">
                {error.message || "Unknown client-side exception."}
              </p>
              {error.digest && (
                <p className="mt-2 text-[10px] text-slate-500">Digest: {error.digest}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
