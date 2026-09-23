import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterNurse() {
  const navigate = useNavigate();

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
        message:
          "Password must be at least 6 characters.",
        type: "danger",
      });

      return;
    }

    // Check passwords
    if (password !== confirmPassword) {
      setAlert({
        message: "Passwords do not match.",
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
          message:
            "An account with this email already exists.",
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
          message:
            "A nurse with this Nurse/Staff ID already exists.",
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
        message:
          "Nurse account registered successfully!",
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
        message:
          "Unable to register nurse. Please try again.",
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
              "Administrator"}
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
          Admin Menu
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
            Dashboard
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
            Register Nurse
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
            System Config
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
            Reports
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
            Logout
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
            Register Nurse 👩‍⚕️
          </div>

          <div className="page-subtitle">
            Create a new nurse account for
            KwaDlangezwa Clinic
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
              Nurse Account Details
            </div>

          </div>

          <div className="card-body">

            <form onSubmit={handleRegister}>

              {/* FULL NAME */}

              <div className="form-group">

                <label className="form-label">
                  Full Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Thandi Mkhize"
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
                    Email Address
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="nurse@email.com"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label className="form-label">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    className="form-control"
                    placeholder="e.g. 072 345 6789"
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
                    Nurse/Staff ID
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. NUR001"
                    value={staffId}
                    onChange={(event) =>
                      setStaffId(event.target.value)
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label className="form-label">
                    Department
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
                      Select Department
                    </option>

                    <option value="General">
                      General
                    </option>

                    <option value="Maternal">
                      Maternal
                    </option>

                    <option value="Child Health">
                      Child Health
                    </option>

                    <option value="Chronic Care">
                      Chronic Care
                    </option>

                    <option value="Emergency">
                      Emergency
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

              </div>

              {/* PASSWORD + CONFIRM PASSWORD */}

              <div className="form-row">

                <div className="form-group">

                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Minimum 6 characters"
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
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Re-enter password"
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
                  Account Role
                </label>

                <input
                  type="text"
                  className="form-control"
                  value="Nurse"
                  readOnly
                />

                <small
                  style={{
                    display: "block",
                    marginTop: "6px",
                    color: "#666",
                  }}
                >
                  The account role is automatically
                  set to Nurse.
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
                    ? "Registering Nurse..."
                    : "Register Nurse"}
                </button>

                <button
                  type="button"
                  className="btn"
                  onClick={() =>
                    navigate("/admin/dashboard")
                  }
                  disabled={loading}
                >
                  Cancel
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
              Registered Nurses
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
                No nurses have been registered yet.
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
                        Full Name
                      </th>

                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px",
                          borderBottom:
                            "1px solid #ddd",
                        }}
                      >
                        Email
                      </th>

                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px",
                          borderBottom:
                            "1px solid #ddd",
                        }}
                      >
                        Phone
                      </th>

                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px",
                          borderBottom:
                            "1px solid #ddd",
                        }}
                      >
                        Staff ID
                      </th>

                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px",
                          borderBottom:
                            "1px solid #ddd",
                        }}
                      >
                        Department
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