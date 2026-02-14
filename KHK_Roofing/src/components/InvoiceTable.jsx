import React from "react";

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    num,
  );

const InvoiceTable = ({
  results,
  selectedAccIds,
  accessoryList,
  totalPrice,
}) => {
  if (!results)
    return (
      <div className="invoice-container">
        <h2>Invoice</h2>
        <p className="placeholder">
          Calculate dimensions to generate the quote.
        </p>
      </div>
    );

  const selectedAccessories = (selectedAccIds || [])
    .map((id) => accessoryList.find((a) => a.id === id))
    .filter(Boolean);

  return (
    <div className="invoice-container">
      <header className="invoice-header">
        <h2>Roofing Quote / Invoice</h2>
      </header>

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
              const rowSubtotal = rowArea * results.pricePerUnit;
              return (
                <tr key={i}>
                  <td>
                    Sheet: {results.sheetWidthFt}ft × {row.lengthFt.toFixed(2)}
                    ft
                  </td>
                  <td>{row.count}</td>
                  <td>{results.pricePerUnit}/sqft</td>
                  <td>{formatCurrency(rowSubtotal)}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td>{results.type} Sheets</td>
              <td>{results.count}</td>
              <td>{results.pricePerUnit}/pc</td>
              <td>{formatCurrency(results.totalBasePrice)}</td>
            </tr>
          )}

          {selectedAccessories.map((acc, i) => (
            <tr key={`acc-${i}`} className="accessory-row">
              <td>{acc.label}</td>
              <td>{results.count}</td>
              <td>{acc.price}/unit</td>
              <td>{formatCurrency(acc.price * results.count)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="invoice-summary">
        <div className="summary-row total">
          <span>Grand Total:</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <button className="print-btn no-print" onClick={() => window.print()}>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default InvoiceTable;
