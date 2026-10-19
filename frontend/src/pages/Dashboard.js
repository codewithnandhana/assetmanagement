import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    total_assets: 0,
    available_assets: 0,
    assigned_assets: 0,
    under_repair: 0,
  });

  useEffect(() => {
    fetch("/api/dashboard/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("DASHBOARD DATA:", data);
        setDashboard(data);
      });
  }, []);

  const totalAssets = dashboard.total_assets;

  const availableAssets = dashboard.available_assets;

  const assignedAssets = dashboard.assigned_assets;

  const repairAssets = dashboard.repair_assets;
  const chartData = [
    {
      name: "Available",
      count: availableAssets,
    },
    {
      name: "Assigned",
      count: assignedAssets,
    },
    {
      name: "Under Repair",
      count: repairAssets,
    },
  ];

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="dashboard-top">
        <div className="dashboard-cards">

          <div className="dashboard-card">
            <h3>Total Assets</h3>
            <p>{totalAssets}</p>
          </div>

          <div className="dashboard-card">
            <h3>Available</h3>
            <p>{availableAssets}</p>
          </div>

          <div className="dashboard-card">
            <h3>Assigned</h3>
            <p>{assignedAssets}</p>
          </div>

          <div className="dashboard-card">
            <h3>Under Repair</h3>
            <p>{repairAssets}</p>
          </div>

        </div>

        <div className="dashboard-chart">
          <h2>Asset Status</h2>

          <BarChart
            width={550}
            height={300}
            data={chartData}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="count" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;