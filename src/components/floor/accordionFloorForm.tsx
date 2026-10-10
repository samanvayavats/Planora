"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import axios from "axios";

import { toast } from "@/components/ui/toast";

import {
  Bed,
  Bath,
  UtensilsCrossed,
  Sofa,
  Plus,
  X,
  Sparkles,
  Layers,
  Ruler,
  DollarSign,
  ShieldCheck,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";
import FloorPlanSvgBox from "./floorPlanSvgBox";

// ============================================================
// TYPES
// ============================================================
// CUID2 generator (valid for Zod & Prisma)
const createId = (length = 24): string => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "c";
  for (let i = 1; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export interface FloorRequirementsData {
  projectId: string;
  floorNumber: number;
  floorName: string;

  versionId: string;
  currentVersionId: string;

  asyncJobType: string;
  asyncJobStatus: string;

  versionNumber: number;
  changeLog: string;

  bedrooms: number;
  bathrooms: number;

  kitchen: boolean;
  livingRoom: boolean;

  plotWidth: number;
  plotHeight: number;
  totalArea: number;

  budget: number;

  roomTypes: string[];
  roomCount: number;

  specialRooms: string[];

  accessibility: boolean;

  constraints: string[];

  notes: string;
}

interface SavedFloorMetadata {
  floorId: string;
  versionId: string;
}

// ============================================================
// DEFAULT DATA
// ============================================================

const DEFAULT_FLOOR_DATA: FloorRequirementsData = {
  projectId: "",

  floorNumber: 1,
  floorName: "Ground Floor",

  versionId: "", //Clean default: generated dynamically via createId() on save
  currentVersionId: "residential",

  asyncJobType: "get-draft",
  asyncJobStatus: "PENDING",

  versionNumber: 1,
  changeLog: "Initial floor plan and requirements draft",

  bedrooms: 3,
  bathrooms: 2,

  kitchen: true,
  livingRoom: true,

  plotWidth: 45.5,
  plotHeight: 60,
  totalArea: 2730,

  budget: 850000,

  roomTypes: [
    "Master Bedroom",
    "Guest Bedroom",
    "Kids Bedroom",
    "Kitchen",
    "Living Room",
    "Dining Area",
  ],

  roomCount: 6,

  specialRooms: ["Home Office", "Pooja Room", "Utility Area"],

  accessibility: true,

  constraints: [
    "Max ceiling height 3.2m",
    "Front setback 3.0m",
    "Side setback 1.5m",
    "Medium structural load",
  ],

  notes:
    "Ensure cross-ventilation in all bedrooms and maximize natural sunlight from the east-facing facade.",
};

// ============================================================
// PROPS
// ============================================================

interface AccordionFloorFormProps {
  projectId: string;

  initialData?: FloorRequirementsData;

  onSubmit?: (data: FloorRequirementsData) => Promise<void> | void;

  floorNumberFromSer?: number;
}

// ============================================================
// COMPONENT
// ============================================================

export default function AccordionFloorForm({
  projectId,
  initialData = DEFAULT_FLOOR_DATA,
  onSubmit,
  floorNumberFromSer,
}: AccordionFloorFormProps) {
  // ==========================================================
  // BASIC STATE
  // ==========================================================

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isRequirementsSaved, setIsRequirementsSaved] = useState(false);

  const [savedMeta, setSavedMeta] = useState<SavedFloorMetadata | null>(null);

  // ==========================================================
  // POLLING STATE
  // ==========================================================

  const [isPolling, setIsPolling] = useState(false);

  const [pollCount, setPollCount] = useState(0);

  const [svgCode, setSvgCode] = useState<string | null>(null);

  const [pollError, setPollError] = useState<string | null>(null);

  // ==========================================================
  // POLLING CONFIG
  // ==========================================================

  const MAX_ATTEMPTS = 10;

  const INTERVAL_MS = 6000;

  // ==========================================================
  // POLLING REFS
  // ==========================================================

  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isCancelledRef = useRef(false);

  // ==========================================================
  // FORM
  // ==========================================================

  const { register, handleSubmit, setValue, control } = useForm<FloorRequirementsData>({
    defaultValues: {
      ...initialData,

      projectId: projectId || initialData.projectId,

      floorNumber: floorNumberFromSer ?? initialData.floorNumber ?? 1,
    },
  });

  // ==========================================================
  // SYNC PROPS
  // ==========================================================

  useEffect(() => {
    if (projectId) {
      setValue("projectId", projectId);
    }
  }, [projectId, setValue]);

  useEffect(() => {
    if (floorNumberFromSer !== undefined) {
      setValue("floorNumber", floorNumberFromSer);
    }
  }, [floorNumberFromSer, setValue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isCancelledRef.current = true;

      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, []);

  // ==========================================================
  // WATCH FORM VALUES
  // ==========================================================

  const bedrooms =
    useWatch({
      control,
      name: "bedrooms",
    }) || 0;

  const bathrooms =
    useWatch({
      control,
      name: "bathrooms",
    }) || 0;

  const kitchen = useWatch({
    control,
    name: "kitchen",
  });

  const livingRoom = useWatch({
    control,
    name: "livingRoom",
  });

  const accessibility = useWatch({
    control,
    name: "accessibility",
  });

  const roomTypes =
    useWatch({
      control,
      name: "roomTypes",
    }) || [];

  const specialRooms =
    useWatch({
      control,
      name: "specialRooms",
    }) || [];

  const constraints =
    useWatch({
      control,
      name: "constraints",
    }) || [];

  const floorName =
    useWatch({
      control,
      name: "floorName",
    }) || "Floor";

  const floorNumber =
    useWatch({
      control,
      name: "floorNumber",
    }) ??
    floorNumberFromSer ??
    1;

  const totalArea =
    useWatch({
      control,
      name: "totalArea",
    }) || 0;

  // ==========================================================
  // TAG INPUT STATE
  // ==========================================================

  const [newRoomType, setNewRoomType] = useState("");

  const [newSpecialRoom, setNewSpecialRoom] = useState("");

  const [newConstraint, setNewConstraint] = useState("");

  // ==========================================================
  // TAG HELPERS
  // ==========================================================

  const addTag = (
    field: "roomTypes" | "specialRooms" | "constraints",
    value: string,
    setter: (value: string) => void,
  ) => {
    const cleanValue = value.trim();

    if (!cleanValue) {
      return;
    }

    const current =
      field === "roomTypes" ? roomTypes : field === "specialRooms" ? specialRooms : constraints;

    if (!current.includes(cleanValue)) {
      const updated = [...current, cleanValue];

      setValue(field, updated);

      if (field === "roomTypes") {
        setValue("roomCount", updated.length);
      }
    }

    setter("");
  };

  const removeTag = (field: "roomTypes" | "specialRooms" | "constraints", itemToRemove: string) => {
    const current =
      field === "roomTypes" ? roomTypes : field === "specialRooms" ? specialRooms : constraints;

    const updated = current.filter((item) => item !== itemToRemove);

    setValue(field, updated);

    if (field === "roomTypes") {
      setValue("roomCount", updated.length);
    }
  };

  // ==========================================================
  // POLL FOR SVG (/api/v1/floor/draft)
  // ==========================================================

  const startPollingForSvg = useCallback((floorId: string) => {
    isCancelledRef.current = false;

    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }

    let attempts = 0;

    setIsPolling(true);
    setPollCount(0);
    setPollError(null);

    const checkDraft = async () => {
      if (isCancelledRef.current) {
        console.log("🛑 Polling cancelled");
        return;
      }

      attempts += 1;
      setPollCount(attempts);

      console.log(`🔄 Draft polling attempt ${attempts}/${MAX_ATTEMPTS}`);

      try {
        const url =
          `/api/v1/floor/draft` + `?floorId=${encodeURIComponent(floorId)}` + `&t=${Date.now()}`;

        console.log("📡 Calling:", url);

        const response = await axios.get(url, {
          timeout: 5000,
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        const data = response.data?.data;

        console.log("📨 Poll response:", data);
        console.log("📡 Draft status:", data?.status);

        // ------------------------------------------------------
        // COMPLETED
        // ------------------------------------------------------
        if (data?.status === "COMPLETED" && data?.svgCode) {
          console.log("🎯 SVG RECEIVED:", data.svgCode.length, "characters");

          setSvgCode(data.svgCode);
          setIsPolling(false);
          setPollError(null);

          if (pollTimerRef.current) {
            clearTimeout(pollTimerRef.current);
            pollTimerRef.current = null;
          }

          toast.add({
            type: "success",
            title: "Blueprint Ready",
            description: "CAD vector blueprint received successfully.",
          });

          return;
        }

        // ------------------------------------------------------
        // FAILED
        // ------------------------------------------------------
        if (data?.status === "FAILED") {
          console.error("❌ Blueprint generation failed");

          setIsPolling(false);
          setPollError(data?.error || "Blueprint generation failed. Please try again.");

          if (pollTimerRef.current) {
            clearTimeout(pollTimerRef.current);
            pollTimerRef.current = null;
          }

          toast.add({
            type: "error",
            title: "Draft Failed",
            description: data?.error || "Blueprint generation failed. Please try again.",
          });

          return;
        }

        console.log(`⏳ Draft not ready yet: ${data?.status || "UNKNOWN"}`);
      } catch (error) {
        console.error(`❌ Polling error on attempt ${attempts}:`, error);
      }

      // ------------------------------------------------------
      // MAX ATTEMPTS REACHED (10 checks)
      // ------------------------------------------------------
      if (attempts >= MAX_ATTEMPTS) {
        console.log("⏰ Maximum polling attempts reached");

        setIsPolling(false);
        setPollError("Blueprint is still being generated. Click 'Get Draft' to check again.");

        if (pollTimerRef.current) {
          clearTimeout(pollTimerRef.current);
          pollTimerRef.current = null;
        }

        toast.add({
          type: "error",
          title: "Draft Still Processing",
          description: "No SVG received after 10 checks. You can check again using 'Get Draft'.",
        });

        return;
      }

      // Schedule next poll
      pollTimerRef.current = setTimeout(checkDraft, INTERVAL_MS);
    };

    checkDraft();
  }, []);

  // ==========================================================
  // QUEUE GET DRAFT
  // ==========================================================

  const executeGetDraft = useCallback(
    async (floorId: string, versionId: string) => {
      setPollError(null);
      setSvgCode(null);

      try {
        console.log("📤 Queueing floor draft...");

        const response = await axios.post("/api/v1/floor/get-draft", {
          projectId: projectId || initialData.projectId,
          floorId,
          versionId,
        });

        const jobId = response.data?.data?.jobId;

        console.log("📥 Queue response:", response.data);

        if (jobId === null || jobId === undefined) {
          throw new Error("Failed to queue blueprint job");
        }

        console.log("📤 Draft job:", jobId);

        startPollingForSvg(floorId);
      } catch (error: unknown) {
        console.error("❌ Failed to queue draft:", error);

        setIsPolling(false);

        const message =
          (
            error as {
              response?: {
                data?: {
                  message?: string;
                };
              };
            }
          )?.response?.data?.message ||
          (error instanceof Error ? error.message : "Failed to push draft to queue.");

        setPollError(message);

        toast.add({
          type: "error",
          title: "Queue Failed",
          description: message,
        });
      }
    },
    [initialData.projectId, projectId, startPollingForSvg],
  );

  // ==========================================================
  // SAVE REQUIREMENTS (WITH DYNAMIC CUID2 GENERATION)
  // ==========================================================

  const handleFormSubmit = useCallback(
    async (data: FloorRequirementsData) => {
      setIsSubmitting(true);

      try {
        // 🛡️ Generate a valid CUID2 versionId if empty
        const versionId = data.versionId?.trim() || createId();

        const payload = {
          ...data,

          projectId: projectId || data.projectId,

          versionId,

          floorNumber: floorNumberFromSer ?? data.floorNumber ?? 1,

          asyncJobType: "get-draft",

          asyncJobStatus: "PENDING",
        };

        console.log("📤 FLOOR SAVE PAYLOAD:", payload);

        const response = await axios.post("/api/v1/floor", payload);

        console.log("✅ FLOOR SAVE RESPONSE:", response.data);

        if (!response.data?.data) {
          throw new Error("Floor requirements save returned empty response");
        }

        const floor = response.data.data.floor;
        const floorVersion = response.data.data.floorVersion;

        if (!floor?.id || !floorVersion?.id) {
          throw new Error("Floor or floor version was not returned by server");
        }

        setSavedMeta({
          floorId: floor.id,
          versionId: floorVersion.id,
        });

        setIsRequirementsSaved(true);

        toast.add({
          type: "success",
          title: `${data.floorName || "Floor"} Requirements Locked`,
          description: "Requirements saved. Generating blueprint draft...",
        });

        if (onSubmit) {
          await onSubmit({
            ...payload,
            versionId,
          });
        }

        console.log("🚀 Starting draft generation:", {
          floorId: floor.id,
          versionId: floorVersion.id,
        });

        await executeGetDraft(floor.id, floorVersion.id);
      } catch (error: unknown) {
        console.error("❌ FLOOR SAVE FAILED:", error);

        if (axios.isAxiosError(error)) {
          console.error("❌ FLOOR SAVE STATUS:", error.response?.status);
          console.error("❌ FLOOR SAVE RESPONSE:", error.response?.data);
          console.error("❌ FLOOR SAVE PAYLOAD:", error.config?.data);
        }

        const serverMessage =
          (
            error as {
              response?: {
                data?: {
                  message?: string;
                };
              };
            }
          )?.response?.data?.message ||
          "Could not register floor requirements. Please check your inputs and try again.";

        toast.add({
          type: "error",
          title: `${data.floorName || "Floor"} Setup Failed`,
          description: serverMessage,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [executeGetDraft, floorNumberFromSer, onSubmit, projectId],
  );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 mb-2">
      <Accordion defaultValue={[`floor-${floorNumber}`]} className="space-y-4">
        <AccordionItem
          value={`floor-${floorNumber}`}
          className="rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl shadow-2xl transition-all overflow-hidden data-[state=open]:border-emerald-500/40"
        >
          {/* Hidden Project ID */}
          <input type="hidden" {...register("projectId")} value={projectId} />

          {/* Trigger */}
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-900/40 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-4 w-full text-left pr-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-100 text-base">{floorName}</h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                      Level {floorNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {bedrooms} Bed • {bathrooms} Bath • {totalArea} sq.ft
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex text-xs px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono">
                  {svgCode
                    ? "SVG READY"
                    : isPolling
                      ? `CHECKING (${pollCount}/10)`
                      : isRequirementsSaved
                        ? "SAVED"
                        : "DRAFT IDLE"}
                </span>
              </div>
            </div>
          </AccordionTrigger>

          {/* Content */}
          <AccordionContent className="px-6 pb-6 pt-2 border-t border-slate-800/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleSubmit(handleFormSubmit)(e);
              }}
              className="space-y-6 pt-4"
            >
              {/* Basic Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Floor Name</label>
                  <input
                    {...register("floorName")}
                    disabled={isRequirementsSaved}
                    className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/60 transition disabled:opacity-60"
                    placeholder="e.g. Ground Floor, First Floor"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Level / Floor Number</label>
                  <input
                    type="number"
                    disabled={isRequirementsSaved}
                    {...register("floorNumber", {
                      valueAsNumber: true,
                    })}
                    className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/60 transition disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Estimated Budget ($ / ₹)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="number"
                      disabled={isRequirementsSaved}
                      {...register("budget", {
                        valueAsNumber: true,
                      })}
                      className="w-full h-10 pl-9 pr-3 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500/60 transition disabled:opacity-60"
                      placeholder="850000"
                    />
                  </div>
                </div>
              </div>

              {/* Counters & Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
                {/* Bedrooms */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                    <Bed className="h-4 w-4 text-emerald-400" /> Bedrooms
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isRequirementsSaved}
                      className="h-8 w-8 p-0 rounded-lg border-slate-700 bg-slate-800 text-slate-200 disabled:opacity-50"
                      onClick={() => setValue("bedrooms", Math.max(0, bedrooms - 1))}
                    >
                      -
                    </Button>
                    <span className="font-mono text-base font-semibold text-slate-100 min-w-6 text-center">
                      {bedrooms}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isRequirementsSaved}
                      className="h-8 w-8 p-0 rounded-lg border-slate-700 bg-slate-800 text-slate-200 disabled:opacity-50"
                      onClick={() => setValue("bedrooms", bedrooms + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Bathrooms */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                    <Bath className="h-4 w-4 text-cyan-400" /> Bathrooms
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isRequirementsSaved}
                      className="h-8 w-8 p-0 rounded-lg border-slate-700 bg-slate-800 text-slate-200 disabled:opacity-50"
                      onClick={() => setValue("bathrooms", Math.max(0, bathrooms - 1))}
                    >
                      -
                    </Button>
                    <span className="font-mono text-base font-semibold text-slate-100 min-w-6 text-center">
                      {bathrooms}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isRequirementsSaved}
                      className="h-8 w-8 p-0 rounded-lg border-slate-700 bg-slate-800 text-slate-200 disabled:opacity-50"
                      onClick={() => setValue("bathrooms", bathrooms + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Kitchen + Living Room */}
                <div className="flex flex-col justify-center space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                      <UtensilsCrossed className="h-3.5 w-3.5 text-amber-400" /> Kitchen
                    </span>
                    <input
                      type="checkbox"
                      disabled={isRequirementsSaved}
                      checked={kitchen}
                      onChange={(event) => setValue("kitchen", event.target.checked)}
                      className="h-4 w-4 rounded accent-emerald-500 bg-slate-800 border-slate-700 cursor-pointer disabled:opacity-50"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                      <Sofa className="h-3.5 w-3.5 text-indigo-400" /> Living Room
                    </span>
                    <input
                      type="checkbox"
                      disabled={isRequirementsSaved}
                      checked={livingRoom}
                      onChange={(event) => setValue("livingRoom", event.target.checked)}
                      className="h-4 w-4 rounded accent-emerald-500 bg-slate-800 border-slate-700 cursor-pointer disabled:opacity-50"
                    />
                  </label>
                </div>

                {/* Accessibility */}
                <div className="flex flex-col justify-center">
                  <label className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
                    <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <div>
                        <div>Accessible</div>
                        <div className="text-[10px] text-slate-500 font-normal">Barrier-free</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      disabled={isRequirementsSaved}
                      checked={accessibility}
                      onChange={(event) => setValue("accessibility", event.target.checked)}
                      className="h-4 w-4 rounded accent-emerald-500 bg-slate-800 border-slate-700 cursor-pointer disabled:opacity-50"
                    />
                  </label>
                </div>
              </div>

              {/* Room Types */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300">
                    Room Allocations ({roomTypes.length} spaces)
                  </label>
                  <span className="text-[11px] text-slate-500">Press enter or click Add</span>
                </div>

                <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 min-h-[50px] items-center">
                  {roomTypes.map((room) => (
                    <span
                      key={room}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-800/90 text-slate-200 border border-slate-700/80"
                    >
                      {room}
                      {!isRequirementsSaved && (
                        <button
                          type="button"
                          onClick={() => removeTag("roomTypes", room)}
                          className="text-slate-400 hover:text-rose-400 transition"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  ))}

                  {!isRequirementsSaved && (
                    <div className="flex items-center gap-1.5 ml-auto">
                      <input
                        value={newRoomType}
                        onChange={(event) => setNewRoomType(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addTag("roomTypes", newRoomType, setNewRoomType);
                          }
                        }}
                        placeholder="Add room..."
                        className="h-7 w-28 text-xs bg-transparent text-slate-200 placeholder:text-slate-500 focus:outline-none focus:w-36 transition-all"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addTag("roomTypes", newRoomType, setNewRoomType)}
                        className="h-7 px-2 text-xs text-emerald-400 hover:bg-emerald-500/10"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Rooms */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Special Purpose Rooms</label>
                <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 min-h-[50px] items-center">
                  {specialRooms.map((special) => (
                    <span
                      key={special}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                    >
                      <Sparkles className="h-3 w-3 text-emerald-400" />
                      {special}
                      {!isRequirementsSaved && (
                        <button
                          type="button"
                          onClick={() => removeTag("specialRooms", special)}
                          className="text-emerald-400 hover:text-rose-400 transition"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  ))}

                  {!isRequirementsSaved && (
                    <div className="flex items-center gap-1.5 ml-auto">
                      <input
                        value={newSpecialRoom}
                        onChange={(event) => setNewSpecialRoom(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addTag("specialRooms", newSpecialRoom, setNewSpecialRoom);
                          }
                        }}
                        placeholder="e.g. Pooja Room..."
                        className="h-7 w-32 text-xs bg-transparent text-slate-200 placeholder:text-slate-500 focus:outline-none focus:w-40 transition-all"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addTag("specialRooms", newSpecialRoom, setNewSpecialRoom)}
                        className="h-7 px-2 text-xs text-emerald-400 hover:bg-emerald-500/10"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Constraints */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Constraints & Setbacks</label>
                <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 min-h-[50px] items-center">
                  {constraints.map((constraint) => (
                    <span
                      key={constraint}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-800/60 text-slate-300 border border-slate-700/60"
                    >
                      <Ruler className="h-3 w-3 text-cyan-400" />
                      {constraint}
                      {!isRequirementsSaved && (
                        <button
                          type="button"
                          onClick={() => removeTag("constraints", constraint)}
                          className="text-slate-400 hover:text-rose-400 transition"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  ))}

                  {!isRequirementsSaved && (
                    <div className="flex items-center gap-1.5 ml-auto">
                      <input
                        value={newConstraint}
                        onChange={(event) => setNewConstraint(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addTag("constraints", newConstraint, setNewConstraint);
                          }
                        }}
                        placeholder="e.g. Front setback 3.0m..."
                        className="h-7 w-36 text-xs bg-transparent text-slate-200 placeholder:text-slate-500 focus:outline-none focus:w-44 transition-all"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addTag("constraints", newConstraint, setNewConstraint)}
                        className="h-7 px-2 text-xs text-emerald-400 hover:bg-emerald-500/10"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-400" />
                  <label className="text-xs font-medium text-slate-300">
                    Design Directives & Notes
                  </label>
                </div>
                <textarea
                  {...register("notes")}
                  disabled={isRequirementsSaved}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 transition resize-none disabled:opacity-60"
                  placeholder="Ensure cross-ventilation, specify daylight angles..."
                />
              </div>

              {/* Action Row */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-xs font-mono text-slate-500">
                  Plot: {initialData.plotWidth}ft × {initialData.plotHeight}ft ({totalArea} sq.ft)
                </span>

                <div className="flex items-center gap-3">
                  {/* Save Requirements Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || isPolling || isRequirementsSaved}
                    className={`font-medium px-4 rounded-xl transition-all flex items-center gap-2 ${
                      isRequirementsSaved
                        ? "bg-slate-900 text-emerald-400/80 border border-emerald-500/30 cursor-not-allowed opacity-90"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-100"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : isRequirementsSaved ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        Requirements Locked
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-slate-400" />
                        Save Requirements
                      </>
                    )}
                  </Button>

                  {/* Get Draft Button */}
                  <Button
                    type="button"
                    onClick={() => {
                      if (savedMeta?.floorId && savedMeta?.versionId) {
                        executeGetDraft(savedMeta.floorId, savedMeta.versionId);
                      }
                    }}
                    disabled={!savedMeta?.floorId || !savedMeta?.versionId || isPolling}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium px-5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isPolling ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Drafting Blueprint ({pollCount}/10)...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        {svgCode ? "Regenerate Draft" : "Get Draft"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {/* Polling Visualizer */}
            {isPolling && (
              <div className="mt-6 p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md text-center space-y-3">
                <Loader2 className="h-7 w-7 text-emerald-400 animate-spin mx-auto" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">
                    Drafting Blueprint with Gemini AI...
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Checking for SVG in database (Attempt {pollCount}/{MAX_ATTEMPTS})
                  </p>
                </div>
                <div className="w-56 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{
                      width: `${Math.min(pollCount / MAX_ATTEMPTS, 1) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Polling Error Alert */}
            {pollError && !isPolling && (
              <div className="mt-6 p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-slate-200 text-xs flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <span>{pollError}</span>
              </div>
            )}

            {/* SVG Blueprint Viewer */}
            {svgCode && (
              <div className="mt-6">
                <FloorPlanSvgBox
                  svgCode={svgCode}
                  title={`${floorName} Blueprint`}
                  floorNumber={floorNumber}
                  plotWidth={initialData.plotWidth}
                  plotHeight={initialData.plotHeight}
                  totalArea={totalArea}
                />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
