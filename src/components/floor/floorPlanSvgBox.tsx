"use client";

import React, { useState, useRef } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Maximize2,
  Minimize2,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FloorPlanSvgBoxProps {
  svgCode: string;
  title?: string;
  floorNumber?: number;
  plotWidth?: number;
  plotHeight?: number;
  totalArea?: number;
  className?: string;
}

export default function FloorPlanSvgBox({
  svgCode,
  title = "Floor Blueprint",
  floorNumber = 1,
  plotWidth,
  plotHeight,
  totalArea,
  className = "",
}: FloorPlanSvgBoxProps) {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setZoom(1);

  const handleDownloadSvg = () => {
    if (!svgCode) return;
    const blob = new Blob([svgCode], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, "-")}-level-${floorNumber}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = () => {
    if (!viewerRef.current) return;
    if (!document.fullscreenElement) {
      viewerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={viewerRef}
      className={`relative w-full rounded-2xl border border-emerald-500/30 bg-slate-950 overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.1)] flex flex-col ${
        isFullscreen ? "h-screen p-6" : "h-[560px] p-4"
      } ${className}`}
    >
      {/* 1. Toolbar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80 z-10 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-xs text-slate-100">{title}</h4>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                Level {floorNumber}
              </span>
            </div>
            {plotWidth && plotHeight && (
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                {plotWidth}ft × {plotHeight}ft {totalArea ? `(${totalArea} sq.ft)` : ""}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="h-7 w-7 p-0 text-slate-300 hover:text-slate-100"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-[11px] font-mono px-2 text-slate-400 min-w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="h-7 w-7 p-0 text-slate-300 hover:text-slate-100"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetZoom}
              className="h-7 w-7 p-0 text-slate-300 hover:text-slate-100 border-l border-slate-800"
              title="Reset Zoom"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>

          {/* Fullscreen Toggle */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="h-8 px-2.5 rounded-lg border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>

          {/* Download Blueprint */}
          <Button
            type="button"
            size="sm"
            onClick={handleDownloadSvg}
            className="h-8 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="text-xs">Export SVG</span>
          </Button>
        </div>
      </div>

      {/* 2. Architectural CAD Canvas */}
      <div className="relative flex-1 w-full overflow-auto flex items-center justify-center p-4">
        {/* Subtle Architectural Grid Lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, #10b981 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />

        {/* SVG Container with Zoom Transform */}
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
          className="transition-transform duration-150 ease-out flex items-center justify-center max-w-full max-h-full"
          dangerouslySetInnerHTML={{ __html: svgCode }}
        />
      </div>

      {/* 3. Footer CAD Watermark */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[11px] font-mono text-slate-500">
        <span className="flex items-center gap-1.5 text-emerald-400/80">
          <Sparkles className="h-3 w-3" /> Planora Vector Engine
        </span>
        <span>Deterministic CAD • SVG Scale 1:1</span>
      </div>
    </div>
  );
}
