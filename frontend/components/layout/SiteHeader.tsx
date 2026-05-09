import Link from "next/link";
import { Plus } from "lucide-react";
import { getServerAuth } from "@/lib/auth/session";
import { UserMenu } from "@/frontend/components/auth/UserMenu";
import { ThemeToggle } from "@/frontend/components/theme/ThemeToggle";

export async function SiteHeader() {
  const { user, username } = await getServerAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm transition-colors dark:border-neutral-800 dark:bg-neutral-950/95">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-10 w-10 rotate-3 items-center justify-center rounded-xl bg-red-600 transition-transform duration-300 group-hover:rotate-0">
              <span className="text-xl font-bold leading-none text-white">229</span>
            </div>
            <span className="font-display text-2xl font-bold tracking-tighter text-gray-900 dark:text-white">
              open-229
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/#explore"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600 dark:text-neutral-300 dark:hover:text-indigo-400"
            >
              Explore
            </Link>
            <Link
              href="/search"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600 dark:text-neutral-300 dark:hover:text-indigo-400"
            >
              Search
            </Link>
            <Link
              href="/#community"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600 dark:text-neutral-300 dark:hover:text-indigo-400"
            >
              Community
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />
          {user ? (
            <UserMenu email={user.email} username={username} />
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
                className="rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
              >
                Join
              </Link>
            </>
          )}
          <Link
            href="/add"
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:shadow-lg hover:shadow-green-200 active:scale-95 dark:hover:shadow-green-900/30"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </Link>
        </div>
      </div>
    </header>
  );
}
