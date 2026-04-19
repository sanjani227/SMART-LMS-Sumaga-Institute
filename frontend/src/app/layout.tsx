/**
 * ========== FRONTEND ROOT LAYOUT ==========
 * File: frontend/src/app/layout.tsx
 * Purpose: Next.js root layout with global styles and user context provider
 * 
 * @section Imports & Configuration
 */
import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "../context/userContext";

export const metadata: Metadata = {
  title: "LMS Portal",
  description: "Learning Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
