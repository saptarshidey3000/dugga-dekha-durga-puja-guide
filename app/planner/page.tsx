'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PlannerRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/metro');
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-8 bg-[#F7F0E2] text-[#8F1D18]">
      <p className="font-semibold text-sm animate-pulse">Redirecting to Metro Guide...</p>
    </div>
  );
}
