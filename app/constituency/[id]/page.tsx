import type { Metadata } from 'next';
import ConstituencyDetailClient from './ConstituencyDetailClient';

/* SEO: Dynamic metadata for each constituency detail page */

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const decodedId = decodeURIComponent(params.id);

  // Build a human-readable name from the slug (e.g. "dhaka-1" → "Dhaka 1")
  const name = decodedId
    .split('-')
    .map((part, i, arr) => {
      if (i === arr.length - 1 && /^\d+$/.test(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');

  return {
    title: `${name} Constituency Results | Bangladesh Election Tracker 2026`,
    description: `Live election results for ${name} constituency in the Bangladesh Parliamentary Election 2026. View vote breakdown, winning party, margin, and all candidates.`,
    keywords: [
      name,
      'constituency results',
      'Bangladesh election 2026',
      'vote breakdown',
      'candidates',
      'parliamentary election',
    ],
    openGraph: {
      title: `${name} — Election Results | Bangladesh Election Tracker`,
      description: `Detailed election results for ${name} constituency including vote counts, margins, and candidate information.`,
      type: 'website',
      locale: 'en_BD',
      siteName: 'Bangladesh Election Tracker',
    },
    twitter: {
      card: 'summary',
      title: `${name} Constituency Results | Bangladesh Election Tracker`,
      description: `Live results for ${name} constituency — vote breakdown, winner, and candidate details.`,
    },
    alternates: {
      canonical: `/constituency/${params.id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ConstituencyDetailPage({ params }: Props) {
  return <ConstituencyDetailClient id={params.id} />;
}
