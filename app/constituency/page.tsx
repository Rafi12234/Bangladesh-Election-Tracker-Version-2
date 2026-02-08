'use client';

/* Constituency list page showing all constituencies with filters */

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConstituencyList from '@/components/ConstituencyList';
import { PageLoader } from '@/components/LoadingSpinner';
import { useParties, useResults } from '@/hooks';
import { getConstituencies } from '@/lib/firestore';
import type { Constituency } from '@/types';

export default function ConstituencyPage() {
  const { parties, loading: pLoading } = useParties();
  const { results, loading: rLoading } = useResults();
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConstituencies()
      .then(setConstituencies)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || pLoading || rLoading) {
    return (
      <>
        <Header />
        <PageLoader />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8 md:py-10">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-gray-100 mb-2">
            Constituencies
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Browse all {constituencies.length} constituencies and their election results
          </p>
        </div>
        
        <ConstituencyList results={results} parties={parties} constituencies={constituencies} />
      </main>
      <Footer />
    </>
  );
}
