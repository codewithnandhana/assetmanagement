import { useState, useEffect } from "react";
import Table from "../components/Table";
import Form from "../components/Form";

function Assignment() {
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);


  // GET
  useEffect(() => {
    fetch("/api/assignments/", {
      headers: {
Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("ASSIGNMENT DATA:", data);

        if (Array.isArray(data)) {
  setAssignments(data);
} else if (data.results) {
  setAssignments(data.results);
} else {
  console.log("GET ERROR:", data);
  setAssignments([]);
}
      });
  }, []);

  const columns = [
    { key: "asset", label: "Asset" },
    { key: "employee", label: "Employee" },
    { key: "date_assigned", label: "Date Assigned" },
    { key: "date_returned", label: "Date Returned" },
  ];

  // ADD
  const handleAdd = () => {
    setEditingAssignment(null);
    setShowForm(true);
  };

  // EDIT
  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setShowForm(true);
  };

  // DELETE
  const handleDelete = async (id) => {
    const response = await fetch(
      `/api/assignments/${id}/`,
      {
        method: "DELETE",
        headers: {
Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );

    if (response.ok) {
      setAssignments((oldAssignments) =>
        oldAssignments.filter(
          (assignment) => assignment.id !== id
        )
      );
    }
  };

  // POST + PUT
  const handleSave = async (e) => {
    e.preventDefault();

    const form = e.target;

    const assignmentData = {
      asset: form.asset.value,
      employee: form.employee.value,
      date_assigned: form.date_assigned.value,
      date_returned: form.date_returned.value || null,
    };

    if (!editingAssignment) {
      // POST
      const response = await fetch(
        "/api/assignments/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
          body: JSON.stringify(assignmentData),
        }
      );

      const newAssignment = await response.json();

      console.log("ADD ASSIGNMENT:", newAssignment);

      setAssignments((oldAssignments) => [
        ...oldAssignments,
        newAssignment,
      ]);
    } else {
      // PUT
      const response = await fetch(
        `/api/assignments/${editingAssignment.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
          body: JSON.stringify(assignmentData),
        }
      );

      const updatedAssignment = await response.json();

      console.log(
        "UPDATED ASSIGNMENT:",
        updatedAssignment
      );

      setAssignments((oldAssignments) =>
        oldAssignments.map((assignment) =>
          assignment.id === updatedAssignment.id
            ? updatedAssignment
            : assignment
        )
      );
    }

    setShowForm(false);
    setEditingAssignment(null);
  };

  return (
    <div>
      <h1>Assignments</h1>

      <button onClick={handleAdd}>
        Add Assignment
      </button>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>
              {editingAssignment
                ? "Edit Assignment"
                : "Add Assignment"}
            </h2>

            <Form onSubmit={handleSave}>
              <input
                type="number"
                name="asset"
                placeholder="Asset ID"
                defaultValue={
                  editingAssignment?.asset || ""
                }
                required
              />

              <input
                type="number"
                name="employee"
                placeholder="Employee ID"
                defaultValue={
                  editingAssignment?.employee || ""
                }
                required
              />

              <label>Date Assigned</label>

              <input
                type="date"
                name="date_assigned"
                defaultValue={
                  editingAssignment?.date_assigned || ""
                }
                required
              />

              <label>Date Returned</label>

              <input
                type="date"
                name="date_returned"
                defaultValue={
                  editingAssignment?.date_returned || ""
                }
              />

              <button type="submit">
                Save
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingAssignment(null);
                }}
              >
                Cancel
              </button>
            </Form>
          </div>
        </div>
      )}

      <Table
        columns={columns}
        data={assignments}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Assignment;