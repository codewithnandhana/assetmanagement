export const assets = [
  {
    id: 1,
    name: "Dell Laptop",
    asset_type: "Laptop",
    serial_number: "LAP001",
    status: "Available",
    purchase_date: "2026-01-10",
  },
  {
    id: 2,
    name: "HP Monitor",
    asset_type: "Monitor",
    serial_number: "MON001",
    status: "Assigned",
    purchase_date: "2026-02-15",
  },
  {
    id: 3,
    name: "Office Chair",
    asset_type: "Furniture",
    serial_number: "CHR001",
    status: "Available",
    purchase_date: "2026-03-05",
  },
];

export const inventoryItems = [
  {
    id: 1,
    item_type: "Keyboard",
    quantity: 20,
    threshold: 5,
  },
  {
    id: 2,
    item_type: "USB Cable",
    quantity: 3,
    threshold: 5,
  },
];

export const repairTickets = [
  {
    id: 1,
    asset: "HP Monitor",
    issue: "Display not working",
    status: "Pending",
    assigned_technician: "Technician 1",
  },
];