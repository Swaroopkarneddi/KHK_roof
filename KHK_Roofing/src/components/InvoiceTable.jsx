import React from "react";

const InvoiceTable = ({
  results,
  selectedAccIds,
  accessoryList,
  totalPrice,
}) => {
  if (!results)
    return (
      <div className="invoice-container">
        <h2>Quote</h2>
        <p>Please calculate to see results.</p>
      </div>
    );

  const selectedAccessories = (selectedAccIds || [])
    .map((id) => accessoryList.find((a) => a.id === id))
    .filter(Boolean);

  return (
    <div className="invoice-container">
      <h2>Roofing Quote / Invoice</h2>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {results.sheetLengths ? (
            results.sheetLengths.map((row, i) => {
              const rowArea = row.lengthFt * results.sheetWidthFt * row.count;
              const rowPrice = rowArea * results.pricePerUnit;
              return (
                <tr key={i}>
                  <td>
                    Sheet: {results.sheetWidthFt}ft x {row.lengthFt.toFixed(2)}
                    ft
                  </td>
                  <td>{row.count}</td>
                  <td>₹{results.pricePerUnit}/sqft</td>
                  <td>₹{rowPrice.toFixed(2)}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td>{results.type} Sheets</td>
              <td>{results.count}</td>
              <td>₹{results.pricePerUnit}/pc</td>
              <td>₹{(results.count * results.pricePerUnit).toFixed(2)}</td>
            </tr>
          )}
          {selectedAccessories.map((acc, i) => (
            <tr key={`acc-${i}`} className="accessory-row">
              <td>{acc.label}</td>
              <td>{results.count}</td>
              <td>₹{acc.price}</td>
              <td>₹{(acc.price * results.count).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="total-section">
        <h3>Grand Total: ₹{totalPrice.toLocaleString("en-IN")}</h3>
      </div>
    </div>
  );
};

export default InvoiceTable;
