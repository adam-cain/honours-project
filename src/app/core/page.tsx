import { Suspense } from "react";
import Card from "@/components/organisation/card";

export default function Overview() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <h1>Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <Card name={"Liverpool University"} description={""} logo={""} />
      </div>
    </Suspense>
  );
}