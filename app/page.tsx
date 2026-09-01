import { ExperimentLab } from "@/components/experiment/ExperimentLab";
import { Hero } from "@/components/hero/Hero";

export default function Home() {
  return (
    <div className="site-shell min-h-screen overflow-x-clip">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <Hero />
      <ExperimentLab />
      <footer className="relative z-10 border-t border-white/6 px-5 py-8 text-center text-xs leading-6 text-slate-500">
        QA Random is an educational simulation. Sampling uses Math.random() and is not cryptographically secure.
      </footer>
    </div>
  );
}
