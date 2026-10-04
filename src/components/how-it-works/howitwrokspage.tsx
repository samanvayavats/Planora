"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  Ruler,
  Compass,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Clock,
  DollarSign,
  Download,
  Database,
  RefreshCw,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      badge: "INPUT & CONSTRAINTS",
      title: "Define Plot Footprint & Living Directives",
      description:
        "Specify plot dimensions (e.g. 50' × 80'), lot orientation (North-facing, Corner plot), and living requirements (3 Bed, 2 Bath, Home Office). Add critical boundary setbacks and municipal easements (e.g. Western water main easement).",
      features: [
        "Dynamic plot boundary configuration",
        "Setback & easement buffer inputs",
        "Target square footage & room budget",
      ],
      icon: Ruler,
    },
    {
      step: "02",
      badge: "SPATIAL REASONING",
      title: "Autonomous AI Topology & Geometric Placement",
      description:
        "Planora's asynchronous Redis worker streams your requirements into our Gemini-driven spatial model. It resolves room adjacencies, places door thresholds, and optimizes window sightlines without ever violating boundary setbacks.",
      features: [
        "Asynchronous Redis background queue",
        "Graph-based room adjacency solver",
        "Deterministic wall coordinate resolution",
      ],
      icon: Cpu,
    },
    {
      step: "03",
      badge: "CAD COMPILATION",
      title: "1:1 Vector Blueprint Synthesis",
      description:
        "The solved room coordinates are translated into a deterministic, standards-compliant SVG vector canvas. Rooms are labeled with exact square footage, doors are directional, and easement limit lines are rendered.",
      features: [
        "Full interactive zoom (0.5× – 2.5×) & pan",
        "Fullscreen CAD blueprint viewer",
        "1-click raw SVG vector file export",
      ],
      icon: Layers,
    },
    {
      step: "04",
      badge: "FEASIBILITY & SCHEDULE",
      title: "BOQ Budget Breakdown & 32-Week Phasing",
      description:
        "Along with the blueprint, Planora calculates a complete Bill of Quantities (Material vs. Labor vs. Contingency buffer), cost-per-sq.ft estimates, and an end-to-end phased construction Gantt schedule.",
      features: [
        "Localized material pricing (Austin, TX standard)",
        "Category breakdown (Plumbing, MEP, Finishes)",
        "Sequential multi-phase construction roadmap",
      ],
      icon: DollarSign,
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
        {/* HERO */}
        {/* ==================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <Cpu className="h-3.5 w-3.5" />
            END-TO-END CAD PIPELINE
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
            How Planora Builds Blueprints in Seconds.
          </h1>

          <p className="text-base md:text-lg text-slate-400 leading-relaxed">
            From plot measurements to a fully compliant 2D vector CAD blueprint with financial
            estimates. Explore the four-stage pipeline powering Planora.
          </p>
        </div>

        {/* ==================================================== */}
        {/* THE 4-STEP PIPELINE */}
        {/* ==================================================== */}
        <div className="space-y-16">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isEven = idx % 2 === 1;

            return (
              <div
                key={s.step}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                  isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Text Content */}
                <div className={`lg:col-span-7 space-y-4 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xl font-bold text-emerald-400">{s.step}</span>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 uppercase tracking-wider">
                      {s.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-100">{s.title}</h3>

                  <p className="text-sm text-slate-400 leading-relaxed">{s.description}</p>

                  <div className="pt-2 space-y-2">
                    {s.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Card */}
                <div
                  className={`lg:col-span-5 p-8 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                    <Icon className="h-7 w-7" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-slate-500 tracking-widest">
                      Pipeline Phase {s.step}
                    </span>
                    <h4 className="text-base font-semibold text-slate-200">
                      Deterministic Execution
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Every output is verified against Zod & Prisma contracts before client
                      dispatch.
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ==================================================== */}
        {/* BOTTOM CALL TO ACTION */}
        {/* ==================================================== */}
        <div className="p-8 md:p-12 rounded-3xl border border-emerald-500/30 bg-slate-900/80 backdrop-blur-xl text-center space-y-6 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto">
            <Sparkles className="h-6 w-6" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100">
              Ready to generate your first CAD blueprint?
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Enter your plot boundaries and let Planora synthesize an architectural draft in
              seconds.
            </p>
          </div>

          <div className="pt-2">
            <Link href="/projects">
              <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-8 h-12 rounded-xl text-sm shadow-[0_0_25px_rgba(16,185,129,0.25)] gap-2">
                Launch Planora Studio
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
