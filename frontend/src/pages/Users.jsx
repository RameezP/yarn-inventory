import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FaUserPlus, FaUsers, FaTrash, FaUserShield, FaUser, FaLock, FaPhone, FaSearch } from "react-icons/fa";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", password: "", role: "user", phone: "" });
  
  // ✅ 1. NEW STATE: Search Query
  const [searchTerm, setSearchTerm] = useState("");

  const role = localStorage.getItem("role");
  const currentUsername = localStorage.getItem("username"); 
  const isRootAdmin = currentUsername === "admin"; 

  const loadUsers = () => {
    API.get("/users").then(res => setUsers(res.data));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = (e) => {
    e.preventDefault();
    API.post("/users", form)
      .then(() => {
        loadUsers();
        setForm({ username: "", password: "", role: "user", phone: "" });
      })
      .catch(err => alert(err.response?.data?.message || "Error"));
  };

  const deleteUser = (id) => {
    if (!window.confirm("Are you sure?")) return;
    API.delete(`/users/${id}`).then(() => loadUsers()).catch(err => alert(err.response?.data?.message));
  };

  // ✅ 2. FILTER LOGIC (Search by Username or Phone)
  const filteredUsers = users.filter((u) => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.phone && u.phone.includes(searchTerm))
  );

  if (role !== "admin") {
    return <h3 className="text-center mt-5">⛔ Access Denied</h3>;
  }

  return (
    <div className="container-fluid">
      <h2 className="mb-4 fw-bold text-dark">User Management</h2>

      <div className="row g-4">
        {/* LEFT COLUMN: ADD USER FORM */}
        <div className="col-md-4">
          <div className="custom-card h-100">
            <div className="d-flex align-items-center mb-4">
              <div className="card-icon-bg me-3" style={{backgroundColor: "#e8f6f3", color: "#1abc9c"}}>
                <FaUserPlus />
              </div>
              <h5 className="mb-0 fw-bold">Create New User</h5>
            </div>

            <form onSubmit={createUser}>
              <div className="mb-3">
                <label className="form-label text-muted">Username</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><FaUser className="text-muted"/></span>
                  <input type="text" className="form-control border-start-0 ps-0" placeholder="e.g. johndoe"
                    value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted">Phone Number</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><FaPhone className="text-muted"/></span>
                  <input type="text" className="form-control border-start-0 ps-0" placeholder="10-digit mobile"
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><FaLock className="text-muted"/></span>
                  <input type="password" className="form-control border-start-0 ps-0" placeholder="Min. 6 characters"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted">Role</label>
                <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="user">User (View Only)</option>
                  {isRootAdmin && <option value="admin">Admin (Full Access)</option>}
                </select>
              </div>

              <button className="btn btn-primary w-100 py-2 fw-bold shadow-sm">Add User</button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: USER LIST */}
        <div className="col-md-8">
          <div className="custom-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <div className="card-icon-bg me-3" style={{backgroundColor: "#fff3cd", color: "#f1c40f"}}>
                  <FaUsers />
                </div>
                <h5 className="mb-0 fw-bold">System Users ({filteredUsers.length})</h5>
              </div>
            </div>

            {/* ✅ 3. SEARCH BAR */}
            <div className="mb-4">
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-white border-end-0 ps-3">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-2"
                  placeholder="Search by username or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ height: "45px" }}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Username</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td className="fw-bold">{u.username}</td>
                        <td>{u.phone || <span className="text-muted">-</span>}</td>
                        <td>
                          {u.role === "admin" ? (
                            <span className="badge bg-primary"><FaUserShield/> Admin</span>
                          ) : (
                            <span className="badge bg-secondary"><FaUser/> User</span>
                          )}
                        </td>
                        <td className="text-end">
                          {isRootAdmin && u.username !== "admin" ? (
                            <button className="btn btn-outline-danger btn-sm" onClick={() => deleteUser(u.id)}>
                              <FaTrash />
                            </button>
                          ) : (
                             <span className="text-muted small">{u.username === "admin" ? "Root" : "Protected"}</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">
                        No users found matching "{searchTerm}"
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