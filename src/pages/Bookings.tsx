import { useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Booking, BookingStatus, CatalogItem } from "../types";
import {
  bookingAddons,
  bookingCustomer,
  bookingPackage,
  bookingPhone,
  bookingRef,
  bookingTotal,
  peso,
  phDate,
} from "../types";
import { Button, Card, EmptyState, Modal, StatusBadge } from "../components/ui";
import { Icon } from "../components/Icon";

export function Bookings({
  bookings,
  setBookings,
  packages,
}: {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  packages: CatalogItem[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const filtered = useMemo(
    () =>
      bookings.filter((b) => {
        const haystack = [
          bookingRef(b),
          bookingCustomer(b),
          bookingPhone(b),
          b.customer_email,
        ]
          .join(" ")
          .toLowerCase();
        return (
          (!query || haystack.includes(query.toLowerCase())) &&
          (status === "all" || b.status === status) &&
          (packageFilter === "all" || bookingPackage(b) === packageFilter) &&
          (!date || b.appointment_date === date)
        );
      }),
    [bookings, query, status, packageFilter, date],
  );
  const update = async (booking: Booking, values: Partial<Booking>) => {
    setSaving(true);
    setError("");
    const { error: updateError } = await supabase
      .from("bookings")
      .update(values)
      .eq("id", booking.id);
    if (updateError) setError(updateError.message);
    else {
      const updatedBooking = { ...booking, ...values };
      setBookings((items) =>
        items.map((item) =>
          item.id === booking.id ? updatedBooking : item,
        ),
      );
      setSelected(updatedBooking);
    }
    setSaving(false);
  };
  const copy = (value: string) => void navigator.clipboard.writeText(value);
  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Booking management</p>
          <h2>All bookings</h2>
          <p>Search, review, and manage every studio appointment.</p>
        </div>
      </div>
      <Card className="filter-card">
        <div className="search-control">
          <Icon name="Search" size={17} />
          <input
            aria-label="Search bookings"
            placeholder="Search reference, customer, phone, or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option>pending</option>
          <option>confirmed</option>
          <option>paid</option>
          <option>cancelled</option>
        </select>
        <select
          aria-label="Filter by package"
          value={packageFilter}
          onChange={(e) => setPackageFilter(e.target.value)}
        >
          <option value="all">All packages</option>
          {[
            ...new Set([
              ...packages.map((p) => p.name),
              ...bookings.map(bookingPackage),
            ]),
          ].map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
        <input
          aria-label="Filter by appointment date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {(query || status !== "all" || packageFilter !== "all" || date) && (
          <Button
            variant="ghost"
            onClick={() => {
              setQuery("");
              setStatus("all");
              setPackageFilter("all");
              setDate("");
            }}
          >
            Clear
          </Button>
        )}
      </Card>
      <div className="result-count">
        <strong>{filtered.length}</strong> booking
        {filtered.length === 1 ? "" : "s"} found
      </div>
      <Card className="table-card">
        {filtered.length ? (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Package</th>
                    <th>Appointment</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <button
                          className="reference-link"
                          onClick={() => setSelected(b)}
                        >
                          {bookingRef(b)}
                        </button>
                      </td>
                      <td>
                        <strong>{bookingCustomer(b)}</strong>
                        <small>{b.customer_email}</small>
                      </td>
                      <td>{bookingPhone(b) || "—"}</td>
                      <td>{bookingPackage(b)}</td>
                      <td>
                        <strong>
                          {phDate(b.appointment_date, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </strong>
                        <small>{b.appointment_time.slice(0, 5)}</small>
                      </td>
                      <td>{peso(bookingTotal(b))}</td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                      <td>{phDate(b.created_at)}</td>
                      <td>
                        <button
                          className="icon-button"
                          aria-label={`Open booking ${bookingRef(b)}`}
                          onClick={() => setSelected(b)}
                        >
                          <Icon name="Ellipsis" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="booking-cards">
              {filtered.map((b) => (
                <button key={b.id} onClick={() => setSelected(b)}>
                  <div>
                    <strong>{bookingRef(b)}</strong>
                    <StatusBadge status={b.status} />
                  </div>
                  <h3>{bookingCustomer(b)}</h3>
                  <p>{bookingPackage(b)}</p>
                  <span>
                    <Icon name="Calendar" size={14} />
                    {phDate(b.appointment_date)} ·{" "}
                    {b.appointment_time.slice(0, 5)}
                  </span>
                  <b>{peso(bookingTotal(b))}</b>
                </button>
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon="SearchX"
            title="No matching bookings"
            description="Try changing or clearing your filters."
          />
        )}
      </Card>
      {selected && (
        <Modal
          title={`Booking ${bookingRef(selected)}`}
          onClose={() => setSelected(null)}
          wide
          footer={
            <>
              <Button
                variant="secondary"
                icon="Printer"
                onClick={() => window.print()}
              >
                Print
              </Button>
              <Button onClick={() => setSelected(null)}>Done</Button>
            </>
          }
        >
          <div className="detail-header">
            <div>
              <span>Appointment</span>
              <h3>
                {phDate(selected.appointment_date, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h3>
              <p>
                {selected.appointment_time.slice(0, 5)} · Philippine Standard
                Time
              </p>
            </div>
            <StatusBadge status={selected.status} />
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="detail-grid">
            <div>
              <span>Customer</span>
              <strong>{bookingCustomer(selected)}</strong>
            </div>
            <div>
              <span>Phone</span>
              <strong>{bookingPhone(selected) || "—"}</strong>
              {bookingPhone(selected) && (
                <button onClick={() => copy(bookingPhone(selected))}>
                  <Icon name="Copy" size={13} /> Copy
                </button>
              )}
            </div>
            <div>
              <span>Email</span>
              <strong>{selected.customer_email || "—"}</strong>
              {selected.customer_email && (
                <button onClick={() => copy(selected.customer_email!)}>
                  <Icon name="Copy" size={13} /> Copy
                </button>
              )}
            </div>
            <div>
              <span>Reference</span>
              <strong>{bookingRef(selected)}</strong>
              <button onClick={() => copy(bookingRef(selected))}>
                <Icon name="Copy" size={13} /> Copy
              </button>
            </div>
          </div>
          <div className="detail-section">
            <h3>Package and add-ons</h3>
            <div className="line-item">
              <span>{bookingPackage(selected)}</span>
              <strong>
                {peso(
                  selected.package_snapshot?.price ||
                    (typeof selected.package === "object"
                      ? selected.package.price || 0
                      : bookingTotal(selected)),
                )}
              </strong>
            </div>
            {bookingAddons(selected).map((addon, i) => (
              <div className="line-item" key={addon.id || i}>
                <span>{addon.name}</span>
                <strong>{peso(Number(addon.price || 0))}</strong>
              </div>
            ))}
            <div className="line-item line-item--total">
              <span>Booking total</span>
              <strong>{peso(bookingTotal(selected))}</strong>
            </div>
          </div>
          <div className="detail-section">
            <h3>Status</h3>
            <div className="status-actions">
              {(
                ["pending", "confirmed", "paid", "cancelled"] as BookingStatus[]
              ).map((s) => (
                <Button
                  key={s}
                  variant={
                    selected.status === s
                      ? "primary"
                      : s === "cancelled"
                        ? "danger"
                        : "secondary"
                  }
                  disabled={saving || selected.status === s}
                  onClick={() =>
                    s === "cancelled"
                      ? setCancelTarget(selected)
                      : update(selected, { status: s })
                  }
                >
                  {s[0].toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </Modal>
      )}
      {cancelTarget && (
        <Modal
          title="Cancel this booking?"
          onClose={() => setCancelTarget(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setCancelTarget(null)}>
                Keep booking
              </Button>
              <Button
                variant="danger"
                disabled={saving}
                onClick={async () => {
                  await update(cancelTarget, { status: "cancelled" });
                  setCancelTarget(null);
                }}
              >
                Cancel booking
              </Button>
            </>
          }
        >
          <div className="confirm-message">
            <span className="state-icon state-icon--danger">
              <Icon name="CalendarX2" />
            </span>
            <p>
              This removes <strong>{bookingRef(cancelTarget)}</strong> from
              occupied calendar slots. The booking record and historical value
              will be preserved.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
