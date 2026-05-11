import { WhatsAppIcon } from "@/frontend/components/icons/WhatsAppIcon";

type Variant = "hero" | "large" | "compact" | "floating";

const variants: Record<
  Variant,
  string
> = {
  hero: "inline-flex w-full min-h-[3rem] items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#25D366]/30 transition-all hover:bg-[#20BD5A] hover:shadow-xl dark:shadow-[#25D366]/20 sm:w-auto sm:px-8 sm:text-lg",
  large:
    "inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-10 py-5 text-xl font-bold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-[#20BD5A] sm:w-auto",
  compact:
    "inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#20BD5A]",
  floating:
    "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-black/25 transition-transform hover:scale-110 hover:bg-[#20BD5A] md:bottom-8 md:right-8 md:h-16 md:w-16",
};

export function WhatsAppCta({
  href,
  variant,
  label,
}: {
  href: string;
  variant: Variant;
  label?: string;
}) {
  const showLabel = variant !== "floating";
  const base = variants[variant];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={base}
      title={
        variant === "floating"
          ? "Rejoindre la communauté WhatsApp"
          : undefined
      }
    >
      <WhatsAppIcon
        className={
          variant === "floating"
            ? "h-8 w-8 md:h-9 md:w-9"
            : variant === "compact"
              ? "h-5 w-5"
              : "h-7 w-7 shrink-0"
        }
      />
      {showLabel && label ? (
        <span>{label}</span>
      ) : null}
      {variant === "floating" ? (
        <span className="sr-only">WhatsApp — communauté open-229</span>
      ) : null}
    </a>
  );
}
