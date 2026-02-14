import React, { useState } from "react";
import InputSection from "./components/InputSection";
import AccessorySelector from "./components/AccessorySelector";
import InvoiceTable from "./components/InvoiceTable";
import { calculateSheets } from "./utils/calculations";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    type: "",
    subType: "",
    width: 0,
    length: 0,
    unit: "ft",
    price: 0,
  });
  const [selectedAcc, setSelectedAcc] = useState([]);
  const [results, setResults] = useState(null);

  const handleCalculate = () => {
    const calc = calculateSheets(
      formData.type,
      formData.subType,
      formData.width,
      formData.length,
      formData.unit,
    );
    setResults({ ...formData, ...calc });
  };

  const totalPrice = results ? (results.count * results.price).toFixed(2) : 0;

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
          <button className="calc-btn" onClick={handleCalculate}>
            Calculate & Generate Invoice
          </button>
        </div>
        <div className="output-side">
          <InvoiceTable
            results={results}
            accessories={selectedAcc}
            totalPrice={totalPrice}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
