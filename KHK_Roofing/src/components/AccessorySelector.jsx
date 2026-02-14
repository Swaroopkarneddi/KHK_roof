import React from "react";
import { accessoryList } from "../data/roofdata";

const AccessorySelector = ({
  selectedAcc = [],
  setSelectedAcc,
  selectedCategory,
}) => {
  const list = Array.isArray(accessoryList) ? accessoryList : [];
  const selected = Array.isArray(selectedAcc) ? selectedAcc : [];

  // Filter list based on the selectedCategory from InputSection
  const filteredList = list.filter((acc) => acc.category === selectedCategory);

  const toggleAccessory = (id) => {
    setSelectedAcc((prev) => {
      const p = Array.isArray(prev) ? prev : [];
      return p.includes(id) ? p.filter((a) => a !== id) : [...p, id];
    });
  };

  // If no category is selected yet
  if (!selectedCategory) {
    return (
      <div className="card">
        <h3 className="card-title">Accessories</h3>
        <p className="accessory-empty">Please select a roof type first.</p>
      </div>
    );
  }

  // If the category has no accessories
  if (filteredList.length === 0) {
    return (
      <div className="card">
        <h3 className="card-title">Accessories</h3>
        <p className="accessory-empty">
          No accessories available for {selectedCategory}.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="card-title">Accessories for {selectedCategory}</h3>
      <div className="accessory-list">
        {filteredList.map((acc) => {
          const isSelected = selected.includes(acc.id);
          return (
            <label
              key={`${acc.category}-${acc.id}`} // Unique key using category + id
              className={`accessory-option ${isSelected ? "selected" : ""}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleAccessory(acc.id)}
                aria-label={acc.label}
              />
              <span>{acc?.label ?? acc.id}</span>
              <span className="accessory-price">
                ₹{Number(acc?.price ?? 0).toFixed(2)}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default AccessorySelector;
