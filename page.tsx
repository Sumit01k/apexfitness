import dynamic from "next/dynamic";
import { Header } from "@/components/dashboard/Header";
import { PantryToPlate } from "@/components/dashboard/PantryToPlate";
import { AICoachHUD } from "@/components/dashboard/AICoachHUD";
import { MacroBar } from "@/components/dashboard/MacroBar";

// The 3D visualizer touches WebGL directly via @react-three/fiber, so it
// must never attempt to render on the server.
const Visualizer3D = dynamic(
  () => import("@/components/dashboard/3DVisualizer").then((mod) => mod.Visualizer3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[420px] items-center justify-center rounded-lg border border-surface-border bg-surface font-mono text-xs text-ink-faint">
        Loading 3D avatar…
      </div>
    ),
  }
);

export default function DashboardPage() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />

      <main className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-4 lg:grid-cols-[320px_minmax(0,1fr)_360px] lg:overflow-hidden">
        <section className="min-h-[480px] lg:min-h-0 lg:overflow-y-auto">
          <PantryToPlate />
        </section>

        <section className="min-h-[480px] lg:min-h-0 lg:overflow-y-auto">
          <Visualizer3D />
        </section>

        <section className="min-h-[480px] lg:min-h-0 lg:overflow-y-auto">
          <AICoachHUD />
        </section>
      </main>

      <MacroBar />
    </div>
  );
}
