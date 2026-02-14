import React from "react";
import { roofData } from "../data/roofdata";

const InputSection = ({ formData, setFormData }) => {
  const types = Array.isArray(roofData) ? roofData : [];
  const selectedType = types.find((t) => t?.id === formData.type);
  const subTypes = selectedType?.subTypes ?? [];

  const handleChange = (field, value) => {
    try {
      setFormData((prev) => {
        const next = { ...prev, [field]: value };
        if (field === "type") next.subType = "";
        return next;
      });
    } catch (err) {
      console.error("InputSection handleChange:", err);
    }
  };

  return (
    <div className="card">
      <h3>Dimensions & Type</h3>
      <select
        value={formData.type ?? ""}
        onChange={(e) => handleChange("type", e.target.value)}
        aria-label="Roof type"
      >
        <option value="">Select Type</option>
        {types.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label ?? t.id}
          </option>
        ))}
      </select>

      {selectedType && subTypes.length > 0 && (
        <select
          style={{ marginTop: "10px" }}
          value={formData.subType ?? ""}
          onChange={(e) => handleChange("subType", e.target.value)}
          aria-label="Sub-type"
        >
          <option value="">Select Sub-Type</option>
          {subTypes.map((st) => (
            <option key={st.id} value={st.id}>
              {st.label ?? st.id}
            </option>
          ))}
        </select>
      )}

      <div className="grid">
        <input
          type="number"
          min={0}
          step="any"
          placeholder="Width"
          value={formData.width ?? ""}
          onChange={(e) => handleChange("width", e.target.value)}
          aria-label="Width"
        />
        <input
          type="number"
          min={0}
          step="any"
          placeholder="Length"
          value={formData.length ?? ""}
          onChange={(e) => handleChange("length", e.target.value)}
          aria-label="Length"
        />
        <select
          value={formData.unit ?? "ft"}
          onChange={(e) => handleChange("unit", e.target.value)}
          aria-label="Unit"
        >
          <option value="ft">Feet (ft)</option>
          <option value="meter">Meters (m)</option>
        </select>
      </div>

      <input
        type="number"
        min={0}
        step="any"
        placeholder="Price per Sheet"
        value={formData.price ?? ""}
        onChange={(e) => handleChange("price", e.target.value)}
        aria-label="Price per sheet"
      />
    </div>
  );
};

export default InputSection;
