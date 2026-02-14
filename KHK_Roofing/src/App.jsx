import React, { useState, useCallback, useMemo } from "react";
import InputSection from "./components/InputSection";
import AccessorySelector from "./components/AccessorySelector";
import InvoiceTable from "./components/InvoiceTable";
import { calculateSheets } from "./utils/calculations";
import { accessoryList } from "./data/roofdata";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    type: "",
    subType: "",
    width: "",
    length: "",
    unit: "ft",
    price: "",
  });
  const [selectedAcc, setSelectedAcc] = useState([]);
  const [results, setResults] = useState(null);
  const [calcError, setCalcError] = useState(null);

  const handleCalculate = useCallback(() => {
    setCalcError(null);
    try {
      const { type, subType, width, length, unit, price } = formData;

      // Validate basic inputs
      if (!type || !subType || !width || !length || !price) {
        setCalcError("Please fill in all fields, including price.");
        setResults(null);
        return;
      }

      const calc = calculateSheets(type, subType, width, length, unit, price);

      if (calc.error) {
        setCalcError(calc.error);
        setResults(null);
        return;
      }

      setResults(calc);
    } catch (err) {
      setCalcError("Something went wrong with the calculation.");
      setResults(null);
    }
  }, [formData]);

  // useMemo for performance - recalculates only when results or selectedAcc changes
  const totalPrice = useMemo(() => {
    if (!results) return 0;

    // 1. Base Price from Sheets (already calculated in utils)
    const basePrice = results.totalBasePrice || 0;

    // 2. Accessory Price (multiplied by sheet count)
    const accessoryTotal = selectedAcc.reduce((sum, id) => {
      const acc = accessoryList.find((a) => a.id === id);
      // Assuming accessories are quantity per total sheets
      return sum + (acc ? acc.price * (results.count || 1) : 0);
    }, 0);

    return Number((basePrice + accessoryTotal).toFixed(2));
  }, [results, selectedAcc]);

  return (
    <div className="container">
      <h1>Roof Sheet Calculator</h1>
      <div className="main-layout">
        <div className="input-side">
          <InputSection formData={formData} setFormData={setFormData} />
          <AccessorySelector
            selectedAcc={selectedAcc}
            setSelectedAcc={setSelectedAcc}
          />

          {calcError && <div className="error-message">{calcError}</div>}

          <button className="calc-btn" onClick={handleCalculate}>
            Calculate & Generate Invoice
          </button>
        </div>

        <div className="output-side">
          <InvoiceTable
            results={results}
            selectedAccIds={selectedAcc}
            accessoryList={accessoryList}
            totalPrice={totalPrice}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
