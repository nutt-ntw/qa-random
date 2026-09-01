import { ChartIcon, SparkIcon } from "@/components/ui/Icons";

export function Hero() {
  return (
    <header className="relative overflow-hidden px-5 pb-12 pt-10 sm:px-8 sm:pt-14 lg:px-12 lg:pb-16">
      <div className="hero-orbit absolute right-[7%] top-6 hidden aspect-square w-72 rounded-full border border-cyan-300/10 lg:block" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((dot) => <span key={dot} className="hero-dot" style={{ "--dot-index": dot } as React.CSSProperties} />)}
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
          <SparkIcon className="size-4" /> I LOVE Quantitative Analysis LAB
        </div>
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div>
            <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-indigo-300">QA RANDOM · CENTRAL LIMIT THEOREM</p>
            <h1 className="max-w-4xl text-balance text-4xl font-bold leading-[1.3] tracking-[-0.035em] text-white sm:text-6xl sm:leading-[1.24] lg:text-7xl lg:leading-[1.22]">
              เปลี่ยนการสุ่ม ให้มองเห็น<span className="gradient-text pb-[0.12em]">รูปทรงของข้อมูล</span>
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-slate-300 sm:text-lg">
              ทดลองหยิบฉลากซ้ำหลายรอบ สังเกตค่าเฉลี่ยของแต่ละตัวอย่าง และดูว่า sampling distribution ก่อตัวขึ้นอย่างไรจากข้อมูลจริง
            </p>
          </div>
          <aside className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-3 text-cyan-200"><ChartIcon className="size-5" /><span className="text-xs font-bold uppercase tracking-[0.18em]">Learning objective</span></div>
            <p className="text-sm leading-7 text-slate-300">เปรียบเทียบประชากร ตัวอย่าง และการกระจายของค่าเฉลี่ย เพื่อเข้าใจว่าขนาดตัวอย่างส่งผลต่อความแปรปรวนอย่างไร</p>
          </aside>
        </div>
      </div>
    </header>
  );
}
