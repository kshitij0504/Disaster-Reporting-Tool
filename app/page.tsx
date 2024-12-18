import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Bolt,
  Globe,
  Heart,
  Users,
  Activity,
  HelpCircle,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      title: "Real-Time Data Sharing",
      description:
        "Instant processing and sharing of critical disaster information with emergency responders.",
      icon: <Bolt className="h-6 w-6" />,
    },
    {
      title: "Guaranteed Anonymity",
      description:
        "Advanced privacy protocols ensure complete protection of reporter identities.",
      icon: <ShieldCheck className="h-6 w-6" />,
    },
    {
      title: "Nationwide Network",
      description:
        "Collaborative platform connecting communities, volunteers, and emergency services.",
      icon: <Globe className="h-6 w-6" />,
    },
  ];

  const impactStats = [
    {
      value: "100K+",
      label: "Reports Submitted",
      icon: <Activity className="h-8 w-8 text-green-600" />,
    },
    {
      value: "50K+",
      label: "Lives Impacted",
      icon: <Heart className="h-8 w-8 text-green-600" />,
    },
    {
      value: "500+",
      label: "Communities Supported",
      icon: <Users className="h-8 w-8 text-green-600" />,
    },
  ];

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-green-700/10 opacity-50 pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 relative z-10">
        {/* Hero Section */}
        <section className="pt-32 text-center">
          <div className="inline-flex items-center gap-2 mb-6 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-white">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Secure & Anonymous Disaster Reporting
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="block bg-white  bg-clip-text text-transparent">
              Empower Communities
            </span>
            <span className="block bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
              Report. Act. Recover.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-green-100 mb-10">
            Our platform bridges the gap between those experiencing disasters
            and those who can help. By providing anonymous, real-time reporting,
            we enable swift and effective emergency responses.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href={"/submit-report"}>
              <button className="group relative flex h-12 items-center justify-center gap-2 rounded-xl bg-sky-500 px-8 text-sm font-medium text-white transition-all hover:bg-sky-400">
                Make Anonymous Report
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </button>
            </Link>
            <Link href={"/how-it-works"}>
              <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white/5 px-8 text-sm font-medium text-white ring-1 ring-inset ring-white/10 transition-all hover:bg-white/10">
                How it Works
              </button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-24">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 hover:bg-green-500/20 transition-all group"
              >
                <div className="bg-green-500/20 rounded-xl p-3 mb-4 inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-green-100">
                  {feature.title}
                </h3>
                <p className="text-green-200 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Community Impact */}
        <section className="mt-24 text-center">
          <h2 className="text-4xl font-bold mb-6">Our Collective Impact</h2>
          <p className="max-w-2xl mx-auto text-green-200 mb-12">
            Together, we're building a more resilient and responsive emergency
            support ecosystem.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {impactStats.map((stat, index) => (
              <div
                key={index}
                className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 flex flex-col items-center"
              >
                {stat.icon}
                <h3 className="text-4xl font-bold mt-4 text-green-300">
                  {stat.value}
                </h3>
                <p className="text-green-200 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Volunteer Section */}
        <section className="mt-24 text-center bg-green-500/10 rounded-2xl p-12 border border-green-500/20">
          <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
          <p className="max-w-2xl mx-auto text-green-200 mb-10">
            Become a critical part of our disaster response network. Your
            commitment can save lives and help communities rebuild.
          </p>

          <Link href="/volunteer">
            <button className="btn-primary px-10 py-4 text-lg">
              Become a Volunteer
            </button>
          </Link>
        </section>

        <div className="mt-40 mb-20 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-zinc-900 px-5 py-2 text-sm text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Trusted by Law Enforcement Nationwide
          </div>
        </div>
      </div>
    </main>
  );
}
