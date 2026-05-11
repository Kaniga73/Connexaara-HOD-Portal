import { useState } from "react";
import "../Styles/Staffs.css";
const initialStaff = [
  { id: 1, name: "Kavin", email: "kavin@gmail.com", status: "Active", role: "Tutor", department: "Mathematics", joined: "3 May 2026" },
  { id: 2, name: "Raayan", email: "raayan@gmail.com", status: "Active", role: "Staff", department: "Computer Science and Engineering", joined: "7 May 2026" },
  { id: 3, name: "Adnaan", email: "adnaan@gmail.com", status: "Active", role: "Staff", department: "Physics", joined: "1 May 2026" },
  { id: 4, name: "Lokesh", email: "lokesh@gmail.com", status: "Active", role: "Staff", department: "Chemistry", joined: "2 May 2026" },
  { id: 5, name: "Shakul", email: "shakul@gmail.com", status: "Active", role: "Staff", department: "Biology", joined: "4 May 2026" },
  { id: 6, name: "Monisha", email: "monisha@gmail.com", status: "Active", role: "Staff", department: "English", joined: "5 May 2026" },
  { id: 7, name: "Priya", email: "priya@gmail.com", status: "Deactivated", role: "Staff", department: "History", joined: "6 Apr 2026" },
  { id: 8, name: "Karthik", email: "karthik@gmail.com", status: "Deactivated", role: "Tutor", department: "Commerce", joined: "10 Apr 2026" },
];

const avatarColors = [
  "#6c63ff", "#f97316", "#10b981", "#3b82f6",
  "#ec4899", "#8b5cf6", "#14b8a6", "#f59e0b",
];

function getInitial(name) {
  return name ? name.charAt(0).toUpperCase() : "?";
}

export default function Staffs() {
  const [staffList, setStaffList] = useState(initialStaff);
  const [activeTab, setActiveTab] = useState("Active");
  const [search, setSearch] = useState("");
  const [viewStaff, setViewStaff] = useState(null);
  const [editStaff, setEditStaff] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [addForm, setAddForm] = useState({ name: "", email: "", isTutor: false });

  const filtered = staffList.filter(
    (s) =>
      s.status === activeTab &&
      (s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()))
  );

  function openView(staff) {
    setViewStaff(staff);
  }

  function openEdit(staff) {
    setEditStaff(staff);
    setEditForm({ name: staff.name, email: staff.email, isTutor: staff.role === "Tutor" });
    setViewStaff(null);
  }

  function saveEdit() {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === editStaff.id
          ? { ...s, name: editForm.name, email: editForm.email, role: editForm.isTutor ? "Tutor" : "Staff" }
          : s
      )
    );
    setEditStaff(null);
  }

  function deactivateStaff() {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === editStaff.id ? { ...s, status: s.status === "Active" ? "Deactivated" : "Active" } : s
      )
    );
    setEditStaff(null);
  }

  function addStaff() {
    if (!addForm.name.trim() || !addForm.email.trim()) return;
    const newStaff = {
      id: Date.now(),
      name: addForm.name,
      email: addForm.email,
      status: "Active",
      role: addForm.isTutor ? "Tutor" : "Staff",
      department: "General",
      joined: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    };
    setStaffList((prev) => [...prev, newStaff]);
    setAddForm({ name: "", email: "", isTutor: false });
    setShowAdd(false);
  }

  const activeCount = staffList.filter((s) => s.status === "Active").length;
  const deactivatedCount = staffList.filter((s) => s.status === "Deactivated").length;

  return (
    <div className="staffs-root">
      {/* Header */}
      <div className="staffs-header">
        <div className="staffs-title-row">
          <div>
            <h1 className="staffs-title">Staff Members</h1>
            <p className="staffs-subtitle">{staffList.length} total members</p>
          </div>
          <button className="btn-add" onClick={() => setShowAdd(true)}>
            <span className="btn-add-icon">+</span> Add
          </button>
        </div>

        {/* Search */}
        <div className="staffs-search-wrap">
          <span className="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            className="staffs-search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="staffs-tabs">
          <button
            className={`tab-btn ${activeTab === "Active" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("Active")}
          >
            <span className={`tab-dot ${activeTab === "Active" ? "dot-active" : "dot-inactive"}`} />
            Active
            <span className="tab-count">{activeCount}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === "Deactivated" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("Deactivated")}
          >
            <span className={`tab-dot ${activeTab === "Deactivated" ? "dot-active" : "dot-deact"}`} />
            Deactivated
            <span className="tab-count">{deactivatedCount}</span>
          </button>
        </div>
      </div>

      {/* Staff List */}
      <div className="staffs-list">
        {filtered.length === 0 && (
          <div className="staffs-empty">No staff found.</div>
        )}
        {filtered.map((staff, idx) => (
          <div className="staff-card" key={staff.id}>
            <div
              className="staff-avatar"
              style={{ background: avatarColors[staff.id % avatarColors.length] }}
            >
              {getInitial(staff.name)}
            </div>
            <div className="staff-info">
              <span className="staff-name">{staff.name}</span>
              <span className="staff-email">{staff.email}</span>
              <div className="staff-badges">
                <span className={`badge badge-status ${staff.status === "Active" ? "badge-active" : "badge-deact"}`}>
                  <span className="badge-dot" />
                  {staff.status}
                </span>
                {staff.role === "Tutor" && <span className="badge badge-tutor">Tutor</span>}
              </div>
            </div>
            <button className="staff-view-btn" onClick={() => openView(staff)} title="View profile">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>View</span>
            </button>
          </div>
        ))}
      </div>

      {/* View Staff Modal */}
      {viewStaff && (
        <div className="modal-overlay" onClick={() => setViewStaff(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Staff Profile</h2>
              <button className="modal-close" onClick={() => setViewStaff(null)}>×</button>
            </div>
            <div className="modal-avatar-wrap">
              <div
                className="modal-avatar"
                style={{ background: avatarColors[viewStaff.id % avatarColors.length] }}
              >
                {getInitial(viewStaff.name)}
                <span className="modal-avatar-dot" />
              </div>
              <h3 className="modal-name">{viewStaff.name}</h3>
              <p className="modal-email">{viewStaff.email}</p>
            </div>
            <div className="modal-details">
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className={`badge badge-status ${viewStaff.status === "Active" ? "badge-active" : "badge-deact"}`}>
                  <span className="badge-dot" />{viewStaff.status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Role</span>
                <span className="detail-value">{viewStaff.role}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Department</span>
                <span className="detail-value">{viewStaff.department}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Joined</span>
                <span className="detail-value">{viewStaff.joined}</span>
              </div>
            </div>
            <button className="btn-edit-staff" onClick={() => openEdit(viewStaff)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Staff
            </button>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editStaff && (
        <div className="modal-overlay" onClick={() => setEditStaff(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Staff</h2>
              <button className="modal-close" onClick={() => setEditStaff(null)}>×</button>
            </div>
            <div className="modal-avatar-wrap">
              <div
                className="modal-avatar"
                style={{ background: avatarColors[editStaff.id % avatarColors.length] }}
              >
                {getInitial(editForm.name)}
                <span className="modal-avatar-dot" />
              </div>
            </div>
            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Full Name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="Email Address"
                />
              </div>
              <div className="form-toggle-row">
                <div>
                  <p className="toggle-label">Mark as Tutor</p>
                  <p className="toggle-sub">Allows this staff to manage a student batch</p>
                </div>
                <button
                  className={`toggle-switch ${editForm.isTutor ? "toggle-on" : ""}`}
                  onClick={() => setEditForm({ ...editForm, isTutor: !editForm.isTutor })}
                >
                  <span className="toggle-knob" />
                </button>
              </div>
              <button className="btn-deactivate" onClick={deactivateStaff}>
                {editStaff.status === "Active" ? "Deactivate Staff" : "Activate Staff"}
              </button>
              <div className="edit-actions">
                <button className="btn-cancel" onClick={() => setEditStaff(null)}>Cancel</button>
                <button className="btn-save" onClick={saveEdit}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Staff</h2>
              <button className="modal-close" onClick={() => setShowAdd(false)}>×</button>
            </div>
            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="e.g. Prof. John Doe"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  placeholder="e.g. john.doe@university.edu"
                />
              </div>
              <div className="add-actions">
                <button className="btn-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
                <button
                  className={`btn-save ${!addForm.name.trim() || !addForm.email.trim() ? "btn-save-disabled" : ""}`}
                  onClick={addStaff}
                  disabled={!addForm.name.trim() || !addForm.email.trim()}
                >
                  Add Staff Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}