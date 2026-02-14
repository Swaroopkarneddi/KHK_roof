import React, { useMemo } from "react";

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    num,
  );

const InvoiceTable = ({
  results,
  selectedAccIds,
  accessoryList,
  totalPrice, // This is our Taxable Value (Base Price)
  customerName,
  contactNumber,
}) => {
  // --- GST Calculations ---
  const gstRate = 18;
  const gstAmount = (totalPrice * gstRate) / 100;
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
  const finalGrandTotal = totalPrice + gstAmount;

  const invoiceDate = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const invoiceId = useMemo(() => {
    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);
    return `#INV-${timestamp}`;
  }, []);

  if (!results)
    return (
      <div className="invoice-container">
        <header className="invoice-header">
          <h2>Roofing Quote / Invoice</h2>
        </header>
        <p className="placeholder">
          Enter dimensions and click{" "}
          <strong>Calculate & Generate Invoice</strong> to see your quote.
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

      <div className="invoice-details" style={{ marginLeft: "10px" }}>
        <div className="details-col">
          <p>
            <strong>Customer Name:</strong> {customerName}
          </p>
          <p>
            <strong>Contact No:</strong> {contactNumber}
          </p>
        </div>
        <div className="details-col align-right">
          <p>
            <strong>Date:</strong> {invoiceDate}
          </p>
          <p>
            <strong>Invoice No:</strong> {invoiceId}
          </p>
        </div>
      </div>
      <hr className="invoice-divider" />

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
                      Sheet: {results.sheetWidthFt}ft ×{" "}
                      {row.lengthFt.toFixed(2)}ft
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
        {/* Breakdown for GST compliance */}
        <div>
          <div
            className="summary-row"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>Taxable Value</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
          <div
            className="summary-row"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>CGST (9%)</span>
            <span>{formatCurrency(cgst)}</span>
          </div>
          <div
            className="summary-row"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>SGST (9%)</span>
            <span>{formatCurrency(sgst)}</span>
          </div>
        </div>
        <hr />
        <div className="summary-row total">
          <span style={{ fontWeight: "bold" }}>Grand Total (Incl. GST)</span>
          <span style={{ fontWeight: "bold" }}>
            {formatCurrency(finalGrandTotal)}
          </span>
        </div>

        <button
          type="button"
          className="print-btn no-print"
          onClick={() => window.print()}
          style={{ marginTop: "20px" }}
        >
          Download PDF / Print
        </button>
      </div>
    </div>
  );
};

export default InvoiceTable;
