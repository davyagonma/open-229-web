"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, User } from "lucide-react";

type Props = {
  email?: string | null;
  username?: string | null;
};

export function UserMenu({ email, username }: Props) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden max-w-[160px] truncate text-xs text-gray-500 sm:inline dark:text-neutral-400">
        {email}
      </span>
      {username ? (
        <Link
          href={`/u/${username}`}
          className="hidden text-gray-600 transition-colors hover:text-indigo-600 dark:text-neutral-300 dark:hover:text-indigo-400 sm:inline-flex"
          aria-label="Profile"
        >
          <User className="h-5 w-5" />
        </Link>
      ) : null}
      <button
        type="button"
        onClick={() => signOut()}
        className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-900"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Sign out</span>
      </button>
    </div>
  );
}
