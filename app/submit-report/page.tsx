'use client';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Dynamically import ReportLayout with ssr: false to render it only on the client side
const ReportLayout = dynamic(() => import('@/components/submit-report/report'), { 
  ssr: false 
});

export default function SubmitReport() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // This effect is always called and controls the mounted state for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Another effect for redirection which will run after the component has mounted
  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, router]);

  // Don't render anything until after mounting to avoid hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-black selection:bg-green-500/20 overflow-hidden">
      <div className="fixed inset-0 -z-10 min-h-screen">
        <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03),transparent_50%)]" />
        <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.04),transparent_70%)]" />
      </div>

      <main className="relative px-6 pt-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 mb-5 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-white">
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

            <h1 className="mt-4 bg-gradient-to-b from-white to-white/80 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
              Submit Report
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
              Your safety is our priority. All submissions are encrypted and
              anonymized.
            </p>
          </div>

          <div className="mt-8 bg-zinc-900/50 rounded-2xl border border-white/5 p-6">
            {/* Dynamically rendered ReportLayout */}
            <ReportLayout />
          </div>
        </div>
      </main>
    </div>
  );
}
