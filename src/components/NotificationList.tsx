import { formatDistanceToNow } from "date-fns";
import type { Notification } from "@/lib/types";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/actions";

export function NotificationList({
  notifications,
}: {
  notifications: Notification[];
}) {
  const unread = notifications.filter((n) => !n.read);

  return (
    <div className="space-y-4">
      {unread.length > 0 && (
        <form action={markAllNotificationsRead}>
          <button
            type="submit"
            className="text-sm font-medium text-emerald-700 underline hover:text-emerald-900"
          >
            Mark all as read
          </button>
        </form>
      )}

      {notifications.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 px-6 py-10 text-center text-emerald-900/70">
          No notifications yet. You will be alerted here if you miss a biweekly growth form.
        </p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`rounded-2xl border px-4 py-4 ${
                n.read
                  ? "border-emerald-100 bg-white text-emerald-900/70"
                  : "border-amber-200 bg-amber-50 text-amber-950"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
                    {n.type === "missed_form"
                      ? "Missed form"
                      : n.type === "form_due_soon"
                        ? "Due soon"
                        : "Info"}
                  </p>
                  <p className="mt-1 font-medium">{n.message}</p>
                  <p className="mt-1 text-xs opacity-60">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </p>
                </div>
                {!n.read && (
                  <form
                    action={async (formData) => {
                      "use server";
                      await markNotificationRead(
                        String(formData.get("notification_id"))
                      );
                    }}
                  >
                    <input type="hidden" name="notification_id" value={n.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-current/20 px-3 py-1 text-xs font-semibold hover:bg-white/50"
                    >
                      Mark read
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
