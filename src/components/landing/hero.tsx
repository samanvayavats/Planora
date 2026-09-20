"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, Compass, Ruler, Maximize2, Check } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative m-1 overflow-hidden rounded-3xl border-2 border-slate-900 bg-slate-950 px-6 py-10 text-white shadow-2xl shadow-slate-950 md:px-8 lg:py-12">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left Column: AI Space & Room Allocation */}
        <div className="flex flex-col items-start space-y-6 text-left">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-medium text-cyan-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>AI Spatial Zoning & Layout Engine</span>
          </div>

          {/* Headline */}
          <h1 className="font-playfair text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Optimal room placement for{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
              any plot area.
            </span>
          </h1>

          {/* Explanatory text focusing on room placement */}
          <p className="max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Provide your plot dimensions and tell Planora which rooms you need. Our AI generates a
            high-efficiency 2D architectural blueprint—arranging bedrooms, living areas, kitchens,
            and baths to maximize natural lighting, ventilation, and circulation with zero wasted
            space.
          </p>

          {/* Quick Specs / Area Pills */}
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-slate-300">
              📐 Plot: 50&apos; × 30&apos; (1,500 sq.ft)
            </span>
            <span className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-slate-300">
              🚪 Living • Master Bed • Dining • Kitchen • Foyer
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center pt-2">
            <Link href={"/generate-project"}>
              <button
                type="button"
                className=" hover:cursor-pointer inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] hover:from-cyan-400 hover:to-teal-500 active:scale-[0.98]"
              >
                <span>Input Plot &amp; Generate</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href={"/sample-layout"}>
              <button
                type="button"
                className="hover:cursor-pointer inline-flex items-center justify-center space-x-2 rounded-xl border border-slate-800 bg-slate-900/60 px-6 py-3.5 font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <Ruler className="h-4 w-4 text-slate-400" />
                <span>View Sample 2D Layouts</span>
              </button>
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="grid w-full grid-cols-2 gap-4 border-t border-slate-900/90 pt-4 sm:grid-cols-3">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-cyan-400 shrink-0" />
              <span className="text-xs text-slate-400">Zero Hallway Waste</span>
            </div>
            <div className="flex items-center space-x-2">
              <Compass className="h-4 w-4 text-cyan-400 shrink-0" />
              <span className="text-xs text-slate-400">Sunlight &amp; Vastu Aware</span>
            </div>
            <div className="flex items-center space-x-2 col-span-2 sm:col-span-1">
              <Maximize2 className="h-4 w-4 text-cyan-400 shrink-0" />
              <span className="text-xs text-slate-400">Exact CAD Dimensioning</span>
            </div>
          </div>
        </div>

        {/* Right Column: 2D Floor Plan Blueprint */}
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="group relative overflow-hidden rounded-2xl border-2 border-cyan-500/20 bg-slate-900/50 p-2 shadow-2xl shadow-cyan-950/40 transition-all duration-300 hover:border-cyan-500/40">
            {/* 2D Blueprint Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-950">
              <Image
                src="/landing/hero.jpg"
                alt="2D Room Layout Blueprint Planora"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>

            {/* Top Floating Badge */}
            <div className="absolute top-5 left-5 hidden sm:flex items-center space-x-2 rounded-lg border border-slate-800/80 bg-slate-950/90 px-3 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-medium text-slate-200">
                2D Plan View • Scale 1/4&quot; = 1&apos;-0&quot;
              </span>
            </div>

            {/* Bottom Overlay Info */}
            <div className="absolute bottom-5 right-5 left-5 sm:left-auto flex items-center justify-between space-x-4 rounded-xl border border-slate-800/80 bg-slate-950/90 px-4 py-2.5 backdrop-blur-md shadow-xl">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                  Layout Optimization
                </p>
                <p className="text-xs text-slate-300">50&apos; × 30&apos; • 100% Space Utilized</p>
              </div>
              <span className="rounded-md bg-cyan-950/80 px-2.5 py-1 text-xs font-mono font-medium text-cyan-300 border border-cyan-800/50">
                Auto-Placed
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
