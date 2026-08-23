import { useState } from "react";
import type { CatalogItem } from "../types";
import { peso } from "../types";
import { supabase } from "../lib/supabase";
import { Button, Card, Field, Modal } from "../components/ui";
import { Icon } from "../components/Icon";

type Tab = "studio" | "catalog" | "discounts" | "payment" | "profile";
export function Settings({
  packages,
  setPackages,
  addons,
  setAddons,
}: {
  packages: CatalogItem[];
  setPackages: React.Dispatch<React.SetStateAction<CatalogItem[]>>;
  addons: CatalogItem[];
  setAddons: React.Dispatch<React.SetStateAction<CatalogItem[]>>;
}) {
  const [tab, setTab] = useState<Tab>("studio");
  const [editing, setEditing] = useState<{
    type: "packages" | "addons";
    item: CatalogItem;
  } | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const saveCatalog = async () => {
    if (!editing) return;
    setError("");
    const { data, error: e } = await supabase
      .from(editing.type)
      .upsert(editing.item)
      .select()
      .single();
    if (e) setError(e.message);
    else {
      const setter = editing.type === "packages" ? setPackages : setAddons;
      setter((items) =>
        items.some((x) => x.id === (data as CatalogItem).id)
          ? items.map((x) =>
              x.id === (data as CatalogItem).id ? (data as CatalogItem) : x,
            )
          : [...items, data as CatalogItem],
      );
      setEditing(null);
      setMessage(
        "Catalog updated. Historical booking snapshots were not changed.",
      );
    }
  };
  const tabs: Array<{ id: Tab; label: string; icon: any }> = [
    { id: "studio", label: "Studio", icon: "Store" },
    { id: "payment", label: "Payment", icon: "CreditCard" },
    { id: "profile", label: "Admin profile", icon: "UserRound" },
  ];
  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Workspace settings</p>
          <h2>Studio configuration</h2>
          <p>Manage customer-facing details and your service catalog.</p>
        </div>
      </div>
      <div className="settings-layout">
        <Card className="settings-nav">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={tab === t.id ? "active" : ""}
              onClick={() => setTab(t.id)}
            >
              <Icon name={t.icon} />
              <span>{t.label}</span>
              <Icon name="ChevronRight" size={15} />
            </button>
          ))}
        </Card>
        <Card className="settings-panel">
          {message && (
            <div className="success-message">
              <Icon name="CircleCheck" />
              {message}
            </div>
          )}
          {error && <div className="form-error">{error}</div>}
          {tab === "studio" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setMessage("Studio information saved.");
              }}
            >
              <div className="section-heading">
                <div>
                  <h2>Studio information</h2>
                  <p>Basic details shown to customers.</p>
                </div>
              </div>
              <div className="form-grid">
                <Field label="Studio name">
                  <input defaultValue="Isora Studio" />
                </Field>
                <Field label="Contact email">
                  <input type="email" placeholder="hello@isorastudio.com" />
                </Field>
                <Field label="Contact number">
                  <input placeholder="+63 9XX XXX XXXX" />
                </Field>
                <Field label="Timezone">
                  <input value="Asia/Manila (PHT)" disabled />
                </Field>
                <Field label="Opening time">
                  <input type="time" defaultValue="08:00" />
                </Field>
                <Field label="Closing time">
                  <input type="time" defaultValue="22:00" />
                </Field>
                <Field label="Studio address">
                  <textarea rows={3} placeholder="Complete studio address" />
                </Field>
              </div>
              <div className="form-actions">
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          )}
          {tab === "catalog" && (
            <>
              <div className="section-heading">
                <div>
                  <h2>Packages & prices</h2>
                  <p>
                    Edits apply only to future selections. Existing booking JSON
                    snapshots remain unchanged.
                  </p>
                </div>
                <Button
                  icon="Plus"
                  onClick={() =>
                    setEditing({
                      type: "packages",
                      item: {
                        id: crypto.randomUUID(),
                        name: "",
                        price: 0,
                        active: true,
                      },
                    })
                  }
                >
                  Add package
                </Button>
              </div>
              <div className="catalog-list">
                {packages.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setEditing({ type: "packages", item })}
                  >
                    <span className="catalog-icon">
                      <Icon name="Package" />
                    </span>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.description || "Studio package"}</span>
                    </div>
                    <b>{peso(item.price)}</b>
                    <Icon name="Pencil" size={15} />
                  </button>
                ))}
                {!packages.length && (
                  <p className="inline-empty">
                    No package catalog table rows found.
                  </p>
                )}
              </div>
              <div className="section-heading section-heading--spaced">
                <div>
                  <h2>Add-ons & prices</h2>
                  <p>Optional enhancements for future bookings.</p>
                </div>
                <Button
                  variant="secondary"
                  icon="Plus"
                  onClick={() =>
                    setEditing({
                      type: "addons",
                      item: {
                        id: crypto.randomUUID(),
                        name: "",
                        price: 0,
                        active: true,
                      },
                    })
                  }
                >
                  Add add-on
                </Button>
              </div>
              <div className="catalog-list">
                {addons.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setEditing({ type: "addons", item })}
                  >
                    <span className="catalog-icon">
                      <Icon name="Sparkles" />
                    </span>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.description || "Booking add-on"}</span>
                    </div>
                    <b>{peso(item.price)}</b>
                    <Icon name="Pencil" size={15} />
                  </button>
                ))}
                {!addons.length && (
                  <p className="inline-empty">
                    No add-on catalog table rows found.
                  </p>
                )}
              </div>
            </>
          )}
          {tab === "discounts" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setMessage("Birthday discount details saved.");
              }}
            >
              <div className="section-heading">
                <div>
                  <h2>Birthday discount</h2>
                  <p>Configure the birthday offer displayed during booking.</p>
                </div>
              </div>
              <div className="form-grid">
                <Field label="Discount percentage">
                  <input type="number" min="0" max="100" defaultValue="10" />
                </Field>
                <Field label="Eligibility window">
                  <input placeholder="Within 7 days of birthday" />
                </Field>
                <Field label="Customer-facing details">
                  <textarea
                    rows={4}
                    placeholder="Describe validation requirements and terms."
                  />
                </Field>
              </div>
              <div className="form-actions">
                <Button type="submit">Save discount</Button>
              </div>
            </form>
          )}
          {tab === "payment" && (
            <div className="placeholder-panel">
              <span className="state-icon">
                <Icon name="QrCode" />
              </span>
              <p className="eyebrow">Coming soon</p>
              <h2>Payment configuration</h2>
              <p>
                PayMongo and QRPh integration is not active yet. Paid status
                must only be applied after payment is verified outside the
                platform.
              </p>
              <Button variant="secondary" disabled>
                Connect payment provider
              </Button>
            </div>
          )}
          {tab === "profile" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setMessage("Admin profile saved.");
              }}
            >
              <div className="section-heading">
                <div>
                  <h2>Admin profile</h2>
                  <p>Your details inside this workspace.</p>
                </div>
              </div>
              <div className="form-grid">
                <Field label="Full name">
                  <input placeholder="Studio Admin" />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    disabled
                    placeholder="Authenticated email"
                  />
                </Field>
              </div>
              <div className="form-actions">
                <Button type="submit">Save profile</Button>
              </div>
            </form>
          )}
        </Card>
      </div>
      {editing && (
        <Modal
          title={editing.item.name ? "Edit catalog item" : "Add catalog item"}
          onClose={() => setEditing(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button onClick={saveCatalog}>Save item</Button>
            </>
          }
        >
          <div className="form-grid">
            <Field label="Name">
              <input
                value={editing.item.name}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    item: { ...editing.item, name: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Price (PHP)">
              <input
                type="number"
                min="0"
                value={editing.item.price}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    item: { ...editing.item, price: Number(e.target.value) },
                  })
                }
              />
            </Field>
            <Field label="Description">
              <textarea
                rows={3}
                value={editing.item.description || ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    item: { ...editing.item, description: e.target.value },
                  })
                }
              />
            </Field>
          </div>
          <p className="snapshot-note">
            <Icon name="ShieldCheck" /> Saving this will not update package or
            add-on snapshots stored in existing bookings.
          </p>
        </Modal>
      )}
    </div>
  );
}
