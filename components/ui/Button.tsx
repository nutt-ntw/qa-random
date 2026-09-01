import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonTone = "primary" | "secondary" | "ghost" | "success";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: ButtonTone;
  icon?: ReactNode;
}

const tones: Record<ButtonTone, string> = {
  primary: "border-indigo-400/40 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 text-white shadow-[0_14px_40px_rgba(99,102,241,.28)] hover:brightness-110",
  secondary: "border-white/12 bg-white/7 text-slate-100 hover:border-white/25 hover:bg-white/10",
  ghost: "border-transparent bg-transparent text-slate-300 hover:bg-white/7 hover:text-white",
  success: "border-emerald-400/25 bg-emerald-400/12 text-emerald-100 hover:bg-emerald-400/18",
};

export function Button({ className = "", tone = "secondary", icon, children, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-45 ${tones[tone]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
