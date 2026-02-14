const TRAP_SINGLE = {
  maxLen: 20.0,
  lenOverlap: 1.0,
  sheetWidth: 3.71,
  effectiveWidth: 3.5,
};

const M_TO_FT = 3.28084;
const toFeet = (val, unit) => (unit === "meter" ? val * M_TO_FT : val);

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
    const { maxLen, lenOverlap, sheetWidth, effectiveWidth } = TRAP_SINGLE;

    const sheetsAlongLength =
      lFt <= maxLen ? 1 : Math.ceil((lFt - maxLen) / (maxLen - lenOverlap)) + 1;
    const sheetsAlongWidth =
      wFt <= sheetWidth
        ? 1
        : Math.ceil((wFt - sheetWidth) / effectiveWidth) + 1;

    const sheetLengths = [];
    let remaining = lFt;
    for (let i = 0; i < sheetsAlongLength; i++) {
      let currentLen =
        i === 0
          ? Math.min(lFt, maxLen)
          : Math.min(remaining + lenOverlap, maxLen);
      sheetLengths.push({ lengthFt: currentLen, count: sheetsAlongWidth });
      remaining -= maxLen - lenOverlap;
    }

    const totalPaidAreaSqFt = sheetLengths.reduce(
      (s, r) => s + r.lengthFt * sheetWidth * r.count,
      0,
    );

    return {
      type,
      subType,
      unit,
      width,
      length,
      count: sheetsAlongLength * sheetsAlongWidth,
      sheetLengths,
      sheetWidthFt: sheetWidth,
      totalPaidAreaSqFt,
      actualAreaSqFt: wFt * lFt,
      totalBasePrice: totalPaidAreaSqFt * price, // Pricing by SqFt for Trapezoidal
      pricePerUnit: price,
    };
  }

  // Fallback for standard types
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
    totalBasePrice: count * price, // Pricing by piece for others
    pricePerUnit: price,
  };
};
