import { useState, useEffect, useCallback } from "react";
import "../Styles/Batches.css";
import {
  getBatches,
  createBatch,
  getBatchById,
  getAvailableTutors,
  assignTutor,
  promoteBatch,
  passoutBatch,
} from "../api/batchService";

const PALETTE = [
  { color: "#e91e8c", bg: "#fce4f0" },
  { color: "#5c6bc0", bg: "#e8eaf6" },
  { color: "#00897b", bg: "#e0f2f1" },
  { color: "#f57c00", bg: "#fff3e0" },
  { color: "#7b1fa2", bg: "#f3e5f5" },
];

function getAbbr(name) {
  if (!name) return "B";
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function ord(n) {
  if (!n) return "";
  const s = ["th","st","nd","rd"], v = n % 100;
  return n + (s[(v-20)%10] || s[v] || s[0]);
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="b-toast">
      <span className="b-toast-icon">✓</span>
      {message}
    </div>
  );
}

export default function Batches() {
  const [batches, setBatches]           = useState([]);
  const [meta, setMeta]                 = useState({ total: 0, page: 1, limit: 100 });
  const [activeTab, setActiveTab]       = useState("active");
  const [search, setSearch]             = useState("");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  const [showCreate, setShowCreate]     = useState(false);
  const [selectedId, setSelectedId]     = useState(null);
  const [viewBatch, setViewBatch]       = useState(null); // Full details from API
  const [showPromote, setShowPromote]   = useState(false);
  const [showPassOut, setShowPassOut]   = useState(false);
  const [showTutor, setShowTutor]       = useState(false);
  const [availableTutors, setAvailableTutors] = useState([]);
  
  const [toast, setToast]               = useState(null);
  const [saving, setSaving]             = useState(false);

  const [form, setForm] = useState({
    name: "", startYear: new Date().getFullYear(), endYear: new Date().getFullYear() + 4,
    currentSemester: 1
  });

  const fetchBatches = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const isPassedOut = activeTab === "passedout";
      const result = await getBatches({
        page: 1,
        limit: 100,
        search: search.trim() || undefined,
        isPassedOut
      });
      setBatches(result.data || []);
      setMeta(result.meta || { total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load batches.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, search]);

  useEffect(() => {
    const t = setTimeout(fetchBatches, 300);
    return () => clearTimeout(t);
  }, [fetchBatches]);

  function showToast(msg) {
    setToast(msg);
  }

  /* ── actions ── */
  async function handleCreate() {
    if (!form.name.trim()) return;
    setSaving(true);
    setError("");
    try {
      await createBatch({
        name: form.name.trim(),
        startYear: parseInt(form.startYear),
        endYear: parseInt(form.endYear),
        currentSemester: parseInt(form.currentSemester) || 1
      });
      setShowCreate(false);
      setForm({ name: "", startYear: new Date().getFullYear(), endYear: new Date().getFullYear() + 4, currentSemester: 1 });
      showToast("Batch created successfully!");
      fetchBatches();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create batch.");
    } finally {
      setSaving(false);
    }
  }

  async function openView(id) {
    setSelectedId(id);
    setViewBatch(null); // Clear previous details
    try {
      const details = await getBatchById(id);
      setViewBatch(details);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to load batch details.");
      setSelectedId(null);
    }
  }

  async function handlePromote() {
    setSaving(true);
    try {
      await promoteBatch(selectedId);
      setShowPromote(false);
      setSelectedId(null);
      showToast(`Batch promoted successfully!`);
      fetchBatches();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to promote batch.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePassOut() {
    setSaving(true);
    try {
      await passoutBatch(selectedId);
      setShowPassOut(false);
      setSelectedId(null);
      showToast(`Batch marked as passed out!`);
      fetchBatches();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to pass out batch.");
    } finally {
      setSaving(false);
    }
  }

  async function openTutorModal() {
    setShowTutor(true);
    try {
      const tutors = await getAvailableTutors();
      setAvailableTutors(tutors);
    } catch (err) {
      alert("Failed to load available tutors.");
    }
  }

  async function handleChangeTutor(staff) {
    setSaving(true);
    try {
      await assignTutor(selectedId, staff.id);
      setShowTutor(false);
      showToast(`Tutor changed to ${staff.name} successfully!`);
      // Refresh the detailed view and list
      const details = await getBatchById(selectedId);
      setViewBatch(details);
      fetchBatches();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign tutor.");
    } finally {
      setSaving(false);
    }
  }

  /* ── render ── */
  return (
    <div className="batches-root">
      <main className="b-main">

        {/* Toast */}
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}

        {/* Create button — top right */}
        <div className="b-page-header">
          <button className="b-btn-create" onClick={() => setShowCreate(true)}>+ Create</button>
        </div>

        {/* Centered title */}
        <div className="b-title-center">
          <h1 className="b-page-title">Batches</h1>
          <p className="b-page-subtitle">
            {meta.total} {activeTab === "active" ? "active" : "passed out"} batch{meta.total !== 1 ? "es" : ""}
          </p>
        </div>

        {/* Tabs — centered, no dots */}
        <div className="b-tab-bar-wrapper">
          <div className="b-tab-bar">
            <button
              className={`b-tab-btn${activeTab==="active"?" b-tab-active":""}`}
              onClick={() => setActiveTab("active")}
            >
              Active
            </button>
            <button
              className={`b-tab-btn${activeTab==="passedout"?" b-tab-passed":""}`}
              onClick={() => setActiveTab("passedout")}
            >
              Passed Out
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="b-search-bar">
          <i className="fa-solid fa-magnifying-glass b-search-icon"></i>
          <input
            className="b-search-input"
            placeholder="Search batches..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {error && <div className="b-empty-state" style={{ color: "red" }}>{error}</div>}

        {/* List */}
        <div className="b-batch-list">
          {loading && <div className="b-empty-state">Loading...</div>}
          {!loading && !error && batches.length === 0 && <div className="b-empty-state">No batches found.</div>}
          {!loading && batches.map((b, idx) => {
            const palette = PALETTE[idx % PALETTE.length];
            return (
              <div className="b-batch-card" key={b.id}>
                <div className="b-card-left">
                  <div className="b-batch-avatar" style={{ background: palette.bg, color: palette.color }}>
                    {getAbbr(b.name)}
                  </div>
                  <div>
                    <div className="b-batch-name">{b.name}</div>
                    <div className="b-batch-years">{b.startYear} – {b.endYear}</div>
                    <div className="b-batch-tags">
                      <span className="b-tag b-tag-sem">{ord(b.currentSemester)} Sem</span>
                      <span className="b-tag b-tag-students">👤 {b._count?.students || 0}</span>
                      {b.isPassedOut && <span className="b-tag b-tag-passedout">Passed Out</span>}
                    </div>
                    <div className="b-batch-tutor">🎓 {b.tutor ? b.tutor.name : "No Tutor Assigned"}</div>
                  </div>
                </div>
                <button className="b-view-btn" onClick={() => openView(b.id)}>View</button>
              </div>
            );
          })}
        </div>

      </main>

      {/* ── Create Modal ── */}
      {showCreate && (
        <div className="b-modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="b-modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="b-modal-header">
              <h2 className="b-modal-title">Create Batch</h2>
              <button className="b-modal-close" onClick={() => setShowCreate(false)}>✕</button>
            </div>
            {error && <div style={{ color: "red", padding: "10px", fontSize: "0.85rem" }}>{error}</div>}
            
            <label className="b-field-label">Batch Name</label>
            <input className="b-field-input" placeholder="e.g. CSE 2023-2027 A" value={form.name} onChange={e => setForm({...form, name: e.target.value})} disabled={saving} />
            <div className="b-field-row">
              <div className="b-field-col">
                <label className="b-field-label">Start Year</label>
                <input className="b-field-input" type="number" value={form.startYear} onChange={e => setForm({...form, startYear: e.target.value})} disabled={saving} />
              </div>
              <div className="b-field-col">
                <label className="b-field-label">End Year</label>
                <input className="b-field-input" type="number" value={form.endYear} onChange={e => setForm({...form, endYear: e.target.value})} disabled={saving} />
              </div>
            </div>
            <label className="b-field-label">Starting Semester</label>
            <input className="b-field-input" type="number" value={form.currentSemester} onChange={e => setForm({...form, currentSemester: e.target.value})} disabled={saving} />
            
            <div className="b-modal-actions">
              <button className="b-btn-cancel" onClick={() => setShowCreate(false)} disabled={saving}>Cancel</button>
              <button className="b-btn-submit" onClick={handleCreate} disabled={saving}>{saving ? "Creating..." : "Create Batch"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Details Modal ── */}
      {selectedId && !showPromote && !showPassOut && !showTutor && (
        <div className="b-modal-overlay" onClick={() => setSelectedId(null)}>
          <div className="b-modal-sheet b-details-sheet" onClick={e => e.stopPropagation()}>
            <div className="b-modal-header">
              <h2 className="b-modal-title">Batch Details</h2>
              <button className="b-modal-close" onClick={() => setSelectedId(null)}>✕</button>
            </div>
            
            {!viewBatch ? (
              <div style={{ padding: "20px", textAlign: "center" }}>Loading details...</div>
            ) : (
              <>
                <div className="b-details-avatar-wrap">
                  <div className="b-details-avatar" style={{ background: "#e8eaf6", color: "#5c6bc0" }}>
                    {getAbbr(viewBatch.name)}
                  </div>
                  <div className="b-details-name">{viewBatch.name}</div>
                  <div className="b-details-years">{viewBatch.startYear} – {viewBatch.endYear}</div>
                </div>
                <div className="b-details-table">
                  {[
                    ["Department", viewBatch.department?.name || "—"],
                    ["Semester",   ord(viewBatch.currentSemester)],
                    ["Students",   viewBatch._count?.students || 0],
                    ["Subjects",   viewBatch._count?.subjectAssignments || 0],
                  ].map(([k, v]) => (
                    <div className="b-details-row" key={k}>
                      <span className="b-details-key">{k}</span>
                      <span className="b-details-val">{v}</span>
                    </div>
                  ))}
                  <div className="b-details-row">
                    <span className="b-details-key">Status</span>
                    <span className={`b-details-val b-status-badge ${!viewBatch.isPassedOut?"b-status-active":"b-status-passed"}`}>
                      {!viewBatch.isPassedOut ? "Active" : "Passed Out"}
                    </span>
                  </div>
                </div>

                <div className="b-section-title">Class Tutor</div>
                <div className="b-tutor-card">
                  {viewBatch.tutor ? (
                    <>
                      <div className="b-tutor-avatar" style={{ background:"#e8f5e9", color:"#388e3c" }}>
                        {viewBatch.tutor.name?.[0]}
                      </div>
                      <div>
                        <p className="b-tutor-name">{viewBatch.tutor.name}</p>
                        <p className="b-tutor-email">{viewBatch.tutor.email}</p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <p className="b-tutor-name" style={{ color: "#888" }}>No Tutor Assigned</p>
                    </div>
                  )}
                </div>

                {!viewBatch.isPassedOut && (
                  <button className="b-btn-change-tutor" onClick={openTutorModal}>Change Tutor</button>
                )}

                {!viewBatch.isPassedOut && (
                  <>
                    <div className="b-section-title">Batch Actions</div>
                    <div className="b-batch-actions-row">
                      <span className="b-semester-info">
                        Semester <strong>{viewBatch.currentSemester}</strong> of <strong>{(viewBatch.endYear - viewBatch.startYear) * 2}</strong>
                      </span>
                      {viewBatch.currentSemester >= (viewBatch.endYear - viewBatch.startYear) * 2 && <span className="b-final-badge">Final Semester</span>}
                    </div>
                    {viewBatch.currentSemester < (viewBatch.endYear - viewBatch.startYear) * 2
                      ? <button className="b-btn-promote" onClick={() => setShowPromote(true)}>↑ Promote to Next Semester</button>
                      : <button className="b-btn-passout" onClick={() => setShowPassOut(true)}>🎓 Mark as Passed Out</button>
                    }
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Promote Confirm ── */}
      {showPromote && viewBatch && (
        <div className="b-modal-overlay">
          <div className="b-confirm-dialog">
            <div className="b-confirm-icon b-promote-icon">↑</div>
            <h3 className="b-confirm-title">Promote Batch?</h3>
            <p className="b-confirm-body">
              <strong>{viewBatch.name}</strong> will be moved from <strong>{ord(viewBatch.currentSemester)}</strong> to <strong>{ord(viewBatch.currentSemester + 1)}</strong> semester.
              <span className="b-confirm-note">This will update the semester for all students in this batch.</span>
            </p>
            <div className="b-confirm-actions">
              <button className="b-confirm-cancel" onClick={() => setShowPromote(false)} disabled={saving}>Cancel</button>
              <button className="b-confirm-blue" onClick={handlePromote} disabled={saving}>{saving ? "Promoting..." : "Promote"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Pass Out Confirm ── */}
      {showPassOut && viewBatch && (
        <div className="b-modal-overlay">
          <div className="b-confirm-dialog">
            <div className="b-confirm-icon b-passout-icon">🎓</div>
            <h3 className="b-confirm-title">Mark as Passed Out?</h3>
            <p className="b-confirm-body">
              <strong>{viewBatch.name}</strong> will be permanently marked as passed out.
              <span className="b-confirm-note b-danger-note">This action cannot be undone.</span>
            </p>
            <div className="b-confirm-actions">
              <button className="b-confirm-cancel" onClick={() => setShowPassOut(false)} disabled={saving}>Cancel</button>
              <button className="b-confirm-red" onClick={handlePassOut} disabled={saving}>{saving ? "Processing..." : "Confirm"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Change Tutor ── */}
      {showTutor && viewBatch && (
        <div className="b-modal-overlay" onClick={() => setShowTutor(false)}>
          <div className="b-modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="b-modal-header">
              <h2 className="b-modal-title">Select Tutor</h2>
              <button className="b-modal-close" onClick={() => setShowTutor(false)}>✕</button>
            </div>
            <div className="b-tutor-list">
              {availableTutors.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                  No available tutors found.
                </div>
              ) : (
                availableTutors.map(s => (
                  <div
                    key={s.id}
                    className={`b-tutor-option${viewBatch.tutor?.id===s.id?" b-tutor-selected":""}`}
                    onClick={() => { if(!saving) handleChangeTutor(s); }}
                    style={{ opacity: saving ? 0.6 : 1 }}
                  >
                    <div className="b-tutor-avatar" style={{ background:"#e8f5e9", color:"#388e3c" }}>{s.name[0]}</div>
                    <div>
                      <p className="b-tutor-name">{s.name}</p>
                      <p className="b-tutor-email">{s.email}</p>
                    </div>
                    {viewBatch.tutor?.id === s.id && <span className="b-tutor-check">✓</span>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}