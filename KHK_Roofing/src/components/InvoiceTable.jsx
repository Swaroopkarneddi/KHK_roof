import React from "react";

const formatNum = (n) => {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return Number(n);
};

const formatDecimal = (n, decimals = 2) => {
  const num = Number(n);
  if (n == null || Number.isNaN(num)) return "—";
  return num.toFixed(decimals);
};

const InvoiceTable = ({
  results,
  selectedAccIds = [],
  accessoryList = [],
  totalPrice = 0,
}) => {
  if (!results) {
    return (
      <div className="invoice-container">
        <h2>Roofing Quote / Invoice</h2>
        <p className="invoice-placeholder">
          Fill in dimensions and click &quot;Calculate &amp; Generate
          Invoice&quot; to see the quote.
        </p>
      </div>
    );
  }

  const count = results.count ?? 0;
  const price = results.price ?? 0;
  const sheetLengths = results.sheetLengths;
  const isTrapezoidalSingleSide =
    Array.isArray(sheetLengths) && sheetLengths.length > 0;
  const sheetWidthFt = results.sheetWidthFt;

  const sheetTotal = count * price;
  const typeDisplay =
    [results.type, results.subType].filter(Boolean).join(" – ") || "—";
  const list = Array.isArray(accessoryList) ? accessoryList : [];
  const accessoryLabels = (Array.isArray(selectedAccIds) ? selectedAccIds : [])
    .map((id) => list.find((a) => a?.id === id))
    .filter(Boolean)
    .map((a) => `${a.label} (₹${Number(a.price).toFixed(2)})`);

  return (
    <div className="invoice-container">
      <h2>Roofing Quote / Invoice</h2>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Type</th>
            <th>Size (W × L)</th>
            <th>Sheets</th>
            <th>Area</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {isTrapezoidalSingleSide ? (
            sheetLengths.map((row, idx) => {
              const rowSheets = row.count ?? 0;
              const rowPaidSqFt =
                (row.lengthFt ?? 0) * (sheetWidthFt ?? 3.71) * rowSheets;
              const rowPrice = rowSheets * price;
              return (
                <tr key={`sheet-${idx}`}>
                  <td>{idx + 1}</td>
                  <td>{typeDisplay}</td>
                  <td>
                    {formatNum(sheetWidthFt)} × {formatNum(row.lengthFt)} ft
                  </td>
                  <td>{formatNum(rowSheets)}</td>
                  <td>{formatDecimal(rowPaidSqFt)} sq ft</td>
                  <td>₹{formatDecimal(rowPrice)}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td>1</td>
              <td>{typeDisplay}</td>
              <td>
                {formatNum(results.width)} × {formatNum(results.length)}{" "}
                {results.unit ?? "ft"}
              </td>
              <td>{formatNum(count)}</td>
              <td>{formatDecimal(results.area)} m²</td>
              <td>₹{formatDecimal(sheetTotal)}</td>
            </tr>
          )}
        </tbody>
      </table>

      {isTrapezoidalSingleSide && (
        <div
          className="trapezoidal-summary"
          style={{ marginTop: "12px", fontSize: "0.95em" }}
        >
          <p>
            <strong>Sheets along length:</strong>{" "}
            {results.sheetsAlongLength ?? "—"}
          </p>
          <p>
            <strong>Sheets along width:</strong>{" "}
            {results.sheetsAlongWidth ?? "—"}
          </p>
          <p>
            <strong>Total sheets:</strong> {formatNum(count)}
          </p>
          <p>
            <strong>Total paid area:</strong>{" "}
            {formatDecimal(results.totalPaidAreaSqFt)} sq ft
          </p>
          <p>
            <strong>Actual roof area:</strong>{" "}
            {formatDecimal(results.actualAreaSqFt)} sq ft
          </p>
          <p>
            <strong>Extra (overlap & wastage):</strong>{" "}
            {formatDecimal(
              Number(results.totalPaidAreaSqFt) -
                Number(results.actualAreaSqFt),
            )}{" "}
            sq ft
          </p>
        </div>
      )}

      <div className="accessories-summary">
        <h4>Included Accessories:</h4>
        <ul>
          {accessoryLabels.length > 0 ? (
            accessoryLabels.map((label, i) => <li key={`acc-${i}`}>{label}</li>)
          ) : (
            <li>None</li>
          )}
        </ul>
      </div>

      <h3 className="total">Total Estimate: ₹{formatDecimal(totalPrice)}</h3>
      <button
        type="button"
        onClick={() => window.print()}
        className="print-btn"
      >
        Download Invoice (PDF)
      </button>
    </div>
  );
};

export default InvoiceTable;
