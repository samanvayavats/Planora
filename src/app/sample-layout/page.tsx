"use client";

import React, { useState } from "react";
import { Sparkles, Grid, Layers, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

import FloorPlanSvgBox from "@/components/floor/floorPlanSvgBox";
import { SAMPLE_LAYOUTS } from "@/lib/sample-data/svglayout.sample-data";

export default function LayoutsShowcasePage() {
  const [activeLayoutId, setActiveLayoutId] = useState<string>(SAMPLE_LAYOUTS[0].id);
  const [viewMode, setViewMode] = useState<"single" | "grid">("single");

  const selectedLayout = SAMPLE_LAYOUTS.find((l) => l.id === activeLayoutId) || SAMPLE_LAYOUTS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 1. Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider mb-1">
              <Sparkles className="h-4 w-4" /> Planora Blueprint Showcase
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
              Architectural CAD Layouts
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Interactive vector floor plans generated with deterministic setback and zoning
              geometry.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 self-start sm:self-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("single")}
              className={`text-xs flex items-center gap-1.5 rounded-lg px-3 ${
                viewMode === "single"
                  ? "bg-slate-800 text-slate-100 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Eye className="h-3.5 w-3.5" /> Interactive View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("grid")}
              className={`text-xs flex items-center gap-1.5 rounded-lg px-3 ${
                viewMode === "grid"
                  ? "bg-slate-800 text-slate-100 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Grid className="h-3.5 w-3.5" /> Grid Comparison
            </Button>
          </div>
        </div>

        {/* 2. Interactive Selector Pills (Iterated over SAMPLE_LAYOUTS) */}
        {viewMode === "single" && (
          <div className="flex flex-wrap gap-3">
            {SAMPLE_LAYOUTS.map((layout, index) => {
              const isActive = layout.id === activeLayoutId;
              return (
                <button
                  key={layout.id}
                  onClick={() => setActiveLayoutId(layout.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                    isActive
                      ? "bg-slate-900 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/40"
                      : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center font-mono text-xs ${
                      isActive
                        ? "bg-emerald-500/20 text-emerald-400 font-semibold"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-200">{layout.title}</h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {layout.plotWidth}×{layout.plotHeight}ft • {layout.totalArea} sq.ft
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* 3. Single View: Selected Layout */}
        {viewMode === "single" && (
          <div className="space-y-4">
            <FloorPlanSvgBox
              svgCode={selectedLayout.svgCode}
              title={selectedLayout.title}
              floorNumber={selectedLayout.floorNumber}
              plotWidth={selectedLayout.plotWidth}
              plotHeight={selectedLayout.plotHeight}
              totalArea={selectedLayout.totalArea}
            />
          </div>
        )}

        {/* 4. Grid View: Iterates over ALL layouts simultaneously */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {SAMPLE_LAYOUTS.map((layout) => (
              <div key={layout.id} className="space-y-2">
                <FloorPlanSvgBox
                  svgCode={layout.svgCode}
                  title={layout.title}
                  floorNumber={layout.floorNumber}
                  plotWidth={layout.plotWidth}
                  plotHeight={layout.plotHeight}
                  totalArea={layout.totalArea}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
