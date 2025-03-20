import MemeLeaderboard from '@/components/leaderboard';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense>
      <main className="min-h-screen bg-background">
        <MemeLeaderboard />
      </main>
    </Suspense>
  );
}