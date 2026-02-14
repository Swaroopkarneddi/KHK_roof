export const roofData = [
  {
    id: "Trapezoidal",
    label: "Trapezoidal",
    subTypes: [
      {
        id: "Single Side",
        label: "Single Side",
        minWidth: 2,
        maxWidth: 4,
        minLength: 5,
        maxLength: 20,
        customSize: true,
      },
      {
        id: "AType",
        label: "AType",
        minWidth: 1,
        maxWidth: 2,
        minLength: 10,
        maxLength: 40,
        customSize: false,
      },
    ],
  },
  // Add more types here in the future
];

export const accessoryList = [
  { id: "screws", label: "Screws (per sheet)", price: 0.5 },
  { id: "caps", label: "Ridge Caps", price: 15.0 },
  { id: "sealant", label: "Sealant Tape", price: 8.0 },
];
