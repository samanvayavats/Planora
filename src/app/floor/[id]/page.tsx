"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import GetParticularFloorAllData from "@/components/floor/getParticularFloorAllData";
import NotAuthenticated from "@/components/ui/not-authenticated";

const Page = () => {
  const { data: session, status } = useSession();
  const params = useParams();
  const searchParams = useSearchParams();

  const floorId: string = (params?.id as string) || (searchParams.get("id") as string);

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
          title="Floor Blueprint Locked"
          description="You must be signed in to inspect this floor's CAD vector layout and construction feasibility specs."
        />
      </main>
    );
  }

  return (
    <div>
      <GetParticularFloorAllData floorId={floorId} />
    </div>
  );
};

export default Page;
