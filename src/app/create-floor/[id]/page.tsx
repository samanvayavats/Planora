"use client";
import AccordionFloorForm from "@/components/floor/accordionFloorForm";
import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { AlertCircle, Loader2 } from "lucide-react";
import NotAuthenticated from "@/components/ui/not-authenticated";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = ({ params }: PageProps) => {
  const { data: session, status } = useSession();
  const { id } = use(params);

  // 1. Initialise state as a number (0) since the backend returns a count
  const [totalFloorCount, setTotalFloorCount] = useState<number>(0);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getTotalFloors = async () => {
      try {
        const res = await axios.get(`/api/v1/project/total-floor?projectId=${id}`);
        if (!res) {
          throw new Error("No floor available");
        }
        if (isMounted) {
          setServerError(null);
          const count =
            typeof res.data.data === "number" ? res.data.data : Number(res.data.data) || 0;
          setTotalFloorCount(count);
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        if (axios.isAxiosError(err)) {
          const serverMessage =
            err.response?.data?.message ||
            err.response?.data?.error ||
            (typeof err.response?.data === "string" ? err.response.data : null);
          setServerError(serverMessage || err.message || "Failed to fetch floors.");
        } else if (err instanceof Error) {
          setServerError(err.message);
        } else {
          setServerError("An unexpected error occurred while saving.");
        }
      }
    };

    if (id && status === "authenticated") {
      void getTotalFloors();
    }

    return () => {
      isMounted = false;
    };
  }, [id, status]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Authenticating session...</p>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <NotAuthenticated
          title="Floor Generator Locked"
          description="You must be signed in to configure architectural floor requirements and generate blueprints."
        />
      </main>
    );
  }

  return (
    <div>
      {serverError && (
        <div className="mb-6 flex items-center space-x-2.5 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3.5 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{serverError}</span>
        </div>
      )}

      {Array.from({ length: totalFloorCount }).map((_, index) => (
        <AccordionFloorForm floorNumberFromSer={index + 1} projectId={id} key={index} />
      ))}
    </div>
  );
};

export default Page;
