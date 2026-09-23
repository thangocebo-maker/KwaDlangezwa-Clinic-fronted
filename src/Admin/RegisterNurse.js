import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../translations/LanguageContext";

function RegisterNurse() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [user, setUser] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [staffId, setStaffId] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nurses, setNurses] = useState([]);

  const [alert, setAlert] = useState({
    message: "",
    type: "",
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // CHECK ADMIN LOGIN
  // =========================

  useEffect(() => {
    try {
      const loggedInUser = JSON.parse(
        localStorage.getItem("clinic_user")
      );

      if (
        !loggedInUser ||
        loggedInUser.role !== "admin"
      ) {
        navigate("/login");
        return;
      }

      setUser(loggedInUser);

      loadNurses();
    } catch (error) {
      console.error(
        "Admin authentication error:",
        error
      );

      navigate("/login");
    }
  }, [navigate]);

  // =========================
  // LOAD REGISTERED NURSES
  // =========================

  const loadNurses = () => {
    try {
      const storedUsers = JSON.parse(
        localStorage.getItem("clinic_users")
      );

      const users = Array.isArray(storedUsers)
        ? storedUsers
        : [];

      const registeredNurses = users.filter(
        (person) => person.role === "nurse"
      );

      setNurses(registeredNurses);
    } catch (error) {
      console.error(
        "Error loading nurses:",
        error
      );

      setNurses([]);
    }
  };

  // =========================
  // REGISTER NURSE
  // =========================

  const handleRegister = (event) => {
    event.preventDefault();

    setAlert({
      message: "",
      type: "",
    });

    // Check password length
    if (password.length < 6) {
      setAlert({
        message: t("passwordTooShort"),
        type: "danger",
      });

      return;
    }

    // Check passwords
    if (password !== confirmPassword) {
      setAlert({
        message: t("passwordsDoNotMatch"),
        type: "danger",
      });

      return;
    }

    setLoading(true);

    try {
      const storedUsers = JSON.parse(
        localStorage.getItem("clinic_users")
      );

      const users = Array.isArray(storedUsers)
        ? storedUsers
        : [];

      const newEmail = email
        .trim()
        .toLowerCase();

      const newStaffId = staffId
        .trim()
        .toLowerCase();

      // =========================
      // CHECK DUPLICATE EMAIL
      // =========================

      const emailExists = users.some(
        (existingUser) =>
          existingUser &&
          existingUser.email &&
          String(existingUser.email)
            .trim()
            .toLowerCase() === newEmail
      );

      if (emailExists) {
        setAlert({
          message: t("emailAlreadyExists"),
          type: "danger",
        });

        setLoading(false);
        return;
      }

      // =========================
      // CHECK DUPLICATE STAFF ID
      // =========================

      const staffIdExists = users.some(
        (existingUser) =>
          existingUser &&
          existingUser.staff_id &&
          String(existingUser.staff_id)
            .trim()
            .toLowerCase() === newStaffId
      );

      if (staffIdExists) {
        setAlert({
          message: t("staffIdExists"),
          type: "danger",
        });

        setLoading(false);
        return;
      }

      // =========================
      // CREATE NURSE ACCOUNT
      // =========================

      const newNurse = {
        id: `nurse-${Date.now()}`,
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        staff_id: staffId.trim(),
        department: department,
        password: password,
        role: "nurse",
      };

      // Add nurse to users
      users.push(newNurse);

      // Save users
      localStorage.setItem(
        "clinic_users",
        JSON.stringify(users)
      );

      // IMPORTANT:
      // Do NOT change clinic_user.
      // The Admin remains logged in.

      // Update nurse list
      const updatedNurses = users.filter(
        (person) => person.role === "nurse"
      );

      setNurses(updatedNurses);

      // Success message
      setAlert({
        message: t("nurseRegisteredSuccessfully"),
        type: "success",
      });

      // Clear form
      setFullName("");
      setEmail("");
      setPhone("");
      setStaffId("");
      setDepartment("");
      setPassword("");
      setConfirmPassword("");

      setLoading(false);

      // Return to Admin Dashboard
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);
    } catch (error) {
      console.error(
        "Nurse registration error:",
        error
      );

      setAlert({
        message: t("unableToRegisterNurse"),
        type: "danger",
      });

      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("clinic_user");
    navigate("/login");
  };

  // =========================
  // WAIT FOR ADMIN
  // =========================

  if (!user) {
    return null;
  }

  return (
    <>
      {/* =========================
          TOPBAR
      ========================== */}

      <div className="topbar">

        <div className="topbar-brand">
          KwaDlangezwa<span>Clinic</span>
        </div>

        <div className="topbar-user">

          <span>
            {user.full_name ||
              user.name ||
              t("administrator")}
          </span>

          <div className="topbar-avatar">
            🛠️
          </div>

        </div>

      </div>

      {/* =========================
          SIDEBAR
      ========================== */}

      <div className="sidebar">

        <div className="sidebar-section">
          {t("adminMenu")}
        </div>

        {/* Dashboard */}

        <div
          className="sidebar-item"
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          <span className="icon">
            🏛️
          </span>

          <span>
            {t("dashboard")}
          </span>
        </div>

        {/* Register Nurse */}

        <div
          className="sidebar-item active"
          onClick={() =>
            navigate("/admin/register-nurse")
          }
        >
          <span className="icon">
            👩‍⚕️
          </span>

          <span>
            {t("registerNurse")}
          </span>
        </div>

        {/* System Configuration */}

        <div
          className="sidebar-item"
          onClick={() =>
            navigate("/admin/configuration")
          }
        >
          <span className="icon">
            ⚙️
          </span>

          <span>
            {t("systemConfig")}
          </span>
        </div>

        {/* Reports */}

        <div
          className="sidebar-item"
          onClick={() =>
            navigate("/admin/reports")
          }
        >
          <span className="icon">
            📊
          </span>

          <span>
            {t("reports")}
          </span>
        </div>

        <hr className="sidebar-divider" />

        {/* Logout */}

        <div
          className="sidebar-item"
          onClick={handleLogout}
        >
          <span className="icon">
            🚪
          </span>

          <span>
            {t("logout")}
          </span>
        </div>

      </div>

      {/* =========================
          MAIN CONTENT
      ========================== */}

      <div className="main-content">

        {/* PAGE HEADER */}

        <div className="page-header">

          <div className="page-title">
            {t("registerNurse")} 👩‍⚕️
          </div>

          <div className="page-subtitle">
            {t("registerNurseDescription")}
          </div>

        </div>

        {/* =========================
            ALERT
        ========================== */}

        {alert.message && (
          <div
            className={`alert show ${
              alert.type === "success"
                ? "alert-success"
                : "alert-danger"
            }`}
          >
            {alert.message}
          </div>
        )}

        {/* =========================
            REGISTRATION FORM
        ========================== */}

        <div className="card">

          <div className="card-header">

            <div className="card-title">
              {t("nurseAccountDetails")}
            </div>

          </div>

          <div className="card-body">

            <form onSubmit={handleRegister}>

              {/* FULL NAME */}

              <div className="form-group">

                <label className="form-label">
                  {t("fullName")}
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder={t("nurseFullNamePlaceholder")}
                  value={fullName}
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
                  required
                />

              </div>

              {/* EMAIL + PHONE */}

              <div className="form-row">

                <div className="form-group">

                  <label className="form-label">
                    {t("email")}
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder={t("nurseEmailPlaceholder")}
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label className="form-label">
                    {t("phone")}
                  </label>

                  <input
                    type="tel"
                    className="form-control"
                    placeholder={t("enterPhone")}
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    required
                  />

                </div>

              </div>

              {/* STAFF ID + DEPARTMENT */}

              <div className="form-row">

                <div className="form-group">

                  <label className="form-label">
                    {t("staffId")}
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder={t("staffIdPlaceholder")}
                    value={staffId}
                    onChange={(event) =>
                      setStaffId(event.target.value)
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label className="form-label">
                    {t("department")}
                  </label>

                  <select
                    className="form-control"
                    value={department}
                    onChange={(event) =>
                      setDepartment(event.target.value)
                    }
                    required
                  >

                    <option value="">
                      {t("selectDepartment")}
                    </option>

                    <option value="General">
                      {t("general")}
                    </option>

                    <option value="Maternal">
                      {t("maternal")}
                    </option>

                    <option value="Child Health">
                      {t("childHealth")}
                    </option>

                    <option value="Chronic Care">
                      {t("chronicCare")}
                    </option>

                    <option value="Emergency">
                      {t("emergency")}
                    </option>

                    <option value="Other">
                      {t("other")}
                    </option>

                  </select>

                </div>

              </div>

              {/* PASSWORD + CONFIRM PASSWORD */}

              <div className="form-row">

                <div className="form-group">

                  <label className="form-label">
                    {t("password")}
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder={t("minimumSixCharacters")}
                    minLength="6"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label className="form-label">
                    {t("confirmPassword")}
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder={t("reEnterPassword")}
                    minLength="6"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>

              </div>

              {/* ACCOUNT ROLE */}

              <div className="form-group">

                <label className="form-label">
                  {t("accountRole")}
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={t("nurse")}
                  readOnly
                />

                <small
                  style={{
                    display: "block",
                    marginTop: "6px",
                    color: "#666",
                  }}
                >
                  {t("nurseRoleAutomaticallySet")}
                </small>

              </div>

              {/* BUTTONS */}

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "20px",
                  flexWrap: "wrap",
                }}
              >

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading
                    ? t("registeringNurse")
                    : t("registerNurse")}
                </button>

                <button
                  type="button"
                  className="btn"
                  onClick={() =>
                    navigate("/admin/dashboard")
                  }
                  disabled={loading}
                >
                  {t("cancel")}
                </button>

              </div>

            </form>

          </div>

        </div>

        {/* =========================
            REGISTERED NURSES
        ========================== */}

        <div
          className="card"
          style={{
            marginTop: "20px",
          }}
        >

          <div className="card-header">

            <div className="card-title">
              {t("registeredNurses")}
            </div>

          </div>

          <div className="card-body">

            {nurses.length === 0 ? (

              <p
                style={{
                  margin: 0,
                  color: "#666",
                }}
              >
                {t("noNursesRegisteredYet")}
              </p>

            ) : (

              <div
                style={{
                  overflowX: "auto",
                }}
              >

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >

                  <thead>

                    <tr>

                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px",
                          borderBottom:
                            "1px solid #ddd",
                        }}
                      >
                        {t("fullName")}
                      </th>

                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px",
                          borderBottom:
                            "1px solid #ddd",
                        }}
                      >
                        {t("email")}
                      </th>

                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px",
                          borderBottom:
                            "1px solid #ddd",
                        }}
                      >
                        {t("phone")}
                      </th>

                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px",
                          borderBottom:
                            "1px solid #ddd",
                        }}
                      >
                        {t("staffId")}
                      </th>

                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px",
                          borderBottom:
                            "1px solid #ddd",
                        }}
                      >
                        {t("department")}
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {nurses.map((nurse) => (

                      <tr key={nurse.id}>

                        <td
                          style={{
                            padding: "12px",
                            borderBottom:
                              "1px solid #eee",
                          }}
                        >
                          {nurse.full_name}
                        </td>

                        <td
                          style={{
                            padding: "12px",
                            borderBottom:
                              "1px solid #eee",
                          }}
                        >
                          {nurse.email}
                        </td>

                        <td
                          style={{
                            padding: "12px",
                            borderBottom:
                              "1px solid #eee",
                          }}
                        >
                          {nurse.phone}
                        </td>

                        <td
                          style={{
                            padding: "12px",
                            borderBottom:
                              "1px solid #eee",
                          }}
                        >
                          {nurse.staff_id}
                        </td>

                        <td
                          style={{
                            padding: "12px",
                            borderBottom:
                              "1px solid #eee",
                          }}
                        >
                          {nurse.department}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </div>
    </>
  );
}

export default RegisterNurse;