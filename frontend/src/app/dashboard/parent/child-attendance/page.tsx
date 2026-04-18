import { Suspense } from "react";
import ChildAttendanceContent from "./ChildAttendanceContent";

export default function ChildAttendancePage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ChildAttendanceContent />
    </Suspense>
  );
}
