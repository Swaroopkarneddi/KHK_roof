import React from "react";
import { accessoryList } from "../data/roofdata";

const AccessorySelector = ({ selectedAcc = [], setSelectedAcc }) => {
  const list = Array.isArray(accessoryList) ? accessoryList : [];
  const selected = Array.isArray(selectedAcc) ? selectedAcc : [];

  const toggleAccessory = (id) => {
    try {
      setSelectedAcc((prev) => {
        const p = Array.isArray(prev) ? prev : [];
        return p.includes(id) ? p.filter((a) => a !== id) : [...p, id];
      });
    } catch (err) {
      console.error("AccessorySelector toggle:", err);
    }
  };

  if (list.length === 0) {
    return (
      <div className="card">
        <h3>Accessories</h3>
        <p className="accessory-empty">No accessories available.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Accessories</h3>
      {list.map((acc) => (
        <label
          key={acc.id}
          className="checkbox-label"
          style={{ display: "block", margin: "5px 0" }}
        >
          <input
            type="checkbox"
            checked={selected.includes(acc.id)}
            onChange={() => toggleAccessory(acc.id)}
            aria-label={acc.label}
          />
          {acc?.label ?? acc.id} (₹{Number(acc?.price ?? 0).toFixed(2)})
        </label>
      ))}
    </div>
  );
};

export default AccessorySelector;
