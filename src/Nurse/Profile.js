import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../translations/LanguageContext";

function Profile() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [schedule, setSchedule] = useState("");
  const [avatar, setAvatar] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // =========================
  // CHECK NURSE LOGIN
  // =========================

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("clinic_user")
    );

    // Only nurses can access this page
    if (
      !storedUser ||
      storedUser.role !== "nurse"
    ) {
      navigate("/login");
      return;
    }

    setUser(storedUser);
    loadNurseProfile(storedUser);
  }, [navigate]);

  // =========================
  // LOAD NURSE PROFILE
  // =========================

  const loadNurseProfile = (storedUser) => {
    setFullName(
      storedUser.full_name ||
        storedUser.name ||
        ""
    );

    setEmail(
      storedUser.email || ""
    );

    setRole(
      storedUser.nurse_role ||
        storedUser.position ||
        "Nurse"
    );

    setDepartment(
      storedUser.department ||
        "General"
    );

    setPhone(
      storedUser.phone || ""
    );

    setSchedule(
      storedUser.schedule ||
        "Mon–Fri, 08:00–16:00"
    );

    setAvatar(
      storedUser.avatar_url || ""
    );

    setLoading(false);
  };

  // =========================
  // PROFILE PICTURE
  // =========================

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage(
        t("invalidImageFile")
      );

      setMessageType("danger");

      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setAvatar(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // =========================
  // SAVE PROFILE
  // =========================

  const saveProfile = (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    try {
      const users =
        JSON.parse(
          localStorage.getItem(
            "clinic_users"
          )
        ) || [];

      // Check duplicate email
      const emailExists =
        users.some(
          (existingUser) =>
            existingUser.id !== user.id &&
            existingUser.email &&
            existingUser.email
              .toLowerCase() ===
              email
                .trim()
                .toLowerCase()
        );

      if (emailExists) {
        setMessage(
          t("emailAlreadyInUse")
        );

        setMessageType("danger");

        return;
      }

      // Updated Nurse profile
      const updatedUser = {
        ...user,

        full_name:
          fullName.trim(),

        email:
          email.trim(),

        role:
          "nurse",

        nurse_role:
          role.trim() ||
          "Nurse",

        department:
          department.trim() ||
          "General",

        phone:
          phone.trim(),

        schedule:
          schedule.trim() ||
          "Mon–Fri, 08:00–16:00",

        avatar_url:
          avatar,
      };

      // Update clinic users
      const updatedUsers =
        users.map(
          (existingUser) =>
            existingUser.id === user.id
              ? updatedUser
              : existingUser
        );

      localStorage.setItem(
        "clinic_users",
        JSON.stringify(
          updatedUsers
        )
      );

      // Update logged-in user
      localStorage.setItem(
        "clinic_user",
        JSON.stringify(
          updatedUser
        )
      );

      setUser(updatedUser);

      setEditing(false);

      setMessage(
        t("nurseProfileUpdated")
      );

      setMessageType("success");

    } catch (error) {
      console.error(
        "Error updating Nurse profile:",
        error
      );

      setMessage(
        t("profileUpdateFailed")
      );

      setMessageType("danger");
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem(
      "clinic_user"
    );

    navigate("/login");
  };

  if (
    loading ||
    !user
  ) {
    return null;
  }

  return (
    <>
      {/* =========================
          TOPBAR
      ========================== */}

      <div className="topbar">

        <div className="topbar-brand">
          KwaDlangezwa
          <span>Clinic</span>
        </div>

        <div className="topbar-user">

          <span>
            {fullName ||
              t("nurse")}
          </span>

          <div className="topbar-avatar">

            {avatar ? (
              <img
                src={avatar}
                alt={t("nurseAvatar")}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius:
                    "50%",
                  objectFit:
                    "cover",
                }}
              />
            ) : (
              fullName
                ? fullName
                    .charAt(0)
                    .toUpperCase()
                : "👩‍⚕️"
            )}

          </div>

        </div>

      </div>

      {/* =========================
          SIDEBAR
      ========================== */}

      <div className="sidebar">

        <div className="sidebar-section">
          {t("nurseMenu")}
        </div>

        {/* Dashboard */}

        <button
          className="sidebar-item"
          onClick={() =>
            navigate(
              "/nurse/dashboard"
            )
          }
        >
          <span className="icon">
            🏠
          </span>

          <span>
            {t("dashboard")}
          </span>
        </button>

        {/* Manage Appointments */}

        <button
          className="sidebar-item"
          onClick={() =>
            navigate(
              "/nurse/appointments"
            )
          }
        >
          <span className="icon">
            📅
          </span>

          <span>
            {t("manageAppointments")}
          </span>
        </button>

        {/* Manage Walk-ins */}

        <button
          className="sidebar-item"
          onClick={() =>
            navigate(
              "/nurse/walkins"
            )
          }
        >
          <span className="icon">
            🚶
          </span>

          <span>
            {t("manageWalkIns")}
          </span>
        </button>

        <hr className="sidebar-divider" />

        {/* Profile */}

        <button
          className="sidebar-item active"
          onClick={() =>
            navigate(
              "/nurse/profile"
            )
          }
        >
          <span className="icon">
            👤
          </span>

          <span>
            {t("myProfile")}
          </span>
        </button>

        {/* Logout */}

        <button
          className="sidebar-item"
          onClick={
            logout
          }
        >
          <span className="icon">
            🚪
          </span>

          <span>
            {t("logout")}
          </span>
        </button>

      </div>

      {/* =========================
          MAIN CONTENT
      ========================== */}

      <div className="main-content">

        {/* PAGE HEADER */}

        <div className="page-title">
          {t("nurseProfile")}
        </div>

        <div className="page-subtitle">
          {t("nurseProfileSubtitle")}
        </div>

        <br />

        {/* =========================
            MESSAGE
        ========================== */}

        {message && (
          <div
            className={
              messageType === "success"
                ? "alert show alert-success"
                : "alert show alert-danger"
            }
          >
            {message}
          </div>
        )}

        {/* =========================
            PROFILE DISPLAY
        ========================== */}

        <div className="card">

          <div className="card-header">

            <div className="card-title">
              {t("nurseProfile")}
            </div>

            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                setEditing(
                  !editing
                )
              }
            >
              {editing
                ? t("close")
                : t("editProfile")}
            </button>

          </div>

          <div className="card-body">

            {/* PROFILE PICTURE */}

            <div
              className="profile-row"
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap: "12px",
                marginBottom:
                  "18px",
              }}
            >

              <strong>
                {t("profilePicture")}:
              </strong>

              {avatar ? (
                <img
                  src={avatar}
                  alt={t("nurseProfile")}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius:
                      "50%",
                    objectFit:
                      "cover",
                    border:
                      "2px solid var(--accent)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius:
                      "50%",
                    background:
                      "var(--accent)",
                    display:
                      "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    fontSize:
                      "25px",
                  }}
                >
                  👩‍⚕️
                </div>
              )}

            </div>

            {/* FULL NAME */}

            <div
              className="profile-row"
              style={{
                marginBottom:
                  "12px",
              }}
            >
              <strong>
                {t("fullName")}:
              </strong>{" "}
              {fullName}
            </div>

            {/* EMAIL */}

            <div
              className="profile-row"
              style={{
                marginBottom:
                  "12px",
              }}
            >
              <strong>
                {t("email")}:
              </strong>{" "}
              {email}
            </div>

            {/* ROLE */}

            <div
              className="profile-row"
              style={{
                marginBottom:
                  "12px",
              }}
            >
              <strong>
                {t("role")}:
              </strong>{" "}
              {role ||
                t("nurse")}
            </div>

            {/* DEPARTMENT */}

            <div
              className="profile-row"
              style={{
                marginBottom:
                  "12px",
              }}
            >
              <strong>
                {t("department")}:
              </strong>{" "}
              {department ||
                "-"}
            </div>

            {/* PHONE */}

            <div
              className="profile-row"
              style={{
                marginBottom:
                  "12px",
              }}
            >
              <strong>
                {t("phone")}:
              </strong>{" "}
              {phone ||
                "-"}
            </div>

            {/* SCHEDULE */}

            <div
              className="profile-row"
              style={{
                marginBottom:
                  "12px",
              }}
            >
              <strong>
                {t("schedule")}:
              </strong>{" "}
              {schedule ||
                "-"}
            </div>

          </div>

        </div>

        {/* =========================
            EDIT FORM
        ========================== */}

        {editing && (
          <div className="card">

            <div className="card-header">

              <div className="card-title">
                {t("editNurseProfile")}
              </div>

            </div>

            <div className="card-body">

              <form
                onSubmit={
                  saveProfile
                }
              >

                {/* PROFILE PICTURE */}

                <div className="form-group">

                  <label className="form-label">
                    {t("profilePicture")}
                  </label>

                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={
                      handleAvatarChange
                    }
                  />

                  <small
                    style={{
                      color:
                        "var(--text-secondary)",
                    }}
                  >
                    {t("uploadJpgPng")}
                  </small>

                </div>

                {/* AVATAR PREVIEW */}

                {avatar && (
                  <div
                    className="form-group"
                    style={{
                      textAlign:
                        "center",
                    }}
                  >

                    <img
                      src={avatar}
                      alt={t("profilePreview")}
                      style={{
                        width: "90px",
                        height: "90px",
                        borderRadius:
                          "50%",
                        objectFit:
                          "cover",
                        border:
                          "3px solid var(--accent)",
                      }}
                    />

                  </div>
                )}

                {/* FULL NAME */}

                <div className="form-group">

                  <label className="form-label">
                    {t("fullName")}
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={
                      fullName
                    }
                    onChange={(e) =>
                      setFullName(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>

                {/* EMAIL */}

                <div className="form-group">

                  <label className="form-label">
                    {t("email")}
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    value={
                      email
                    }
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>

                {/* ROLE */}

                <div className="form-group">

                  <label className="form-label">
                    {t("role")}
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={
                      role
                    }
                    onChange={(e) =>
                      setRole(
                        e.target.value
                      )
                    }
                  />

                </div>

                {/* DEPARTMENT */}

                <div className="form-group">

                  <label className="form-label">
                    {t("department")}
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={
                      department
                    }
                    onChange={(e) =>
                      setDepartment(
                        e.target.value
                      )
                    }
                  />

                </div>

                {/* PHONE */}

                <div className="form-group">

                  <label className="form-label">
                    {t("phone")}
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={
                      phone
                    }
                    onChange={(e) =>
                      setPhone(
                        e.target.value
                      )
                    }
                  />

                </div>

                {/* SCHEDULE */}

                <div className="form-group">

                  <label className="form-label">
                    {t("schedule")}
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Mon–Fri, 08:00–16:00"
                    value={
                      schedule
                    }
                    onChange={(e) =>
                      setSchedule(
                        e.target.value
                      )
                    }
                  />

                </div>

                {/* SAVE */}

                <button
                  type="submit"
                  className="btn btn-success"
                >
                  💾 {t("saveChanges")}
                </button>

              </form>

            </div>

          </div>
        )}

      </div>
    </>
  );
}

export default Profile;