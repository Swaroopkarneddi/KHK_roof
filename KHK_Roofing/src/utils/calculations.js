/**
 * Calculate sheet count and area from dimensions.
 * @param {string} type - Roof type id
 * @param {string} subType - Sub-type id (e.g. "Single Side", "AType")
 * @param {number|string} width - Width value
 * @param {number|string} length - Length value
 * @param {string} unit - "ft" or "meter"
 * @returns {{ count: number, area: number } | { error: string }}
 */
export const calculateSheets = (type, subType, width, length, unit) => {
  try {
    const w = Number(width);
    const len = Number(length);
    if (Number.isNaN(w) || Number.isNaN(len)) {
      return { count: 0, area: 0, error: "Width and length must be valid numbers." };
    }
    if (w <= 0 || len <= 0) {
      return { count: 0, area: 0, error: "Width and length must be greater than 0." };
    }

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
