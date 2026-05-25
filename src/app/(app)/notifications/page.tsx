import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { syncMissedFormNotifications } from "@/lib/notifications";
import { NotificationList } from "@/components/NotificationList";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await syncMissedFormNotifications(user.id);

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-950">Notifications</h1>
        <p className="mt-1 text-emerald-900/70">
          Alerts when biweekly growth forms are overdue or due soon.
        </p>
      </div>
      <NotificationList notifications={notifications ?? []} />
    </div>
  );
}
