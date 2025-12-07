import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FaArrowDown, FaArrowUp, FaHistory } from "react-icons/fa";

export default function Transactions() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    API.get("/transactions")
      .then((res) => setLogs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container-fluid">
      <h2 className="mb-4 fw-bold text-dark">Transaction History</h2>

      <div className="custom-card">
        <div className="d-flex align-items-center mb-4">
          <div className="card-icon-bg me-3" style={{backgroundColor: "#e8f6f3", color: "#1abc9c"}}>
            <FaHistory />
          </div>
          <h5 className="mb-0 fw-bold">Recent Movements</h5>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Date & Time</th>
                <th>Material</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((t) => (
                <tr key={t.id}>
                  <td className="text-muted">
                    {new Date(t.timestamp).toLocaleString()}
                  </td>
                  <td className="fw-bold">{t.Material?.name}</td>
                  <td>
                    {t.change_type === "IN" ? (
                      <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                        <FaArrowDown className="me-1"/> STOCK IN
                      </span>
                    ) : (
                      <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2">
                        <FaArrowUp className="me-1"/> STOCK OUT
                      </span>
                    )}
                  </td>
                  <td className="fw-bold fs-5">
                    {t.amount} <small className="text-muted fs-6">{t.Material?.unit}</small>
                  </td>
                  <td>
                    <span className="badge bg-secondary">Completed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}