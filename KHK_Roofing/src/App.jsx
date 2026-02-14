import React, { useState, useCallback } from "react";
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
      const width = formData.width === "" ? 0 : Number(formData.width);
      const length = formData.length === "" ? 0 : Number(formData.length);
      const price = formData.price === "" ? 0 : Number(formData.price);

      const calc = calculateSheets(
        formData.type,
        formData.subType,
        width,
        length,
        formData.unit,
      );

      if (calc.error) {
        setCalcError(calc.error);
        setResults(null);
        return;
      }

      setResults({
        ...formData,
        width,
        length,
        price,
        count: calc.count,
        area: calc.area,
      });
    } catch (err) {
      setCalcError(err?.message || "Something went wrong.");
      setResults(null);
    }
  }, [formData]);

  const totalPrice = (() => {
    if (!results) return 0;
    const sheetTotal = (results.count ?? 0) * (results.price ?? 0);
    const accessoryTotal = (selectedAcc || []).reduce((sum, id) => {
      const acc = accessoryList?.find((a) => a.id === id);
      return sum + (acc?.price ?? 0);
    }, 0);
    return Number((sheetTotal + accessoryTotal).toFixed(2));
  })();

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
          {calcError && (
            <div className="error-message" role="alert">
              {calcError}
            </div>
          )}
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
