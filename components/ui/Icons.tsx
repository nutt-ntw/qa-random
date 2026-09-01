import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export function SparkIcon(props: IconProps) {
  return <IconBase {...props}><path d="m12 3 1.35 4.1L17.5 8.5l-4.15 1.4L12 14l-1.35-4.1L6.5 8.5l4.15-1.4L12 3Z" /><path d="m18 14 .8 2.2 2.2.8-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14Z" /></IconBase>;
}

export function DiceIcon(props: IconProps) {
  return <IconBase {...props}><rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="8" cy="8" r="1" fill="currentColor" stroke="none" /><circle cx="16" cy="8" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="8" cy="16" r="1" fill="currentColor" stroke="none" /><circle cx="16" cy="16" r="1" fill="currentColor" stroke="none" /></IconBase>;
}

export function ResetIcon(props: IconProps) {
  return <IconBase {...props}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></IconBase>;
}

export function ChartIcon(props: IconProps) {
  return <IconBase {...props}><path d="M4 19V5" /><path d="M4 19h16" /><path d="m6.5 15 3.5-4 3 2 4.5-6" /></IconBase>;
}

export function CopyIcon(props: IconProps) {
  return <IconBase {...props}><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></IconBase>;
}

export function DownloadIcon(props: IconProps) {
  return <IconBase {...props}><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></IconBase>;
}

export function ShareIcon(props: IconProps) {
  return <IconBase {...props}><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.6" /><path d="m8.2 13.2 7.6 4.6" /></IconBase>;
}

export function CheckIcon(props: IconProps) {
  return <IconBase {...props}><path d="m5 12 4 4L19 6" /></IconBase>;
}

export function TableIcon(props: IconProps) {
  return <IconBase {...props}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M9 4v16" /></IconBase>;
}

export function ArrowIcon(props: IconProps) {
  return <IconBase {...props}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></IconBase>;
}
