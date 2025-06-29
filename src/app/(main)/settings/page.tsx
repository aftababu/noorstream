import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SettingsPageContent } from "@/components/settings/SettingsPageContent";

export const metadata: Metadata = {
  title: "Settings | NoorStream",
  description: "Manage your NoorStream account settings",
};





export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/settings");
  }

  const tab = searchParams.tab || "account";

  // Fetch initial data on the server



  return <SettingsPageContent initialTab={tab}/>;
}