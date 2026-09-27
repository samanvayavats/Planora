"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Play, Square, RotateCcw, Trash2, CheckCircle2, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface Point {
  x: number;
  y: number;
  id: string;
}

interface PlotShapeDrawerModalProps {
  open: boolean;
  onClose: () => void;
  initialPoints?: Point[];
  onApply: (result: { points: Point[]; area: number; perimeter: number }) => void;
}

export default function PlotShapeDrawerModal({
  open,
  onClose,
  initialPoints = [],
  onApply,
}: PlotShapeDrawerModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>(initialPoints);
  const [isDrawing, setIsDrawing] = useState(false);

  // Fixed constants to avoid unused state setter warnings
  const scale = 12; // pixels per foot
  const gridSize = 5; // 5ft grid steps

  const MAX_X = 40;
  const MAX_Y = 50;
  const PAD_LEFT = 35;
  const PAD_BOTTOM = 30;
  const PAD_TOP = 20;
  const PAD_RIGHT = 25;

  const PLOT_WIDTH = MAX_X * scale;
  const PLOT_HEIGHT = MAX_Y * scale;
  const CANVAS_WIDTH = PLOT_WIDTH + PAD_LEFT + PAD_RIGHT;
  const CANVAS_HEIGHT = PLOT_HEIGHT + PAD_TOP + PAD_BOTTOM;

  // Reset points when modal opens without calling setState inside an effect
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setPoints(initialPoints || []);
      setIsDrawing(false);
    }
  }

  // Pure calculation functions
  const calculateArea = (pts: Point[]) => {
    if (pts.length < 3) return 0;
    let a = 0;
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length;
      a += pts[i].x * pts[j].y;
      a -= pts[j].x * pts[i].y;
    }
    return Math.abs(a) / 2;
  };

  const calculatePerimeter = (pts: Point[]) => {
    if (pts.length < 2) return 0;
    let p = 0;
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length;
      const dx = pts[j].x - pts[i].x;
      const dy = pts[j].y - pts[i].y;
      p += Math.sqrt(dx * dx + dy * dy);
    }
    return p;
  };

  // Derived values via useMemo (No setState in effect required)
  const area = useMemo(() => calculateArea(points), [points]);
  const perimeter = useMemo(() => calculatePerimeter(points), [points]);

  // Memoized coordinate conversion helpers to satisfy exhaustive-deps
  const toCanvasX = useCallback((xFeet: number) => PAD_LEFT + xFeet * scale, [PAD_LEFT, scale]);
  const toCanvasY = useCallback(
    (yFeet: number) => PAD_TOP + (MAX_Y - yFeet) * scale,
    [PAD_TOP, MAX_Y, scale],
  );

  // Canvas Drawing Routine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "#050c1e";
    ctx.fillRect(PAD_LEFT, PAD_TOP, PLOT_WIDTH, PLOT_HEIGHT);

    // Grid lines
    ctx.strokeStyle = "#0f233d";
    ctx.lineWidth = 1;
    for (let i = 0; i <= MAX_X; i += gridSize) {
      const x = toCanvasX(i);
      ctx.beginPath();
      ctx.moveTo(x, PAD_TOP);
      ctx.lineTo(x, PAD_TOP + PLOT_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i <= MAX_Y; i += gridSize) {
      const y = toCanvasY(i);
      ctx.beginPath();
      ctx.moveTo(PAD_LEFT, y);
      ctx.lineTo(PAD_LEFT + PLOT_WIDTH, y);
      ctx.stroke();
    }

    // Grid numeric markers
    ctx.fillStyle = "#64748b";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (let i = 0; i <= MAX_X; i += gridSize * 2) {
      const x = toCanvasX(i);
      ctx.fillText(`${i}'`, x, PAD_TOP + PLOT_HEIGHT + 8);
    }
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= MAX_Y; i += gridSize * 2) {
      const y = toCanvasY(i);
      ctx.fillText(`${i}'`, PAD_LEFT - 8, y);
    }

    // Cartesian Axes (Bottom-Left is 0, 0)
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(PAD_LEFT, toCanvasY(0));
    ctx.lineTo(PAD_LEFT + PLOT_WIDTH, toCanvasY(0));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(PAD_LEFT, toCanvasY(0));
    ctx.lineTo(PAD_LEFT, toCanvasY(MAX_Y));
    ctx.stroke();

    // Draw Polygon Lines
    if (points.length > 1) {
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#06b6d4";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(toCanvasX(points[0].x), toCanvasY(points[0].y));
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(toCanvasX(points[i].x), toCanvasY(points[i].y));
      }
      if (points.length >= 3 && !isDrawing) {
        ctx.lineTo(toCanvasX(points[0].x), toCanvasY(points[0].y));
        ctx.fillStyle = "rgba(6, 182, 212, 0.12)";
        ctx.fill();
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Draw Vertices
    points.forEach((point, index) => {
      const cx = toCanvasX(point.x);
      const cy = toCanvasY(point.y);

      ctx.fillStyle = "#0891b2";
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, 2 * Math.PI);
      ctx.fill();

      const label = `${index + 1}: (${point.x}, ${point.y})`;
      ctx.font = "10px sans-serif";
      const textWidth = ctx.measureText(label).width;

      ctx.fillStyle = "rgba(2, 6, 23, 0.85)";
      ctx.fillRect(cx + 8, cy - 14, textWidth + 8, 16);
      ctx.strokeStyle = "#1e293b";
      ctx.strokeRect(cx + 8, cy - 14, textWidth + 8, 16);

      ctx.fillStyle = "#38bdf8";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(label, cx + 12, cy - 6);
    });
  }, [
    points,
    scale,
    gridSize,
    isDrawing,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    PLOT_WIDTH,
    PLOT_HEIGHT,
    toCanvasX,
    toCanvasY,
  ]);

  // Click handler with CSS scale compensation
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;

    const rawX = (canvasX - PAD_LEFT) / scale;
    const rawY = (PLOT_HEIGHT - (canvasY - PAD_TOP)) / scale;

    const snappedX = Math.round(rawX / gridSize) * gridSize;
    const snappedY = Math.round(rawY / gridSize) * gridSize;

    const clampedX = Math.max(0, Math.min(MAX_X, snappedX));
    const clampedY = Math.max(0, Math.min(MAX_Y, snappedY));

    // Close shape if clicked near the 1st point
    if (points.length >= 3) {
      const first = points[0];
      const dist = Math.sqrt(Math.pow(clampedX - first.x, 2) + Math.pow(clampedY - first.y, 2));
      if (dist <= Math.max(1, gridSize * 0.4)) {
        setIsDrawing(false);
        return;
      }
    }

    if (points.some((p) => p.x === clampedX && p.y === clampedY)) return;

    setPoints((curr) => [
      ...curr,
      { x: clampedX, y: clampedY, id: `point_${Date.now()}_${curr.length}` },
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border-2 border-slate-900 bg-slate-950 p-6 text-white shadow-2xl">
        <DialogHeader className="border-b border-slate-900 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="font-playfair text-xl font-bold text-white">
                Plot Shape CAD Drawer
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Click to place coordinates. Click on Point #1 to close the shape.
              </DialogDescription>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsDrawing(!isDrawing)}
                className={`inline-flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold ${
                  isDrawing
                    ? "border border-rose-500/40 bg-rose-950/50 text-rose-300"
                    : "bg-gradient-to-r from-cyan-500 to-teal-600 text-white"
                }`}
              >
                {isDrawing ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isDrawing ? "Stop Drawing" : "Start Drawing"}</span>
              </button>

              {isDrawing && points.length >= 3 && (
                <button
                  type="button"
                  onClick={() => setIsDrawing(false)}
                  className="rounded-xl border border-emerald-500/40 bg-emerald-950/50 px-3 py-1.5 text-xs font-semibold text-emerald-300"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setPoints(points.slice(0, -1))}
                disabled={points.length === 0}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-slate-300 disabled:opacity-40"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setPoints([]);
                  setIsDrawing(false);
                }}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-rose-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Canvas Display */}
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-slate-900 bg-slate-950/80 p-4">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onClick={handleCanvasClick}
            className={`cursor-crosshair rounded-xl border border-slate-800/80 ${
              isDrawing ? "ring-2 ring-cyan-500/50" : ""
            }`}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>

        {/* Live Stats */}
        {points.length >= 3 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-900 bg-slate-900/50 p-3">
              <p className="text-[10px] text-slate-400">Total Area</p>
              <p className="font-mono text-lg font-bold text-cyan-400">
                {Math.round(area)} <span className="text-xs font-normal">sq ft</span>
              </p>
            </div>
            <div className="rounded-xl border border-slate-900 bg-slate-900/50 p-3">
              <p className="text-[10px] text-slate-400">Perimeter</p>
              <p className="font-mono text-lg font-bold text-sky-400">
                {Math.round(perimeter)} <span className="text-xs font-normal">ft</span>
              </p>
            </div>
            <div className="rounded-xl border border-slate-900 bg-slate-900/50 p-3">
              <p className="text-[10px] text-slate-400">Vertices</p>
              <p className="font-mono text-lg font-bold text-teal-400">
                {points.length} <span className="text-xs font-normal">corners</span>
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <DialogFooter className="flex justify-between items-center border-t border-slate-900 pt-4">
          <Button type="button" variant="default" onClick={onClose} className="px-4 py-2 text-xs">
            Cancel
          </Button>

          <Button
            type="button"
            variant="planaoraButton"
            disabled={points.length < 3}
            onClick={() =>
              onApply({
                points,
                area: Math.round(area),
                perimeter: Math.round(perimeter),
              })
            }
            className="px-5 py-2 text-xs disabled:opacity-40"
          >
            <span>Apply Shape to Project</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
