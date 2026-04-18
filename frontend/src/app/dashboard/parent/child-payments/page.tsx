import { Suspense } from "react";
import ChildPaymentsContent from "./ChildPaymentsContent";

export default function ChildPayments() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ChildPaymentsContent />
    </Suspense>
  );
}
