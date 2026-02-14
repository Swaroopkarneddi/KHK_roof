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
  {
    id: "Tile",
    label: "Tile",
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
    ],
  },
  // Add more types here in the future
];

export const accessoryList = [
  {
    id: "screws and caps",
    label: "Screws and Caps (per sheet)",
    price: 0.5,
    category: "Trapezoidal",
  },
  {
    id: "main ridgs",
    label: "Main Ridge",
    price: 15.0,
    category: "Trapezoidal",
  },
  { id: "eve", label: "EVE ", price: 8.0, category: "Trapezoidal" },
  {
    id: "l ridgs",
    label: "L Ridge",
    price: 15.0,
    category: "Trapezoidal",
  },

  {
    id: "screws and caps",
    label: "Screws and Caps (per sheet)",
    price: 45.0,
    category: "Tile",
  },
  { id: "main ridgs", label: "Main Ridge", price: 15.0, category: "Tile" },
  {
    id: "diagnal ridgs",
    label: "Diagnal Ridge",
    price: 15.0,
    category: "Tile",
  },
  { id: "zalar ridge", label: "Zalar Ridge", price: 15.0, category: "Tile" },
  { id: "3way ridgs", label: "3Way Ridge", price: 15.0, category: "Tile" },
  { id: "4way ridgs", label: "4Way Ridge", price: 15.0, category: "Tile" },
  { id: "lflash", label: "LFlash", price: 15.0, category: "Tile" },
];
