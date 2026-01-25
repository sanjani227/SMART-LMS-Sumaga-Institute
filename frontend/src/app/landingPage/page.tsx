"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col font-sans w-full">
      {/* --- NAVBAR --- */}

      <nav className="flex items-center justify-between  py-4 bg-white border-b border-gray-100  ">
        <div className="flex items-center gap-2">
          {/* Logo - Replace with your actual logo image path */}
          <div className="w-12 h-12 relative">
            <Image
              src="/logo.png"
              alt="Sumaga Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold text-gray-800">
            Sumaga Institute
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <Link href="/" className="hover:text-orange-500">
            Home
          </Link>
          <Link href="/courses" className="hover:text-orange-500">
            Courses
          </Link>
          <Link href="/about" className="hover:text-orange-500">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-orange-500">
            Contact
          </Link>
          <Link
            href="/auth/login"
            className="bg-orange-500 text-white px-8 py-2 rounded-lg hover:bg-orange-600 transition shadow-md h-[40] w-[84] flex items-center justify-center "
          >
            Login
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="grow">
        <section className="text-center py-20 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Welcome to Sumaga Institute
          </h1>
          <p className="text-lg text-gray-600  mx-auto mb-10 leading-relaxed justify-center item-center">
            Empowering minds, shaping futures. Explore our courses and embark on
            a journey of knowledge and growth.
          </p>
          <button
            className="bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-xl shadow-lg transform transition hover:scale-105 h-14 w-40  "
            onClick={() => router.push("/dashboard")}
          >
            Get Started
          </button>
        </section>

        <div className="h-4"></div>

        {/* Hero Image */}
        <div className="w-full relative h-[400px] md:h-[500px] ">
          <Image
            src="/landing-page-image.jpg"
            alt="Group of happy students"
            fill
            className="object-cover"
            priority
          />
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-orange-500 text-white py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold mb-2">Sumaga Institute</h3>
          <p className="text-sm opacity-90">
            ©️ 2023 Sumaga Institute, Batagama. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
