import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FaTrash, FaPlus, FaBoxOpen } from "react-icons/fa";

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState({ name: "", unit: "" });

  const loadMaterials = () => {
    API.get("/materials")
      .then((res) => setMaterials(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    API.post("/materials", form).then(() => {
      setForm({ name: "", unit: "" });
      loadMaterials();
    });
  };

  const handleDelete = (id) => {
    if(!window.confirm("Are you sure?")) return;
    API.delete(`/materials/${id}`).then(() => loadMaterials());
  };

  return (
    <div className="container-fluid">
      <h2 className="mb-4 fw-bold text-dark">Material Management</h2>

      <div className="row">
        {/* Left: Add Material Form */}
        <div className="col-md-4 mb-4">
          <div className="custom-card h-100">
            <h5 className="mb-3 fw-bold"><FaPlus className="me-2 text-primary"/> Add New Material</h5>
            <form onSubmit={handleAdd}>
              <div className="mb-3">
                <label className="form-label text-muted">Material Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control form-control-lg"
                  placeholder="e.g. Red Cotton 40s"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted">Unit</label>
                <input
                  type="text"
                  name="unit"
                  className="form-control form-control-lg"
                  placeholder="e.g. kg, bags, meters"
                  value={form.unit}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="btn btn-primary w-100 py-2 fw-bold">
                Create Material
              </button>
            </form>
          </div>
        </div>

        {/* Right: Materials Table */}
        <div className="col-md-8">
          <div className="custom-card">
            <h5 className="mb-3 fw-bold"><FaBoxOpen className="me-2 text-primary"/> Material List</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Unit</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((m) => (
                    <tr key={m.id}>
                      <td><span className="badge bg-secondary">#{m.id}</span></td>
                      <td className="fw-bold text-dark">{m.name}</td>
                      <td className="text-muted">{m.unit}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(m.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {materials.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">
                        No materials found. Add one on the left.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}