/**
 * Constants for Trapezoidal Single Side sheet calculation (feet).
 */
const TRAP_SINGLE = {
  maxLen: 20.0,
  lenOverlap: 1.0,
  sheetWidth: 3.71,
  effectiveWidth: 3.5,
};

const FT_TO_M2 = 0.09290304; // 1 sq ft = 0.09290304 m²
const M_TO_FT = 3.28084;

/**
 * Convert dimension to feet (for internal calculation).
 */
function toFeet(value, unit) {
  return unit === "meter" ? value * M_TO_FT : value;
}

/**
 * Calculate sheets and sheet lengths for Trapezoidal Single Side.
 * Uses overlap logic: max sheet length 20 ft, 1 ft overlap between sheets.
 * @param {number} lFt - Length in feet
 * @param {number} wFt - Width in feet
 * @returns {{ count: number, area: number, sheetLengths: Array<{ lengthFt: number, count: number }>, totalPaidAreaSqFt: number, sheetsAlongLength: number, sheetsAlongWidth: number, actualAreaSqFt: number }}
 */
function calculateTrapezoidalSingleSide(lFt, wFt) {
  const { maxLen, lenOverlap, sheetWidth, effectiveWidth } = TRAP_SINGLE;

  let sheetsAlongLength;
  let sheetsAlongWidth;

  if (lFt <= maxLen) {
    sheetsAlongLength = 1;
  } else {
    sheetsAlongLength = Math.ceil((lFt - maxLen) / (maxLen - lenOverlap)) + 1;
  }

  if (wFt <= sheetWidth) {
    sheetsAlongWidth = 1;
  } else {
    sheetsAlongWidth = Math.ceil((wFt - sheetWidth) / effectiveWidth) + 1;
  }

  const totalSheets = sheetsAlongLength * sheetsAlongWidth;
  const actualAreaSqFt = lFt * wFt;
  const areaM2 = actualAreaSqFt * FT_TO_M2;

  const sheetLengths = [];

  if (sheetsAlongLength === 1) {
    sheetLengths.push({ lengthFt: lFt, count: sheetsAlongWidth });
  } else {
    let remaining = lFt;
    sheetLengths.push({ lengthFt: maxLen, count: sheetsAlongWidth });
    remaining -= maxLen;

    for (let i = 2; i <= sheetsAlongLength; i++) {
      if (remaining <= maxLen - lenOverlap) {
        const lastSheet = remaining + lenOverlap;
        sheetLengths.push({ lengthFt: lastSheet, count: sheetsAlongWidth });
        break;
      } else {
        sheetLengths.push({ lengthFt: maxLen, count: sheetsAlongWidth });
        remaining -= maxLen - lenOverlap;
      }
    }
  }

  const totalPaidAreaSqFt = sheetLengths.reduce(
    (sum, { lengthFt, count }) => sum + lengthFt * sheetWidth * count,
    0
  );

  return {
    count: totalSheets,
    area: areaM2,
    sheetLengths,
    totalPaidAreaSqFt,
    sheetsAlongLength,
    sheetsAlongWidth,
    actualAreaSqFt,
    sheetWidthFt: sheetWidth,
  };
}

/**
 * Calculate sheet count and area from dimensions.
 * For Trapezoidal Single Side: uses overlap/sheet-length logic; other variants use area-based estimate.
 * @param {string} type - Roof type id (e.g. "Trapezoidal")
 * @param {string} subType - Sub-type id (e.g. "Single Side", "AType")
 * @param {number|string} width - Width value
 * @param {number|string} length - Length value
 * @param {string} unit - "ft" or "meter"
 * @returns {{ count: number, area: number, ... } | { error: string }}
 */
export const calculateSheets = (type, subType, width, length, unit) => {
  try {
    const w = Number(width);
    const len = Number(length);
    if (Number.isNaN(w) || Number.isNaN(len)) {
      return {
        count: 0,
        area: 0,
        error: "Width and length must be valid numbers.",
      };
    }
    if (w <= 0 || len <= 0) {
      return {
        count: 0,
        area: 0,
        error: "Width and length must be greater than 0.",
      };
    }

    // Trapezoidal Single Side: use sheet-length and overlap logic (in feet)
    if (type === "Trapezoidal" && subType === "Single Side") {
      const lFt = toFeet(len, unit);
      const wFt = toFeet(w, unit);
      return calculateTrapezoidalSingleSide(lFt, wFt);
    }

    // Other variants: area-based estimate (convert to m² for area)
    const factor = unit === "ft" ? 0.3048 : 1;
    const area = w * factor * (len * factor);

    let sheetCount = 0;
    if (subType === "Single Side") {
      sheetCount = Math.ceil(area / 1.5);
    } else {
      sheetCount = Math.ceil(area / 2.0);
    }

    return { count: Math.max(0, sheetCount), area };
  } catch (err) {
    return { count: 0, area: 0, error: err?.message || "Calculation failed." };
  }
};
