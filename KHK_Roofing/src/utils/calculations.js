export const calculateSheets = (type, subType, width, length, unit) => {
  // Convert everything to meters for internal calculation if needed
  const factor = unit === "ft" ? 0.3048 : 1;
  const area = width * factor * (length * factor);

  // Example Logic: Different math based on subType
  let sheetCount = 0;
  if (subType === "corrugated") {
    sheetCount = Math.ceil(area / 1.5); // Example: 1.5sqm per sheet
  } else {
    sheetCount = Math.ceil(area / 2.0); // Example: 2.0sqm per sheet
  }

  return {
    count: sheetCount,
    area: area.toFixed(2),
  };
};
