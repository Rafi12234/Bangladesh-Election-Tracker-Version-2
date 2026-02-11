'use client';

/* Landing page — Main dashboard showing election summary, seat counts,
   popular vote percentages, and a constituency list. */

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useParties, useResults, useSummary } from '@/hooks';
import { getConstituencies } from '@/lib/firestore';
import { aggregateAllianceSeatCounts } from '@/lib/alliances';
import type { Constituency, SeatCount } from '@/types';

// Dynamic imports for ALL non-critical components to reduce initial bundle size
const Header = dynamic(() => import('@/components/Header'), {
  ssr: true
});

const ElectionBanner = dynamic(() => import('@/components/ElectionBanner'), {
  ssr: true
});

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: false
});

const ResultsSummary = dynamic(() => import('@/components/ResultsSummary'), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  ),
  ssr: false
});

const ConstituencyList = dynamic(() => import('@/components/ConstituencyList'), {
  loading: () => (
    <div className="animate-pulse space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      ))}
    </div>
  ),
  ssr: false
});

export default function HomePage() {
  const { parties, loading: pLoading } = useParties();
  const { results, loading: rLoading } = useResults();
  const { summary } = useSummary(results);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [cLoading, setCLoading] = useState(true);

  useEffect(() => {
    // Fetch constituencies with timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      console.warn('Constituency loading taking too long, using fallback');
      setCLoading(false);
    }, 5000);

    getConstituencies()
      .then(setConstituencies)
      .catch(err => {
        console.error('Failed to load constituencies:', err);
        setConstituencies([]);
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setCLoading(false);
      });

    return () => clearTimeout(timeoutId);
  }, []);

  // Compute seat counts locally — no extra hooks / Firestore subscriptions
  const seatCounts = useMemo((): SeatCount[] => {
    const counts: Record<string, SeatCount> = {};
    parties.forEach(p => {
      counts[p.id] = { partyId: p.id, partyName: p.shortName, partyColor: p.color, seats: 0, leadingSeats: 0, totalVotes: 0, votePercentage: 0 };
    });
    let totalVotes = 0;
    results.forEach(r => {
      Object.entries(r.partyVotes).forEach(([pid, v]) => { if (counts[pid]) counts[pid].totalVotes += v; totalVotes += v; });
      if (r.status === 'completed' && r.winnerPartyId && counts[r.winnerPartyId]) counts[r.winnerPartyId].seats++;
      else if (r.status === 'partial') { const l = Object.entries(r.partyVotes).sort(([,a],[,b]) => b - a)[0]; if (l && counts[l[0]]) counts[l[0]].leadingSeats++; }
    });
    return Object.values(counts).map(sc => ({ ...sc, votePercentage: totalVotes > 0 ? (sc.totalVotes / totalVotes) * 100 : 0 }))
      .filter(sc => sc.seats > 0 || sc.leadingSeats > 0 || sc.totalVotes > 0)
      .sort((a, b) => b.seats - a.seats || b.totalVotes - a.totalVotes);
  }, [results, parties]);

  const allianceSeatCounts = useMemo(() => aggregateAllianceSeatCounts(results), [results]);

  // Show a more informative loading state
  const isInitialLoad = pLoading || rLoading;

  if (isInitialLoad) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8 md:py-10">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-bd-green border-r-transparent" />
              <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">Loading election data...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <ElectionBanner />
      <main className="mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8 md:py-10">
        <div className="space-y-8">
          <ResultsSummary summary={summary} seatCounts={seatCounts} allianceSeatCounts={allianceSeatCounts} />

          <section>
            <h2 className="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">Constituencies</h2>
            {cLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-solid border-bd-green border-r-transparent" />
              </div>
            ) : (
              <ConstituencyList results={results} parties={parties} constituencies={constituencies} enablePagination itemsPerPage={30} />
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
