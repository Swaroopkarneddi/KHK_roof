import React from "react";
import { roofData } from "../data/roofdata";

const InputSection = ({ formData, setFormData }) => {
  const selectedType = roofData.find((t) => t.id === formData.type);

  return (
    <div className="card">
      <h3>Dimensions & Type</h3>
      <select
        onChange={(e) =>
          setFormData({ ...formData, type: e.target.value, subType: "" })
        }
      >
        <option value="">Select Type</option>
        {roofData.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>

      {selectedType && (
        <select
          onChange={(e) =>
            setFormData({ ...formData, subType: e.target.value })
          }
        >
          <option value="">Select Sub-Type</option>
          {selectedType.subTypes.map((st) => (
            <option key={st.id} value={st.id}>
              {st.label}
            </option>
          ))}
        </select>
      )}

      <div className="grid">
        <input
          type="number"
          placeholder="Width"
          onChange={(e) => setFormData({ ...formData, width: e.target.value })}
        />
        <input
          type="number"
          placeholder="Length"
          onChange={(e) => setFormData({ ...formData, length: e.target.value })}
        />
        <select
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
        >
          <option value="ft">Feet (ft)</option>
          <option value="meter">Meters (m)</option>
        </select>
      </div>

      <input
        type="number"
        placeholder="Price per Sheet"
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
      />
    </div>
  );
};

export default InputSection;
