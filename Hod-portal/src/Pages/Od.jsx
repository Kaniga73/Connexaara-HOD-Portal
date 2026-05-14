import { useState } from "react";
import "../Styles/Od.css";

const initialODs = [
  {
    id: 1,
    status: "Pending",
    tags: ["Pending Your Review", "Group", "Sem 6"],
    studentName: "Z Mohammed Saif",
    studentId: "6176AC23UCS099",
    section: "CSE B",
    title: "Request for hackathon",
    description:
      "We are participating in the upcoming national hackathon, so need on-duty permission to implement",
    dateFrom: "11 May 2026",
    dateTo: "14 May 2026",
    submittedOn: "9 May 2026 at 12:48 am",
    type: "Group",
    participants: [
      { name: "Z Mohammed Saif", id: "6176AC23UCS099", approved: true },
      { name: "J Manoj Kumar", id: "6176AC23UCS094", approved: false },
      { name: "R Kaniga", id: "6176AC23UCS073", approved: false },
    ],
    tutorApprovals: [
      { name: "Mohammed Saif (TUTOR)", status: "Approved" },
    ],
  },
  {
    id: 2,
    status: "Pending",
    tags: ["Pending Your Review", "Individual", "Sem 4"],
    studentName: "A Priya Dharshini",
    studentId: "6176AC23UCS012",
    section: "CSE A",
    title: "Inter-college symposium",
    description:
      "Attending an inter-college technical symposium as a paper presenter. Requesting OD for the event day.",
    dateFrom: "16 May 2026",
    dateTo: "16 May 2026",
    submittedOn: "10 May 2026 at 9:15 am",
    type: "Individual",
    participants: [
      { name: "A Priya Dharshini", id: "6176AC23UCS012", approved: false },
    ],
    tutorApprovals: [
      { name: "Kavitha (TUTOR)", status: "Approved" },
    ],
  },
];

const initialApproved = [
  {
    id: 3,
    status: "Approved",
    tags: ["Approved", "Individual", "Sem 5"],
    studentName: "R Karthikeyan",
    studentId: "6176AC22UCS045",
    section: "CSE C",
    title: "Sports meet participation",
    description:
      "Selected to represent the college in the state-level sports meet.",
    dateFrom: "5 May 2026",
    dateTo: "6 May 2026",
    submittedOn: "2 May 2026 at 3:00 pm",
    type: "Individual",
    participants: [
      { name: "R Karthikeyan", id: "6176AC22UCS045", approved: true },
    ],
    tutorApprovals: [
      { name: "Lokesh (TUTOR)", status: "Approved" },
    ],
    approvedOn: "3 May 2026 at 10:00 am",
  },
];

const avatarColors = [
  "#6c63ff",
  "#f97316",
  "#10b981",
  "#3b82f6",
  "#ec4899",
  "#8b5cf6",
];

function getInitial(name) {
  return name ? name.charAt(0).toUpperCase() : "?";
}

export default function Od() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [pendingList, setPendingList] = useState(initialODs);
  const [approvedList, setApprovedList] = useState(initialApproved);

  const [reviewOD, setReviewOD] = useState(null);
  const [viewOD, setViewOD] = useState(null);

  const [remark, setRemark] = useState("");
  const [successOD, setSuccessOD] = useState(null);
  const [rejectConfirm, setRejectConfirm] = useState(false);

  function handleApprove() {
    const od = reviewOD;

    const now = new Date();

    const approvedOn =
      now.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) +
      " at " +
      now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

    const approvedOD = {
      ...od,
      status: "Approved",
      tags: od.tags.map((t) =>
        t === "Pending Your Review" ? "Approved" : t
      ),
      approvedOn,
    };

    setPendingList((prev) => prev.filter((o) => o.id !== od.id));

    setApprovedList((prev) => [approvedOD, ...prev]);

    setReviewOD(null);
    setRemark("");
    setSuccessOD(approvedOD);
  }

  function handleReject() {
    setPendingList((prev) =>
      prev.filter((o) => o.id !== reviewOD.id)
    );

    setReviewOD(null);
    setRemark("");
    setRejectConfirm(false);
  }

  const displayList =
    activeTab === "Pending" ? pendingList : approvedList;

  return (
    <div className="od-root">

      {/* HEADER */}

      <div className="od-page-header">
        <div>
          <h1 className="od-page-title">OD Requests</h1>

          <p className="od-page-sub">
            {activeTab === "Pending"
              ? "Department-level approval"
              : "Review and approve student ODs"}
          </p>
        </div>
      </div>

      {/* TABS */}

      <div className="od-tabs">

        <button
          className={`od-tab ${
            activeTab === "Pending" ? "od-tab-active" : ""
          }`}
          onClick={() => setActiveTab("Pending")}
        >
          Pending

          {pendingList.length > 0 && (
            <span className="od-tab-badge">
              {pendingList.length}
            </span>
          )}
        </button>

        <button
          className={`od-tab ${
            activeTab === "Approved" ? "od-tab-active" : ""
          }`}
          onClick={() => setActiveTab("Approved")}
        >
          Approved

          {approvedList.length > 0 && (
            <span className="od-tab-badge od-tab-badge-green">
              {approvedList.length}
            </span>
          )}
        </button>
      </div>

      {/* LIST */}

      <div className="od-list">

        {displayList.length === 0 && (
          <div className="od-empty">
            

            <p>
              No {activeTab.toLowerCase()} OD requests
            </p>
          </div>
        )}

        {displayList.map((od, idx) => (

          <div
            className="od-card"
            key={od.id}
            style={{
              animationDelay: `${idx * 0.05}s`,
            }}
          >

            {/* LEFT */}

            

          <div className="od-card-left">
  <div className="od-card-main">
    <div className="od-card-student">

      <div className="od-avatar" style={{ background: avatarColors[od.id % avatarColors.length] }}>
        {getInitial(od.studentName)}
      </div>

      <div>
        <p className="od-student-name">{od.studentName}</p>
        <p className="od-student-meta">{od.studentId} · {od.section}</p>
      </div>

    </div>
    <h3 className="od-card-title">{od.title}</h3>
   

                {/* DESC */}

                <p className="od-card-desc">
                  {od.description}
                </p>

                {/* TAGS */}

                <div className="od-card-tags">

                  {od.tags.map((tag, i) => (

                    <span
                      key={i}
                      className={`od-tag ${
                        tag === "Pending Your Review"
                          ? "od-tag-pending"
                          : tag === "Approved"
                          ? "od-tag-approved"
                          : tag === "Group"
                          ? "od-tag-group"
                          : tag === "Individual"
                          ? "od-tag-individual"
                          : "od-tag-neutral"
                      }`}
                    >
                      {tag}
                    </span>

                  ))}
                </div>

                {/* DATE */}

                <div className="od-date-row">

                  <span className="od-date-icon">
                    📅
                  </span>

                  <span className="od-date">
                    {od.dateFrom}

                    {od.dateFrom !== od.dateTo && (
                      <>
                        {" "}
                        → {od.dateTo}
                      </>
                    )}
                  </span>
                </div>

              </div>
            </div>

            {/* RIGHT */}

            <div className="od-card-right">

              {od.status === "Pending" ? (

                <button
                  className="od-review-btn"
                  onClick={() => {
                    setReviewOD(od);
                    setRemark("");
                  }}
                >
                  Review
                </button>

              ) : (

                <button
                  className="od-view-btn"
                  onClick={() => setViewOD(od)}
                >
                  View
                </button>

              )}

            </div>
          </div>

        ))}
      </div>

      {/* VIEW MODAL */}

      {viewOD && (
        <div
          className="od-overlay"
          onClick={() => setViewOD(null)}
        >
          <div
            className="od-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="od-modal-header">

              <h2 className="od-modal-title">
                OD Details
              </h2>

              <button
                className="od-modal-close"
                onClick={() => setViewOD(null)}
              >
                ×
              </button>

            </div>

            <div className="od-modal-body">

              <div className="od-view-approved-banner">
                ✓ Approved on {viewOD.approvedOn}
              </div>

              <div className="od-review-section">
                <p className="od-review-label">
                  STUDENT
                </p>

                <p className="od-review-value">
                  {viewOD.studentName}
                </p>
              </div>

              <div className="od-review-section">
                <p className="od-review-label">
                  EVENT
                </p>

                <p className="od-review-value">
                  {viewOD.title}
                </p>
              </div>

              <div className="od-review-section">
                <p className="od-review-label">
                  DESCRIPTION
                </p>

                <p className="od-review-value">
                  {viewOD.description}
                </p>
              </div>

       <div className="od-review-section">
  <p className="od-review-label">
    DATE
  </p>

  <p className="od-review-value">
    {viewOD.dateFrom}
    {viewOD.dateFrom !== viewOD.dateTo &&
      ` → ${viewOD.dateTo}`}
  </p>
</div>

{viewOD.participants && viewOD.participants.length > 1 && (
  <div className="od-review-section">
    <p className="od-review-label">PARTICIPANTS</p>
    <div className="od-participants-list">
      {viewOD.participants.map((p, i) => (
        <div key={i} className="od-participant-row">
          <span className={`od-part-status-dot ${p.approved ? "dot-approved" : "dot-pending"}`} />
          <span className="od-part-name">{p.name}</span>
          <span className="od-part-id">{p.id}</span>
        </div>
      ))}
    </div>
  </div>
)}

{viewOD.tutorApprovals && viewOD.tutorApprovals.length > 0 && (
  <div className="od-review-section">
    <p className="od-review-label">TUTOR APPROVAL</p>
    <div className="od-participants-list">
      {viewOD.tutorApprovals.map((t, i) => (
        <div key={i} className="od-participant-row">
          <span className={`od-part-status-dot ${t.status === "Approved" ? "dot-approved" : "dot-pending"}`} />
          <span className="od-part-name">{t.name}</span>
          <span className="od-part-id" style={{ color: t.status === "Approved" ? "#15803d" : "#94a3b8", fontWeight: 600 }}>
            {t.status}
          </span>
        </div>
      ))}
    </div>
  </div>
)}

</div>  {/* closes od-modal-body */}

<div className="od-modal-actions">
              <button
                className="od-btn-approve"
                style={{ flex: 1 }}
                onClick={() => setViewOD(null)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* REVIEW MODAL */}

      {reviewOD && (
        <div
          className="od-overlay"
          onClick={() => setReviewOD(null)}
        >
          <div
            className="od-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="od-modal-header">

              <h2 className="od-modal-title">
                Review Request
              </h2>

              <button
                className="od-modal-close"
                onClick={() => setReviewOD(null)}
              >
                ×
              </button>

            </div>

            <div className="od-modal-body">

              <div className="od-review-section">
                <p className="od-review-label">
                  STUDENT
                </p>

                <p className="od-review-value">
                  {reviewOD.studentName}
                </p>
              </div>

              <div className="od-review-section">
                <p className="od-review-label">
                  EVENT
                </p>

                <p className="od-review-value">
                  {reviewOD.title}
                </p>
              </div>

              <div className="od-review-section">
                <p className="od-review-label">
                  DESCRIPTION
                </p>

                <p className="od-review-value">
                  {reviewOD.description}
                </p>
              </div>

              <div className="od-review-section">
                <p className="od-review-label">
                  PARTICIPANTS
                </p>

                <div className="od-participants-list">

                  {reviewOD.participants.map((p, i) => (

                    <div
                      key={i}
                      className="od-participant-row"
                    >

                      <span
                        className={`od-part-status-dot ${
                          p.approved
                            ? "dot-approved"
                            : "dot-pending"
                        }`}
                      />

                      <span className="od-part-name">
                        {p.name}
                      </span>

                      <span className="od-part-id">
                        {p.id}
                      </span>

                    </div>

                  ))}
                </div>
              </div>

              <div className="od-review-section">

                <p className="od-review-label">
                  YOUR REMARK
                </p>

                <textarea
                  className="od-remark-input"
                  placeholder="Add a remark (required for rejection)"
                  value={remark}
                  onChange={(e) =>
                    setRemark(e.target.value)
                  }
                  rows={3}
                />
              </div>

            </div>

            <div className="od-modal-actions">

              <button
                className="od-btn-reject"
                onClick={() =>
                  setRejectConfirm(true)
                }
              >
                Reject
              </button>

              <button
                className="od-btn-approve"
                onClick={handleApprove}
              >
                Approve
              </button>

            </div>
          </div>
        </div>
      )}

      {/* REJECT CONFIRM */}

      {rejectConfirm && reviewOD && (
        <div
          className="od-overlay"
          onClick={() => setRejectConfirm(false)}
        >

          <div
            className="od-confirm-dialog"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="od-confirm-icon od-confirm-icon-danger">
              !
            </div>

            <h3 className="od-confirm-title">
              Reject OD Request?
            </h3>

            <p className="od-confirm-desc">
              {reviewOD.studentName} will be notified.
            </p>

            <div className="od-confirm-actions">

              <button
                className="od-confirm-cancel"
                onClick={() =>
                  setRejectConfirm(false)
                }
              >
                Cancel
              </button>

              <button
                className={`od-confirm-reject ${
                  !remark.trim()
                    ? "od-confirm-reject-disabled"
                    : ""
                }`}
                onClick={() =>
                  remark.trim() && handleReject()
                }
                disabled={!remark.trim()}
              >
                Reject
              </button>

            </div>
          </div>
        </div>
      )}

      {/* SUCCESS */}

      {successOD && (
        <div
          className="od-overlay"
          onClick={() => setSuccessOD(null)}
        >

          <div
            className="od-success-dialog"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="od-success-icon">
              ✅
            </div>

            <h3 className="od-success-title">
              OD Approved!
            </h3>

            <p className="od-success-desc">
              {successOD.studentName}'s OD request
              approved successfully.
            </p>

            <div className="od-success-meta">

              <span>
                📅 {successOD.dateFrom}
              </span>

              <span>
                ✓ {successOD.approvedOn}
              </span>

            </div>

            <button
              className="od-success-btn"
              onClick={() => {
                setSuccessOD(null);
                setActiveTab("Approved");
              }}
            >
              View Approved ODs
            </button>

          </div>
        </div>
      )}
    </div>
  );
}