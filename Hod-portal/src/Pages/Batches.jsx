import { useState, useEffect } from "react";
import "../Styles/Batches.css";

const initialBatches = [
  {
    id: 1, name: "CSE A", abbr: "CA",
    department: "Computer Science and Engineering",
    startYear: 2023, endYear: 2027, semester: 6, maxSemester: 8,
    students: 0, subjects: 0, status: "active",
    tutor: { name: "Adnaan", email: "adnaan@gmail.com" },
    color: "#e91e8c", bg: "#fce4f0",
  },
  {
    id: 2, name: "CSE B", abbr: "CB",
    department: "Computer Science and Engineering",
    startYear: 2023, endYear: 2027, semester: 6, maxSemester: 8,
    students: 0, subjects: 0, status: "active",
    tutor: { name: "Mohammed Saif", email: "saif@gmail.com" },
    color: "#5c6bc0", bg: "#e8eaf6",
  },
];

const STAFF = [
  { name: "Adnaan",        email: "adnaan@gmail.com" },
  { name: "Mohammed Saif", email: "saif@gmail.com"   },
  { name: "Dr. Priya",     email: "priya@gmail.com"  },
  { name: "Prof. Raj",     email: "raj@gmail.com"    },
];

const PALETTE = [
  { color: "#e91e8c", bg: "#fce4f0" },
  { color: "#5c6bc0", bg: "#e8eaf6" },
  { color: "#00897b", bg: "#e0f2f1" },
  { color: "#f57c00", bg: "#fff3e0" },
  { color: "#7b1fa2", bg: "#f3e5f5" },
];

function ord(n) {
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
  const [batches, setBatches]           = useState(initialBatches);
  const [activeTab, setActiveTab]       = useState("active");
  const [search, setSearch]             = useState("");
  const [showCreate, setShowCreate]     = useState(false);
  const [selectedId, setSelectedId]     = useState(null);
  const [showPromote, setShowPromote]   = useState(false);
  const [showPassOut, setShowPassOut]   = useState(false);
  const [showTutor, setShowTutor]       = useState(false);
  const [toast, setToast]               = useState(null);

  const [form, setForm] = useState({
    name: "", startYear: "2023", endYear: "2027",
    startingSemester: "1",
    department: "Computer Science and Engineering",
    tutor: STAFF[0],
  });

  const filtered = batches.filter(b =>
    b.status === activeTab &&
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = batches.filter(b => b.status === "active").length;
  const passedCount = batches.filter(b => b.status === "passedout").length;
  const viewBatch   = batches.find(b => b.id === selectedId) || null;

  function showToast(msg) {
    setToast(msg);
  }

  /* ── actions ── */
  function handleCreate() {
    if (!form.name.trim()) return;
    const abbr = form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const c    = PALETTE[batches.length % PALETTE.length];
    setBatches([...batches, {
      id: Date.now(), name: form.name, abbr,
      department: form.department,
      startYear: parseInt(form.startYear),
      endYear:   parseInt(form.endYear),
      semester:  parseInt(form.startingSemester) || 1,
      maxSemester: 8, students: 0, subjects: 0, status: "active",
      tutor: form.tutor, ...c,
    }]);
    setShowCreate(false);
    setForm({ name:"", startYear:"2023", endYear:"2027", startingSemester:"1", department:"Computer Science and Engineering", tutor: STAFF[0] });
  }

  function handlePromote() {
    const currentSem = batches.find(b => b.id === selectedId)?.semester || 0;
    setBatches(batches.map(b => b.id === selectedId ? { ...b, semester: b.semester + 1 } : b));
    setShowPromote(false);
    setSelectedId(null);
    showToast(`Batch promoted to ${ord(currentSem + 1)} semester successfully!`);
  }

  function handlePassOut() {
    setBatches(batches.map(b => b.id === selectedId ? { ...b, status: "passedout" } : b));
    setShowPassOut(false);
    setSelectedId(null);
  }

  function handleChangeTutor(staff) {
    setBatches(batches.map(b => b.id === selectedId ? { ...b, tutor: staff } : b));
    setShowTutor(false);
    showToast(`Tutor changed to ${staff.name} successfully!`);
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
            {activeTab === "active"
              ? `${activeCount} active batch${activeCount !== 1 ? "es" : ""}`
              : `${passedCount} passed out batch${passedCount !== 1 ? "es" : ""}`}
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

        {/* List */}
        <div className="b-batch-list">
          {filtered.length === 0 && <div className="b-empty-state">No batches found.</div>}
          {filtered.map(b => (
            <div className="b-batch-card" key={b.id}>
              <div className="b-card-left">
                <div className="b-batch-avatar" style={{ background: b.bg, color: b.color }}>{b.abbr}</div>
                <div>
                  <div className="b-batch-name">{b.name}</div>
                  <div className="b-batch-years">{b.startYear} – {b.endYear}</div>
                  <div className="b-batch-tags">
                    <span className="b-tag b-tag-sem">{ord(b.semester)} Sem</span>
                    <span className="b-tag b-tag-students">👤 {b.students}</span>
                    {b.status === "passedout" && <span className="b-tag b-tag-passedout">Passed Out</span>}
                  </div>
                  <div className="b-batch-tutor">🎓 {b.tutor.name}</div>
                </div>
              </div>
              <button className="b-view-btn" onClick={() => setSelectedId(b.id)}>View</button>
            </div>
          ))}
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
            <label className="b-field-label">Batch Name</label>
            <input className="b-field-input" placeholder="e.g. CSE 2023-2027 A" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <div className="b-field-row">
              <div className="b-field-col">
                <label className="b-field-label">Start Year</label>
                <input className="b-field-input" value={form.startYear} onChange={e => setForm({...form, startYear: e.target.value})} />
              </div>
              <div className="b-field-col">
                <label className="b-field-label">End Year</label>
                <input className="b-field-input" value={form.endYear} onChange={e => setForm({...form, endYear: e.target.value})} />
              </div>
            </div>
            <label className="b-field-label">Starting Semester</label>
            <input className="b-field-input" value={form.startingSemester} onChange={e => setForm({...form, startingSemester: e.target.value})} />
            <label className="b-field-label">Department</label>
            <input className="b-field-input" value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
            <label className="b-field-label">Assign Tutor</label>
            <select
              className="b-field-input b-field-select"
              value={form.tutor.email}
              onChange={e => setForm({...form, tutor: STAFF.find(s => s.email === e.target.value)})}
            >
              {STAFF.map(s => (
                <option key={s.email} value={s.email}>{s.name} — {s.email}</option>
              ))}
            </select>
            <div className="b-modal-actions">
              <button className="b-btn-cancel" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="b-btn-submit" onClick={handleCreate}>Create Batch</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Details Modal ── */}
      {viewBatch && !showPromote && !showPassOut && !showTutor && (
        <div className="b-modal-overlay" onClick={() => setSelectedId(null)}>
          <div className="b-modal-sheet b-details-sheet" onClick={e => e.stopPropagation()}>
            <div className="b-modal-header">
              <h2 className="b-modal-title">Batch Details</h2>
              <button className="b-modal-close" onClick={() => setSelectedId(null)}>✕</button>
            </div>
            <div className="b-details-avatar-wrap">
              <div className="b-details-avatar" style={{ background: viewBatch.bg, color: viewBatch.color }}>{viewBatch.abbr}</div>
              <div className="b-details-name">{viewBatch.name}</div>
              <div className="b-details-years">{viewBatch.startYear} – {viewBatch.endYear}</div>
            </div>
            <div className="b-details-table">
              {[
                ["Department", viewBatch.department],
                ["Semester",   ord(viewBatch.semester)],
                ["Students",   viewBatch.students],
                ["Subjects",   viewBatch.subjects],
              ].map(([k, v]) => (
                <div className="b-details-row" key={k}>
                  <span className="b-details-key">{k}</span>
                  <span className="b-details-val">{v}</span>
                </div>
              ))}
              <div className="b-details-row">
                <span className="b-details-key">Status</span>
                <span className={`b-details-val b-status-badge ${viewBatch.status==="active"?"b-status-active":"b-status-passed"}`}>
                  {viewBatch.status === "active" ? "Active" : "Passed Out"}
                </span>
              </div>
            </div>

            <div className="b-section-title">Class Tutor</div>
            <div className="b-tutor-card">
              <div className="b-tutor-avatar" style={{ background:"#e8f5e9", color:"#388e3c" }}>{viewBatch.tutor.name[0]}</div>
              <div>
                <p className="b-tutor-name">{viewBatch.tutor.name}</p>
                <p className="b-tutor-email">{viewBatch.tutor.email}</p>
              </div>
            </div>

            {viewBatch.status === "active" && (
              <button className="b-btn-change-tutor" onClick={() => setShowTutor(true)}>Change Tutor</button>
            )}

            {viewBatch.status === "active" && (
              <>
                <div className="b-section-title">Batch Actions</div>
                <div className="b-batch-actions-row">
                  <span className="b-semester-info">Semester <strong>{viewBatch.semester}</strong> of <strong>{viewBatch.maxSemester}</strong></span>
                  {viewBatch.semester >= viewBatch.maxSemester && <span className="b-final-badge">Final Semester</span>}
                </div>
                {viewBatch.semester < viewBatch.maxSemester
                  ? <button className="b-btn-promote" onClick={() => setShowPromote(true)}>↑ Promote to Next Semester</button>
                  : <button className="b-btn-passout" onClick={() => setShowPassOut(true)}>🎓 Mark as Passed Out</button>
                }
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
              <strong>{viewBatch.name}</strong> will be moved from <strong>{ord(viewBatch.semester)}</strong> to <strong>{ord(viewBatch.semester + 1)}</strong> semester.
              <span className="b-confirm-note">This will update the semester for all students in this batch.</span>
            </p>
            <div className="b-confirm-actions">
              <button className="b-confirm-cancel" onClick={() => setShowPromote(false)}>Cancel</button>
              <button className="b-confirm-blue" onClick={handlePromote}>Promote</button>
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
              <button className="b-confirm-cancel" onClick={() => setShowPassOut(false)}>Cancel</button>
              <button className="b-confirm-red" onClick={handlePassOut}>Confirm</button>
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
              {STAFF.map(s => (
                <div
                  key={s.email}
                  className={`b-tutor-option${viewBatch.tutor.email===s.email?" b-tutor-selected":""}`}
                  onClick={() => handleChangeTutor(s)}
                >
                  <div className="b-tutor-avatar" style={{ background:"#e8f5e9", color:"#388e3c" }}>{s.name[0]}</div>
                  <div>
                    <p className="b-tutor-name">{s.name}</p>
                    <p className="b-tutor-email">{s.email}</p>
                  </div>
                  {viewBatch.tutor.email === s.email && <span className="b-tutor-check">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}