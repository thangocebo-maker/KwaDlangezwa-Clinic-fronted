import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../translations/LanguageContext";

function MyAppointments() {
  const navigate = useNavigate();
  const { t } = useLanguage();

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

  // Reschedule appointment
  const reschedule = (id) => {
    const newDate = prompt(
      t("enterNewDate")
    );

    if (!newDate) {
      return;
    }

    const newTime = prompt(
      t("enterNewTime")
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
          t("timeSlotAlreadyBookedChooseAnother")
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
        t("appointmentRescheduledAwaitingStaffApproval")
      );

      setMessageType("success");

      loadAppointments(user.id);
    } catch (error) {
      console.error(
        "Error rescheduling appointment:",
        error
      );

      setMessage(
        t("unableRescheduleAppointment")
      );

      setMessageType("danger");
    }
  };

  // Cancel appointment
  const cancelBooking = (id) => {
    const confirmCancel =
      window.confirm(
        t("confirmCancelAppointment")
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
        t("appointmentCancelled")
      );

      setMessageType("success");

      loadAppointments(user.id);
    } catch (error) {
      console.error(
        "Error cancelling appointment:",
        error
      );

      setMessage(
        t("unableCancelAppointment")
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
            {t("dashboard")}
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
            {t("bookAppointment")}
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

          <div className="page-title">
            {t("myAppointments")}
          </div>

          <div className="page-subtitle">
            {t("appointmentsWalkInsOverview")}
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
                {t("myWalkInVisits")}
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
                        {t("queueNumber")}
                      </th>

                      <th>
                        {t("department")}
                      </th>

                      <th>
                        {t("priority")}
                      </th>

                      <th>
                        {t("date")}
                      </th>

                      <th>
                        {t("time")}
                      </th>

                      <th>
                        {t("status")}
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
                              translatedDepartment[
                                walkin.department
                              ] ||
                              walkin.department ||
                              "—"
                            }
                          </td>

                          <td>
                            {
                              translatedPriority[
                                walkin.priority
                              ] ||
                              walkin.priority ||
                              t("normal")
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
              {t("appointmentHistory")}
            </div>

            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                navigate(
                  "/patient/book"
                )
              }
            >
              + {t("bookNewAppointment")}
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

                {t("loadingYourAppointments")}

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
                    📅 {t("bookYourFirstAppointment")}
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
                          {t("date")}
                        </th>

                        <th>
                          {t("time")}
                        </th>

                        <th>
                          {t("status")}
                        </th>

                        <th>
                          {t("actions")}
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
                                    {t("reschedule")}
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
                                    {t("cancel")}
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