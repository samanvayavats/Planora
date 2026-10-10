"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserProjectsAccordion from "@/components/project/userProjectsAccordion";
import NotAuthenticated from "@/components/ui/not-authenticated";

export interface UserProjectItem {
  id: string;
}

export interface UserApiResponse {
  message: string;
  data: UserProjectItem[];
}

export default function Page() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<UserProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const requestUserProjects = async () => {
    const response = await axios.get<UserApiResponse>("http://localhost:3000/api/v1/user");
    return response.data?.data || [];
  };

  // ==========================================================
  // FETCH USER PROJECTS ON THE PAGE
  // ==========================================================
  const fetchUserProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setProjects(await requestUserProjects());
    } catch (err: unknown) {
      console.error("❌ Failed to fetch user projects:", err);
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Could not retrieve user projects.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    if (status === "authenticated") {
      requestUserProjects()
        .then((userProjects) => {
          if (isActive) setProjects(userProjects);
        })
        .catch((err: unknown) => {
          console.error("❌ Failed to fetch user projects:", err);
          const message =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Could not retrieve user projects.";
          if (isActive) setError(message);
        })
        .finally(() => {
          if (isActive) setIsLoading(false);
        });
    }

    return () => {
      isActive = false;
    };
  }, [status]);

  // Session Loading
  if (status === "loading") {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Authenticating Planora session...</p>
        </div>
      </main>
    );
  }

  // Not Authenticated
  if (status === "unauthenticated" || !session) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <NotAuthenticated
          title="Project Dashboard Locked"
          description="You must be signed in to access your architectural projects, floor configurations, and vector blueprints."
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">Project Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">
              Browse your registered architectural developments and inspect generated floor
              blueprints.
            </p>
          </div>

          <Button
            onClick={fetchUserProjects}
            variant="outline"
            size="sm"
            className="border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs rounded-xl"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="h-8 w-8 text-emerald-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-mono">
              Loading projects from user account...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-950/20 text-center space-y-3">
            <AlertCircle className="h-7 w-7 text-rose-400 mx-auto" />
            <p className="text-xs text-slate-300">{error}</p>
            <Button
              onClick={fetchUserProjects}
              size="sm"
              className="bg-slate-900 border border-slate-800 text-xs"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Projects Accordion */}
        {!isLoading && !error && <UserProjectsAccordion projects={projects} />}
      </div>
    </main>
  );
}
