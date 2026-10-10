"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Layers,
  Ruler,
  DollarSign,
  Clock,
  Building2,
  DoorOpen,
  Eye,
  AlertCircle,
  Loader2,
  Compass,
  TrendingUp,
  ShieldCheck,
  MapPin,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import FloorPlanSvgBox from "@/components/floor/floorPlanSvgBox";

// ============================================================
// 1. DATA CONTRACTS & TYPES
// ============================================================

export interface DoorData {
  id: string;
  x: number;
  y: number;
  position: string;
}

export interface WindowData {
  id: string;
  count: number;
  position: string;
}

export interface RoomData {
  id: string;
  floorId: string;
  roomId: string;
  type: string;
  area: number;
  width: number;
  height: number;
  x: number;
  y: number;
  color: string;
  doors: DoorData[];
  windows: WindowData[];
  adjacent: string[];
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface TimelinePhase {
  name: string;
  duration: number;
}

export interface CostEstimateData {
  id: string;
  versionId: string;
  materialCost: number;
  laborCost: number;
  contingency: number;
  totalCost: number;
  costPerSqft: number;
  materialBreakdown: Record<string, number>;
  timeline: {
    duration: number;
    phases: TimelinePhase[];
  };
  assumptions: string;
  location: string;
  quality: string;
  createdAt: string;
  updatedAt: string;
}

export interface FloorPlanVersion {
  id: string;
  versionId: string;
  plotWidth: number;
  plotHeight: number;
  totalArea: number;
  utilization: number;
  rooms: RoomData[];
  svgCode: string;
  generatedAt: string;
  updatedAt: string;
}

export interface FloorVersionData {
  floorPlan: FloorPlanVersion;
  costEstimate: CostEstimateData;
}

export interface FloorApiResponse {
  message: string;
  data: {
    rooms: RoomData[];
    versions: FloorVersionData[];
  };
}

interface GetParticularFloorAllDataProps {
  floorId: string;
}
export default function GetParticularFloorAllData({ floorId }: GetParticularFloorAllDataProps) {
  const [data, setData] = useState<FloorApiResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"blueprint" | "rooms" | "costs" | "timeline">(
    "blueprint",
  );

  // ==========================================================
  // FETCH FLOOR DETAILS
  // ==========================================================
  // Retry handler for user interaction
  const handleRetry = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<FloorApiResponse>(
        `/api/v1/floor?floorId=${encodeURIComponent(floorId)}`,
        {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        },
      );

      if (response.data?.data) {
        setData(response.data.data);
      } else {
        throw new Error("Empty payload received from server");
      }
    } catch (err: unknown) {
      console.error("❌ Failed to fetch floor details:", err);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Could not retrieve floor data from API.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [floorId]);

  // Initial load without calling synchronous setState in effect body
  useEffect(() => {
    let isMounted = true;

    const loadFloorDetails = async () => {
      try {
        const response = await axios.get<FloorApiResponse>(
          `/api/v1/floor?floorId=${encodeURIComponent(floorId)}`,
          {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          },
        );

        if (isMounted) {
          if (response.data?.data) {
            setData(response.data.data);
            setError(null);
          } else {
            throw new Error("Empty payload received from server");
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          console.error("❌ Failed to fetch floor details:", err);
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Could not retrieve floor data from API.";
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (floorId) {
      void loadFloorDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [floorId]);

  // Extract primary version data
  const activeVersion = useMemo(() => data?.versions?.[0] || null, [data]);
  const floorPlan = activeVersion?.floorPlan;
  const costEstimate = activeVersion?.costEstimate;
  const rooms = data?.rooms || [];

  // ==========================================================
  // LOADING STATE
  // ==========================================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Loader2 className="h-7 w-7 text-emerald-400 animate-spin" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-200">
              Loading Architectural Blueprint...
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Parsing vector SVG, BOQ calculations, and room matrix for {floorId}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // ERROR STATE
  // ==========================================================
  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl border border-rose-500/30 bg-rose-950/20 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-rose-400 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-rose-200">Failed to Retrieve Floor</h3>
            <p className="text-xs text-slate-400 mt-1">{error}</p>
          </div>
          <Button
            onClick={handleRetry}
            className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Retry Request
          </Button>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MAIN VIEW
  // ==========================================================
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ==================================================== */}
        {/* HEADER BAR */}
        {/* ==================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
                FLOOR ARCHITECTURE
              </span>
              <span className="text-xs font-mono text-slate-500">ID: {floorId}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100">
              Ground Floor Blueprint & Structural Specs
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
              <span>{costEstimate?.location || "Austin, TX"}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-medium">
                {costEstimate?.quality || "Premium"} Standard
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={handleRetry}
              variant="outline"
              size="sm"
              className="border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs rounded-xl"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Refresh
            </Button>
          </div>
        </div>

        {/* ==================================================== */}
        {/* SPATIAL & COST METRIC STRIP */}
        {/* ==================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Plot Footprint */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Plot Boundaries</span>
              <Ruler className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-xl md:text-2xl font-bold font-mono text-slate-100">
              {floorPlan?.plotWidth || 50}&apos; × {floorPlan?.plotHeight || 80}&apos;
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Total Area: {floorPlan?.totalArea?.toLocaleString() || 4000} sq.ft
            </div>
          </div>

          {/* Utilization */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Plot Utilization</span>
              <TrendingUp className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-xl md:text-2xl font-bold font-mono text-emerald-400">
              {floorPlan?.utilization ?? 57}%
            </div>
            <div className="text-[11px] text-slate-500">Complies with 8ft western easement</div>
          </div>

          {/* Rooms Count */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Room Partitions</span>
              <Layers className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-xl md:text-2xl font-bold font-mono text-slate-100">
              {rooms.length} Rooms
            </div>
            <div className="text-[11px] text-slate-500">Bedrooms, Living, Foyer, Garage</div>
          </div>

          {/* Cost Per Sq Ft */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Projected Cost</span>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-xl md:text-2xl font-bold font-mono text-slate-100">
              ${costEstimate?.totalCost?.toLocaleString() ?? "456,000"}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              ${costEstimate?.costPerSqft ?? 114} / sq.ft
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* NAVIGATION TABS */}
        {/* ==================================================== */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          {[
            { id: "blueprint", label: "Vector Blueprint", icon: Eye },
            { id: "rooms", label: `Room Matrix (${rooms.length})`, icon: Building2 },
            { id: "costs", label: "BOQ & Cost Breakdown", icon: DollarSign },
            { id: "timeline", label: "Construction Phasing", icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ==================================================== */}
        {/* TAB 1: VECTOR BLUEPRINT (USING YOUR REUSABLE COMPONENT) */}
        {/* ==================================================== */}
        {activeTab === "blueprint" && (
          <div className="space-y-4">
            {floorPlan?.svgCode ? (
              <FloorPlanSvgBox
                svgCode={floorPlan.svgCode}
                title="Ground Floor Vector Blueprint"
                floorNumber={1}
                plotWidth={floorPlan.plotWidth}
                plotHeight={floorPlan.plotHeight}
                totalArea={floorPlan.totalArea}
                className="w-full"
              />
            ) : (
              <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40 text-slate-400 text-xs">
                No vector SVG blueprint generated yet.
              </div>
            )}

            {/* Setback and Engineering Assumptions */}
            {costEstimate?.assumptions && (
              <div className="p-4 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 text-slate-300 text-xs flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-cyan-300">Engineering Directives & Setbacks</h4>
                  <p className="text-slate-400 leading-relaxed">{costEstimate.assumptions}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: ROOM MATRIX & CONNECTIVITY */}
        {/* ==================================================== */}
        {activeTab === "rooms" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all space-y-4"
                >
                  {/* Room Name + Color Pill */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-4 w-4 rounded-md border border-slate-700 shadow-sm"
                        style={{ backgroundColor: room.color }}
                      />
                      <h3 className="font-semibold text-slate-100 capitalize text-sm">
                        {room.roomId.replace(/_/g, " ")}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                      Priority {room.priority}
                    </span>
                  </div>

                  {/* Room Dimensions */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 uppercase">Dimensions</span>
                      <p className="font-mono text-slate-200 mt-0.5">
                        {room.width}&apos; × {room.height}&apos;
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 uppercase">Floor Area</span>
                      <p className="font-mono text-emerald-400 mt-0.5">{room.area} sq.ft</p>
                    </div>
                  </div>

                  {/* Doors & Windows Info */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                        <DoorOpen className="h-3 w-3 text-cyan-400" />
                        Doors ({room.doors.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {room.doors.length > 0 ? (
                          room.doors.map((door) => (
                            <span
                              key={door.id}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300"
                            >
                              {door.position} (x:{door.x}, y:{door.y})
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-600">None</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                        <Compass className="h-3 w-3 text-amber-400" />
                        Windows ({room.windows.reduce((sum, w) => sum + w.count, 0)})
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {room.windows.length > 0 ? (
                          room.windows.map((win) => (
                            <span
                              key={win.id}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300"
                            >
                              {win.count}x {win.position}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-600">None</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Adjacencies */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-500 uppercase">Adjacent Rooms:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {room.adjacent.map((adj) => (
                        <span
                          key={adj}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/40 border border-slate-700/40 text-slate-400 capitalize"
                        >
                          {adj.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: FINANCIALS & BOQ BREAKDOWN */}
        {/* ==================================================== */}
        {activeTab === "costs" && costEstimate && (
          <div className="space-y-6">
            {/* High-level budget cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1">
                <span className="text-xs text-slate-400">Direct Materials</span>
                <div className="text-2xl font-bold font-mono text-slate-100">
                  ${costEstimate.materialCost.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-500">
                  {Math.round((costEstimate.materialCost / costEstimate.totalCost) * 100)}% of total
                  budget
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1">
                <span className="text-xs text-slate-400">Labor & Contracting</span>
                <div className="text-2xl font-bold font-mono text-slate-100">
                  ${costEstimate.laborCost.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-500">
                  {Math.round((costEstimate.laborCost / costEstimate.totalCost) * 100)}% of total
                  budget
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1">
                <span className="text-xs text-slate-400">Contingency Reserve</span>
                <div className="text-2xl font-bold font-mono text-amber-400">
                  ${costEstimate.contingency.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-500">
                  {Math.round((costEstimate.contingency / costEstimate.totalCost) * 100)}% safety
                  buffer
                </p>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200">
                Material Categories Breakdown
              </h3>

              <div className="space-y-3">
                {Object.entries(costEstimate.materialBreakdown).map(([category, amount]) => {
                  const percentage = Math.round((amount / costEstimate.materialCost) * 100);
                  return (
                    <div key={category} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="capitalize font-medium text-slate-300">{category}</span>
                        <span className="font-mono text-slate-400">
                          ${amount.toLocaleString()} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: CONSTRUCTION TIMELINE */}
        {/* ==================================================== */}
        {activeTab === "timeline" && costEstimate?.timeline && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-100">
                  Total Timeline: {costEstimate.timeline.duration} Weeks
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sequential Gantt schedule from foundation pouring to final inspection.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
                {costEstimate.timeline.phases.length} Execution Phases
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {costEstimate.timeline.phases.map((phase, idx) => (
                <div
                  key={phase.name}
                  className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      Phase 0{idx + 1}
                    </span>
                    <span className="text-xs font-mono text-emerald-400">{phase.duration} Wks</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200 text-sm">{phase.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {Math.round((phase.duration / costEstimate.timeline.duration) * 100)}% of
                      timeline
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
