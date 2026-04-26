import { type ReactNode } from "react";

import { cn } from "@/lib/cn";

type ScreenShellProps = {
  children: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
  contentClassName?: string;
};

export function ScreenShell({
  children,
  footer,
  scroll = false,
  contentClassName,
}: ScreenShellProps) {
  return (
    <main
      className={cn(
        "min-h-dvh bg-background text-ink",
        scroll && "overflow-y-auto",
      )}
    >
      <section
        className={cn(
          "mx-auto flex min-h-dvh w-full max-w-app flex-col gap-6 px-6 pb-6 pt-8",
          contentClassName,
        )}
      >
        {children}
        {footer ? <div className="mt-auto w-full pt-4">{footer}</div> : null}
      </section>
    </main>
  );
}
