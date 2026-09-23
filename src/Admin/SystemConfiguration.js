import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../translations/LanguageContext";

function SystemConfiguration() {
  const navigate = useNavigate();
  const { t } = useLanguage();

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
        t("configurationUpdated")
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
        t("unableSaveConfiguration")
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
          {t("clinicName")}
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
          className="sidebar-item"
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
          className="sidebar-item active"
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
            {t("systemConfiguration")} ⚙️
          </div>

          <div className="page-subtitle">
            {t("systemConfigurationSubtitle")}
          </div>

        </div>

        {/* SUCCESS / ERROR MESSAGE */}
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
              {t("clinicSettings")}
            </div>

          </div>

          <div className="card-body">

            <form onSubmit={saveConfig}>

              {/* Daily Appointment Capacity */}
              <div className="form-group">

                <label className="form-label">
                  {t("dailyAppointmentCapacity")}
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
                  {t("appointmentSlotDuration")}
                  {" "}
                  {t("minutesInBrackets")}
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
                  {t("walkInLimitPerDay")}
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
                  {t("restrictedWalkInHours")}
                </label>

                <input
                  type="text"
                  name="walkin_restriction"
                  className="form-control"
                  placeholder={t("walkInTimeExample")}
                  value={
                    config.walkin_restriction
                  }
                  onChange={handleChange}
                />

              </div>

              {/* Nurse Permissions */}
              <div className="form-group">

                <label className="form-label">
                  {t("nursePermissions")}
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
                    {t("basicAppointmentsOnly")}
                  </option>

                  <option value="extended">
                    {t("extendedAppointmentsWalkIns")}
                  </option>

                  <option value="full">
                    {t("fullAppointmentsWalkInsReports")}
                  </option>

                </select>

              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="btn btn-primary"
              >
                {t("saveConfiguration")}
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
              {t("currentConfiguration")}
            </div>

          </div>

          <div className="card-body">

            <ul className="report-list">

              <li>
                {t("dailyCapacity")}:

                <span>
                  {config.capacity}
                </span>
              </li>

              <li>
                {t("slotDuration")}:

                <span>
                  {config.slot_duration}
                </span>{" "}
                {t("minutes")}
              </li>

              <li>
                {t("walkInLimit")}:

                <span>
                  {config.walkin_limit}
                </span>
              </li>

              <li>
                {t("restrictedHours")}:

                <span>
                  {config.walkin_restriction ||
                    t("none")}
                </span>
              </li>

              <li>
                {t("nursePermissions")}:

                <span>
                  {config.nurse_permissions === "basic"
                    ? t("basic")
                    : config.nurse_permissions ===
                      "extended"
                    ? t("extended")
                    : config.nurse_permissions ===
                      "full"
                    ? t("full")
                    : config.nurse_permissions}
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