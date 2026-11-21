"use client";
import { useState } from "react";
import { Download, Plus, Minus } from "lucide-react";
export function ProcurementList({ items }: { items: string[] }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const selected = items.filter((i) => quantities[i] > 0);
  function change(item: string, delta: number) {
    setQuantities((q) => ({
      ...q,
      [item]: Math.min(999, Math.max(0, (q[item] ?? 0) + delta)),
    }));
  }
  function download() {
    const text = [
      "KEMVILLE — PURCHASE ENQUIRY DRAFT",
      "Not an order. No stock, pricing or delivery confirmed.",
      "Quantities are provisional; pack sizes/specifications require confirmation.",
      "",
      ...selected.map((i) => `${i}: ${quantities[i]}`),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "kemville-purchase-enquiry.txt";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="procurement">
      <div>
        <p className="eyebrow">PREPARE A PURCHASE ENQUIRY</p>
        <h2>Your procurement list.</h2>
        {items.map((item) => (
          <div className="procurement-row" key={item}>
            <div>
              <h3>{item}</h3>
              <span>Specifications and pack sizes to be confirmed</span>
            </div>
            <div className="quantity">
              <button
                aria-label={"Remove " + item}
                disabled={!quantities[item]}
                onClick={() => change(item, -1)}
              >
                <Minus size={15} />
              </button>
              <output aria-label={item + " quantity"}>
                {quantities[item] ?? 0}
              </output>
              <button
                aria-label={"Add " + item}
                disabled={quantities[item] === 999}
                onClick={() => change(item, 1)}
              >
                <Plus size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <aside>
        <h3>Enquiry summary</h3>
        <p aria-live="polite">
          {selected.length} {selected.length === 1 ? "category" : "categories"}{" "}
          selected
        </p>
        <p>
          This list stays in this tab. Download a copy for your records; it is
          not sent to Kemville.
        </p>
        <button
          className="button"
          disabled={!selected.length}
          onClick={download}
        >
          Download list <Download size={17} />
        </button>
      </aside>
    </div>
  );
}
