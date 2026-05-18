import { useState, useEffect, useCallback } from "react";
import "../Styles/Staffs.css";
import {
  getStaff,
  createStaff,
  updateStaff,
  deactivateStaff,
  activateStaff,
} from "../api/staffService";

const avatarColors = [
  "#6c63ff", "#f97316", "#10b981", "#3b82f6",
  "#ec4899", "#8b5cf6", "#14b8a6", "#f59e0b",
];

function getInitial(name) {
  return name ? name.charAt(0).toUpperCase() : "?";
}

function avatarColor(id = "") {
  // stable color from uuid chars
  const code = id.charCodeAt(0) || 0;
  return avatarColors[code % avatarColors.length];
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function Staffs() {
  // ── List state ─────────────────────────────────────────────────────────────
  const [staffList, setStaffList]   = useState([]);
  const [meta, setMeta]             = useState({ total: 0, page: 1, limit: 10 });
  const [activeTab, setActiveTab]   = useState("Active");   // "Active" | "Deactivated"
  const [search, setSearch]         = useState("");
  const [loading, setLoading]       = useState(false);
  const [listError, setListError]   = useState("");

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [viewStaff, setViewStaff]   = useState(null);
  const [editStaff, setEditStaff]   = useState(null);
  const [showAdd, setShowAdd]       = useState(false);
  const [editForm, setEditForm]     = useState({});
  const [addForm, setAddForm]       = useState({ name: "", email: "", isTutor: false });
  const [confirmAction, setConfirmAction] = useState(null);

  // ── Operation state ─────────────────────────────────────────────────────────
  const [saving, setSaving]         = useState(false);
  const [opError, setOpError]       = useState("");

  // ── Fetch staff list ────────────────────────────────────────────────────────
  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setListError("");
    try {
      const isActive = activeTab === "Active";
      const result = await getStaff({
        page: 1,
        limit: 100,
        search: search.trim() || undefined,
        isActive,
      });
      setStaffList(result.data ?? []);
      setMeta(result.meta ?? { total: 0, page: 1, limit: 10 });
    } catch (err) {
      setListError(err.response?.data?.message || "Failed to load staff.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, search]);

  // Debounced search refetch
  useEffect(() => {
    const t = setTimeout(fetchStaff, 350);
    return () => clearTimeout(t);
  }, [fetchStaff]);

  // ── View ────────────────────────────────────────────────────────────────────
  function openView(staff) {
    setViewStaff(staff);
    setOpError("");
  }

  // ── Edit ────────────────────────────────────────────────────────────────────
  function openEdit(staff) {
    setEditStaff(staff);
    setEditForm({ name: staff.name, email: staff.email, isTutor: staff.isTutor });
    setViewStaff(null);
    setOpError("");
  }

  async function saveEdit() {
    if (saving) return;
    setSaving(true);
    setOpError("");
    try {
      const updated = await updateStaff(editStaff.id, {
        name: editForm.name,
        email: editForm.email,
        isTutor: editForm.isTutor,
      });
      // Merge update into local list
      setStaffList((prev) =>
        prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s))
      );
      setEditStaff(null);
    } catch (err) {
      setOpError(err.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  // ── Activate / Deactivate flow ──────────────────────────────────────────────
  function requestToggle() {
    setConfirmAction({
      staff: editStaff,
      action: editStaff.isActive ? "deactivate" : "activate",
    });
  }

  async function confirmToggle() {
    if (saving) return;
    setSaving(true);
    setOpError("");
    const { staff, action } = confirmAction;
    try {
      if (action === "deactivate") {
        await deactivateStaff(staff.id);
      } else {
        await activateStaff(staff.id);
      }
      setConfirmAction(null);
      setEditStaff(null);
      await fetchStaff(); // refresh list
    } catch (err) {
      setOpError(err.response?.data?.message || "Operation failed.");
      setConfirmAction(null);
    } finally {
      setSaving(false);
    }
  }

  // ── Add Staff ───────────────────────────────────────────────────────────────
  async function addStaffMember() {
    if (!addForm.name.trim() || !addForm.email.trim()) return;
    if (saving) return;
    setSaving(true);
    setOpError("");
    try {
      await createStaff({
        name: addForm.name.trim(),
        email: addForm.email.trim(),
        isTutor: addForm.isTutor,
      });
      setAddForm({ name: "", email: "", isTutor: false });
      setShowAdd(false);
      await fetchStaff();
    } catch (err) {
      setOpError(err.response?.data?.message || "Failed to add staff.");
    } finally {
      setSaving(false);
    }
  }

  // ── Counts ──────────────────────────────────────────────────────────────────
  // We show meta.total for the active tab; use local list length as fallback
  const tabTotal = meta.total ?? staffList.length;

  return (
    <div className="staffs-root">
      {/* Header */}
      <div className="staffs-header">
        <div className="staffs-title-row">
          <div>
            <h1 className="staffs-title">Staff Members</h1>
            <p className="staffs-subtitle">{meta.total ?? 0} members in this tab</p>
          </div>
          <button className="btn-add" onClick={() => { setShowAdd(true); setOpError(""); }}>
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
            {activeTab === "Active" && <span className="tab-count">{tabTotal}</span>}
          </button>
          <button
            className={`tab-btn ${activeTab === "Deactivated" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("Deactivated")}
          >
            <span className={`tab-dot ${activeTab === "Deactivated" ? "dot-active" : "dot-deact"}`} />
            Deactivated
            {activeTab === "Deactivated" && <span className="tab-count">{tabTotal}</span>}
          </button>
        </div>
      </div>

      {/* Staff List */}
      <div className="staffs-list">
        {loading && <div className="staffs-empty">Loading...</div>}
        {!loading && listError && <div className="staffs-empty staffs-error">{listError}</div>}
        {!loading && !listError && staffList.length === 0 && (
          <div className="staffs-empty">No staff found.</div>
        )}
        {!loading && staffList.map((staff) => (
          <div className="staff-card" key={staff.id}>
            <div className="staff-avatar" style={{ background: avatarColor(staff.id) }}>
              {getInitial(staff.name)}
            </div>
            <div className="staff-info">
              <span className="staff-name">{staff.name}</span>
              <span className="staff-email">{staff.email}</span>
              <div className="staff-badges">
                <span className={`badge badge-status ${staff.isActive ? "badge-active" : "badge-deact"}`}>
                  <span className="badge-dot" />
                  {staff.isActive ? "Active" : "Deactivated"}
                </span>
                {staff.isTutor && <span className="badge badge-tutor">Tutor</span>}
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

      {/* ── View Staff Modal ── */}
      {viewStaff && (
        <div className="modal-overlay" onClick={() => setViewStaff(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Staff Profile</h2>
              <button className="modal-close" onClick={() => setViewStaff(null)}>×</button>
            </div>
            <div className="modal-avatar-wrap">
              <div className="modal-avatar" style={{ background: avatarColor(viewStaff.id) }}>
                {getInitial(viewStaff.name)}
                <span className="modal-avatar-dot" />
              </div>
              <h3 className="modal-name">{viewStaff.name}</h3>
              <p className="modal-email">{viewStaff.email}</p>
            </div>
            <div className="modal-details">
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className={`badge badge-status ${viewStaff.isActive ? "badge-active" : "badge-deact"}`}>
                  <span className="badge-dot" />{viewStaff.isActive ? "Active" : "Deactivated"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Role</span>
                <span className="detail-value">{viewStaff.isTutor ? "Tutor" : "Staff"}</span>
              </div>
              {viewStaff.department && (
                <div className="detail-row">
                  <span className="detail-label">Department</span>
                  <span className="detail-value">{viewStaff.department.name}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Joined</span>
                <span className="detail-value">{formatDate(viewStaff.createdAt)}</span>
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

      {/* ── Edit Staff Modal ── */}
      {editStaff && (
        <div className="modal-overlay" onClick={() => setEditStaff(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Staff</h2>
              <button className="modal-close" onClick={() => setEditStaff(null)}>×</button>
            </div>
            <div className="modal-avatar-wrap">
              <div className="modal-avatar" style={{ background: avatarColor(editStaff.id) }}>
                {getInitial(editForm.name)}
                <span className="modal-avatar-dot" />
              </div>
            </div>
            <div className="edit-form">
              {opError && <div className="op-error-banner">{opError}</div>}
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Full Name"
                  disabled={saving}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="Email Address"
                  disabled={saving}
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
                  disabled={saving}
                >
                  <span className="toggle-knob" />
                </button>
              </div>
              <button
                className={`btn-deactivate ${!editStaff.isActive ? "btn-activate" : ""}`}
                onClick={requestToggle}
                disabled={saving}
              >
                {editStaff.isActive ? "Deactivate Staff" : "Activate Staff"}
              </button>
              <div className="edit-actions">
                <button className="btn-cancel" onClick={() => setEditStaff(null)} disabled={saving}>Cancel</button>
                <button className="btn-save" onClick={saveEdit} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Staff Modal ── */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Staff</h2>
              <button className="modal-close" onClick={() => setShowAdd(false)}>×</button>
            </div>
            <div className="edit-form">
              {opError && <div className="op-error-banner">{opError}</div>}
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="e.g. Prof. John Doe"
                  disabled={saving}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  placeholder="e.g. john.doe@university.edu"
                  disabled={saving}
                />
              </div>
              <div className="form-toggle-row">
                <div>
                  <p className="toggle-label">Mark as Tutor</p>
                  <p className="toggle-sub">Allows this staff to manage a student batch</p>
                </div>
                <button
                  className={`toggle-switch ${addForm.isTutor ? "toggle-on" : ""}`}
                  onClick={() => setAddForm({ ...addForm, isTutor: !addForm.isTutor })}
                  disabled={saving}
                >
                  <span className="toggle-knob" />
                </button>
              </div>
              <p className="add-password-hint">
                🔑 Default password: <strong>{addForm.email.split("@")[0] || "prefix"}@123</strong>
              </p>
              <div className="add-actions">
                <button className="btn-cancel" onClick={() => setShowAdd(false)} disabled={saving}>Cancel</button>
                <button
                  className={`btn-save ${!addForm.name.trim() || !addForm.email.trim() ? "btn-save-disabled" : ""}`}
                  onClick={addStaffMember}
                  disabled={!addForm.name.trim() || !addForm.email.trim() || saving}
                >
                  {saving ? "Adding..." : "Add Staff Member"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Toggle Modal ── */}
      {confirmAction && (
        <div className="modal-overlay" onClick={() => setConfirmAction(null)}>
          <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`confirm-icon-wrap ${confirmAction.action === "deactivate" ? "confirm-danger" : "confirm-success"}`}>
              {confirmAction.action === "deactivate" ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <h2 className="confirm-title">
              {confirmAction.action === "deactivate" ? "Deactivate Staff?" : "Activate Staff?"}
            </h2>
            <p className="confirm-desc">
              <strong>{confirmAction.staff.name}</strong>{" "}
              {confirmAction.action === "deactivate"
                ? "will lose all access to the system."
                : "will regain full access to the system."}
            </p>
            {opError && <div className="op-error-banner">{opError}</div>}
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setConfirmAction(null)} disabled={saving}>Cancel</button>
              <button
                className={`btn-confirm ${confirmAction.action === "deactivate" ? "btn-confirm-danger" : "btn-confirm-success"}`}
                onClick={confirmToggle}
                disabled={saving}
              >
                {saving ? "Processing..." : confirmAction.action === "deactivate" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}