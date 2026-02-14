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
      <h3 className="card-title">Dimensions & Type</h3>

      <div className="form-group">
        <label className="form-label" htmlFor="roof-type">
          Roof type
        </label>
        <select
          id="roof-type"
          value={formData.type ?? ""}
          onChange={(e) => handleChange("type", e.target.value)}
          aria-label="Roof type"
        >
          <option value="">Select type</option>
          {types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label ?? t.id}
            </option>
          ))}
        </select>
      </div>

      {selectedType && subTypes.length > 0 && (
        <div className="form-group">
          <label className="form-label" htmlFor="sub-type">
            Sub-type
          </label>
          <select
            id="sub-type"
            value={formData.subType ?? ""}
            onChange={(e) => handleChange("subType", e.target.value)}
            aria-label="Sub-type"
          >
            <option value="">Select sub-type</option>
            {subTypes.map((st) => (
              <option key={st.id} value={st.id}>
                {st.label ?? st.id}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="dimensions-grid">
        <div className="form-group">
          <label className="form-label" htmlFor="width">
            Width
          </label>
          <input
            id="width"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 10"
            value={formData.width ?? ""}
            onChange={(e) => handleChange("width", e.target.value)}
            aria-label="Width"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="length">
            Length
          </label>
          <input
            id="length"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 20"
            value={formData.length ?? ""}
            onChange={(e) => handleChange("length", e.target.value)}
            aria-label="Length"
          />
        </div>
        <div className="form-group form-group-full">
          <label className="form-label" htmlFor="unit">
            Unit
          </label>
          <select
            id="unit"
            value={formData.unit ?? "ft"}
            onChange={(e) => handleChange("unit", e.target.value)}
            aria-label="Unit"
          >
            <option value="ft">Feet (ft)</option>
            <option value="meter">Meters (m)</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="price">
          Price per unit (₹)
        </label>
        <input
          id="price"
          type="number"
          min={0}
          step="any"
          placeholder="e.g. 45"
          value={formData.price ?? ""}
          onChange={(e) => handleChange("price", e.target.value)}
          aria-label="Price per sheet"
        />
      </div>
    </div>
  );
};

export default InputSection;
