'use client';

/* Landing page — Main dashboard showing election summary, seat counts,
   popular vote percentages, and a constituency list. */

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ResultsSummary from '@/components/ResultsSummary';
import ConstituencyList from '@/components/ConstituencyList';
import { PageLoader } from '@/components/LoadingSpinner';
import { useParties, useResults, useSummary, useSeatCounts, useAllianceSeatCounts } from '@/hooks';
import { getConstituencies } from '@/lib/firestore';
import type { Constituency } from '@/types';

export default function HomePage() {
  const { parties, loading: partiesLoading } = useParties();
  const { results, loading: resultsLoading } = useResults();
  const { summary, loading: summaryLoading } = useSummary();
  const { seatCounts } = useSeatCounts();
  const { allianceSeatCounts } = useAllianceSeatCounts();
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [consLoading, setConsLoading] = useState(true);

  useEffect(() => {
    getConstituencies()
      .then(setConstituencies)
      .catch(console.error)
      .finally(() => setConsLoading(false));
  }, []);

  const loading = partiesLoading || resultsLoading || summaryLoading;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8 md:py-10">
        {loading ? (
          <PageLoader />
        ) : (
          <div className="space-y-8">
            {/* Election summary + metrics */}
            <ResultsSummary summary={summary} seatCounts={seatCounts} allianceSeatCounts={allianceSeatCounts} />

            {/* Constituency list */}
            <section>
              <h2 className="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">Constituencies</h2>
              {consLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="skeleton h-14 rounded-lg" />
                  ))}
                </div>
              ) : (
                <ConstituencyList results={results} parties={parties} constituencies={constituencies} />
              )}
            </section>
          </div>
        )}
      </main>
    </>
  );
}
