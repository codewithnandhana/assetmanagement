import { useState, useEffect } from "react";
import Table from "../components/Table";
import Form from "../components/Form";

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);


  // GET
  useEffect(() => {
    fetch("/api/tickets/", {
      headers: {
Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("TICKET DATA:", data);

      if (Array.isArray(data)) {
  setTickets(data);
} else if (data.results) {
  setTickets(data.results);
} else {
  console.log("GET ERROR:", data);
  setTickets([]);
}
      });
  }, []);

  const columns = [
    { key: "asset", label: "Asset" },
    { key: "issue", label: "Issue" },
    { key: "status", label: "Status" },
    {
      key: "assigned_technician",
      label: "Technician",
    },
  ];

  // ADD
  const handleAdd = () => {
    setEditingTicket(null);
    setShowForm(true);
  };

  // EDIT
  const handleEdit = (ticket) => {
    setEditingTicket(ticket);
    setShowForm(true);
  };

  // DELETE
  const handleDelete = async (id) => {
    const response = await fetch(
      `/api/tickets/${id}/`,
      {
        method: "DELETE",
        headers: {
Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );

    if (response.ok) {
      setTickets((oldTickets) =>
        oldTickets.filter(
          (ticket) => ticket.id !== id
        )
      );
    }
  };

  // POST + PUT
  const handleSave = async (e) => {
    e.preventDefault();

    const form = e.target;

    const ticketData = {
      asset: form.asset.value,
      issue: form.issue.value,
      status: form.status.value,
      assigned_technician:
        form.assigned_technician.value,
    };

    if (!editingTicket) {
      // POST
      const response = await fetch(
        "/api/tickets/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify(ticketData),
        }
      );

      const newTicket = await response.json();

      console.log("ADD TICKET:", newTicket);

      setTickets((oldTickets) => [
        ...oldTickets,
        newTicket,
      ]);
    } else {
      // PUT
      const response = await fetch(
        `/api/tickets/${editingTicket.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify(ticketData),
        }
      );

      const updatedTicket = await response.json();

      console.log(
        "UPDATED TICKET:",
        updatedTicket
      );

      setTickets((oldTickets) =>
        oldTickets.map((ticket) =>
          ticket.id === updatedTicket.id
            ? updatedTicket
            : ticket
        )
      );
    }

    setShowForm(false);
    setEditingTicket(null);
  };

  return (
    <div>
      <h1>Tickets</h1>

      <button onClick={handleAdd}>
        Add Ticket
      </button>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>
              {editingTicket
                ? "Edit Ticket"
                : "Add Ticket"}
            </h2>

            <Form onSubmit={handleSave}>
              <input
                type="number"
                name="asset"
                placeholder="Asset ID"
                defaultValue={
                  editingTicket?.asset || ""
                }
                required
              />

              <textarea
                name="issue"
                placeholder="Enter issue"
                defaultValue={
                  editingTicket?.issue || ""
                }
                required
              />

              <select
                name="status"
                defaultValue={
                  editingTicket?.status || "Pending"
                }
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>

              <input
                type="number"
                name="assigned_technician"
                placeholder="Technician ID"
                defaultValue={
                  editingTicket?.assigned_technician ||
                  ""
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
                  setEditingTicket(null);
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
        data={tickets}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Tickets;