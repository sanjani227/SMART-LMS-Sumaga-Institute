/**
 * ========== HOME PAGE ==========
 * File: frontend/src/app/page.tsx
 * Purpose: Landing redirect page - routes to landing page or dashboard
 * 
 * @section Redirect Logic
 */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * @component Home
 * @description Redirect users to landing page on initial load
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/landingPage");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 bg-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
