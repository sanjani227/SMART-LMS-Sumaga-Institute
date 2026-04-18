import { Suspense } from "react";
import ChildProgressContent from "./ChildProgressContent";

export default function ChildProgress() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ChildProgressContent />
    </Suspense>
  );
}
