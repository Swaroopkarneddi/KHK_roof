const TRAP_SINGLE = {
  maxLen: 20.0,
  lenOverlap: 1.0,
  sheetWidth: 3.71,
  effectiveWidth: 3.5,
};

const M_TO_FT = 3.28084;
const toFeet = (val, unit) => (unit === "meter" ? val * M_TO_FT : val);

function calculateTrapezoidalSingleSide(lFt, wFt, pricePerSqFt) {
  const { maxLen, lenOverlap, sheetWidth, effectiveWidth } = TRAP_SINGLE;

  const sheetsAlongLength =
    lFt <= maxLen ? 1 : Math.ceil((lFt - maxLen) / (maxLen - lenOverlap)) + 1;
  const sheetsAlongWidth =
    wFt <= sheetWidth ? 1 : Math.ceil((wFt - sheetWidth) / effectiveWidth) + 1;

  // Use a Map to group sheets by length to avoid repetition
  const groupedSheets = new Map();

  let remaining = lFt;
  for (let i = 0; i < sheetsAlongLength; i++) {
    let currentLen =
      i === 0
        ? Math.min(lFt, maxLen)
        : Math.min(remaining + lenOverlap, maxLen);

    // Round to 2 decimals to ensure Map keys match correctly
    const key = Number(currentLen.toFixed(2));
    const existingCount = groupedSheets.get(key) || 0;
    groupedSheets.set(key, existingCount + sheetsAlongWidth);

    remaining -= maxLen - lenOverlap;
  }

  // Convert Map back to an array for the table
  const sheetLengths = Array.from(groupedSheets.entries()).map(
    ([length, count]) => ({
      lengthFt: length,
      count: count,
    }),
  );

  const totalPaidAreaSqFt = sheetLengths.reduce(
    (s, r) => s + r.lengthFt * sheetWidth * r.count,
    0,
  );

  return {
    count: sheetsAlongLength * sheetsAlongWidth,
    sheetLengths,
    sheetWidthFt: sheetWidth,
    totalPaidAreaSqFt,
    actualAreaSqFt: wFt * lFt,
    totalBasePrice: totalPaidAreaSqFt * pricePerSqFt,
  };
}

export const calculateSheets = (
  type,
  subType,
  width,
  length,
  unit,
  priceInput,
) => {
  const wFt = toFeet(Number(width), unit);
  const lFt = toFeet(Number(length), unit);
  const price = Number(priceInput);

  if (type === "Trapezoidal" && subType === "Single Side") {
    const result = calculateTrapezoidalSingleSide(lFt, wFt, price);
    return {
      ...result,
      type,
      subType,
      unit,
      width,
      length,
      pricePerUnit: price,
    };
  }

  // Standard Logic
  const areaSqFt = wFt * lFt;
  const count =
    subType === "Single Side"
      ? Math.ceil(areaSqFt / 15)
      : Math.ceil(areaSqFt / 20);
  return {
    type,
    subType,
    unit,
    width,
    length,
    count,
    area: areaSqFt,
    totalBasePrice: count * price,
    pricePerUnit: price,
  };
};
