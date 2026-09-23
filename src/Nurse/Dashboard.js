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
    scheduled: 0,
    walkins: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("clinic_user")
    );

    // Only nurses can access this page
    if (!storedUser || storedUser.role !== "nurse") {
      navigate("/login");
      return;
    }

    setUser(storedUser);
    loadDashboard();
  }, [navigate]);

  const loadDashboard = () => {
    setLoading(true);

    try {
      const allAppointments =
        JSON.parse(
          localStorage.getItem("clinic_appointments")
        ) || [];

      const allWalkins =
        JSON.parse(
          localStorage.getItem("clinic_walkins")
        ) || [];

      setAppointments(allAppointments);
      setWalkins(allWalkins);

      // Count scheduled appointments
      const scheduled = allAppointments.filter(
        (appointment) =>
          appointment.status === "Scheduled" ||
          appointment.type === "Booked"
      ).length;

      // Count walk-ins
      const walkinCount = allWalkins.length;

      // Count completed appointments and walk-ins
      const completedAppointments =
        allAppointments.filter(
          (appointment) =>
            appointment.status === "Completed"
        ).length;

      const completedWalkins =
        allWalkins.filter(
          (walkin) =>
            walkin.status === "Completed"
        ).length;

      const completed =
        completedAppointments +
        completedWalkins;

      // Count cancelled/no-shows
      const cancelledAppointments =
        allAppointments.filter(
          (appointment) =>
            appointment.status === "Cancelled" ||
            appointment.status === "No-show"
        ).length;

      const cancelledWalkins =
        allWalkins.filter(
          (walkin) =>
            walkin.status === "No-show"
        ).length;

      const cancelled =
        cancelledAppointments +
        cancelledWalkins;

      setStats({
        total:
          allAppointments.length +
          allWalkins.length,

        scheduled,

        walkins: walkinCount,

        completed,

        cancelled,
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
        scheduled: 0,
        walkins: 0,
        completed: 0,
        cancelled: 0,
      });
    }

    setLoading(false);
  };

  const getStatusBadge = (status) => {
    const statusClass = status
      ? status.toLowerCase()
      : "pending";

    let badgeClass =
      "badge badge-pending";

    if (statusClass === "scheduled") {
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
      Scheduled: t("scheduled"),
      Completed: t("completed"),
      Cancelled: t("cancelled"),
      "No-show": t("noShow"),
      Rejected: t("rejected"),
      Waiting: t("waiting"),
      "In Progress": t("inProgress"),
      Pending: t("pending"),
    };

    return (
      <span className={badgeClass}>
        {translatedStatus[status] ||
          status ||
          t("pending")}
      </span>
    );
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

  const logout = () => {
    localStorage.removeItem(
      "clinic_user"
    );

    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <>
      {/* TOPBAR */}
      <div className="topbar">

        <div className="topbar-brand">
          {t("clinicName")}
        </div>

        <div className="topbar-user">

          <span>
            {user.full_name ||
              user.name ||
              t("nurse")}
          </span>

          <div className="topbar-avatar">
            👩‍⚕️
          </div>

        </div>

      </div>

      {/* SIDEBAR */}
      <div className="sidebar">

        <div className="sidebar-section">
          {t("nurseMenu")}
        </div>

        {/* DASHBOARD */}
        <button
          className="sidebar-item active"
          onClick={() =>
            navigate("/nurse/dashboard")
          }
        >
          <span className="icon">
            🏠
          </span>

          <span>
            {t("dashboard")}
          </span>
        </button>

        {/* MANAGE APPOINTMENTS */}
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

        {/* MANAGE WALK-INS */}
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

        {/* PROFILE */}
        <button
          className="sidebar-item"
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

        {/* LOGOUT */}
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

          <div className="page-title">
            {t("nurseDashboard")}
          </div>

          <div className="page-subtitle">
            {t("nurseDashboardSubtitle")}
          </div>

        </div>

        {/* STATS */}
        <div className="stats-grid">

          {/* TOTAL PATIENTS */}
          <div className="stat-card">

            <div className="stat-label">
              {t("totalPatients")}
            </div>

            <div className="stat-value">
              {loading
                ? "—"
                : stats.total}
            </div>

          </div>

          {/* SCHEDULED */}
          <div className="stat-card">

            <div className="stat-label">
              {t("scheduledAppointments")}
            </div>

            <div className="stat-value primary">
              {loading
                ? "—"
                : stats.scheduled}
            </div>

          </div>

          {/* WALK-INS */}
          <div className="stat-card">

            <div className="stat-label">
              {t("walkInPatients")}
            </div>

            <div className="stat-value warning">
              {loading
                ? "—"
                : stats.walkins}
            </div>

          </div>

          {/* COMPLETED */}
          <div className="stat-card">

            <div className="stat-label">
              {t("completed")}
            </div>

            <div className="stat-value success">
              {loading
                ? "—"
                : stats.completed}
            </div>

          </div>

          {/* CANCELLED */}
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

        {/* REPORTS + DAILY SCHEDULE */}
        <div className="card">

          <div className="card-header">

            <div className="card-title">
              {t("clinicFlowReportsSchedule")}
            </div>

          </div>

          <div className="card-body">

            {/* REPORTS */}
            <ul className="report-list">

              <li>
                {t("totalPatients")}:{" "}
                <span>
                  {loading
                    ? "—"
                    : stats.total}
                </span>
              </li>

              <li>
                {t("scheduledAppointments")}:{" "}
                <span>
                  {loading
                    ? "—"
                    : stats.scheduled}
                </span>
              </li>

              <li>
                {t("walkInsRegistered")}:{" "}
                <span>
                  {loading
                    ? "—"
                    : stats.walkins}
                </span>
              </li>

              <li>
                {t("completedVisits")}:{" "}
                <span>
                  {loading
                    ? "—"
                    : stats.completed}
                </span>
              </li>

              <li>
                {t("cancelledNoShows")}:{" "}
                <span>
                  {loading
                    ? "—"
                    : stats.cancelled}
                </span>
              </li>

            </ul>

            {/* LOADING */}
            {loading && (
              <div className="loading">

                <div className="spinner"></div>

                {t("loadingSchedule")}

              </div>
            )}

            {/* EMPTY */}
            {!loading &&
              appointments.length === 0 &&
              walkins.length === 0 && (
                <div className="empty-state">

                  <div className="empty-icon">
                    📭
                  </div>

                  <p>
                    {t("noAppointmentsOrWalkIns")}
                  </p>

                </div>
              )}

            {/* SCHEDULE TABLE */}
            {!loading &&
              (appointments.length > 0 ||
                walkins.length > 0) && (
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
                          {t("queueNumber")}
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

                      {/* APPOINTMENTS */}
                      {appointments.map(
                        (appointment) => (
                          <tr
                            key={
                              `appointment-${appointment.id}`
                            }
                          >

                            <td>
                              #
                              {
                                appointment.id
                              }
                            </td>

                            <td>
                              <strong>
                                {appointment.patient_name ||
                                  t("unknownPatient")}
                              </strong>
                            </td>

                            <td>
                              {appointment.service ||
                                t("generalConsultation")}
                            </td>

                            <td>
                              {getStatusBadge(
                                appointment.status
                              )}
                            </td>

                            <td>
                              {appointment.type ||
                                t("booked")}
                            </td>

                            <td>
                              —
                            </td>

                            <td>
                              {formatDate(
                                appointment.date
                              )}
                            </td>

                            <td>
                              {appointment.time ||
                                ""}
                            </td>

                          </tr>
                        )
                      )}

                      {/* WALK-INS */}
                      {walkins.map(
                        (walkin) => (
                          <tr
                            key={
                              `walkin-${walkin.id}`
                            }
                          >

                            <td>
                              #
                              {
                                walkin.id
                              }
                            </td>

                            <td>
                              <strong>
                                {walkin.patient_name ||
                                  t("unknownPatient")}
                              </strong>
                            </td>

                            <td>
                              {walkin.department ||
                                t("general")}
                            </td>

                            <td>
                              {getStatusBadge(
                                walkin.status
                              )}
                            </td>

                            <td>
                              <span className="badge badge-pending">
                                🚶 {t("walkIn")}
                              </span>
                            </td>

                            <td>
                              <strong
                                style={{
                                  color:
                                    "var(--accent)",
                                }}
                              >
                                {walkin.queue_number ||
                                  "—"}
                              </strong>
                            </td>

                            <td>
                              {formatDate(
                                walkin.date
                              )}
                            </td>

                            <td>
                              {walkin.time ||
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

export default Dashboard;