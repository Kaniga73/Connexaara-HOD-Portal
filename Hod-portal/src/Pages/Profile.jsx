import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Profile.css";

const initialProfile = {
  name: "Dr.G.Fathima ",
  email: "FathimaAce@gmail.com.com",
  phone: "1234567890",
  bio: "",
  role: "Student",
  avatarURL: null,
};

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [modalMsg, setModalMsg] = useState({
    title: "",
    text: "",
  });

  // ── Change Password Modal ─────────────────────────────
  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState(
    {}
  );

  const fileInputRef = useRef();

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  // ── Avatar upload ─────────────────────────────────────
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setProfile((p) => ({
      ...p,
      avatarURL: url,
    }));

    setModalMsg({
      title: "Profile Updated",
      text: "Your profile picture has been updated.",
    });

    setShowModal(true);
  };

  // ── Edit mode ─────────────────────────────────────────
  const startEdit = () => {
    setDraft({
      name: profile.name,
      phone: profile.phone,
      bio: profile.bio,
    });

    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const saveEdit = () => {
    setProfile((p) => ({
      ...p,
      ...draft,
    }));

    setEditing(false);

    setModalMsg({
      title: "Profile Updated",
      text: "Your personal details have been updated.",
    });

    setShowModal(true);
  };

  const handleDraft = (e) => {
    const { name, value } = e.target;

    setDraft((d) => ({
      ...d,
      [name]: value,
    }));
  };

  // ── Password Validation ───────────────────────────────
  const handlePasswordInput = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    setPasswordErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validatePasswordForm = () => {
    const errors = {};

    // Current Password
    if (!passwordData.currentPassword.trim()) {
      errors.currentPassword =
        "Current password is required";
    }

    // New Password
    if (!passwordData.newPassword.trim()) {
  errors.newPassword = "New password is required";
}

    setPasswordErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handlePasswordSave = () => {
    if (!validatePasswordForm()) return;

    // Add backend/API logic here

    setShowPasswordModal(false);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
    });

    setPasswordErrors({});

    setModalMsg({
      title: "Password Updated",
      text: "Your password has been changed successfully.",
    });

    setShowModal(true);
  };

  const initial =
    profile.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="profile-page">
      <div className="profile-layout">

        {/* ── Left: Identity Card ───────────────────── */}
        <div className="profile-identity-card">

          <div className="profile-avatar-wrap">
            {profile.avatarURL ? (
              <img
                src={profile.avatarURL}
                alt="avatar"
                className="profile-avatar-img"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                {initial}
              </div>
            )}

            <label
              className="profile-avatar-edit-btn"
              title="Change photo"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          <span className="profile-role-badge">
            {profile.role}
          </span>

          <h2 className="profile-identity-name">
            {profile.name}
          </h2>

          <p className="profile-identity-email">
            {profile.email}
          </p>
        </div>

        {/* ── Right Panel ───────────────────────────── */}
        <div className="profile-right">

          {/* Personal Details */}
          <div className="profile-section-card">

            <div className="profile-section-header">
              <h3 className="profile-section-title">
                Personal Details
              </h3>

              {!editing && (
                <button
                  className="profile-edit-btn"
                  onClick={startEdit}
                >
                  Edit
                </button>
              )}
            </div>

            {editing ? (
              <div className="profile-form">

                <div className="profile-form-group">
                  <label className="profile-form-label">
                    Name
                  </label>

                  <input
                    className="profile-form-input"
                    name="name"
                    value={draft.name}
                    onChange={handleDraft}
                    placeholder="Your full name"
                  />
                </div>

                <div className="profile-form-group">
                  <label className="profile-form-label">
                    Phone Number
                  </label>

                  <input
                    className="profile-form-input"
                    name="phone"
                    value={draft.phone}
                    onChange={handleDraft}
                    placeholder="Your phone number"
                  />
                </div>

                <div className="profile-form-group">
                  <label className="profile-form-label">
                    Bio
                  </label>

                  <textarea
                    className="profile-form-textarea"
                    name="bio"
                    value={draft.bio}
                    onChange={handleDraft}
                    placeholder="Write a short bio"
                  />
                </div>

                <div className="profile-form-actions">
                  <button
                    className="profile-cancel-btn"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>

                  <button
                    className="profile-save-btn"
                    onClick={saveEdit}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="profile-detail-row">
                  <div className="profile-detail-label">
                    Name
                  </div>

                  <div className="profile-detail-value">
                    {profile.name}
                  </div>
                </div>

                <div className="profile-detail-row">
                  <div className="profile-detail-label">
                    Phone Number
                  </div>

                  <div className="profile-detail-value">
                    {profile.phone || "Not provided"}
                  </div>
                </div>

                <div className="profile-detail-row">
                  <div className="profile-detail-label">
                    Bio
                  </div>

                  <div className="profile-detail-value">
                    {profile.bio || "Not provided"}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Account Settings */}
          <div className="profile-section-card">

            <div className="profile-section-header">
              <h3 className="profile-section-title">
                Account Settings
              </h3>
            </div>

            <div
              className="profile-settings-row"
              onClick={() =>
                setShowPasswordModal(true)
              }
            >
              <span className="profile-settings-label">
                Change Password
              </span>

              <span className="profile-settings-chevron">
                ›
              </span>
            </div>

            <div
              className="profile-settings-row"
              onClick={handleLogout}
            >
              <span className="profile-settings-label danger">
                Log Out
              </span>

              <span className="profile-settings-chevron">
                ›
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Change Password Modal ───────────────────── */}
      {showPasswordModal && (
        <div
          className="profile-modal-overlay"
          onClick={() =>
            setShowPasswordModal(false)
          }
        >
          <div
            className="profile-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="profile-modal-close"
              onClick={() =>
                setShowPasswordModal(false)
              }
            >
              ×
            </button>

            <h2 className="profile-modal-title">
              Change Password
            </h2>

            <div className="profile-form">

              {/* Current Password */}
              <div className="profile-form-group">
                <label className="profile-form-label">
                  Current Password
                </label>

                <input
                  type="password"
                  className={`profile-form-input ${
                    passwordErrors.currentPassword
                      ? "profile-input-error"
                      : ""
                  }`}
                  name="currentPassword"
                  value={
                    passwordData.currentPassword
                  }
                  onChange={handlePasswordInput}
                  placeholder="Enter current password"
                />

                {passwordErrors.currentPassword && (
                  <span className="profile-error-text">
                    {
                      passwordErrors.currentPassword
                    }
                  </span>
                )}
              </div>

              {/* New Password */}
              <div className="profile-form-group">
                <label className="profile-form-label">
                  New Password
                </label>

                <input
                  type="password"
                  className={`profile-form-input ${
                    passwordErrors.newPassword
                      ? "profile-input-error"
                      : ""
                  }`}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInput}
                  placeholder="Enter new password"
                />

                {passwordErrors.newPassword && (
                  <span className="profile-error-text">
                    {passwordErrors.newPassword}
                  </span>
                )}
              </div>

              <div className="profile-form-actions">
                <button
                  className="profile-cancel-btn"
                  onClick={() =>
                    setShowPasswordModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  className="profile-save-btn"
                  onClick={handlePasswordSave}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Success Modal ───────────────────────────── */}
      {showModal && (
        <div
          className="profile-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="profile-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="profile-modal-close"
              onClick={() =>
                setShowModal(false)
              }
            >
              ×
            </button>

            <div className="profile-modal-icon">
              ✅
            </div>

            <h2 className="profile-modal-title">
              {modalMsg.title}
            </h2>

            <p className="profile-modal-text">
              {modalMsg.text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}