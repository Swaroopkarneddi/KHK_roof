const TRAP_SINGLE = {
  maxLen: 20.0,
  lenOverlap: 1.0,
  sheetWidth: 3.71,
  effectiveWidth: 3.5,
};

const M_TO_FT = 3.28084;
const toFeet = (val, unit) => (unit === "meter" ? val * M_TO_FT : val);

// function calculateTrapezoidalSingleSide(lFt, wFt, pricePerSqFt) {
//   const { maxLen, lenOverlap, sheetWidth, effectiveWidth } = TRAP_SINGLE;

//   const sheetsAlongLength =
//     lFt <= maxLen ? 1 : Math.ceil((lFt - maxLen) / (maxLen - lenOverlap)) + 1;
//   const sheetsAlongWidth =
//     wFt <= sheetWidth ? 1 : Math.ceil((wFt - sheetWidth) / effectiveWidth) + 1;

//   const groupedSheets = new Map();
//   let remaining = lFt;

//   for (let i = 0; i < sheetsAlongLength; i++) {
//     let currentLen =
//       i === 0
//         ? Math.min(lFt, maxLen)
//         : Math.min(remaining + lenOverlap, maxLen);

//     const key = Number(currentLen.toFixed(2));
//     const existingCount = groupedSheets.get(key) || 0;
//     groupedSheets.set(key, existingCount + sheetsAlongWidth);

//     remaining -= maxLen - lenOverlap;
//   }

//   const sheetLengths = Array.from(groupedSheets.entries()).map(
//     ([length, count]) => ({
//       lengthFt: length,
//       count: count,
//     }),
//   );

//   const totalPaidAreaSqFt = sheetLengths.reduce(
//     (s, r) => s + r.lengthFt * sheetWidth * r.count,
//     0,
//   );

//   return {
//     count: sheetsAlongLength * sheetsAlongWidth,
//     sheetLengths,
//     sheetWidthFt: sheetWidth,
//     totalPaidAreaSqFt,
//     actualAreaSqFt: wFt * lFt,
//     totalBasePrice: totalPaidAreaSqFt * pricePerSqFt,
//   };
// }

function calculateTrapezoidalSingleSide(lFt, wFt, pricePerSqFt) {
  const { maxLen, lenOverlap, sheetWidth, effectiveWidth } = TRAP_SINGLE;

  // Calculates how many sheets fit along the length considering the overlap
  const sheetsAlongLength =
    lFt <= maxLen ? 1 : Math.ceil((lFt - lenOverlap) / (maxLen - lenOverlap));

  const sheetsAlongWidth =
    wFt <= sheetWidth ? 1 : Math.ceil((wFt - sheetWidth) / effectiveWidth) + 1;

  const groupedSheets = new Map();
  let remaining = lFt;

  for (let i = 0; i < sheetsAlongLength; i++) {
    let currentLen;

    if (i === 0) {
      // First sheet covers the initial span
      currentLen = Math.min(lFt, maxLen);
      remaining -= currentLen;
    } else {
      // Subsequent sheets cover the remaining gap plus the required overlap
      // For 23ft total: Remaining is 3. 3 + overlap(1) = 4ft sheet.
      currentLen = Math.min(remaining + lenOverlap, maxLen);

      // Reduce remaining by the actual "new" distance covered on the roof
      remaining -= currentLen - lenOverlap;
    }

    const key = Number(currentLen.toFixed(2));
    const existingCount = groupedSheets.get(key) || 0;
    groupedSheets.set(key, existingCount + sheetsAlongWidth);
  }

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

const calculateTileSingleSide = (lFt, wFt, pricePerSqFt) => {
  const lenOverlap = 1.0;
  const sheetWidth = 3.5;
  const effectiveWidth = 3.0;
  const available = [5.7, 6.5, 7.9, 10.07, 12.2, 14.37, 16.5, 17.9, 20.01];

  const toIdx = (val) => Math.round(val * 100);

  let sheetsAlongWidth = 1;
  if (wFt > sheetWidth) {
    sheetsAlongWidth =
      Math.ceil((wFt - sheetWidth) / effectiveWidth - 1e-9) + 1;
  }

  const target = toIdx(lFt);
  const limit = target + 2500;

  const dp = new Array(limit + 1).fill(Infinity);
  const parent = new Array(limit + 1).fill(-1);
  const usedLen = new Array(limit + 1).fill(0);

  dp[0] = 0;

  for (let i = 0; i <= limit; i++) {
    if (dp[i] === Infinity) continue;
    for (let j = 0; j < available.length; j++) {
      const len = available[j];
      const effective = i === 0 ? toIdx(len) : toIdx(len - lenOverlap);
      const next = i + effective;

      if (next <= limit) {
        if (dp[next] > dp[i] + len) {
          dp[next] = dp[i] + len;
          parent[next] = i;
          usedLen[next] = len;
        }
      }
    }
  }

  let bestPurchasedLength = Infinity;
  let bestIndex = -1;
  for (let i = target; i <= limit; i++) {
    if (dp[i] < bestPurchasedLength) {
      bestPurchasedLength = dp[i];
      bestIndex = i;
    }
  }

  const countsPerSize = {};
  let tempIdx = bestIndex;
  let sheetsAlongLength = 0;

  while (tempIdx > 0) {
    const len = usedLen[tempIdx];
    countsPerSize[len] = (countsPerSize[len] || 0) + sheetsAlongWidth;
    const effective =
      tempIdx === toIdx(len) ? toIdx(len) : toIdx(len - lenOverlap);
    tempIdx -= effective;
    sheetsAlongLength++;
  }

  // CONVERT TO UNIFIED FORMAT FOR TABLE
  const sheetLengths = Object.entries(countsPerSize).map(([length, count]) => ({
    lengthFt: parseFloat(length),
    count: count,
  }));

  const totalPaidArea = bestPurchasedLength * sheetWidth * sheetsAlongWidth;

  return {
    count: sheetsAlongLength * sheetsAlongWidth,
    sheetLengths,
    sheetWidthFt: sheetWidth,
    totalPaidAreaSqFt: Number(totalPaidArea.toFixed(2)),
    totalBasePrice: Number((totalPaidArea * pricePerSqFt).toFixed(2)),
    actualAreaSqFt: wFt * lFt,
  };
};

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

  if (type === "Tile" && subType === "Single Side") {
    const result = calculateTileSingleSide(lFt, wFt, price);
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

  // Fallback Logic
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
    totalPaidAreaSqFt: areaSqFt,
    totalBasePrice: count * price,
    pricePerUnit: price,
  };
};
