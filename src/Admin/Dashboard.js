import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

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
          className="sidebar-item active"
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
            Clinic Overview 🏥
          </div>

          <div className="page-subtitle">
            Consolidated view of appointments,
            walk-ins, nurse activity, and urgent cases
          </div>

        </div>

        {/* =========================
            STATISTICS
        ========================== */}

        <div className="stats-grid">

          {/* Total Patients */}
          <div className="stat-card">

            <div className="stat-label">
              Total Patients
            </div>

            <div className="stat-value">
              {appointments.length +
                walkins.length}
            </div>

          </div>

          {/* Appointments */}
          <div className="stat-card">

            <div className="stat-label">
              Appointments
            </div>

            <div className="stat-value primary">
              {appointments.length}
            </div>

          </div>

          {/* Walk-ins */}
          <div className="stat-card">

            <div className="stat-label">
              Walk-ins
            </div>

            <div className="stat-value warning">
              {walkins.length}
            </div>

          </div>

          {/* Completed */}
          <div className="stat-card">

            <div className="stat-label">
              Completed
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
              Cancelled / No-shows
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
              Nurses Active
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
              Nurse Activity
            </div>

          </div>

          <div className="card-body">

            {nurses.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  👩‍⚕️
                </div>

                <p>
                  No nurses are registered
                  in the system.
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
                        "Nurse"}
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
                        "General Department"}
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
              Pending & High Priority
              Appointments
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
                  No pending or urgent
                  appointments right now!
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
                        Patient
                      </th>

                      <th>
                        Service
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Type
                      </th>

                      <th>
                        Date
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
                              "Unknown Patient"}
                          </td>

                          <td>
                            {appointment.service ||
                              "General Consultation"}
                          </td>

                          <td>

                            <span
                              className={getStatusClass(
                                appointment.status
                              )}
                            >
                              {appointment.status ||
                                "Pending"}
                            </span>

                          </td>

                          <td>
                            {appointment.type ||
                              "Booked"}
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