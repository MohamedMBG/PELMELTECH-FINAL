interface StatusBadgeProps {
  status: string;
  variant?: "default" | "cyan" | "magenta" | "muted";
}

const VARIANT_MAP: Record<string, StatusBadgeProps["variant"]> = {
  published: "cyan",
  draft: "muted",
  hidden: "muted",
  new: "cyan",
  "in-progress": "magenta",
  done: "default",
};

export default function StatusBadge({ status, variant }: StatusBadgeProps) {
  const resolved = variant ?? VARIANT_MAP[status] ?? "default";

  const styles = {
    cyan: "bg-cyan/10 text-cyan-dark border-cyan/20",
    magenta: "bg-magenta/10 text-magenta-dark border-magenta/20",
    muted: "bg-black/[0.04] text-on-surface-variant border-black/[0.06]",
    default: "bg-black/[0.04] text-on-surface border-black/[0.08]",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase border ${styles[resolved]}`}
    >
      {status.replace("-", " ")}
    </span>
  );
}
