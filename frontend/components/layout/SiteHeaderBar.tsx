"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Plus, X } from "lucide-react";
import { ThemeToggle } from "@/frontend/components/theme/ThemeToggle";
import { UserMenu } from "@/frontend/components/auth/UserMenu";

type Props = {
  signedIn: boolean;
  email?: string | null;
  username?: string | null;
};

const navLinkClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-green-700 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-green-400";

export function SiteHeaderBar({ signedIn, email, username }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm transition-colors dark:border-neutral-800 dark:bg-neutral-950/95">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:h-20 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-8">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-2"
            onClick={close}
          >
            <div className="flex h-9 w-9 shrink-0 rotate-3 items-center justify-center rounded-xl bg-green-600 transition-transform duration-300 group-hover:rotate-0 dark:bg-green-600 sm:h-10 sm:w-10">
              <span className="text-lg font-bold leading-none text-white sm:text-xl">
                229
              </span>
            </div>
            <span className="font-display truncate text-lg font-bold tracking-tighter text-gray-900 dark:text-white sm:text-xl md:text-2xl">
              open-229
            </span>
          </Link>
          <nav
            className="hidden items-center gap-6 md:flex"
            aria-label="Navigation principale"
          >
            <Link href="/#explore" className={navLinkClass}>
              Explore
            </Link>
            <Link href="/search" className={navLinkClass}>
              Search
            </Link>
            <Link href="/#community" className={navLinkClass}>
              Community
            </Link>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:gap-4">
          <ThemeToggle />
          <div className="hidden items-center gap-2 md:flex md:gap-3">
            {signedIn ? (
              <UserMenu email={email} username={username} />
            ) : (
              <>
                <Link
                  href="/signin"
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/join"
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/40"
                >
                  Join
                </Link>
              </>
            )}
            <Link
              href="/add"
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:shadow-lg hover:shadow-green-200/80 active:scale-95 dark:hover:shadow-green-900/30"
            >
              <Plus className="h-4 w-4 shrink-0" />
              Add Project
            </Link>
          </div>

          <Link
            href="/add"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white shadow-sm transition-all hover:bg-green-700 active:scale-95 md:hidden"
            aria-label="Ajouter un projet"
          >
            <Plus className="h-5 w-5" />
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-800 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <>
          <div
            role="presentation"
            className="fixed inset-x-0 bottom-0 top-16 z-40 cursor-default bg-black/40 md:hidden"
            onClick={close}
          />
          <div
            id="mobile-nav"
            className="absolute left-0 right-0 top-full z-50 max-h-[min(70vh,calc(100dvh-4rem))] overflow-y-auto overscroll-contain border-b border-gray-100 bg-white px-4 py-4 shadow-xl dark:border-neutral-800 dark:bg-neutral-950 md:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Navigation mobile">
              <Link href="/#explore" className={navLinkClass} onClick={close}>
                Explore
              </Link>
              <Link href="/search" className={navLinkClass} onClick={close}>
                Search
              </Link>
              <Link href="/#community" className={navLinkClass} onClick={close}>
                Community
              </Link>
              <div className="my-3 border-t border-gray-100 dark:border-neutral-800" />
              {signedIn ? (
                <div className="flex flex-col gap-2 px-1">
                  <UserMenu email={email} username={username} />
                </div>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className={`${navLinkClass} font-semibold`}
                    onClick={close}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/join"
                    className={`${navLinkClass} font-semibold text-green-700 dark:text-green-400`}
                    onClick={close}
                  >
                    Join
                  </Link>
                </>
              )}
              <Link
                href="/add"
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-green-700"
                onClick={close}
              >
                <Plus className="h-4 w-4 shrink-0" />
                Add Project
              </Link>
            </nav>
          </div>
        </>
      ) : null}
    </header>
  );
}
