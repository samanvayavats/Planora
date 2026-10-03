"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  Sparkles,
  Layers,
  Ruler,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Compass,
  Code2,
  Users,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const stats = [
    { label: "Draft Generation Time", value: "< 15s", change: "98% faster than traditional CAD" },
    { label: "Vector Precision", value: "1:1 SVG", change: "Deterministic geometric coordinates" },
    { label: "Feasibility Accuracy", value: "94%+", change: "Localized material & labor BOQ" },
    { label: "Legal Compliance", value: "100%", change: "Automated setback & easement buffers" },
  ];

  const pillars = [
    {
      icon: Cpu,
      title: "Generative Spatial Intelligence",
      description:
        "We harness state-of-the-art LLMs trained on spatial topologies to solve complex room adjacencies, orientation constraints, and daylight paths mathematically.",
    },
    {
      icon: Ruler,
      title: "Deterministic Vector Precision",
      description:
        "Unlike generative pixel art, Planora produces exact, coordinate-backed SVG vector blueprints with accurate wall thicknesses, door swings, and window counts.",
    },
    {
      icon: ShieldCheck,
      title: "Building Code & Easement Compliance",
      description:
        "Municipal water mains, corner-plot setbacks, and local zoning laws are treated as hard mathematical boundaries before a single wall is drafted.",
    },
    {
      icon: Zap,
      title: "Integrated Construction Economics",
      description:
        "Blueprints shouldn't exist in a vacuum. Every layout is paired with an itemized Bill of Quantities (BOQ) and a multi-phase construction Gantt schedule.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background CAD Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #10b981 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-24 relative z-10">
        {/* ==================================================== */}
        {/* HERO SECTION */}
        {/* ==================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Sparkles className="h-3.5 w-3.5" />
            THE FUTURE OF RESIDENTIAL CAD
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
            Bridging Architectural AI with Real-World Construction.
          </h1>

          <p className="text-base md:text-lg text-slate-400 leading-relaxed">
            Planora was founded to eliminate the weeks of back-and-forth between client
            requirements, CAD drafting, and structural budgeting. We turn plain directives into
            compliant, vector-accurate floor blueprints in seconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/projects">
              <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 h-11 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.25)] flex items-center gap-2">
                Explore Projects
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button
                variant="outline"
                className="border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 h-11 px-6 rounded-xl"
              >
                How It Works
              </Button>
            </Link>
          </div>
        </div>

        {/* ==================================================== */}
        {/* METRICS STRIP */}
        {/* ==================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl">
          {stats.map((s, idx) => (
            <div key={idx} className="space-y-1 p-3">
              <div className="text-3xl md:text-4xl font-extrabold font-mono text-emerald-400">
                {s.value}
              </div>
              <div className="text-xs font-semibold text-slate-200">{s.label}</div>
              <p className="text-[11px] text-slate-500">{s.change}</p>
            </div>
          ))}
        </div>

        {/* ==================================================== */}
        {/* MISSION & VISION */}
        {/* ==================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
              <Target className="h-4 w-4" />
              Our Mission
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-100">
              Democratizing architectural feasibility for everyone.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Traditional architecture workflows are fragmented: an architect drafts a plan, a civil
              engineer reviews setbacks weeks later, and a general contractor finally estimates the
              cost. If the budget exceeds limits or easements are violated, you start over from
              square one.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Planora unifies spatial design, legal zoning, and financial modeling into an
              automated, feedback-driven pipeline.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              What Planora Guarantees
            </h3>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5" />
                <span>
                  <strong>Zero Hallucinations:</strong> Every room has bounded $X, Y, W, H$
                  coordinates verified against the master plot area.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5" />
                <span>
                  <strong>True Topological Adjacency:</strong> Kitchens connect to dining areas,
                  garages route to exterior access, and bathrooms preserve privacy.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5" />
                <span>
                  <strong>Instant Export:</strong> Blueprints are rendered as clean, editable SVG
                  vector code ready for standard CAD tool import.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ==================================================== */}
        {/* CORE PILLARS */}
        {/* ==================================================== */}
        <div className="space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100">
              Engineering Architecture from First Principles
            </h2>
            <p className="text-xs text-slate-400">
              How our autonomous engine blends computational geometry with structural feasibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-emerald-500/40 transition-all space-y-3"
                >
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-slate-100 text-base">{pillar.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
