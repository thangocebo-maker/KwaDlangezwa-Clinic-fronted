import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../translations/LanguageContext";

function ManageAppointments() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // =========================
  // CHECK NURSE LOGIN
  // =========================

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("clinic_user")
    );

    if (
      !storedUser ||
      storedUser.role !== "nurse"
    ) {
      navigate("/login");
      return;
    }

    setUser(storedUser);
    loadAppointments();
  }, [navigate]);

  // =========================
  // LOAD APPOINTMENTS
  // =========================

  const loadAppointments = () => {
    setLoading(true);

    try {
      const allAppointments =
        JSON.parse(
          localStorage.getItem(
            "clinic_appointments"
          )
        ) || [];

      setAppointments(allAppointments);
    } catch (error) {
      console.error(
        "Error loading appointments:",
        error
      );

      setAppointments([]);
    }

    setLoading(false);
  };

  // =========================
  // SHOW MESSAGE
  // =========================

  const showMessage = (
    text,
    type = "success"
  ) => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  // =========================
  // FORMAT DATE
  // =========================

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

  // =========================
  // STATUS BADGE
  // =========================

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
      statusClass === "no-show" ||
      statusClass === "noshow"
    ) {
      badgeClass =
        "badge badge-noshow";
    } else if (
      statusClass === "pending"
    ) {
      badgeClass =
        "badge badge-pending";
    }

    const translatedStatus = {
      Pending: t("pending"),
      Scheduled: t("scheduled"),
      Completed: t("completed"),
      Cancelled: t("cancelled"),
      Rejected: t("rejected"),
      "No-show": t("noShow"),
    };

    return (
      <span className={badgeClass}>
        {translatedStatus[status] ||
          status ||
          t("pending")}
      </span>
    );
  };

  // =========================
  // UPDATE APPOINTMENT STATUS
  // =========================

  const updateAppointmentStatus = (
    appointmentId,
    newStatus
  ) => {
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
              String(appointment.id) ===
              String(appointmentId)
            ) {
              return {
                ...appointment,
                status: newStatus,
                updated_by: user.id,
                updated_at:
                  new Date().toISOString(),
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

      setAppointments(
        updatedAppointments
      );

      const statusMessages = {
        Scheduled: t("appointmentApprovedSuccessfully"),
        Rejected: t("appointmentRejectedSuccessfully"),
        Completed: t("appointmentCompletedSuccessfully"),
        "No-show": t("appointmentNoShowSuccessfully"),
        Cancelled: t("appointmentCancelledSuccessfully"),
      };

      showMessage(
        statusMessages[newStatus] ||
          `${t("appointment")} ${newStatus.toLowerCase()} ${t("successfully")}.`,
        "success"
      );
    } catch (error) {
      console.error(
        "Error updating appointment:",
        error
      );

      showMessage(
        t("unableUpdateAppointment"),
        "danger"
      );
    }
  };

  // =========================
  // APPROVE
  // =========================

  const approveAppointment = (
    appointmentId
  ) => {
    updateAppointmentStatus(
      appointmentId,
      "Scheduled"
    );
  };

  // =========================
  // REJECT
  // =========================

  const rejectAppointment = (
    appointmentId
  ) => {
    updateAppointmentStatus(
      appointmentId,
      "Rejected"
    );
  };

  // =========================
  // COMPLETE
  // =========================

  const completeAppointment = (
    appointmentId
  ) => {
    updateAppointmentStatus(
      appointmentId,
      "Completed"
    );
  };

  // =========================
  // NO-SHOW
  // =========================

  const markAppointmentNoShow = (
    appointmentId
  ) => {
    updateAppointmentStatus(
      appointmentId,
      "No-show"
    );
  };

  // =========================
  // CANCEL
  // =========================

  const cancelAppointment = (
    appointmentId
  ) => {
    updateAppointmentStatus(
      appointmentId,
      "Cancelled"
    );
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem(
      "clinic_user"
    );

    navigate("/login");
  };

  // =========================
  // FILTER APPOINTMENTS
  // =========================

  const filteredAppointments =
    appointments.filter(
      (appointment) => {
        if (
          filterStatus &&
          appointment.status !==
            filterStatus
        ) {
          return false;
        }

        return true;
      }
    );

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
              t("nurse")}
          </span>

          <div className="topbar-avatar">
            👩‍⚕️
          </div>

        </div>

      </div>

      {/* =========================
          SIDEBAR
      ========================== */}

      <div className="sidebar">

        <div className="sidebar-section">
          {t("nurseMenu")}
        </div>

        {/* DASHBOARD */}

        <button
          className="sidebar-item"
          onClick={() =>
            navigate(
              "/nurse/dashboard"
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

        {/* MANAGE APPOINTMENTS */}

        <button
          className="sidebar-item active"
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

      {/* =========================
          MAIN CONTENT
      ========================== */}

      <div className="main-content">

        {/* PAGE HEADER */}

        <div className="page-header">

          <div className="page-title">
            {t("manageAppointments")}
          </div>

          <div className="page-subtitle">
            {t("manageAppointmentsSubtitle")}
          </div>

        </div>

        {/* =========================
            MESSAGE
        ========================== */}

        {message && (
          <div
            className={
              messageType ===
              "success"
                ? "alert show alert-success"
                : "alert show alert-danger"
            }
          >
            {message}
          </div>
        )}

        {/* =========================
            APPOINTMENTS CARD
        ========================== */}

        <div className="card">

          {/* CARD HEADER */}

          <div className="card-header">

            <div className="card-title">
              {t("patientAppointments")}
            </div>

            {/* STATUS FILTER */}

            <div className="filter-group">

              <select
                value={
                  filterStatus
                }
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value
                  )
                }
                className="form-control"
              >

                <option value="">
                  {t("allStatuses")}
                </option>

                <option value="Pending">
                  {t("pending")}
                </option>

                <option value="Scheduled">
                  {t("scheduled")}
                </option>

                <option value="Completed">
                  {t("completed")}
                </option>

                <option value="Cancelled">
                  {t("cancelled")}
                </option>

                <option value="Rejected">
                  {t("rejected")}
                </option>

                <option value="No-show">
                  {t("noShow")}
                </option>

              </select>

            </div>

          </div>

          {/* CARD BODY */}

          <div className="card-body">

            {/* LOADING */}

            {loading && (
              <div className="loading">

                <div className="spinner"></div>

                {t("loadingAppointments")}

              </div>
            )}

            {/* NO APPOINTMENTS */}

            {!loading &&
              filteredAppointments.length ===
                0 && (
                <div className="empty-state">

                  <div className="empty-icon">
                    📅
                  </div>

                  <p>
                    {filterStatus
                      ? `${t("no")} ${t(
                          filterStatus ===
                            "Pending"
                            ? "pending"
                            : filterStatus ===
                              "Scheduled"
                            ? "scheduled"
                            : filterStatus ===
                              "Completed"
                            ? "completed"
                            : filterStatus ===
                              "Cancelled"
                            ? "cancelled"
                            : filterStatus ===
                              "Rejected"
                            ? "rejected"
                            : "noShow"
                        )} ${t(
                          "appointmentsFound"
                        )}.`
                      : t(
                          "noAppointmentsFound"
                        )}
                  </p>

                </div>
              )}

            {/* APPOINTMENT TABLE */}

            {!loading &&
              filteredAppointments.length >
                0 && (
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
                          {t("department")}
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

                      {filteredAppointments.map(
                        (appointment) => (
                          <tr
                            key={
                              `appointment-${appointment.id}`
                            }
                          >

                            {/* ID */}

                            <td>
                              #
                              {
                                appointment.id
                              }
                            </td>

                            {/* PATIENT */}

                            <td>

                              <strong>
                                {appointment.patient_name ||
                                  appointment.full_name ||
                                  t("unknownPatient")}
                              </strong>

                              {appointment.patient_email && (
                                <div
                                  style={{
                                    fontSize:
                                      "12px",
                                    color:
                                      "#777",
                                    marginTop:
                                      "3px",
                                  }}
                                >
                                  {
                                    appointment.patient_email
                                  }
                                </div>
                              )}

                            </td>

                            {/* SERVICE */}

                            <td>
                              {appointment.service ||
                                t("generalConsultation")}
                            </td>

                            {/* DEPARTMENT */}

                            <td>
                              {appointment.department ||
                                t("general")}
                            </td>

                            {/* DATE */}

                            <td>
                              {formatDate(
                                appointment.date
                              )}
                            </td>

                            {/* TIME */}

                            <td>
                              {appointment.time ||
                                "—"}
                            </td>

                            {/* STATUS */}

                            <td>
                              {getStatusBadge(
                                appointment.status
                              )}
                            </td>

                            {/* ACTIONS */}

                            <td>

                              <div className="action-buttons">

                                {/* PENDING */}

                                {appointment.status ===
                                  "Pending" && (
                                  <>

                                    <button
                                      className="btn btn-success"
                                      onClick={() =>
                                        approveAppointment(
                                          appointment.id
                                        )
                                      }
                                    >
                                      {t("approve")}
                                    </button>

                                    <button
                                      className="btn btn-danger"
                                      onClick={() =>
                                        rejectAppointment(
                                          appointment.id
                                        )
                                      }
                                    >
                                      {t("reject")}
                                    </button>

                                  </>
                                )}

                                {/* SCHEDULED */}

                                {appointment.status ===
                                  "Scheduled" && (
                                  <>

                                    <button
                                      className="btn btn-primary"
                                      onClick={() =>
                                        completeAppointment(
                                          appointment.id
                                        )
                                      }
                                    >
                                      {t("complete")}
                                    </button>

                                    <button
                                      className="btn btn-danger"
                                      onClick={() =>
                                        markAppointmentNoShow(
                                          appointment.id
                                        )
                                      }
                                    >
                                      {t("noShow")}
                                    </button>

                                    <button
                                      className="btn btn-warning"
                                      onClick={() =>
                                        cancelAppointment(
                                          appointment.id
                                        )
                                      }
                                    >
                                      {t("cancel")}
                                    </button>

                                  </>
                                )}

                                {/* COMPLETED */}

                                {appointment.status ===
                                  "Completed" && (
                                  <span
                                    style={{
                                      color:
                                        "#198754",
                                      fontSize:
                                        "13px",
                                      fontWeight:
                                        "600",
                                    }}
                                  >
                                    ✓ {t("completed")}
                                  </span>
                                )}

                                {/* CANCELLED */}

                                {appointment.status ===
                                  "Cancelled" && (
                                  <span
                                    style={{
                                      color:
                                        "#dc3545",
                                      fontSize:
                                        "13px",
                                      fontWeight:
                                        "600",
                                    }}
                                  >
                                    {t("cancelled")}
                                  </span>
                                )}

                                {/* REJECTED */}

                                {appointment.status ===
                                  "Rejected" && (
                                  <span
                                    style={{
                                      color:
                                        "#dc3545",
                                      fontSize:
                                        "13px",
                                      fontWeight:
                                        "600",
                                    }}
                                  >
                                    {t("rejected")}
                                  </span>
                                )}

                                {/* NO-SHOW */}

                                {appointment.status ===
                                  "No-show" && (
                                  <span
                                    style={{
                                      color:
                                        "#dc3545",
                                      fontSize:
                                        "13px",
                                      fontWeight:
                                        "600",
                                    }}
                                  >
                                    {t("noShow")}
                                  </span>
                                )}

                              </div>

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

export default ManageAppointments;