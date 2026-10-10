"use client";

import React from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { ShieldAlert, Lock, ArrowRight, Home, Sparkles, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface NotAuthenticatedProps {
  title?: string;
  description?: string;
  actionText?: string;
  redirectUrl?: string;
  showHomeButton?: boolean;
  className?: string;
}

export default function NotAuthenticated({
  title = "Authentication Required",
  description = "You must be signed in to access Planora's architectural workspace, view CAD floor blueprints, and generate structural estimates.",
  actionText = "Sign In with Credentials",
  redirectUrl,
  showHomeButton = true,
  className = "",
}: NotAuthenticatedProps) {
  return (
    <div
      className={`min-h-[70vh] w-full flex items-center justify-center p-4 md:p-8 font-sans ${className}`}
    >
      <div className="relative max-w-lg w-full rounded-3xl border border-slate-800 bg-slate-950/80 backdrop-blur-2xl p-8 md:p-10 text-center shadow-[0_0_50px_rgba(15,23,42,0.8)] overflow-hidden">
        {/* Subtle CAD Blueprint Grid Glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, #10b981 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Security / Lock Icon Badge */}
        <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 shadow-inner group">
          <div className="absolute inset-0 rounded-2xl bg-emerald-500/10 blur-md group-hover:bg-emerald-500/20 transition-all" />
          <Lock className="relative h-7 w-7 text-emerald-400" />
        </div>

        {/* Header Badges */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-emerald-400 mb-4">
          <ShieldAlert className="h-3 w-3 text-emerald-400" />
          SECURITY CLEARANCE: 401 UNAUTHORIZED
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100">{title}</h2>

        {/* Description */}
        <p className="mt-3 text-xs md:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
          {description}
        </p>

        {/* Action Controls */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() =>
              redirectUrl ? signIn(undefined, { callbackUrl: redirectUrl }) : signIn()
            }
            className="w-full sm:w-auto h-11 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2"
          >
            <KeyRound className="h-4 w-4" />
            {actionText}
            <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
          </Button>

          {showHomeButton && (
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-11 px-5 rounded-xl border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs transition-all flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4 text-slate-400" />
                Return to Home
              </Button>
            </Link>
          )}
        </div>

        {/* Footer Meta */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-600">
          <span className="flex items-center gap-1.5 text-slate-500">
            <Sparkles className="h-3 w-3 text-emerald-500/60" /> Planora CAD Engine
          </span>
          <span>NextAuth JWT Protected</span>
        </div>
      </div>
    </div>
  );
}
