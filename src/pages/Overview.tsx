import type { Booking, Review } from "../types";
import {
  bookingCustomer,
  bookingPackage,
  bookingRef,
  bookingTotal,
  peso,
  phDate,
  todayPH,
} from "../types";
import { Card, EmptyState, StatusBadge, Button } from "../components/ui";
import { Icon, type IconName } from "../components/Icon";
import { PackageChart, RevenueChart, StatusChart } from "../components/Charts";
import type { Page } from "../components/Layout";

export function Overview({
  bookings,
  reviews,
  navigate,
}: {
  bookings: Booking[];
  reviews: Review[];
  navigate: (page: Page) => void;
}) {
  const today = todayPH();
  const active = bookings.filter((b) => b.status !== "cancelled");
  const todayBookings = active.filter((b) => b.appointment_date === today);
  const upcoming = active.filter((b) => b.appointment_date > today);
  const paid = bookings.filter((b) => b.status === "paid");
  const publicReviews = reviews.filter(
    (r) => r.is_public ?? r.visible ?? r.is_visible ?? true,
  );
  const average = publicReviews.length
    ? publicReviews.reduce((sum, r) => sum + Number(r.rating), 0) /
      publicReviews.length
    : 0;
  const stats: Array<{
    label: string;
    value: string | number;
    sub: string;
    icon: IconName;
    tone?: string;
  }> = [
    {
      label: "Today's bookings",
      value: todayBookings.length,
      sub: `${todayBookings.filter((b) => b.status === "confirmed").length} confirmed`,
      icon: "CalendarCheck",
    },
    {
      label: "Upcoming bookings",
      value: upcoming.length,
      sub: "Excludes cancellations",
      icon: "CalendarClock",
    },
    {
      label: "Pending bookings",
      value: bookings.filter((b) => b.status === "pending").length,
      sub: "Needs attention",
      icon: "Clock3",
      tone: "amber",
    },
    {
      label: "Confirmed bookings",
      value: bookings.filter((b) => b.status === "confirmed").length,
      sub: "Ready for schedule",
      icon: "BadgeCheck",
    },
    {
      label: "Paid bookings",
      value: paid.length,
      sub: "Payment recorded",
      icon: "CircleDollarSign",
      tone: "green",
    },
    {
      label: "Cancelled bookings",
      value: bookings.filter((b) => b.status === "cancelled").length,
      sub: "Not in schedule",
      icon: "CalendarX2",
      tone: "red",
    },
    {
      label: "Today's expected value",
      value: peso(todayBookings.reduce((s, b) => s + bookingTotal(b), 0)),
      sub: "Active bookings, not collected",
      icon: "WalletCards",
    },
    {
      label: "Total paid revenue",
      value: peso(paid.reduce((s, b) => s + bookingTotal(b), 0)),
      sub: "Collected revenue only",
      icon: "Banknote",
      tone: "green",
    },
    {
      label: "Public reviews",
      value: publicReviews.length,
      sub: `${reviews.length} total submissions`,
      icon: "MessagesSquare",
    },
    {
      label: "Average rating",
      value: average ? average.toFixed(1) : "—",
      sub: "Public reviews only",
      icon: "Star",
    },
  ];
  const recent = bookings.slice(0, 5);
  const packageCounts = Object.entries(
    active.reduce<Record<string, number>>((acc, b) => {
      const name = bookingPackage(b);
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
  const statuses = (["pending", "confirmed", "paid", "cancelled"] as const).map(
    (name) => ({
      name: name[0].toUpperCase() + name.slice(1),
      value: bookings.filter((b) => b.status === name).length,
    }),
  );
  const revenue = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    const key = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
    return {
      label: phDate(d, { weekday: "short" }),
      revenue: paid
        .filter((b) => b.appointment_date === key)
        .reduce((s, b) => s + bookingTotal(b), 0),
    };
  });
  return (
    <div className="page-stack">
      <div className="welcome-row">
        <div>
          <p className="eyebrow">Studio at a glance</p>
          <h2>Good day, Admin</h2>
          <p>Here’s what’s happening across the studio today.</p>
        </div>
        <div className="quick-actions">
          <Button
            variant="secondary"
            icon="Search"
            onClick={() => navigate("bookings")}
          >
            Find booking
          </Button>
        </div>
      </div>
      <div className="stat-grid">
        {stats.map((stat) => (
          <Card className="stat-card" key={stat.label}>
            <div
              className={`stat-icon ${stat.tone ? `stat-icon--${stat.tone}` : ""}`}
            >
              <Icon name={stat.icon} size={19} />
            </div>
            <div>
              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
              <span>{stat.sub}</span>
            </div>
          </Card>
        ))}
      </div>
      <div className="dashboard-grid dashboard-grid--charts">
        <RevenueChart data={revenue} />
        <StatusChart data={statuses} />
      </div>
      <div className="dashboard-grid dashboard-grid--lower">
        <Card>
          <div className="section-heading">
            <div>
              <h2>Today’s schedule</h2>
              <p>
                {todayBookings.length} active appointment
                {todayBookings.length === 1 ? "" : "s"}
              </p>
            </div>
            <button
              className="text-button"
              onClick={() => navigate("calendar")}
            >
              View calendar <Icon name="ArrowUpRight" size={15} />
            </button>
          </div>
          {todayBookings.length ? (
            <div className="schedule-list">
              {todayBookings
                .sort((a, b) =>
                  a.appointment_time.localeCompare(b.appointment_time),
                )
                .map((b) => (
                  <div key={b.id}>
                    <time>{b.appointment_time.slice(0, 5)}</time>
                    <span className="schedule-line" />
                    <div>
                      <strong>{bookingCustomer(b)}</strong>
                      <span>{bookingPackage(b)}</span>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                ))}
            </div>
          ) : (
            <EmptyState
              icon="CalendarDays"
              title="No appointments today"
              description="Your studio schedule is clear for the day."
            />
          )}
        </Card>
        <PackageChart data={packageCounts} />
      </div>
      <Card>
        <div className="section-heading">
          <div>
            <h2>Recent bookings</h2>
            <p>Latest booking activity</p>
          </div>
          <button className="text-button" onClick={() => navigate("bookings")}>
            View all <Icon name="ArrowRight" size={15} />
          </button>
        </div>
        {recent.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Customer</th>
                  <th>Package</th>
                  <th>Appointment</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <strong>{bookingRef(b)}</strong>
                    </td>
                    <td>{bookingCustomer(b)}</td>
                    <td>{bookingPackage(b)}</td>
                    <td>
                      {phDate(b.appointment_date)} ·{" "}
                      {b.appointment_time.slice(0, 5)}
                    </td>
                    <td>{peso(bookingTotal(b))}</td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No bookings yet"
            description="New bookings will appear here."
          />
        )}
      </Card>
    </div>
  );
}
