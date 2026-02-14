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
        <header className="invoice-header">
          <h2>Roofing Quote / Invoice</h2>
        </header>
        <p className="placeholder">
          Enter dimensions and click <strong>Calculate & Generate Invoice</strong> to see your quote.
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

      <div className="invoice-table-wrap">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>S.No.</th>
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
                  <td>{i + 1}</td>
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
              <td>1</td>
              <td>{results.type} Sheets</td>
              <td>{results.count}</td>
              <td>{results.pricePerUnit}/pc</td>
              <td>{formatCurrency(results.totalBasePrice)}</td>
            </tr>
          )}

          {selectedAccessories.map((acc, i) => {
            const baseCount = results.sheetLengths
              ? results.sheetLengths.length
              : 1;
            return (
              <tr key={`acc-${i}`} className="accessory-row">
                <td>{baseCount + i + 1}</td>
                <td>{acc.label}</td>
                <td>{results.count}</td>
                <td>{acc.price}/unit</td>
                <td>{formatCurrency(acc.price * results.count)}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>

      <div className="invoice-summary">
        <div className="summary-row total">
          <span>Grand Total</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <button type="button" className="print-btn no-print" onClick={() => window.print()}>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default InvoiceTable;
