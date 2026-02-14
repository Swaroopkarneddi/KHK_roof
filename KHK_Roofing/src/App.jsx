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

  // NEW: State for customer details
  const [customerInfo, setCustomerInfo] = useState({
    name: "Walk-in Customer",
    contact: "N/A",
  });

  const [selectedAcc, setSelectedAcc] = useState([]);
  const [results, setResults] = useState(null);
  const [calcError, setCalcError] = useState(null);

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalculate = useCallback(() => {
    setCalcError(null);
    try {
      const { type, subType, width, length, unit, price } = formData;
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

  const totalPrice = useMemo(() => {
    if (!results) return 0;
    const basePrice = results.totalBasePrice || 0;
    const accessoryTotal = selectedAcc.reduce((sum, id) => {
      const acc = accessoryList.find((a) => a.id === id);
      return sum + (acc ? acc.price * (results.count || 1) : 0);
    }, 0);
    return Number((basePrice + accessoryTotal).toFixed(2));
  }, [results, selectedAcc]);

  return (
    <div className="container">
      <h1 className="app-title">Roof Sheet Calculator</h1>
      <div className="main-layout">
        <div className="input-side">
          {/* NEW: Customer Input Fields */}

          <InputSection formData={formData} setFormData={setFormData} />
          <AccessorySelector
            selectedAcc={selectedAcc}
            setSelectedAcc={setSelectedAcc}
            selectedCategory={formData.type}
          />
          <div className="input-group customer-inputs">
            <h3>Customer Details</h3>
            <label className="form-label" htmlFor="name">
              Customer Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Customer Name"
              value={customerInfo.name}
              onChange={handleCustomerChange}
              className="form-input"
              style={{ marginBottom: "10px" }}
            />
            <label className="form-label" htmlFor="contact">
              Contact Number
            </label>
            <input
              type="text"
              name="contact"
              placeholder="Contact Number"
              value={customerInfo.contact}
              onChange={handleCustomerChange}
              className="form-input"
            />
          </div>

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
            customerName={customerInfo.name} // Passing state
            contactNumber={customerInfo.contact} // Passing state
          />
        </div>
      </div>
    </div>
  );
}

export default App;
