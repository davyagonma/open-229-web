import Link from "next/link";
import { AtSign, Briefcase, Code } from "lucide-react";
import { getServerAuth } from "@/lib/auth/session";
import { ThemeToggle } from "@/frontend/components/theme/ThemeToggle";

export async function SiteFooter() {
  const { user } = await getServerAuth();

  return (
    <footer className="border-t border-gray-100 bg-white py-16 transition-colors dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div>
            <Link href="/" className="mb-6 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
                <span className="text-sm font-bold leading-none text-white">229</span>
              </div>
              <span className="font-display text-xl font-bold tracking-tighter text-gray-900 dark:text-white">
                open-229
              </span>
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-gray-500 dark:text-neutral-400">
              Initiative communautaire pour cartographier et soutenir l’open source au Bénin.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://twitter.com"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-all hover:bg-gray-900 hover:text-white dark:bg-neutral-900 dark:text-neutral-500 dark:hover:bg-white dark:hover:text-neutral-900"
                aria-label="Twitter"
              >
                <AtSign className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-all hover:bg-gray-900 hover:text-white dark:bg-neutral-900 dark:text-neutral-500 dark:hover:bg-white dark:hover:text-neutral-900"
                aria-label="GitHub"
              >
                <Code className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-all hover:bg-gray-900 hover:text-white dark:bg-neutral-900 dark:text-neutral-500 dark:hover:bg-white dark:hover:text-neutral-900"
                aria-label="LinkedIn"
              >
                <Briefcase className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-display mb-6 text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white">
              Platform
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/search"
                  className="text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400"
                >
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/add"
                  className="text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400"
                >
                  Add a project
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display mb-6 text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white">
              Community
            </h4>
            <ul className="space-y-4">
              {!user ? (
                <li>
                  <Link
                    href="/join"
                    className="text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400"
                  >
                    Join
                  </Link>
                </li>
              ) : null}
              <li>
                <a
                  href="https://github.com"
                  className="text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400"
                >
                  GitHub org
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display mb-6 text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white">
              Legal
            </h4>
            <ul className="space-y-4">
              <li>
                <span className="text-sm text-gray-500 dark:text-neutral-400">
                  Privacy (soon)
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-6 border-t border-gray-50 pt-12 dark:border-neutral-800 sm:flex-row">
          <p className="text-center text-xs font-medium text-gray-400 dark:text-neutral-500 sm:text-left">
            &copy; {new Date().getFullYear()} open-229. Made with care for Cotonou &amp; the 229.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
