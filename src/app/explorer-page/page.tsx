import MemeExplorer from "@/components/meme-explorer";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense>
      <main className="min-h-screen bg-background">
        <MemeExplorer />
      </main>
    </Suspense>
  );
}
