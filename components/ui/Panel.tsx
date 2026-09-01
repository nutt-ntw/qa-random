import type { ElementType, HTMLAttributes, ReactNode } from "react";

interface PanelProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
}

export function Panel({ as: Component = "section", className = "", children, ...props }: PanelProps) {
  return (
    <Component className={`glass-panel rounded-[1.75rem] border border-white/10 ${className}`} {...props}>
      {children}
    </Component>
  );
}
