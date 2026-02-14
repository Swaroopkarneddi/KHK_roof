import React from "react";

const InvoiceTable = ({ results, accessories, totalPrice }) => {
  if (!results) return null;

  return (
    <div className="invoice-container">
      <h2>Roofing Quote / Invoice</h2>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Type</th>
            <th>Size (W x L)</th>
            <th>Sheets</th>
            <th>Area</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>{results.subType}</td>
            <td>
              {results.width} x {results.length} {results.unit}
            </td>
            <td>{results.count}</td>
            <td>{results.area} m²</td>
            <td>${(results.count * results.price).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div className="accessories-summary">
        <h4>Included Accessories:</h4>
        <ul>
          {accessories.length > 0 ? (
            accessories.map((a) => <li key={a}>{a}</li>)
          ) : (
            <li>None</li>
          )}
        </ul>
      </div>

      <h3 className="total">Total Estimate: ${totalPrice}</h3>
      <button onClick={() => window.print()} className="print-btn">
        Download Invoice (PDF)
      </button>
    </div>
  );
};

export default InvoiceTable;
