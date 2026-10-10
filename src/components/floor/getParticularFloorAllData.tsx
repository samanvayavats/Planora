"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FolderGit2,
  Layers,
  Building2,
  Compass,
  Loader2,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

// ============================================================
// 1. DATA CONTRACTS & INTERFACES
// ============================================================

export interface PlotConfiguration {
  id: string;
  projectId: string;
  shapeType: string;
  width: number;
  height: number;
  secondWidth: number | null;
  secondHeight: number | null;
  totalArea: number;
  customPoints: unknown | null;
  northFacing: boolean;
  cornerPlot: boolean;
  slopedPlot: boolean;
  obstacles: string | null;
  plotImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface FloorItem {
  id: string;
}

export interface DetailedProject {
  id: string;
  title: string;
  description: string;
  totalFloors: number;
  buildingSummary: string | null;
  buildingType: string;
  plotConfiguration: PlotConfiguration;
  floors: FloorItem[];
}

export interface ProjectApiResponse {
  data: DetailedProject;
}

export interface UserProjectsAccordionProps {
  /** Array of user projects received from parent page */
  projects: Array<{ id: string }>;
}

// ============================================================
// 2. PROJECT ITEM CARD (FETCHES INDIVIDUAL PROJECT DETAILS)
// ============================================================

function ProjectAccordionCard({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [projectData, setProjectData] = useState<DetailedProject | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const floorRegistertionNotCompleted = async () => {
    router.push(`/create-floor/${projectId}`);
  };

  // ✅ Retry handler for user interaction (event handlers are allowed to call setState synchronously)
  const handleRetry = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<ProjectApiResponse>(
        `http://localhost:3000/api/v1/project?projectId=${encodeURIComponent(projectId)}`,
      );
      setProjectData(response.data?.data);
    } catch (err: unknown) {
      console.error(`❌ Failed to fetch project ${projectId}:`, err);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Could not load project details.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // ✅ Initial load without synchronous setState in the effect body (satisfies react-hooks/set-state-in-effect)
  useEffect(() => {
    let isMounted = true;

    const loadProject = async () => {
      try {
        const response = await axios.get<ProjectApiResponse>(
          `http://localhost:3000/api/v1/project?projectId=${encodeURIComponent(projectId)}`,
        );
        if (isMounted) {
          setProjectData(response.data?.data);
          setError(null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          console.error(`❌ Failed to fetch project ${projectId}:`, err);
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Could not load project details.";
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (projectId) {
      void loadProject();
    }

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  // Skeleton Loader for Individual Item
  if (isLoading) {
    return (
      <AccordionItem
        value={projectId}
        className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-emerald-400 animate-spin" />
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-400">Loading {projectId}...</span>
            </div>
          </div>
        </div>
      </AccordionItem>
    );
  }

  // Error State for Individual Item
  if (error || !projectData) {
    return (
      <AccordionItem
        value={projectId}
        className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-4"
      >
        <div className="flex items-center justify-between text-xs text-rose-300">
          <span>Failed to load project: {projectId}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRetry}
            className="text-xs text-rose-400 hover:text-rose-200"
          >
            Retry
          </Button>
        </div>
      </AccordionItem>
    );
  }

  const { plotConfiguration, floors } = projectData;

  return (
    <AccordionItem
      value={projectData.id}
      className="rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl shadow-2xl transition-all overflow-hidden data-[state=open]:border-emerald-500/40 data-[state=open]:shadow-[0_0_30px_rgba(16,185,129,0.05)]"
    >
      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-900/40 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-4 w-full text-left pr-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-100 text-base">{projectData.title}</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
                  {projectData.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-emerald-400" />
                  {projectData.totalFloors} {projectData.totalFloors === 1 ? "Floor" : "Floors"}
                </span>
                <span className="text-slate-600">•</span>
                <span className="capitalize text-slate-400">{projectData.buildingType}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {plotConfiguration && (
              <span className="hidden sm:inline-flex text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                {plotConfiguration.width}ft × {plotConfiguration.height}ft (
                {plotConfiguration.totalArea} sq.ft)
              </span>
            )}
            <span className="inline-flex text-xs px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono">
              READY
            </span>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-6 pb-6 pt-2 border-t border-slate-800/80">
        <div className="space-y-6 pt-3">
          {projectData.description && (
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/60">
              {projectData.description}
            </p>
          )}

          {plotConfiguration && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase">Plot Footprint</span>
                <p className="font-mono text-slate-200 mt-0.5">
                  {plotConfiguration.width}&apos; × {plotConfiguration.height}&apos;
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase">Total Land Area</span>
                <p className="font-mono text-emerald-400 mt-0.5">
                  {plotConfiguration.totalArea} sq.ft
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase">Orientation</span>
                <p className="text-slate-200 mt-0.5 flex items-center gap-1">
                  <Compass className="h-3.5 w-3.5 text-cyan-400" />
                  {plotConfiguration.northFacing ? "North-Facing" : "Standard"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase">Lot Positioning</span>
                <p className="text-slate-200 mt-0.5">
                  {plotConfiguration.cornerPlot ? "Corner Lot" : "Standard Lot"}
                </p>
              </div>
            </div>
          )}

          {plotConfiguration?.obstacles && (
            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 text-slate-200 text-xs flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300">
                  Easement & Setback Constraint:{" "}
                </span>
                <span className="text-slate-300">{plotConfiguration.obstacles}</span>
              </div>
            </div>
          )}

          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Architectural Floors ({floors?.length || 0})
              </h4>
              <span className="text-[11px] text-slate-500">
                Click any floor to view its CAD blueprint
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {floors && floors.length > 0 ? (
                floors.map((floor, floorIndex) => (
                  <div
                    key={floor.id}
                    onClick={() => {
                      router.push(`http://localhost:3000/floor/${floor.id}`);
                    }}
                    className="group cursor-pointer p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-emerald-500/50 transition-all flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                        <Layers className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-semibold text-xs text-slate-200 group-hover:text-emerald-300 transition-colors">
                            Floor Level {floorIndex + 1}
                          </h5>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            {floor.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Click to inspect 2D SVG canvas & BOQ
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-xs font-medium text-emerald-400 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                      <span>View</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between">
                  <div className="col-span-full p-4 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                    No floors created yet for this project.
                  </div>
                  <Button variant={"planaoraButton"} onClick={floorRegistertionNotCompleted}>
                    Complete Floor Requirements
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

// ============================================================
// 3. MAIN ACCORDION WRAPPER
// ============================================================

export default function UserProjectsAccordion({ projects }: UserProjectsAccordionProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 space-y-2">
        <FolderGit2 className="h-8 w-8 text-slate-600 mx-auto" />
        <h3 className="text-sm font-medium text-slate-300">No Projects Found</h3>
        <p className="text-xs text-slate-500">
          Your account does not have any architectural projects registered.
        </p>
      </div>
    );
  }

  return (
    <Accordion className="space-y-4">
      {projects.map((proj) => (
        <ProjectAccordionCard key={proj.id} projectId={proj.id} />
      ))}
    </Accordion>
  );
}
