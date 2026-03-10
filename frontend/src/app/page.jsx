"use client";

import Link from "next/link";
import {
  Users, BookOpen, Trophy, MessageSquare, FileText,
  Target, Sparkles,
} from "lucide-react";

/* NAVBAR COMPONENT */
function Navbar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg sm:text-xl text-gray-900">StudBuds</span>
        </div>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/login"
            className="text-gray-700 hover:text-gray-900 font-medium transition text-sm sm:text-base"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition font-medium shadow-lg shadow-indigo-500/30 text-sm sm:text-base"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* HERO SECTION */
function Hero() {
  return (
    <section className="min-h-screen snap-start flex items-center justify-center px-4 sm:px-6 relative py-24 sm:py-0">
      <div className="text-center max-w-4xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
          Level up
          <br />
          your learning experience.
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
          A smarter way for students to connect, collaborate, and level up their
          learning, all in one place.
        </p>

        <Link
          href="/signup"
          className="inline-block px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white rounded-full hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 transition font-medium text-base sm:text-lg shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105 transform animate-horizontal-gradient"
        >
          Sign Up For Free
        </Link>
      </div>
    </section>
  );
}

/* STATS SECTION */
function StatsSection() {
  const logos = [
    { src: "/UCLA.svg", alt: "UCLA", className: "top-[8%] left-[5%] sm:top-[12%] sm:left-[10%]" },
    { src: "/UCR.svg", alt: "UCR", className: "top-[12%] right-[5%] sm:top-[18%] sm:right-[12%]" },
    { src: "/NYU.svg", alt: "NYU", className: "top-[42%] left-[2%] sm:top-[45%] sm:left-[6%]" },
    { src: "/Harvard.svg", alt: "Harvard", className: "top-[30%] right-[2%] sm:top-[28%] sm:right-[5%]" },
    { src: "/berkeley.svg", alt: "Berkeley", className: "bottom-[20%] left-[3%] sm:bottom-[22%] sm:left-[6%]" },
    { src: "/Stanford.svg", alt: "Stanford", className: "bottom-[8%] left-[38%] sm:bottom-[6%] sm:left-[44%]" },
    { src: "/Duke.svg", alt: "Duke", className: "bottom-[25%] right-[3%] sm:bottom-[28%] sm:right-[6%]" },
  ];

  return (
    <section className="min-h-screen snap-start flex items-center justify-center px-4 sm:px-6 relative py-16 sm:py-0">
      {/* University logos */}
      <div className="absolute inset-0">
        {logos.map((logo) => (
          <img
            key={logo.alt}
            src={logo.src}
            alt={logo.alt}
            className={`logo-float-1 absolute w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 hover:scale-110 transition-transform cursor-pointer ${logo.className}`}
          />
        ))}
      </div>

      {/* Stats content */}
      <div className="relative z-10 text-center">
        <p className="text-xs sm:text-sm md:text-lg text-gray-500 uppercase tracking-wide mb-3 sm:mb-4 md:mb-8">
          A growing library of
        </p>
        <div className="space-y-1 sm:space-y-2 md:space-y-4">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900">
            1,560 schools
          </h2>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900">
            25,000 students
          </h2>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900">
            16,000 courses
          </h2>
        </div>
      </div>
    </section>
  );
}

/* MISSION SECTION */
function Mission() {
  const features = [
    { icon: Users, title: "Connect", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: MessageSquare, title: "Collaborate", color: "text-purple-600", bg: "bg-purple-50" },
    { icon: BookOpen, title: "Study better", color: "text-indigo-600", bg: "bg-indigo-50" },
    { icon: FileText, title: "Share notes", color: "text-green-600", bg: "bg-green-50" },
    { icon: Trophy, title: "Stay motivated", color: "text-yellow-600", bg: "bg-yellow-50" },
    { icon: Target, title: "Set goals", color: "text-red-600", bg: "bg-red-50" },
    { icon: Sparkles, title: "Track progress", color: "text-pink-600", bg: "bg-pink-50" },
  ];

  return (
    <section className="min-h-screen snap-start flex items-center justify-center px-4 sm:px-6 relative py-16 sm:py-0">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 md:mb-12">
          Our mission
        </h2>

        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 sm:mb-14 md:mb-20 px-2">
          StudBuds was built to make studying less isolating and more
          collaborative. We help students find classmates, join study sessions,
          and stay motivated through shared progress and a touch of
          gamification. Whether you&apos;re preparing for finals or learning something
          new, StudBuds makes it easier and a lot more fun to learn together.
        </p>

        {/* Feature icons — 4-col on mobile, wraps naturally on larger */}
        <div className="grid grid-cols-4 sm:flex sm:flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-12 max-w-4xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 ${feature.bg} rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg flex items-center justify-center mb-2 sm:mb-3 transition-all group-hover:scale-110 duration-300`}
                >
                  <Icon
                    className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ${feature.color}`}
                    strokeWidth={2}
                  />
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                  {feature.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* FOOTER */
function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: ["Landing Page", "Course Builder", "Web-design", "Courses", "Integrations"],
    },
    {
      title: "Use Cases",
      links: ["Web-designers", "Marketers", "Small Business", "Website Builder"],
    },
    {
      title: "Resources",
      links: ["Academy", "Blog", "Themes", "Hosting", "Developers", "Support"],
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "FAQs", "Teams", "Contact Us"],
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white py-10 sm:py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-indigo-100">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href="#" className="hover:text-white transition">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/20 pt-5 sm:pt-6 flex flex-col gap-3 sm:gap-0 sm:flex-row justify-between items-center text-xs sm:text-sm text-indigo-100">
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-6">
            {["Privacy Policy", "Terms of Use", "Sales and Refunds", "Legal", "Site Map"].map((item) => (
              <Link key={item} href="#" className="hover:text-white transition">
                {item}
              </Link>
            ))}
          </div>
          <p className="whitespace-nowrap">© {new Date().getFullYear()} StudBuds. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/* HOMEPAGE MAIN COMPONENT */
export default function HomePage() {
  return (
    <div className="snap-y snap-proximity overflow-y-scroll h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 z-0" />
      <div className="fixed inset-0 pointer-events-none z-0 animated-gradient-bg opacity-[0.05]" />

      {/* Background splotches */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[
          { cls: "splotch-1 -top-48 -left-48 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px]", opacity: 0.15 },
          { cls: "splotch-2 top-20 -right-32 w-[400px] h-[400px] sm:w-[700px] sm:h-[700px]", opacity: 0.15 },
          { cls: "splotch-3 top-1/2 -left-40 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px]", opacity: 0.15 },
          { cls: "splotch-4 top-1/3 right-0 w-[350px] h-[350px] sm:w-[600px] sm:h-[600px]", opacity: 0.1 },
          { cls: "splotch-5 bottom-10 right-20 w-[350px] h-[350px] sm:w-[650px] sm:h-[650px]", opacity: 0.15 },
          { cls: "splotch-6 -bottom-32 left-1/3 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px]", opacity: 0.2 },
          { cls: "splotch-7 top-2/3 left-1/4 w-[300px] h-[300px] sm:w-[550px] sm:h-[550px]", opacity: 0.15 },
        ].map((s, i) => (
          <div
            key={i}
            className={`absolute ${s.cls} rounded-full blur-3xl`}
            style={{ backgroundColor: "#6366F1", opacity: s.opacity }}
          />
        ))}
      </div>

      {/* Page content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <StatsSection />
        <Mission />
        <Footer />
      </div>
    </div>
  );
}