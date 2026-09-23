import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../translations/LanguageContext";

function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [walkins, setWalkins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    walkins: 0,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem(
      "clinic_user"
    );

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(
        storedUser
      );

      if (
        !parsedUser ||
        parsedUser.role !== "patient"
      ) {
        navigate("/login");
        return;
      }

      setUser(parsedUser);
      loadDashboard(parsedUser.id);
    } catch (error) {
      console.error(
        "Invalid user data:",
        error
      );

      navigate("/login");
    }
  }, [navigate]);

  const loadDashboard = (userId) => {
    setLoading(true);

    try {
      // Get all appointments
      const allAppointments =
        JSON.parse(
          localStorage.getItem(
            "clinic_appointments"
          )
        ) || [];

      // Get all walk-ins
      const allWalkins =
        JSON.parse(
          localStorage.getItem(
            "clinic_walkins"
          )
        ) || [];

      // Get only this patient's appointments
      const patientAppointments =
        allAppointments.filter(
          (appointment) =>
            String(appointment.patient_id) ===
            String(userId)
        );

      // Get only this patient's walk-ins
      const patientWalkins =
        allWalkins.filter(
          (walkin) =>
            String(walkin.patient_id) ===
            String(userId)
        );

      setAppointments(
        patientAppointments
      );

      setWalkins(patientWalkins);

      // Appointment statistics
      const upcoming =
        patientAppointments.filter(
          (appointment) =>
            appointment.status ===
            "Scheduled"
        ).length;

      const completedAppointments =
        patientAppointments.filter(
          (appointment) =>
            appointment.status ===
            "Completed"
        ).length;

      const cancelledAppointments =
        patientAppointments.filter(
          (appointment) =>
            appointment.status ===
              "Cancelled" ||
            appointment.status ===
              "No-show"
        ).length;

      // Walk-in statistics
      const completedWalkins =
        patientWalkins.filter(
          (walkin) =>
            walkin.status ===
            "Completed"
        ).length;

      const noShowWalkins =
        patientWalkins.filter(
          (walkin) =>
            walkin.status ===
            "No-show"
        ).length;

      // Total completed visits
      const completed =
        completedAppointments +
        completedWalkins;

      // Total cancelled/no-show visits
      const cancelled =
        cancelledAppointments +
        noShowWalkins;

      // Total visits includes appointments
      // and walk-ins
      const total =
        patientAppointments.length +
        patientWalkins.length;

      setStats({
        total,
        upcoming,
        completed,
        cancelled,
        walkins:
          patientWalkins.length,
      });
    } catch (error) {
      console.error(
        "Error loading dashboard:",
        error
      );

      setAppointments([]);
      setWalkins([]);

      setStats({
        total: 0,
        upcoming: 0,
        completed: 0,
        cancelled: 0,
        walkins: 0,
      });
    }

    setLoading(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }

    const dateObject = new Date(
      `${dateString}T00:00:00`
    );

    return dateObject.toLocaleDateString(
      "en-ZA",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatusBadge = (status) => {
    const statusClass = status
      ? status.toLowerCase()
      : "pending";

    let badgeClass =
      "badge badge-pending";

    if (
      statusClass === "scheduled"
    ) {
      badgeClass =
        "badge badge-scheduled";
    } else if (
      statusClass === "completed"
    ) {
      badgeClass =
        "badge badge-completed";
    } else if (
      statusClass === "cancelled"
    ) {
      badgeClass =
        "badge badge-cancelled";
    } else if (
      statusClass === "rejected"
    ) {
      badgeClass =
        "badge badge-rejected";
    } else if (
      statusClass === "noshow"
    ) {
      badgeClass =
        "badge badge-noshow";
    } else if (
      statusClass === "waiting"
    ) {
      badgeClass =
        "badge badge-pending";
    } else if (
      statusClass === "in progress"
    ) {
      badgeClass =
        "badge badge-scheduled";
    }

    const translatedStatus = {
      Pending: t("pending"),
      Scheduled: t("scheduled"),
      Completed: t("completed"),
      Cancelled: t("cancelled"),
      Rejected: t("rejected"),
      "No-show": t("noShow"),
      Waiting: t("waiting"),
      "In Progress": t("inProgress"),
    };

    return (
      <span className={badgeClass}>
        {translatedStatus[status] ||
          status ||
          t("pending")}
      </span>
    );
  };

  const logout = () => {
    localStorage.removeItem(
      "clinic_user"
    );

    navigate("/login");
  };

  if (!user) {
    return null;
  }

  const firstName =
    user.full_name?.split(" ")[0] ||
    user.name?.split(" ")[0] ||
    t("patient");

  const recentAppointments =
    appointments.slice(0, 5);

  /*
    Get the most recent walk-in record.

    This allows the patient to see their
    current queue/status after being
    registered by the nurse.
  */
  const currentWalkin =
    walkins.length > 0
      ? walkins[walkins.length - 1]
      : null;

  const translatedDepartment = {
    General: t("general"),
    Dental: t("dental"),
    Maternal: t("maternal"),
    "Child Health": t("childHealth"),
    Chronic: t("chronicCare"),
  };

  const translatedPriority = {
    Normal: t("normal"),
    Urgent: t("urgent"),
    Emergency: t("emergency"),
  };

  return (
    <>
      {/* TOPBAR */}
      <div className="topbar">
        <div className="topbar-brand">
          KwaDlangezwa
          <span>Clinic</span>
        </div>

        <div className="topbar-user">
          <span>
            {user.full_name ||
              user.name ||
              t("patient")}
          </span>

          <div className="topbar-avatar">
            👤
          </div>
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-section">
          {t("patientMenu")}
        </div>

        <button
          className="sidebar-item active"
          onClick={() =>
            navigate(
              "/patient/dashboard"
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

        <button
          className="sidebar-item"
          onClick={() =>
            navigate("/patient/book")
          }
        >
          <span className="icon">
            📅
          </span>

          <span>
            {t("bookAppointment")}
          </span>
        </button>

        <button
          className="sidebar-item"
          onClick={() =>
            navigate(
              "/patient/appointments"
            )
          }
        >
          <span className="icon">
            🗂
          </span>

          <span>
            {t("myAppointments")}
          </span>
        </button>

        <button
          className="sidebar-item"
          onClick={() =>
            navigate(
              "/patient/profile"
            )
          }
        >
          <span className="icon">
            👤
          </span>

          <span>
            {t("profile")}
          </span>
        </button>

        <hr className="sidebar-divider" />

        <button
          className="sidebar-item"
          onClick={logout}
        >
          <span className="icon">
            🚪
          </span>

          <span>
            {t("logout")}
          </span>
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">

        {/* PAGE HEADER */}
        <div className="page-header">
          <div
            className="page-title"
            id="welcome-title"
          >
            {t("welcomePatient")}, {firstName}! 👋
          </div>

          <div className="page-subtitle">
            {t("patientDashboardSubtitle")}
          </div>
        </div>

        {/* STATS */}
        <div className="stats-grid">

          {/* Total Visits */}
          <div className="stat-card">
            <div className="stat-label">
              {t("totalVisits")}
            </div>

            <div className="stat-value">
              {loading
                ? "—"
                : stats.total}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="stat-card">
            <div className="stat-label">
              {t("upcomingAppointments")}
            </div>

            <div className="stat-value warning">
              {loading
                ? "—"
                : stats.upcoming}
            </div>
          </div>

          {/* Walk-in Visits */}
          <div className="stat-card">
            <div className="stat-label">
              {t("walkInVisits")}
            </div>

            <div className="stat-value warning">
              {loading
                ? "—"
                : stats.walkins}
            </div>
          </div>

          {/* Completed */}
          <div className="stat-card">
            <div className="stat-label">
              {t("completedVisits")}
            </div>

            <div className="stat-value success">
              {loading
                ? "—"
                : stats.completed}
            </div>
          </div>

          {/* Cancelled / No-shows */}
          <div className="stat-card">
            <div className="stat-label">
              {t("cancelledNoShows")}
            </div>

            <div className="stat-value danger">
              {loading
                ? "—"
                : stats.cancelled}
            </div>
          </div>

        </div>

        {/* CURRENT WALK-IN STATUS */}
        {currentWalkin && (
          <div className="card">

            <div className="card-header">
              <div className="card-title">
                {t("currentWalkIn")}
              </div>
            </div>

            <div className="card-body">

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "20px",
                }}
              >

                {/* Queue Number */}
                <div>
                  <div
                    className="stat-label"
                    style={{
                      marginBottom: "6px",
                    }}
                  >
                    {t("queueNumber")}
                  </div>

                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                    }}
                  >
                    {currentWalkin.queue_number ||
                      "—"}
                  </div>
                </div>

                {/* Department */}
                <div>
                  <div
                    className="stat-label"
                    style={{
                      marginBottom: "6px",
                    }}
                  >
                    {t("department")}
                  </div>

                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    {translatedDepartment[
                      currentWalkin.department
                    ] ||
                      currentWalkin.department ||
                      "—"}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <div
                    className="stat-label"
                    style={{
                      marginBottom: "6px",
                    }}
                  >
                    {t("priority")}
                  </div>

                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    {translatedPriority[
                      currentWalkin.priority
                    ] ||
                      currentWalkin.priority ||
                      t("normal")}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <div
                    className="stat-label"
                    style={{
                      marginBottom: "6px",
                    }}
                  >
                    {t("currentStatus")}
                  </div>

                  <div>
                    {getStatusBadge(
                      currentWalkin.status
                    )}
                  </div>
                </div>

              </div>

              {/* Walk-in information */}
              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "16px",
                  borderTop:
                    "1px solid var(--border-color)",
                  color:
                    "var(--text-secondary)",
                  fontSize: "13px",
                }}
              >
                {currentWalkin.status ===
                  "Waiting" && (
                  <span>
                    {t("waitingInClinicQueue")}
                  </span>
                )}

                {currentWalkin.status ===
                  "In Progress" && (
                  <span>
                    {t("beingAttendedByStaff")}
                  </span>
                )}

                {currentWalkin.status ===
                  "Completed" && (
                  <span>
                    {t("visitCompleted")}
                  </span>
                )}

                {currentWalkin.status ===
                  "No-show" && (
                  <span>
                    {t("walkInNoShow")}
                  </span>
                )}
              </div>

            </div>
          </div>
        )}

        {/* RECENT APPOINTMENTS */}
        <div className="card">

          <div className="card-header">

            <div className="card-title">
              {t("recentAppointments")}
            </div>

            <button
              className="btn btn-outline btn-sm"
              onClick={() =>
                navigate(
                  "/patient/appointments"
                )
              }
            >
              {t("viewAll")}
            </button>

          </div>

          <div
            className="card-body"
            style={{ padding: 0 }}
          >

            {/* LOADING */}
            {loading && (
              <div className="loading">
                <div className="spinner"></div>

                {t("loadingYourAppointments")}
              </div>
            )}

            {/* EMPTY */}
            {!loading &&
              appointments.length === 0 && (
                <div className="empty-state">

                  <div className="empty-icon">
                    📭
                  </div>

                  <p>
                    {t("noAppointmentsYet")}
                  </p>

                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      navigate(
                        "/patient/book"
                      )
                    }
                  >
                    📅 {t("bookAnAppointment")}
                  </button>

                </div>
              )}

            {/* TABLE */}
            {!loading &&
              appointments.length > 0 && (
                <div className="table-wrap">

                  <table>

                    <thead>
                      <tr>
                        <th>
                          {t("service")}
                        </th>

                        <th>
                          {t("doctor")}
                        </th>

                        <th>
                          {t("status")}
                        </th>

                        <th>
                          {t("date")}
                        </th>

                        <th>
                          {t("time")}
                        </th>
                      </tr>
                    </thead>

                    <tbody>

                      {recentAppointments.map(
                        (appointment) => (
                          <tr
                            key={
                              appointment.id
                            }
                          >

                            <td
                              title={
                                appointment.service ||
                                t("clinicAppointment")
                              }
                              style={{
                                maxWidth:
                                  "220px",
                                overflow:
                                  "hidden",
                                textOverflow:
                                  "ellipsis",
                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {appointment.service ||
                                t("clinicAppointment")}
                            </td>

                            <td>
                              {appointment.doctor ||
                                t("clinicStaff")}
                            </td>

                            <td>
                              {getStatusBadge(
                                appointment.status
                              )}
                            </td>

                            <td
                              style={{
                                color:
                                  "var(--text-secondary)",
                                fontSize:
                                  "12px",
                              }}
                            >
                              {formatDate(
                                appointment.date
                              )}
                            </td>

                            <td
                              style={{
                                color:
                                  "var(--text-secondary)",
                                fontSize:
                                  "12px",
                              }}
                            >
                              {
                                appointment.time
                              }
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

        {/* QUICK ACTIONS */}
        <div
          className="quick-actions"
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >

          <button
            className="btn btn-primary"
            style={{
              fontSize: "14px",
              padding: "14px 28px",
            }}
            onClick={() =>
              navigate(
                "/patient/book"
              )
            }
          >
            📅 {t("bookNewAppointment")}
          </button>

          <button
            className="btn btn-outline"
            style={{
              fontSize: "14px",
              padding: "14px 28px",
            }}
            onClick={() =>
              navigate(
                "/patient/appointments"
              )
            }
          >
            🗂 {t("viewMyAppointments")}
          </button>

        </div>

      </div>
    </>
  );
}

export default Dashboard;