import { useState, useEffect } from "react";
import Table from "../components/Table";
import Form from "../components/Form";

function Inventory() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);


  // GET
  useEffect(() => {
    fetch("/api/inventory/", {
      headers: {

Authorization: `Bearer ${localStorage.getItem("access")}`,      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("INVENTORY DATA:", data);

      if (Array.isArray(data)) {
  setInventoryItems(data);
} else if (data.results) {
  setInventoryItems(data.results);
} else {
  console.log("GET ERROR:", data);
  setInventoryItems([]);
}
      });
  }, []);

  const columns = [
    { key: "item_type", label: "Item Type" },
    { key: "quantity", label: "Quantity" },
    { key: "threshold", label: "Threshold" },
  ];

  const data = inventoryItems.map((item) => ({
    ...item,
    status:
      item.quantity <= item.threshold
        ? "Low Stock"
        : "Available",
  }));

  const tableColumns = [
    ...columns,
    { key: "status", label: "Status" },
  ];

  // ADD
  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  // EDIT
  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  // DELETE
  const handleDelete = async (id) => {
    const response = await fetch(
      `/api/inventory/${id}/`,
      {
        method: "DELETE",
        headers: {
Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );

    if (response.ok) {
      setInventoryItems((oldItems) =>
        oldItems.filter((item) => item.id !== id)
      );
    }
  };

  // ADD + EDIT
  const handleSave = async (e) => {
    e.preventDefault();

    const form = e.target;

    const inventoryData = {
      item_type: form.item_type.value,
      quantity: form.quantity.value,
      threshold: form.threshold.value,
    };

    if (!editingItem) {
      // POST
      const response = await fetch(
        "/api/inventory/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify(inventoryData),
        }
      );

      const newItem = await response.json();

      console.log("ADD INVENTORY:", newItem);

      setInventoryItems((oldItems) => [
        ...oldItems,
        newItem,
      ]);
    } else {
      // PUT
      const response = await fetch(
        `/api/inventory/${editingItem.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify(inventoryData),
        }
      );

      const updatedItem = await response.json();

      console.log("UPDATED INVENTORY:", updatedItem);

      setInventoryItems((oldItems) =>
        oldItems.map((item) =>
          item.id === updatedItem.id
            ? updatedItem
            : item
        )
      );
    }

    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div>
      <h1>Inventory</h1>

      <button onClick={handleAdd}>
        Add Inventory
      </button>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>
              {editingItem
                ? "Edit Inventory"
                : "Add Inventory"}
            </h2>

            <Form onSubmit={handleSave}>
              <input
                name="item_type"
                placeholder="Item Type"
                defaultValue={
                  editingItem?.item_type || ""
                }
                required
              />

              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                defaultValue={
                  editingItem?.quantity || ""
                }
                required
              />

              <input
                type="number"
                name="threshold"
                placeholder="Threshold"
                defaultValue={
                  editingItem?.threshold || ""
                }
                required
              />

              <button type="submit">
                Save
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
              >
                Cancel
              </button>
            </Form>
          </div>
        </div>
      )}
      
      <Table
        columns={tableColumns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Inventory;