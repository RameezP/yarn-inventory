import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FaCubes, FaPlus, FaMinus } from "react-icons/fa";
import "./Inventory.css";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(""); 
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [amount, setAmount] = useState("");

  const fetchInventory = async () => {
    try {
      const res = await API.get("/inventory");
      setInventory(res.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchInventory(); }, []);

  const openModal = (item, type) => {
    setSelectedMaterial(item);
    setActionType(type);
    setShowModal(true);
    setAmount("");
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMaterial(null);
  };

  const submitAction = async () => {
    if (!amount || amount <= 0) return alert("Enter valid amount");
    const endpoint = actionType === "IN" ? "/inventory/in" : "/inventory/out";
    
    try {
      await API.post(endpoint, {
        material_id: selectedMaterial.material_id,
        amount: parseFloat(amount),
      });
      closeModal();
      fetchInventory();
    } catch (err) {
      alert(err.response?.data?.message || "Error processing transaction");
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="mb-4 fw-bold text-dark">Current Stock</h2>

      <div className="row g-4">
        {inventory.map((item) => (
          <div className="col-md-6 col-lg-4 col-xl-3" key={item.id}>
            <div className="custom-card h-100 d-flex flex-column justify-content-between position-relative overflow-hidden">
              
              {/* Decorative Circle Background */}
              <div style={{
                position: "absolute", top: "-20px", right: "-20px", 
                width: "100px", height: "100px", borderRadius: "50%", 
                background: "var(--bg-light)", opacity: 0.5
              }}></div>

              <div>
                <div className="d-flex align-items-center mb-3">
                  <div className="card-icon-bg me-3" style={{background: "#e8f6f3", color: "var(--accent-color)"}}>
                    <FaCubes />
                  </div>
                  <h5 className="fw-bold mb-0 text-truncate">{item.Material?.name}</h5>
                </div>
                
                <h2 className="display-6 fw-bold my-3 text-dark">
                  {item.quantity} 
                  <small className="fs-6 text-muted ms-2">{item.Material?.unit}</small>
                </h2>
              </div>

              <div className="d-flex gap-2 mt-3">
                <button 
                  className="btn btn-success flex-grow-1" 
                  onClick={() => openModal(item, "IN")}
                >
                  <FaPlus className="me-1"/> In
                </button>
                <button 
                  className="btn btn-outline-danger flex-grow-1"
                  onClick={() => openModal(item, "OUT")}
                >
                  <FaMinus className="me-1"/> Out
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Slide Modal */}
      {showModal && selectedMaterial && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="slide-modal shadow-lg">
            <div className="p-4 mt-5">
              <h4 className="fw-bold mb-1">
                {actionType === "IN" ? "Add Stock" : "Remove Stock"}
              </h4>
              <p className="text-muted mb-4">
                {selectedMaterial.Material?.name}
              </p>

              <div className="mb-3">
                <label className="form-label">Quantity ({selectedMaterial.Material?.unit})</label>
                <input
                  type="number"
                  className="form-control form-control-lg"
                  autoFocus
                  placeholder="Enter positive amount"
                  min="0.1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  // PREVENT TYPING NEGATIVE SIGNS
                  onKeyDown={(e) => {
                    if (["-", "e", "+"].includes(e.key)) {
                      e.preventDefault();
                   }
                  }}
                />                
              </div>

              <button className={`btn w-100 py-2 mb-2 ${actionType === "IN" ? "btn-success" : "btn-danger"}`} onClick={submitAction}>
                Confirm {actionType}
              </button>
              <button className="btn btn-light w-100 py-2" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}