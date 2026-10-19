import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Table from "../components/Table";
import Form from "../components/Form";
import { addAsset, updateAsset } from "../redux/assetSlice";

function Assets() {
  const [assets, setAssets] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("/api/assets/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("GET DATA:", data);

      if (Array.isArray(data)) {
  setAssets(data);
} else if (data.results) {
  setAssets(data.results);
} else {
  console.log("GET ERROR:", data);
  setAssets([]);
}
      });
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const handleAdd = () => {
    setEditingAsset(null);
    setShowModal(true);
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setShowModal(true);
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "asset_type", label: "Type" },
    { key: "serial_number", label: "Serial Number" },
    { key: "status", label: "Status" },
    { key: "purchase_date", label: "Purchase Date" },
  ];
   const handleDelete = async (id) => {
  const response = await fetch(
    `/api/assets/${id}/`,
    {
      method: "DELETE",
      headers: {
Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    }
  );

  if (response.ok) {
    setAssets((oldAssets) =>
      oldAssets.filter((asset) => asset.id !== id)
    );
  }
};
  const handleSave = async (e) => {
    e.preventDefault();

    const form = e.target;

    const assetData = {
      name: form.name.value,
      asset_type: form.asset_type.value,
      serial_number: form.serial_number.value,
      status: form.status.value,
      purchase_date: form.purchase_date.value,
    };

    if (!editingAsset) {
      const response = await fetch(
        "/api/assets/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify(assetData),
        }
      );

      const newAsset = await response.json();

      setAssets((oldAssets) => [...oldAssets, newAsset]);
    } else {
      const response = await fetch(
        `/api/assets/${editingAsset.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify(assetData),
        }
      );

      const updatedAsset = await response.json();

      setAssets((oldAssets) =>
        oldAssets.map((asset) =>
          asset.id === updatedAsset.id ? updatedAsset : asset
        )
      );
    }

    setShowModal(false);
  };

  return (
    <div>
      <h1>Assets</h1>

      <button onClick={handleAdd}>Add Asset</button>

      <Table
        columns={columns}
        data={assets}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>{editingAsset ? "Edit Asset" : "Add Asset"}</h2>

            <Form onSubmit={handleSave}>
              <input
                name="name"
                placeholder="Asset Name"
                defaultValue={editingAsset?.name || ""}
                required
              />

              <input
                name="asset_type"
                placeholder="Asset Type"
                defaultValue={editingAsset?.asset_type || ""}
                required
              />

              <input
                name="serial_number"
                placeholder="Serial Number"
                defaultValue={editingAsset?.serial_number || ""}
                required
              />

              <select
                name="status"
                defaultValue={editingAsset?.status || "Available"}
              >
                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
                <option value="Under Repair">Under Repair</option>
              </select>

              <input
                type="date"
                name="purchase_date"
                defaultValue={editingAsset?.purchase_date || ""}
                required
              />

              <button type="submit">Save</button>

              <button
                type="button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assets