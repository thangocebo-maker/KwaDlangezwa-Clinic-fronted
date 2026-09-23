import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

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
        "Please select a valid image file."
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
          "Another account is already using this email address."
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
        "Nurse profile updated successfully!"
      );

      setMessageType("success");

    } catch (error) {
      console.error(
        "Error updating Nurse profile:",
        error
      );

      setMessage(
        "Failed to update profile. Please try again."
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
              "Nurse"}
          </span>

          <div className="topbar-avatar">

            {avatar ? (
              <img
                src={avatar}
                alt="Nurse Avatar"
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
          Nurse Menu
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
            Dashboard
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
            Manage Appointments
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
            Manage Walk-ins
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
            My Profile
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
            Logout
          </span>
        </button>

      </div>


      {/* =========================
          MAIN CONTENT
      ========================== */}

      <div className="main-content">

        {/* PAGE HEADER */}

        <div className="page-title">
          Nurse Profile
        </div>

        <div className="page-subtitle">
          View and update your personal
          information
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
              Nurse Profile
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
                ? "Close"
                : "Edit Profile"}
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
                Profile Picture:
              </strong>

              {avatar ? (
                <img
                  src={avatar}
                  alt="Nurse Profile"
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
                Full Name:
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
                Email:
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
                Role:
              </strong>{" "}
              {role ||
                "Nurse"}
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
                Department:
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
                Phone:
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
                Schedule:
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
                Edit Nurse Profile
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
                    Profile Picture
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
                    Upload a JPG or PNG
                    image
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
                      alt="Profile Preview"
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
                    Full Name
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
                    Email
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
                    Role
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
                    Department
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
                    Phone
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
                    Schedule
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
                  💾 Save Changes
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