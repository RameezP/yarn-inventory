import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FaLayerGroup, FaArrowDown, FaArrowUp, FaChartLine } from "react-icons/fa"; // Import Icons

import {
  Bar,
  Pie,
  Line
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [materialStock, setMaterialStock] = useState([]);
  const [summary, setSummary] = useState({ IN: 0, OUT: 0 });
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    API.get("/dashboard/material-stocks")
      .then((res) => setMaterialStock(res.data))
      .catch(err => console.error(err));

    API.get("/dashboard/transaction-summary")
      .then((res) => setSummary(res.data))
      .catch(err => console.error(err));

    API.get("/dashboard/stock-trend")
      .then((res) => setTrend(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container-fluid">
      <h2 className="mb-4 fw-bold text-dark">Dashboard Overview</h2>

      {/* --- TOP CARDS SECTION --- */}
      <div className="row g-4 mb-4">
        
        {/* Card 1: Total Materials */}
        <div className="col-md-4">
          <div className="custom-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted text-uppercase fw-bold mb-2">Total Materials</h6>
                <h2 className="fw-bold text-dark mb-0">{materialStock.length}</h2>
              </div>
              <div className="card-icon-bg" style={{ backgroundColor: "#e8f6f3", color: "#1abc9c" }}>
                <FaLayerGroup />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Total Stock IN */}
        <div className="col-md-4">
          <div className="custom-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted text-uppercase fw-bold mb-2">Total Stock IN</h6>
                <h2 className="fw-bold text-success mb-0">+{summary.IN}</h2>
              </div>
              <div className="card-icon-bg" style={{ backgroundColor: "#d4edda", color: "#28a745" }}>
                <FaArrowDown />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Total Stock OUT */}
        <div className="col-md-4">
          <div className="custom-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted text-uppercase fw-bold mb-2">Total Stock OUT</h6>
                <h2 className="fw-bold text-danger mb-0">-{summary.OUT}</h2>
              </div>
              <div className="card-icon-bg" style={{ backgroundColor: "#f8d7da", color: "#dc3545" }}>
                <FaArrowUp />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="row g-4">
        
        {/* Left: Bar Chart */}
        <div className="col-md-8">
          <div className="custom-card h-100">
            <div className="d-flex align-items-center mb-3">
              <FaChartLine className="me-2 text-primary" />
              <h5 className="mb-0 fw-bold">Current Stock Levels</h5>
            </div>
            <div style={{ height: "300px" }}>
              <Bar
                data={{
                  labels: materialStock.map((m) => m.name),
                  datasets: [
                    {
                      label: "Quantity (kg/units)",
                      data: materialStock.map((m) => m.quantity),
                      backgroundColor: "rgba(54, 162, 235, 0.7)",
                      borderRadius: 5,
                    }
                  ]
                }}
                options={{ 
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: { display: false } // Hide legend for cleaner look
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Right: Pie Chart */}
        <div className="col-md-4">
          <div className="custom-card h-100">
            <h5 className="mb-3 fw-bold">In/Out Ratio</h5>
            <div style={{ height: "250px", display: "flex", justifyContent: "center" }}>
              <Pie
                data={{
                  labels: ["Stock IN", "Stock OUT"],
                  datasets: [
                    {
                      data: [summary.IN, summary.OUT],
                      backgroundColor: ["#2ecc71", "#e74c3c"],
                      hoverOffset: 4
                    }
                  ]
                }}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>

        {/* Bottom: Line Chart */}
        <div className="col-12">
          <div className="custom-card">
            <h5 className="mb-3 fw-bold">Daily Transaction Trend</h5>
            <div style={{ height: "300px" }}>
              <Line
                data={{
                  labels: trend.map((t) => t.date),
                  datasets: [
                    {
                      label: "Total Movement",
                      data: trend.map((t) => t.total),
                      fill: true, // Fill area under line
                      backgroundColor: "rgba(0, 123, 255, 0.1)",
                      borderColor: "#3498db",
                      tension: 0.4 // Smooth curves
                    }
                  ]
                }}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}