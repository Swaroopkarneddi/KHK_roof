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
        <h3 className="card-title">Accessories</h3>
        <p className="accessory-empty">No accessories available.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="card-title">Accessories</h3>
      <div className="accessory-list">
        {list.map((acc) => {
          const isSelected = selected.includes(acc.id);
          return (
            <label
              key={acc.id}
              className={`accessory-option ${isSelected ? "selected" : ""}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleAccessory(acc.id)}
                aria-label={acc.label}
              />
              <span>{acc?.label ?? acc.id}</span>
              <span className="accessory-price">₹{Number(acc?.price ?? 0).toFixed(2)}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default AccessorySelector;
