import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../translations/LanguageContext";

function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [walkins, setWalkins] = useState([]);
  const [nurses, setNurses] = useState([]);

  useEffect(() => {
    const loggedInUser = JSON.parse(
      localStorage.getItem("clinic_user")
    );

    // Admin authentication
    if (!loggedInUser || loggedInUser.role !== "admin") {
      navigate("/login");
      return;
    }

    setUser(loggedInUser);

    // Load appointments
    const savedAppointments =
      JSON.parse(
        localStorage.getItem("clinic_appointments")
      ) || [];

    // Load walk-ins
    const savedWalkins =
      JSON.parse(
        localStorage.getItem("clinic_walkins")
      ) || [];

    // Load users
    const savedUsers =
      JSON.parse(
        localStorage.getItem("clinic_users")
      ) || [];

    // Get only nurses
    const nurseUsers = Array.isArray(savedUsers)
      ? savedUsers.filter(
          (person) => person.role === "nurse"
        )
      : [];

    setAppointments(
      Array.isArray(savedAppointments)
        ? savedAppointments
        : []
    );

    setWalkins(
      Array.isArray(savedWalkins)
        ? savedWalkins
        : []
    );

    setNurses(nurseUsers);
  }, [navigate]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("clinic_user");
    navigate("/login");
  };

  // Format date
  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const formatted = new Date(date);

    if (isNaN(formatted.getTime())) {
      return date;
    }

    return formatted.toLocaleDateString("en-ZA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Pending and high priority appointments
  const urgentAppointments = appointments
    .filter(
      (appointment) =>
        appointment.status === "Pending" ||
        appointment.priority === "High"
    )
    .slice(0, 10);

  // Status badge
  const getStatusClass = (status) => {
    switch (status) {
      case "Scheduled":
        return "badge badge-success";

      case "Completed":
        return "badge badge-success";

      case "Pending":
        return "badge badge-warning";

      case "Cancelled":
        return "badge badge-danger";

      case "No-show":
        return "badge badge-danger";

      case "Rejected":
        return "badge badge-danger";

      default:
        return "badge";
    }
  };

  // Translate appointment status
  const getStatusText = (status) => {
    switch (status) {
      case "Scheduled":
        return t("scheduled");

      case "Completed":
        return t("completed");

      case "Pending":
        return t("pending");

      case "Cancelled":
        return t("cancelled");

      case "No-show":
        return t("noShow");

      case "Rejected":
        return t("rejected");

      default:
        return t("pending");
    }
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
          KwaDlangezwa
          <span>Clinic</span>
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
          className="sidebar-item active"
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
            {t("clinicOverview")} 🏥
          </div>

          <div className="page-subtitle">
            {t("adminOverviewDescription")}
          </div>

        </div>

        {/* =========================
            STATISTICS
        ========================== */}

        <div className="stats-grid">

          {/* Total Patients */}
          <div className="stat-card">

            <div className="stat-label">
              {t("totalPatients")}
            </div>

            <div className="stat-value">
              {appointments.length +
                walkins.length}
            </div>

          </div>

          {/* Appointments */}
          <div className="stat-card">

            <div className="stat-label">
              {t("appointments")}
            </div>

            <div className="stat-value primary">
              {appointments.length}
            </div>

          </div>

          {/* Walk-ins */}
          <div className="stat-card">

            <div className="stat-label">
              {t("walkIns")}
            </div>

            <div className="stat-value warning">
              {walkins.length}
            </div>

          </div>

          {/* Completed */}
          <div className="stat-card">

            <div className="stat-label">
              {t("completed")}
            </div>

            <div className="stat-value success">
              {
                appointments.filter(
                  (appointment) =>
                    appointment.status ===
                    "Completed"
                ).length
              }
            </div>

          </div>

          {/* Cancelled / No-shows */}
          <div className="stat-card">

            <div className="stat-label">
              {t("cancelledNoShows")}
            </div>

            <div className="stat-value danger">
              {
                appointments.filter(
                  (appointment) =>
                    appointment.status ===
                      "Cancelled" ||
                    appointment.status ===
                      "No-show"
                ).length
              }
            </div>

          </div>

          {/* Nurses Active */}
          <div className="stat-card">

            <div className="stat-label">
              {t("nursesActive")}
            </div>

            <div className="stat-value">
              {nurses.length}
            </div>

          </div>

        </div>

        {/* =========================
            NURSE ACTIVITY
        ========================== */}

        <div
          className="card"
          style={{
            marginBottom: "20px",
          }}
        >

          <div className="card-header">

            <div className="card-title">
              {t("nurseActivity")}
            </div>

          </div>

          <div className="card-body">

            {nurses.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  👩‍⚕️
                </div>

                <p>
                  {t("noNursesRegistered")}
                </p>

              </div>

            ) : (

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "15px",
                }}
              >

                {nurses.map((nurse) => (

                  <div
                    key={nurse.id}
                    style={{
                      border:
                        "1px solid #e5e7eb",
                      borderRadius:
                        "10px",
                      padding:
                        "15px",
                      background:
                        "#f9fafb",
                    }}
                  >

                    <div
                      style={{
                        fontWeight: 600,
                        marginBottom:
                          "5px",
                      }}
                    >
                      👩‍⚕️{" "}
                      {nurse.full_name ||
                        nurse.name ||
                        t("nurse")}
                    </div>

                    <div
                      style={{
                        fontSize:
                          "13px",
                        color:
                          "var(--text-secondary)",
                      }}
                    >
                      {nurse.department ||
                        t("generalDepartment")}
                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

        {/* =========================
            URGENT APPOINTMENTS
        ========================== */}

        <div className="card">

          <div className="card-header">

            <div className="card-title">
              {t("pendingHighPriorityAppointments")}
            </div>

          </div>

          <div
            className="card-body"
            style={{
              padding: 0,
            }}
          >

            {urgentAppointments.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  ✅
                </div>

                <p>
                  {t("noUrgentAppointments")}
                </p>

              </div>

            ) : (

              <div className="table-wrap">

                <table>

                  <thead>

                    <tr>

                      <th>
                        #
                      </th>

                      <th>
                        {t("patient")}
                      </th>

                      <th>
                        {t("service")}
                      </th>

                      <th>
                        {t("status")}
                      </th>

                      <th>
                        {t("type")}
                      </th>

                      <th>
                        {t("date")}
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {urgentAppointments.map(
                      (appointment) => (

                        <tr
                          key={
                            appointment.id
                          }
                        >

                          <td>
                            #{appointment.id}
                          </td>

                          <td>
                            {appointment.patient_name ||
                              t("unknownPatient")}
                          </td>

                          <td>
                            {appointment.service ||
                              t("generalConsultation")}
                          </td>

                          <td>

                            <span
                              className={getStatusClass(
                                appointment.status
                              )}
                            >
                              {getStatusText(
                                appointment.status
                              )}
                            </span>

                          </td>

                          <td>
                            {appointment.type ||
                              t("booked")}
                          </td>

                          <td>
                            {formatDate(
                              appointment.date
                            )}{" "}
                            {appointment.time ||
                              ""}
                          </td>

                        </tr>

                      )
                    )}

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

export default AdminDashboard;