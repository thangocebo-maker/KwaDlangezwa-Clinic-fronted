import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyAppointments() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [walkins, setWalkins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

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
      loadAppointments(parsedUser.id);
    } catch (error) {
      console.error(
        "Invalid user data:",
        error
      );

      navigate("/login");
    }
  }, [navigate]);

  const loadAppointments = (userId) => {
    setLoading(true);

    try {
      // Load normal appointments
      const allAppointments =
        JSON.parse(
          localStorage.getItem(
            "clinic_appointments"
          )
        ) || [];

      // Load walk-in patients
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
            String(
              appointment.patient_id
            ) === String(userId)
        );

      // Get only this patient's walk-ins
      const patientWalkins =
        allWalkins.filter(
          (walkin) =>
            String(
              walkin.patient_id
            ) === String(userId)
        );

      setAppointments(
        patientAppointments
      );

      setWalkins(patientWalkins);
    } catch (error) {
      console.error(
        "Error loading appointments:",
        error
      );

      setAppointments([]);
      setWalkins([]);
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

    return (
      <span className={badgeClass}>
        {status || "Pending"}
      </span>
    );
  };

  // Reschedule appointment
  const reschedule = (id) => {
    const newDate = prompt(
      "Enter new date (YYYY-MM-DD):"
    );

    if (!newDate) {
      return;
    }

    const newTime = prompt(
      "Enter new time (HH:MM):"
    );

    if (!newTime) {
      return;
    }

    try {
      const allAppointments =
        JSON.parse(
          localStorage.getItem(
            "clinic_appointments"
          )
        ) || [];

      const alreadyBooked =
        allAppointments.some(
          (appointment) =>
            appointment.id !== id &&
            appointment.date === newDate &&
            appointment.time === newTime &&
            appointment.status !==
              "Cancelled"
        );

      if (alreadyBooked) {
        setMessage(
          "This time slot is already booked. Please choose another time."
        );

        setMessageType("danger");

        return;
      }

      const updatedAppointments =
        allAppointments.map(
          (appointment) => {
            if (
              appointment.id === id
            ) {
              return {
                ...appointment,
                date: newDate,
                time: newTime,
                status: "Pending",
              };
            }

            return appointment;
          }
        );

      localStorage.setItem(
        "clinic_appointments",
        JSON.stringify(
          updatedAppointments
        )
      );

      setMessage(
        "Appointment rescheduled. Awaiting staff approval."
      );

      setMessageType("success");

      loadAppointments(user.id);
    } catch (error) {
      console.error(
        "Error rescheduling appointment:",
        error
      );

      setMessage(
        "Unable to reschedule appointment. Please try again."
      );

      setMessageType("danger");
    }
  };

  // Cancel appointment
  const cancelBooking = (id) => {
    const confirmCancel =
      window.confirm(
        "Are you sure you want to cancel this appointment?"
      );

    if (!confirmCancel) {
      return;
    }

    try {
      const allAppointments =
        JSON.parse(
          localStorage.getItem(
            "clinic_appointments"
          )
        ) || [];

      const updatedAppointments =
        allAppointments.map(
          (appointment) => {
            if (
              appointment.id === id
            ) {
              return {
                ...appointment,
                status: "Cancelled",
              };
            }

            return appointment;
          }
        );

      localStorage.setItem(
        "clinic_appointments",
        JSON.stringify(
          updatedAppointments
        )
      );

      setMessage(
        "Appointment cancelled."
      );

      setMessageType("success");

      loadAppointments(user.id);
    } catch (error) {
      console.error(
        "Error cancelling appointment:",
        error
      );

      setMessage(
        "Unable to cancel appointment. Please try again."
      );

      setMessageType("danger");
    }
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
          KwaDlangezwa
          <span>Clinic</span>
        </div>

        <div className="topbar-user">

          <span>
            {user.full_name ||
              user.name ||
              "Patient"}
          </span>

          <div className="topbar-avatar">
            👤
          </div>

        </div>

      </div>

      {/* SIDEBAR */}
      <div className="sidebar">

        <div className="sidebar-section">
          Patient Menu
        </div>

        <button
          className="sidebar-item"
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
            Dashboard
          </span>
        </button>

        <button
          className="sidebar-item"
          onClick={() =>
            navigate(
              "/patient/book"
            )
          }
        >
          <span className="icon">
            📅
          </span>

          <span>
            Book Appointment
          </span>
        </button>

        <button
          className="sidebar-item active"
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
            My Appointments
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
            Profile
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
            Logout
          </span>
        </button>

      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">

        {/* PAGE HEADER */}
        <div className="page-header">

          <div className="page-title">
            My Appointments
          </div>

          <div className="page-subtitle">
            View and manage all your clinic
            appointments and walk-in visits
          </div>

        </div>

        {/* MESSAGE */}
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

        {/* WALK-IN VISITS */}
        {walkins.length > 0 && (
          <div className="card">

            <div className="card-header">

              <div className="card-title">
                My Walk-in Visits
              </div>

            </div>

            <div
              className="card-body"
              style={{
                padding: 0,
              }}
            >

              <div className="table-wrap">

                <table>

                  <thead>
                    <tr>

                      <th>
                        Queue Number
                      </th>

                      <th>
                        Department
                      </th>

                      <th>
                        Priority
                      </th>

                      <th>
                        Date
                      </th>

                      <th>
                        Time
                      </th>

                      <th>
                        Status
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {walkins.map(
                      (walkin) => (
                        <tr
                          key={
                            walkin.id
                          }
                        >

                          <td
                            style={{
                              fontWeight:
                                "700",
                            }}
                          >
                            {
                              walkin.queue_number ||
                              "—"
                            }
                          </td>

                          <td>
                            {
                              walkin.department ||
                              "—"
                            }
                          </td>

                          <td>
                            {
                              walkin.priority ||
                              "Normal"
                            }
                          </td>

                          <td
                            style={{
                              fontSize:
                                "12px",
                            }}
                          >
                            {formatDate(
                              walkin.date
                            )}
                          </td>

                          <td
                            style={{
                              fontSize:
                                "12px",
                              color:
                                "var(--text-secondary)",
                            }}
                          >
                            {
                              walkin.time ||
                              "—"
                            }
                          </td>

                          <td>
                            {getStatusBadge(
                              walkin.status
                            )}
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>
        )}

        {/* APPOINTMENTS CARD */}
        <div className="card">

          <div className="card-header">

            <div className="card-title">
              Appointment History
            </div>

            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                navigate(
                  "/patient/book"
                )
              }
            >
              + Book New Appointment
            </button>

          </div>

          <div
            className="card-body"
            style={{
              padding: 0,
            }}
          >

            {/* LOADING */}
            {loading && (
              <div className="loading">

                <div className="spinner"></div>

                Loading your
                appointments...

              </div>
            )}

            {/* EMPTY */}
            {!loading &&
              appointments.length ===
                0 && (
                <div className="empty-state">

                  <div className="empty-icon">
                    📭
                  </div>

                  <p>
                    You don’t have any
                    appointments yet
                  </p>

                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      navigate(
                        "/patient/book"
                      )
                    }
                  >
                    📅 Book Your First
                    Appointment
                  </button>

                </div>
              )}

            {/* APPOINTMENTS TABLE */}
            {!loading &&
              appointments.length >
                0 && (
                <div className="table-wrap">

                  <table>

                    <thead>

                      <tr>

                        <th>
                          #
                        </th>

                        <th>
                          Date
                        </th>

                        <th>
                          Time
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Actions
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {appointments.map(
                        (appointment) => (
                          <tr
                            key={
                              appointment.id
                            }
                          >

                            <td
                              style={{
                                color:
                                  "var(--text-muted)",
                                fontSize:
                                  "12px",
                                fontWeight:
                                  "600",
                              }}
                            >
                              #
                              {
                                appointment.id
                              }
                            </td>

                            <td
                              style={{
                                fontSize:
                                  "12px",
                                fontWeight:
                                  "500",
                              }}
                            >
                              {formatDate(
                                appointment.date
                              )}
                            </td>

                            <td
                              style={{
                                fontSize:
                                  "12px",
                                color:
                                  "var(--text-secondary)",
                              }}
                            >
                              {
                                appointment.time
                              }
                            </td>

                            <td>
                              {getStatusBadge(
                                appointment.status
                              )}
                            </td>

                            <td>

                              {(
                                appointment.status ===
                                  "Pending" ||
                                appointment.status ===
                                  "Scheduled"
                              ) ? (
                                <>

                                  <button
                                    className="btn btn-sm btn-outline"
                                    onClick={() =>
                                      reschedule(
                                        appointment.id
                                      )
                                    }
                                  >
                                    Reschedule
                                  </button>

                                  <button
                                    className="btn btn-sm btn-danger"
                                    style={{
                                      marginLeft:
                                        "8px",
                                    }}
                                    onClick={() =>
                                      cancelBooking(
                                        appointment.id
                                      )
                                    }
                                  >
                                    Cancel
                                  </button>

                                </>
                              ) : (
                                "—"
                              )}

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

export default MyAppointments;