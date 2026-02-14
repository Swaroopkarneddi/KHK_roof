import React from "react";
import { accessoryList } from "../data/roofdata"; // Ensure the case matches your filename

const AccessorySelector = ({ selectedAcc, setSelectedAcc }) => {
  const toggleAccessory = (id) => {
    setSelectedAcc((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  return (
    <div className="card">
      <h3>Accessories</h3>
      {accessoryList.map((acc) => {
        // Explicit return inside the map
        return (
          <label
            key={acc.id}
            className="checkbox-label"
            style={{ display: "block", margin: "5px 0" }}
          >
            <input
              type="checkbox"
              checked={selectedAcc.includes(acc.id)}
              onChange={() => toggleAccessory(acc.id)}
            />
            {acc.label} (${acc.price})
          </label>
        );
      })}
    </div>
  );
};

export default AccessorySelector;
