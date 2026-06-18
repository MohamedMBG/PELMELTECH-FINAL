import { LucideIcon, PackageOpen } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
        <Icon size={24} className="text-on-surface-variant/50" />
      </div>
      <h3 className="text-base font-bold text-on-surface mb-1">{title}</h3>
      <p className="text-sm text-on-surface-variant text-center max-w-sm">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-5 inline-flex items-center gap-2 bg-on-surface text-white px-5 py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase hover:bg-on-surface/90 transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
