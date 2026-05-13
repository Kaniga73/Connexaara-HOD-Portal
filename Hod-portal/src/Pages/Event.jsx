import { useState } from "react";
import "../Styles/Event.css";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

const today = new Date().toISOString().split("T")[0];

const defaultForm = {
  name: "",
  description: "",
  startDate: today,
  endDate: today,
  thumbnail: null,
  thumbnailURL: null,
};

export default function Events() {
  const [tab, setTab] = useState("active");
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, thumbnail: file, thumbnailURL: url }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const newEvent = {
      id: Date.now(),
      name: form.name,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
      thumbnailURL: form.thumbnailURL,
      tag: "CSE",
    };
    setEvents((prev) => [newEvent, ...prev]);
    setForm(defaultForm);
    setShowModal(true);
  };

  const handleViewEvents = () => {
    setShowModal(false);
    setTab("active");
  };

  // ── Event Detail View ──────────────────────────────────
  if (selectedEvent) {
    return (
      <div className="events-page">
        <div className="events-container">
          <button
            className="event-detail-back"
            onClick={() => setSelectedEvent(null)}
          >
            ← Back to Events
          </button>

          {selectedEvent.thumbnailURL ? (
            <img
              src={selectedEvent.thumbnailURL}
              alt={selectedEvent.name}
              className="event-detail-thumb"
            />
          ) : (
            <div className="event-detail-thumb-placeholder">🎉</div>
          )}

          <div className="event-detail-top">
            <h1 className="event-detail-name">{selectedEvent.name}</h1>
            <span className="event-detail-tag">{selectedEvent.tag}</span>
          </div>

          {selectedEvent.description && (
            <p className="event-detail-desc">{selectedEvent.description}</p>
          )}

          <hr className="event-detail-divider" />

          <div className="event-detail-dates">
            <div className="event-detail-date-item">
              <span className="event-detail-date-label">Start Date</span>
              <span className="event-detail-date-value">{formatDate(selectedEvent.startDate)}</span>
            </div>
            <div className="event-detail-date-item">
              <span className="event-detail-date-label">End Date</span>
              <span className="event-detail-date-value">{formatDate(selectedEvent.endDate)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Events View ───────────────────────────────────
  return (
    <div className="events-page">
      <div className="events-container">
        {/* Header */}
        <div className="events-header">
          <h1 className="events-title">Events</h1>
        </div>

        {/* Tabs — full width */}
        <div className="events-tabs">
          <button
            className={`events-tab${tab === "active" ? " active" : ""}`}
            onClick={() => setTab("active")}
          >
            Active Events
          </button>
          <button
            className={`events-tab${tab === "create" ? " active" : ""}`}
            onClick={() => setTab("create")}
          >
            Create New
          </button>
        </div>

        {/* Active Events Tab */}
        {tab === "active" && (
          <>
            {events.length === 0 ? (
              <div className="events-empty">
                <span className="events-empty-icon">📅</span>
                <p className="events-empty-text">No events created yet.</p>
              </div>
            ) : (
              <div className="events-grid">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className="event-card"
                    onClick={() => setSelectedEvent(ev)}
                  >
                    {ev.thumbnailURL ? (
                      <img
                        src={ev.thumbnailURL}
                        alt={ev.name}
                        className="event-card-thumb"
                      />
                    ) : (
                      <div className="event-card-thumb-placeholder">🎉</div>
                    )}
                    <div className="event-card-body">
                      <div className="event-card-top">
                        <h3 className="event-card-name">{ev.name}</h3>
                        <span className="event-card-tag">{ev.tag}</span>
                      </div>
                      {ev.description && (
                        <p className="event-card-desc">{ev.description}</p>
                      )}
                      <hr className="event-card-divider" />
                      <div className="event-card-dates">
                        <div className="event-card-date-item">
                          <span className="event-card-date-label">Start Date</span>
                          <span className="event-card-date-value">{formatDate(ev.startDate)}</span>
                        </div>
                        <div className="event-card-date-item">
                          <span className="event-card-date-label">End Date</span>
                          <span className="event-card-date-value">{formatDate(ev.endDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Create New Tab */}
        {tab === "create" && (
          <div className="events-form">
            {/* Event Name */}
            <div className="events-form-group">
              <label className="events-label">Event Name</label>
              <input
                className="events-input"
                name="name"
                placeholder="e.g. Annual Sports Meet"
                value={form.name}
                onChange={handleInput}
              />
            </div>

            {/* Description */}
            <div className="events-form-group">
              <label className="events-label">Description</label>
              <textarea
                className="events-textarea"
                name="description"
                placeholder="Event details..."
                value={form.description}
                onChange={handleInput}
              />
            </div>

            {/* Dates */}
            <div className="events-form-row">
              <div className="events-form-group">
                <label className="events-label">Start Date</label>
                <input
                  className="events-input"
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleInput}
                />
              </div>
              <div className="events-form-group">
                <label className="events-label">End Date</label>
                <input
                  className="events-input"
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleInput}
                />
              </div>
            </div>

            {/* Thumbnail */}
            <div className="events-form-group">
              <label className="events-label">Thumbnail Image (Optional)</label>
              <div className="events-upload">
                <input type="file" accept="image/*" onChange={handleImage} />
                {form.thumbnailURL ? (
                  <img
                    src={form.thumbnailURL}
                    alt="preview"
                    className="events-upload-preview"
                  />
                ) : (
                  <>
                    <span className="events-upload-icon">🖼️</span>
                    <span className="events-upload-text">Click to select image</span>
                  </>
                )}
              </div>
            </div>

            {/* Submit — centered, auto width */}
            <div className="events-submit-btn-wrapper">
              <button className="events-submit-btn" onClick={handleSubmit}>
                Create Event
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="events-modal-overlay">
          <div className="events-modal">
            <span className="events-modal-emoji">🎉</span>
            <h2 className="events-modal-title">Awesome!</h2>
            <p className="events-modal-text">
              Your event has been created successfully.<br />
              The whole college can now view it.
            </p>
            <button className="events-modal-btn" onClick={handleViewEvents}>
              View Events
            </button>
          </div>
        </div>
      )}
    </div>
  );
}