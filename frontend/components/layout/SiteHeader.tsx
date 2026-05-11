import { getServerAuth } from "@/lib/auth/session";
import { SiteHeaderBar } from "@/frontend/components/layout/SiteHeaderBar";

export async function SiteHeader() {
  const { user, username } = await getServerAuth();
  return (
    <SiteHeaderBar
      signedIn={!!user}
      email={user?.email}
      username={username}
    />
  );
}
