"use client";
import { useParams, useSearchParams } from "next/navigation";
import GetParticularFloorAllData from "@/components/floor/getParticularFloorAllData";
const Page = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const floorId: string = (params?.id as string) || (searchParams.get("id") as string);
  return (
    <div>
      <GetParticularFloorAllData floorId={floorId} />
    </div>
  );
};

export default Page;
