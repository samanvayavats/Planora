"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSession } from "next-auth/react";
import { DEMO_PRESETS, DEMO_RESET_FOR_PROJECT } from "@/lib/sample-data/projectconfig.sample-data";
import {
  Building2,
  Compass,
  Ruler,
  Sparkles,
  Maximize2,
  Wand2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import PlotShapeDrawerModal, { Point } from "./plotShapeDrawerModal";
import { PlotConfigurationSchemaPlotConfigurationSchemaCombined } from "@/schema/v1/project/project.schema";

export interface ProjectPlotFormData {
  userId: string;
  title: string;
  description: string;
  buildingType: "residential" | "commercial" | "mixed";
  totalFloors: number;
  activeFloorNumber: number;
  status: "draft" | "approved" | "archived";
  isPublic?: boolean;
  shapeType: string;
  width: number;
  height: number;
  secondWidth?: number;
  secondHeight?: number;
  totalArea: number;
  customPoints?: Point[];
  northFacing: boolean;
  cornerPlot: boolean;
  slopedPlot: boolean;
  obstacles?: string;
  plotImageUrl?: string;
}

interface ProjectConfigFormProps {
  onSave?: (data: ProjectPlotFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<ProjectPlotFormData>;
}

export default function ProjectConfigForm({
  onSave,
  onCancel,
  initialData,
}: ProjectConfigFormProps) {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [presetIndex, setPresetIndex] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProjectPlotFormData>({
    resolver: (zodResolver as unknown as (schema: unknown) => Resolver<ProjectPlotFormData>)(
      PlotConfigurationSchemaPlotConfigurationSchemaCombined,
    ),
    defaultValues: {
      userId: session?.user?.id || "",
      title: initialData?.title || "",
      description: initialData?.description || "",
      buildingType: initialData?.buildingType || "residential",
      totalFloors: initialData?.totalFloors || 2,
      activeFloorNumber: initialData?.activeFloorNumber || 1,
      status: initialData?.status || "draft",
      isPublic: initialData?.isPublic || false,
      shapeType: initialData?.shapeType || "rectangular",
      width: initialData?.width || 40,
      height: initialData?.height || 50,
      totalArea: initialData?.totalArea || 2000,
      customPoints: initialData?.customPoints || [],
      northFacing: initialData?.northFacing ?? true,
      cornerPlot: initialData?.cornerPlot ?? false,
      slopedPlot: initialData?.slopedPlot ?? false,
      obstacles: initialData?.obstacles || "",
      plotImageUrl: initialData?.plotImageUrl || "",
    },
  });

  // Watchers
  const width = useWatch({ control, name: "width" });
  const height = useWatch({ control, name: "height" });
  const shapeType = useWatch({ control, name: "shapeType" });
  const totalFloors = useWatch({ control, name: "totalFloors" });
  const activeFloorNumber = useWatch({ control, name: "activeFloorNumber" });
  const customPoints = (useWatch({ control, name: "customPoints" }) as Point[]) || [];
  const totalArea = useWatch({ control, name: "totalArea" });

  // Auto-calculate Total Area when width/height change for rectangular & square
  useEffect(() => {
    if (shapeType === "rectangular" || shapeType === "square") {
      const w = Number(width) || 0;
      const h = Number(height) || 0;
      if (w > 0 && h > 0) {
        setValue("totalArea", Math.round(w * h), { shouldValidate: true });
      }
    }
  }, [width, height, shapeType, setValue]);

  // Ensure activeFloor does not exceed totalFloors safely
  useEffect(() => {
    if (totalFloors && activeFloorNumber > totalFloors) {
      setValue("activeFloorNumber", totalFloors, { shouldValidate: true });
    }
  }, [totalFloors, activeFloorNumber, setValue]);

  const handleShapeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setValue("shapeType", selected);
    if (selected === "custom") {
      setIsDrawerOpen(true);
    }
  };

  const handleAutoFill = () => {
    if (!DEMO_PRESETS || DEMO_PRESETS.length === 0) return;
    const selectedPreset = DEMO_PRESETS[presetIndex % DEMO_PRESETS.length];
    setPresetIndex((prev) => prev + 1);
    reset(selectedPreset);
  };

  const handleReset = () => {
    if (!DEMO_RESET_FOR_PROJECT || DEMO_RESET_FOR_PROJECT.length === 0) return;
    reset(DEMO_RESET_FOR_PROJECT[0]);
  };

  const handleApplyCustomShape = (result: { points: Point[]; area: number; perimeter: number }) => {
    setValue("customPoints", result.points, { shouldValidate: true });
    setValue("totalArea", result.area, { shouldValidate: true });
    setValue("shapeType", "custom");
    setIsDrawerOpen(false);
  };

  const onSubmit = async (data: ProjectPlotFormData) => {
    if (!session?.user?.id) {
      setServerError("You must be logged in to create a project.");
      return;
    }
    data.userId = session.user.id;
    setServerError(null);
    try {
      const res = await axios.post("/api/v1/project", data);
      if (onSave) {
        await onSave(res.data);
      }
      toast.add({
        type: "success",
        title: "Blueprint Initialized",
        description: "Plot boundaries and project specs saved. Ready for floor plan zoning.",
      });

      if (res.data.data?.id || res.data.data?.projectId) {
        router.push(`/create-floor/${res.data.data.projectId}`);
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const serverMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          (typeof err.response?.data === "string" ? err.response.data : null);
        setServerError(serverMessage || err.message || "Failed to create project.");
        toast.add({
          type: "error",
          title: "Blueprint Initialization Failed",
          description: err.message || "Failed to create project.",
        });
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("An unexpected error occurred while saving.");
      }
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl rounded-3xl border-2 border-slate-900 bg-slate-950 p-6 sm:p-10 text-slate-100 shadow-2xl my-6">
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-900 pb-5 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            <h2 className="font-playfair text-2xl font-bold text-white sm:text-3xl">
              Project &amp; Plot Configuration
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Define architectural parameters, dimensions, and zoning rules for AI blueprint
            generation.
          </p>
        </div>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="mb-6 flex items-center space-x-2.5 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3.5 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ================= SECTION 1: PROJECT METADATA ================= */}
        <div className="space-y-4 rounded-2xl border border-slate-900 bg-slate-900/40 p-6">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <Building2 className="h-4 w-4" />
            <span>1. Project Metadata</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Title */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-slate-300">Project Name / Title *</label>
              <input
                {...register("title")}
                placeholder="e.g. Modern Sunset Residence"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition focus:border-cyan-500 focus:outline-none"
              />
              {errors.title && <p className="text-[11px] text-rose-400">{errors.title.message}</p>}
            </div>

            {/* Description (Textarea) */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-slate-300">Describe your project *</label>
              <textarea
                rows={3}
                {...register("description")}
                placeholder="Describe your design vision, living requirements, number of occupants, or style preferences..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 text-sm text-white placeholder-slate-500 transition focus:border-cyan-500 focus:outline-none"
              />
              {errors.description && (
                <p className="text-[11px] text-rose-400">{errors.description.message}</p>
              )}
            </div>

            {/* Building Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Project Type *</label>
              <select
                {...register("buildingType")}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2.5 text-sm text-white transition focus:border-cyan-500 focus:outline-none"
              >
                <option value="residential">Residential (Villa / House)</option>
                <option value="commercial">Commercial (Office / Retail)</option>
                <option value="mixed">Mixed-Use Development</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Project Status</label>
              <select
                {...register("status")}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2.5 text-sm text-white transition focus:border-cyan-500 focus:outline-none"
              >
                <option value="draft">Draft Planning</option>
                <option value="approved">Approved</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Total Floors */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Total Floors *</label>
              <input
                type="number"
                min="1"
                max="50"
                {...register("totalFloors", { valueAsNumber: true })}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2.5 text-sm text-white transition focus:border-cyan-500 focus:outline-none"
              />
              {errors.totalFloors && (
                <p className="text-[11px] text-rose-400">{errors.totalFloors.message}</p>
              )}
            </div>

            {/* Active Floor Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Initial Working Floor *</label>
              <input
                type="number"
                min="1"
                max={totalFloors || 1}
                {...register("activeFloorNumber", { valueAsNumber: true })}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2.5 text-sm text-white transition focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2 border-t border-slate-900">
            <input
              type="checkbox"
              id="isPublic"
              {...register("isPublic")}
              className="h-4 w-4 rounded border-slate-800 bg-slate-900 accent-cyan-400"
            />
            <label htmlFor="isPublic" className="text-xs text-slate-400 cursor-pointer">
              Make blueprint publicly visible in gallery
            </label>
          </div>
        </div>

        {/* ================= SECTION 2: PLOT & SHAPE ================= */}
        <div className="space-y-4 rounded-2xl border border-slate-900 bg-slate-900/40 p-6">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <Ruler className="h-4 w-4" />
            <span>2. Plot Geometry &amp; Shape</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-3">
              <label className="text-xs font-medium text-slate-300">Plot Boundary Shape *</label>
              <select
                value={shapeType}
                onChange={handleShapeChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2.5 text-sm text-white transition focus:border-cyan-500 focus:outline-none"
              >
                <option value="rectangular">Rectangular (Standard)</option>
                <option value="square">Square</option>
                <option value="l-shaped">L-Shaped Plot</option>
                <option value="custom">✦ Custom Polygon (Draw on Graph)</option>
              </select>
            </div>

            {/* Custom Shape Drawer Trigger Card */}
            {shapeType === "custom" && (
              <div className="sm:col-span-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-cyan-500/40 bg-cyan-950/20 p-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <Maximize2 className="h-4 w-4 text-cyan-400" />
                    <p className="text-xs font-semibold text-cyan-300">Custom CAD Boundary Mode</p>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {customPoints.length >= 3
                      ? `✓ Defined ${customPoints.length} vertices • Total Calculated Area: ${totalArea || 0} sq.ft`
                      : "Click below to pop out the grid drawer and define your plot vertices."}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="planaoraButton"
                  onClick={() => setIsDrawerOpen(true)}
                  className="px-4 py-2 text-xs shrink-0"
                >
                  {customPoints.length >= 3 ? "Re-open Graph Drawer" : "Open Graph Drawer"}
                </Button>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Primary Width (ft) {shapeType === "custom" && "(Bound)"}
              </label>
              <input
                type="number"
                step="0.5"
                {...register("width", { valueAsNumber: true })}
                disabled={shapeType === "custom"}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-white disabled:opacity-50"
              />
              {errors.width && <p className="text-[11px] text-rose-400">{errors.width.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Primary Depth (ft) {shapeType === "custom" && "(Bound)"}
              </label>
              <input
                type="number"
                step="0.5"
                {...register("height", { valueAsNumber: true })}
                disabled={shapeType === "custom"}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-white disabled:opacity-50"
              />
              {errors.height && (
                <p className="text-[11px] text-rose-400">{errors.height.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Total Area (sq.ft) *</label>
              <input
                type="number"
                {...register("totalArea", { valueAsNumber: true })}
                readOnly={shapeType === "custom"}
                className="w-full rounded-xl border border-cyan-500/30 bg-cyan-950/20 px-3 py-2 text-sm font-mono text-cyan-300"
              />
              {errors.totalArea && (
                <p className="text-[11px] text-rose-400">{errors.totalArea.message}</p>
              )}
            </div>

            {shapeType === "l-shaped" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Cutout Width (ft)</label>
                  <input
                    type="number"
                    step="0.5"
                    {...register("secondWidth", { valueAsNumber: true })}
                    placeholder="e.g. 15"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Cutout Depth (ft)</label>
                  <input
                    type="number"
                    step="0.5"
                    {...register("secondHeight", { valueAsNumber: true })}
                    placeholder="e.g. 20"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-white"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* ================= SECTION 3: ATTRIBUTES ================= */}
        <div className="space-y-4 rounded-2xl border border-slate-900 bg-slate-900/40 p-6">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <Compass className="h-4 w-4" />
            <span>3. Orientation &amp; Terrain Attributes</span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="flex cursor-pointer items-center space-x-2.5 rounded-xl border border-slate-800 bg-slate-900/50 p-3 transition hover:border-slate-700">
              <input
                type="checkbox"
                {...register("northFacing")}
                className="h-4 w-4 rounded border-slate-800 bg-slate-900 accent-cyan-400"
              />
              <span className="text-xs font-medium text-slate-200">North Facing Plot</span>
            </label>

            <label className="flex cursor-pointer items-center space-x-2.5 rounded-xl border border-slate-800 bg-slate-900/50 p-3 transition hover:border-slate-700">
              <input
                type="checkbox"
                {...register("cornerPlot")}
                className="h-4 w-4 rounded border-slate-800 bg-slate-900 accent-cyan-400"
              />
              <span className="text-xs font-medium text-slate-200">Corner Plot (Dual Road)</span>
            </label>

            <label className="flex cursor-pointer items-center space-x-2.5 rounded-xl border border-slate-800 bg-slate-900/50 p-3 transition hover:border-slate-700">
              <input
                type="checkbox"
                {...register("slopedPlot")}
                className="h-4 w-4 rounded border-slate-800 bg-slate-900 accent-cyan-400"
              />
              <span className="text-xs font-medium text-slate-200">Sloped / Uneven Terrain</span>
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Site Obstacles or Notes</label>
            <textarea
              rows={2}
              {...register("obstacles")}
              placeholder="e.g. Existing tree on North-East corner..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs text-white placeholder-slate-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end border-t border-slate-900">
          {onCancel && (
            <Button type="button" onClick={onCancel} variant="default" className="p-5">
              Cancel
            </Button>
          )}

          <Button
            type="button"
            onClick={handleAutoFill}
            variant="ghost"
            className="p-5 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/40 hover:text-white"
          >
            <Wand2 className="h-4 w-4 mr-2 text-cyan-400" />
            <span>Auto-Fill Demo</span>
          </Button>

          <Button type="button" onClick={handleReset} variant="planaoraButton" className="p-5">
            Reset Form
          </Button>

          {/* Submit with Loading State */}
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="planaoraButton"
            className="p-5 min-w-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span>Creating Project...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                <span>Save &amp; Generate Blueprint</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Pop-Out CAD Drawer */}
      <PlotShapeDrawerModal
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        initialPoints={customPoints}
        onApply={handleApplyCustomShape}
      />
    </div>
  );
}
