import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SystemConfiguration() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  const [config, setConfig] = useState({
    capacity: 30,
    slot_duration: 30,
    walkin_limit: 20,
    walkin_restriction: "11:30 - 12:30",
    nurse_permissions: "extended",
  });

  useEffect(() => {
    const loggedInUser = JSON.parse(
      localStorage.getItem("clinic_user")
    );

    // Admin authentication
    if (
      !loggedInUser ||
      loggedInUser.role !== "admin"
    ) {
      navigate("/login");
      return;
    }

    setUser(loggedInUser);

    // Load saved configuration
    try {
      const savedConfig = JSON.parse(
        localStorage.getItem("clinic_config")
      );

      if (
        savedConfig &&
        typeof savedConfig === "object"
      ) {
        setConfig((previousConfig) => ({
          ...previousConfig,
          ...savedConfig,
        }));
      }
    } catch (error) {
      console.error(
        "Error loading configuration:",
        error
      );
    }
  }, [navigate]);

  // Handle configuration changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setConfig((previousConfig) => ({
      ...previousConfig,
      [name]: value,
    }));
  };

  // Save configuration
  const saveConfig = (event) => {
    event.preventDefault();

    try {
      localStorage.setItem(
        "clinic_config",
        JSON.stringify(config)
      );

      setMessage(
        "Configuration updated successfully!"
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Error saving configuration:",
        error
      );

      setMessage(
        "Unable to save configuration."
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("clinic_user");
    navigate("/login");
  };

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
          className="sidebar-item"
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
          className="sidebar-item active"
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
            System Configuration ⚙️
          </div>

          <div className="page-subtitle">
            Manage clinic rules, appointment
            slots, and nurse permissions
          </div>

        </div>

        {/* SUCCESS MESSAGE */}
        {message && (
          <div className="alert show alert-success">
            {message}
          </div>
        )}

        {/* =========================
            CONFIG FORM
        ========================== */}

        <div className="card">

          <div className="card-header">

            <div className="card-title">
              Clinic Settings
            </div>

          </div>

          <div className="card-body">

            <form onSubmit={saveConfig}>

              {/* Daily Appointment Capacity */}
              <div className="form-group">

                <label className="form-label">
                  Daily Appointment Capacity
                </label>

                <input
                  type="number"
                  name="capacity"
                  className="form-control"
                  min="1"
                  required
                  value={config.capacity}
                  onChange={handleChange}
                />

              </div>

              {/* Slot Duration */}
              <div className="form-group">

                <label className="form-label">
                  Appointment Slot Duration
                  (minutes)
                </label>

                <input
                  type="number"
                  name="slot_duration"
                  className="form-control"
                  min="5"
                  step="5"
                  required
                  value={config.slot_duration}
                  onChange={handleChange}
                />

              </div>

              {/* Walk-in Limit */}
              <div className="form-group">

                <label className="form-label">
                  Walk-in Limit Per Day
                </label>

                <input
                  type="number"
                  name="walkin_limit"
                  className="form-control"
                  min="0"
                  required
                  value={config.walkin_limit}
                  onChange={handleChange}
                />

              </div>

              {/* Walk-in Restriction */}
              <div className="form-group">

                <label className="form-label">
                  Restricted Walk-in Hours
                </label>

                <input
                  type="text"
                  name="walkin_restriction"
                  className="form-control"
                  placeholder="e.g. 11:30 - 12:30"
                  value={
                    config.walkin_restriction
                  }
                  onChange={handleChange}
                />

              </div>

              {/* Nurse Permissions */}
              <div className="form-group">

                <label className="form-label">
                  Nurse Permissions
                </label>

                <select
                  name="nurse_permissions"
                  className="form-control"
                  value={
                    config.nurse_permissions
                  }
                  onChange={handleChange}
                >

                  <option value="basic">
                    Basic (appointments only)
                  </option>

                  <option value="extended">
                    Extended (appointments +
                    walk-ins)
                  </option>

                  <option value="full">
                    Full (appointments,
                    walk-ins, reports)
                  </option>

                </select>

              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="btn btn-primary"
              >
                Save Configuration
              </button>

            </form>

          </div>

        </div>

        {/* =========================
            CURRENT CONFIGURATION
        ========================== */}

        <div
          className="card"
          style={{ marginTop: "20px" }}
        >

          <div className="card-header">

            <div className="card-title">
              Current Configuration
            </div>

          </div>

          <div className="card-body">

            <ul className="report-list">

              <li>
                Daily Capacity:

                <span>
                  {config.capacity}
                </span>
              </li>

              <li>
                Slot Duration:

                <span>
                  {config.slot_duration}
                </span>{" "}
                minutes
              </li>

              <li>
                Walk-in Limit:

                <span>
                  {config.walkin_limit}
                </span>
              </li>

              <li>
                Restricted Hours:

                <span>
                  {config.walkin_restriction ||
                    "None"}
                </span>
              </li>

              <li>
                Nurse Permissions:

                <span>
                  {config.nurse_permissions}
                </span>
              </li>

            </ul>

          </div>

        </div>

      </div>
    </>
  );
}

export default SystemConfiguration;