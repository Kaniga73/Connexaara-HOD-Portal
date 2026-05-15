import { useState } from "react";
import "../Styles/Hackathon.css";

const MOCK_HACKATHONS = [
  {
    id: 1,
    name: "Smart India Hackathon 2026",
    description:
      "Here is the smart india hackathon for 2026, and there will be 3 rounds and winners will get cash prize upto 20 lakhs and team should be 5 members",
    isGroup: true,
    minSize: 4,
    maxSize: 5,
    regDeadline: "5/15/2026",
    eventDate: "5/31/2026",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/en/thumb/3/3e/Smart_India_Hackathon_logo.png/320px-Smart_India_Hackathon_logo.png",
    thumbnailBg: "var(--accent-lt)",
    teams: [
      {
        id: 1,
        teamName: "CodeCraft",
        members: [
          { id: 1, name: "Arjun Mehta", email: "arjun@example.com", progress: 75, role: "Team Lead" },
          { id: 2, name: "Priya Singh", email: "priya@example.com", progress: 60, role: "Backend Dev" },
          { id: 3, name: "Rahul Kumar", email: "rahul@example.com", progress: 80, role: "Frontend Dev" },
          { id: 4, name: "Sneha Nair", email: "sneha@example.com", progress: 55, role: "UI/UX Designer" },
        ],
      },
      {
        id: 2,
        teamName: "InnovatorsX",
        members: [
          { id: 5, name: "Vikram Patel", email: "vikram@example.com", progress: 90, role: "Team Lead" },
          { id: 6, name: "Anjali Sharma", email: "anjali@example.com", progress: 70, role: "ML Engineer" },
          { id: 7, name: "Deepak Rao", email: "deepak@example.com", progress: 65, role: "Backend Dev" },
          { id: 8, name: "Meera Iyer", email: "meera@example.com", progress: 85, role: "Data Analyst" },
          { id: 9, name: "Karthik J", email: "karthik@example.com", progress: 72, role: "Frontend Dev" },
        ],
      },
    ],
  },
];

/* ── Unique avatar color based on name ── */
const AVATAR_COLORS = [
  "#6c47ff", // purple
  "#e85d75", // rose
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#f97316", // orange
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#84cc16", // lime
];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function Hackathon() {
  const [activeTab, setActiveTab] = useState("active");
  const [hackathons, setHackathons] = useState(MOCK_HACKATHONS);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    isGroup: false,
    minSize: "",
    maxSize: "",
    regDeadline: "",
    eventDate: "",
    thumbnail: "",
  });
  const [errors, setErrors] = useState({});

  /* ──── helpers ──── */
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Event name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (form.isGroup) {
      if (!form.minSize) e.minSize = "Required";
      if (!form.maxSize) e.maxSize = "Required";
      if (form.minSize && form.maxSize && +form.minSize > +form.maxSize)
        e.minSize = "Min must be ≤ Max";
    }
    if (!form.regDeadline) e.regDeadline = "Required";
    if (!form.eventDate) e.eventDate = "Required";
    return e;
  };

  const handleCreate = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const newH = {
      id: Date.now(),
      name: form.name,
      description: form.description,
      isGroup: form.isGroup,
      minSize: +form.minSize || 1,
      maxSize: +form.maxSize || 1,
      regDeadline: form.regDeadline,
      eventDate: form.eventDate,
      thumbnail: form.thumbnail,
      thumbnailBg: "var(--accent-lt)",
      teams: [],
    };
    setHackathons((prev) => [newH, ...prev]);
    setForm({ name: "", description: "", isGroup: false, minSize: "", maxSize: "", regDeadline: "", eventDate: "", thumbnail: "" });
    setErrors({});
    setActiveTab("active");
  };

  /* ──── Student detail modal ──── */
  if (selectedStudent) {
    const team = selectedHackathon?.teams.find((t) =>
      t.members.some((m) => m.id === selectedStudent.id)
    );
    return (
      <div className="hk-page">
        <header className="hk-header">
          <button className="hk-back" onClick={() => setSelectedStudent(null)}>←</button>
          <span className="hk-header-title">Student Details</span>
        </header>
        <div className="hk-student-detail">
          <div
            className="hk-student-avatar"
            style={{ background: getAvatarColor(selectedStudent.name) }}
          >
            {selectedStudent.name.charAt(0)}
          </div>
          <h2 className="hk-student-name">{selectedStudent.name}</h2>
          <p className="hk-student-email">{selectedStudent.email}</p>
          <span className="hk-role-badge">{selectedStudent.role}</span>

          <div className="hk-detail-card">
            <p className="hk-detail-label">TEAM</p>
            <p className="hk-detail-value">{team?.teamName}</p>
          </div>

          <div className="hk-detail-card">
            <p className="hk-detail-label">OVERALL PROGRESS</p>
            <div className="hk-progress-bar-wrap">
              <div className="hk-progress-bar" style={{ width: `${selectedStudent.progress}%` }} />
            </div>
            <p className="hk-progress-pct">{selectedStudent.progress}%</p>
          </div>

          <div className="hk-detail-card">
            <p className="hk-detail-label">TEAM MEMBERS</p>
            {team?.members.map((m) => (
              <div key={m.id} className="hk-mini-member">
                <span
                  className="hk-mini-avatar"
                  style={{ background: getAvatarColor(m.name) }}
                >
                  {m.name.charAt(0)}
                </span>
                <span className="hk-mini-name">{m.name}</span>
                <span className="hk-mini-role">{m.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ──── Hackathon detail view ──── */
  if (selectedHackathon) {
    const h = selectedHackathon;
    return (
      <div className="hk-page">
        <header className="hk-header">
          <button className="hk-back" onClick={() => setSelectedHackathon(null)}>←</button>
          <span className="hk-header-title">{h.name}</span>
        </header>
        <div className="hk-detail-page">
          <div className="hk-detail-banner">
            {h.thumbnail ? (
              <img src={h.thumbnail} alt={h.name} className="hk-banner-img" onError={(e) => { e.target.style.display = "none"; }} />
            ) : (
              <span className="hk-banner-text">{h.name}</span>
            )}
          </div>

          <div className="hk-detail-body">
            <div className="hk-detail-title-row">
              <h2 className="hk-detail-title">{h.name}</h2>
              {h.isGroup && (
                <span className="hk-group-badge">Group ({h.minSize}–{h.maxSize})</span>
              )}
            </div>
            <p className="hk-detail-desc">{h.description}</p>
            <div className="hk-meta-row">
              <div className="hk-meta-item">
                <span className="hk-meta-label">REG DEADLINE</span>
                <span className="hk-meta-value">{h.regDeadline}</span>
              </div>
              <div className="hk-meta-item">
                <span className="hk-meta-label">EVENT DATE</span>
                <span className="hk-meta-value">{h.eventDate}</span>
              </div>
            </div>
          </div>

          <div className="hk-registered-section">
            <h3 className="hk-section-title">Registered Teams</h3>
            {h.teams.length === 0 ? (
              <p className="hk-empty">No teams registered yet.</p>
            ) : (
              h.teams.map((team) => (
                <div key={team.id} className="hk-team-block">
                  <p className="hk-team-name">🏆 {team.teamName}</p>
                  {team.members.map((member) => (
                    <div
                      key={member.id}
                      className="hk-member-row"
                      onClick={() => setSelectedStudent(member)}
                    >
                      <div
                        className="hk-member-avatar"
                        style={{ background: getAvatarColor(member.name) }}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <div className="hk-member-info">
                        <span className="hk-member-name">{member.name}</span>
                        <span className="hk-member-role">{member.role}</span>
                      </div>
                      <div className="hk-member-progress-wrap">
                        <div className="hk-member-progress-bar" style={{ width: `${member.progress}%` }} />
                        <span className="hk-member-pct">{member.progress}%</span>
                      </div>
                      <span className="hk-chevron">›</span>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ──── Main view ──── */
  return (
    <div className="hk-page">
      {/* ← Changed heading from "Events" to "Hackathon" */}
      <h1 className="hk-page-title">Hackathon</h1>

      <div className="hk-tabs">
        <button
          className={`hk-tab ${activeTab === "active" ? "hk-tab--active" : ""}`}
          onClick={() => setActiveTab("active")}
        >
          Active Events
        </button>
        <button
          className={`hk-tab ${activeTab === "create" ? "hk-tab--active" : ""}`}
          onClick={() => setActiveTab("create")}
        >
          Create New
        </button>
      </div>

      {/* ── Active Events ── */}
      {activeTab === "active" && (
        <div className="hk-scroll">
          {hackathons.length === 0 && (
            <p className="hk-empty hk-empty--center">No events created yet.</p>
          )}
          <div className="hk-cards-grid">
            {hackathons.map((h) => (
              <div key={h.id} className="hk-card" onClick={() => setSelectedHackathon(h)}>
                {/* Full-width cover thumbnail */}
                <div className="hk-card-banner">
                  {h.thumbnail ? (
                    <img
                      src={h.thumbnail}
                      alt={h.name}
                      className="hk-card-img"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <span className="hk-card-banner-text">{h.name}</span>
                  )}
                </div>
                <div className="hk-card-body">
                  <div className="hk-card-title-row">
                    <span className="hk-card-name">{h.name}</span>
                    {h.isGroup && <span className="hk-group-badge">Group</span>}
                  </div>
                  <p className="hk-card-desc">{h.description}</p>
                  <div className="hk-card-divider" />
                  <div className="hk-card-meta">
                    <div>
                      <p className="hk-card-meta-label">REG DEADLINE</p>
                      <p className="hk-card-meta-value">{h.regDeadline}</p>
                    </div>
                    <div>
                      <p className="hk-card-meta-label">EVENT DATE</p>
                      <p className="hk-card-meta-value">{h.eventDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Create New ── */}
      {activeTab === "create" && (
        <div className="hk-scroll hk-scroll--form">
          <div className="hk-form">
            <label className="hk-label">Event Name</label>
            <input
              className={`hk-input ${errors.name ? "hk-input--error" : ""}`}
              placeholder="Enter event name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <p className="hk-error">{errors.name}</p>}

            <label className="hk-label">Description</label>
            <textarea
              className={`hk-textarea ${errors.description ? "hk-input--error" : ""}`}
              placeholder="Enter description"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            {errors.description && <p className="hk-error">{errors.description}</p>}

            <div className="hk-toggle-row">
              <label className="hk-label">Group Hackathon?</label>
              <div
                className={`hk-toggle ${form.isGroup ? "hk-toggle--on" : ""}`}
                onClick={() => setForm({ ...form, isGroup: !form.isGroup })}
              >
                <div className="hk-toggle-thumb" />
              </div>
            </div>

            {form.isGroup && (
              <div className="hk-row">
                <div className="hk-col">
                  <label className="hk-label">Min Size</label>
                  <input
                    className={`hk-input ${errors.minSize ? "hk-input--error" : ""}`}
                    type="number" min="1"
                    placeholder="e.g. 3"
                    value={form.minSize}
                    onChange={(e) => setForm({ ...form, minSize: e.target.value })}
                  />
                  {errors.minSize && <p className="hk-error">{errors.minSize}</p>}
                </div>
                <div className="hk-col">
                  <label className="hk-label">Max Size</label>
                  <input
                    className={`hk-input ${errors.maxSize ? "hk-input--error" : ""}`}
                    type="number" min="1"
                    placeholder="e.g. 5"
                    value={form.maxSize}
                    onChange={(e) => setForm({ ...form, maxSize: e.target.value })}
                  />
                  {errors.maxSize && <p className="hk-error">{errors.maxSize}</p>}
                </div>
              </div>
            )}

            <div className="hk-row">
              <div className="hk-col">
                <label className="hk-label">Registration Deadline</label>
                <input
                  className={`hk-input ${errors.regDeadline ? "hk-input--error" : ""}`}
                  type="date"
                  value={form.regDeadline}
                  onChange={(e) => setForm({ ...form, regDeadline: e.target.value })}
                />
                {errors.regDeadline && <p className="hk-error">{errors.regDeadline}</p>}
              </div>
              <div className="hk-col">
                <label className="hk-label">Event Date</label>
                <input
                  className={`hk-input ${errors.eventDate ? "hk-input--error" : ""}`}
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                />
                {errors.eventDate && <p className="hk-error">{errors.eventDate}</p>}
              </div>
            </div>

            <label className="hk-label">Thumbnail Image (Optional)</label>
            <div className="hk-upload-zone">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    setForm({ ...form, thumbnail: imageUrl });
                  }
                }}
              />
              {!form.thumbnail && (
                <span className="hk-upload-placeholder">Click to select image</span>
              )}
              {form.thumbnail && (
                <img src={form.thumbnail} alt="preview" className="hk-thumb-preview" onError={(e) => { e.target.style.display = "none"; }} />
              )}
            </div>

            <button className="hk-btn-create" onClick={handleCreate}>
              Create Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
}