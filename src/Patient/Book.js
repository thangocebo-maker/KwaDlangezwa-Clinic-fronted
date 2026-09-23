import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../translations/LanguageContext";

function Book() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [user, setUser] = useState(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [slotStatus, setSlotStatus] = useState([]);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Available clinic appointment times
  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00"
  ];

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("clinic_user")
    );

    if (!storedUser || storedUser.role !== "patient") {
      navigate("/login");
      return;
    }

    setUser(storedUser);
    loadBookings(storedUser.id);
  }, [navigate]);

  // Load patient's appointments
  const loadBookings = (userId) => {
    setLoading(true);

    try {
      const allAppointments =
        JSON.parse(
          localStorage.getItem("clinic_appointments")
        ) || [];

      const patientBookings =
        allAppointments.filter(
          (appointment) =>
            appointment.patient_id === userId
        );

      setBookings(patientBookings);
    } catch (error) {
      console.error(
        "Error loading bookings:",
        error
      );

      setBookings([]);
    }

    setLoading(false);
  };

  // Check which time slots are available or fully booked
  const checkAvailableSlots = (selectedDate) => {
    setDate(selectedDate);
    setTime("");
    setMessage("");
    setMessageType("");

    if (!selectedDate) {
      setSlotStatus([]);
      return;
    }

    try {
      const allAppointments =
        JSON.parse(
          localStorage.getItem("clinic_appointments")
        ) || [];

      // Get all booked times for the selected date
      const bookedTimes =
        allAppointments
          .filter(
            (appointment) =>
              appointment.date === selectedDate &&
              appointment.status !== "Cancelled"
          )
          .map(
            (appointment) =>
              appointment.time
          );

      // Create status for every time slot
      const slots = timeSlots.map((slot) => ({
        time: slot,
        booked: bookedTimes.includes(slot)
      }));

      setSlotStatus(slots);

    } catch (error) {
      console.error(
        "Error checking available slots:",
        error
      );

      // If there is an error, show all slots as available
      setSlotStatus(
        timeSlots.map((slot) => ({
          time: slot,
          booked: false
        }))
      );
    }
  };

  // Confirm appointment
  const submitBooking = (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (!date) {
      setMessage(
        t("selectDateRequired")
      );
      setMessageType("danger");
      return;
    }

    if (!time) {
      setMessage(
        t("selectAvailableTime")
      );
      setMessageType("danger");
      return;
    }

    if (!user) {
      setMessage(
        t("loginFirst")
      );
      setMessageType("danger");
      return;
    }

    const allAppointments =
      JSON.parse(
        localStorage.getItem(
          "clinic_appointments"
        )
      ) || [];

    // Check again before saving to prevent double booking
    const alreadyBooked =
      allAppointments.some(
        (appointment) =>
          appointment.date === date &&
          appointment.time === time &&
          appointment.status !== "Cancelled"
      );

    if (alreadyBooked) {
      setMessage(
        t("timeSlotJustBooked")
      );

      setMessageType("danger");

      checkAvailableSlots(date);

      return;
    }

    const newAppointment = {
      id: Date.now(),

      patient_id: user.id,

      patient_name:
        user.full_name ||
        user.name ||
        "Patient",

      date: date,

      time: time,

      status: "Pending"
    };

    const updatedAppointments = [
      ...allAppointments,
      newAppointment
    ];

    localStorage.setItem(
      "clinic_appointments",
      JSON.stringify(
        updatedAppointments
      )
    );

    setMessage(
      t("appointmentConfirmedAwaitingApproval")
    );

    setMessageType("success");

    // Reset form
    setDate("");
    setTime("");
    setSlotStatus([]);

    // Reload bookings
    loadBookings(user.id);
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

    const allAppointments =
      JSON.parse(
        localStorage.getItem(
          "clinic_appointments"
        )
      ) || [];

    // Check if the new slot is already booked
    const alreadyBooked =
      allAppointments.some(
        (appointment) =>
          appointment.id !== id &&
          appointment.date === newDate &&
          appointment.time === newTime &&
          appointment.status !== "Cancelled"
      );

    if (alreadyBooked) {
      setMessage(
        t("newTimeSlotAlreadyBooked")
      );

      setMessageType("danger");

      return;
    }

    const updatedAppointments =
      allAppointments.map(
        (appointment) => {
          if (appointment.id === id) {
            return {
              ...appointment,

              date: newDate,

              time: newTime,

              status: "Pending"
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
      t("appointmentRescheduledAwaitingApproval")
    );

    setMessageType("success");

    loadBookings(user.id);
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

    const allAppointments =
      JSON.parse(
        localStorage.getItem(
          "clinic_appointments"
        )
      ) || [];

    const updatedAppointments =
      allAppointments.map(
        (appointment) => {
          if (appointment.id === id) {
            return {
              ...appointment,

              status: "Cancelled"
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
      t("appointmentCancelledSuccessfully")
    );

    setMessageType("success");

    loadBookings(user.id);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }

    const dateObject =
      new Date(
        `${dateString}T00:00:00`
      );

    return dateObject.toLocaleDateString(
      "en-ZA",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  // Status badge
  const getStatusBadge = (status) => {
    const statusClass =
      status
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
    }

    const translatedStatus = {
      Pending: t("pending"),
      Scheduled: t("scheduled"),
      Completed: t("completed"),
      Cancelled: t("cancelled"),
      Rejected: t("rejected"),
      "No-show": t("noShow")
    };

    return (
      <span className={badgeClass}>
        {translatedStatus[status] || status}
      </span>
    );
  };

  // Logout
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
              t("patient")}
          </span>

          <div className="topbar-avatar">
            👤
          </div>

        </div>

      </div>


      {/* =========================
          SIDEBAR
      ========================== */}
      <div className="sidebar">

        <div className="sidebar-section">
          {t("patientMenu")}
        </div>


        {/* Dashboard */}
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


        {/* Book Appointment */}
        <button
          className="sidebar-item active"
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


        {/* My Appointments */}
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


        {/* Profile */}
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


        {/* Logout */}
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

        {/* Page Header */}
        <div className="page-header">

          <div className="page-title">
            {t("bookAppointment")}
          </div>

          <div className="page-subtitle">
            {t("chooseDateTimeForVisit")}
          </div>

        </div>


        {/* =========================
            MESSAGE
        ========================== */}
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


        {/* =========================
            NEW APPOINTMENT
        ========================== */}
        <div className="card">

          <div className="card-header">

            <div className="card-title">
              {t("newAppointment")}
            </div>

          </div>


          <div className="card-body">

            <form
              onSubmit={submitBooking}
            >

              {/* DATE */}
              <div className="form-group">

                <label className="form-label">
                  {t("selectDate")}
                </label>

                <input
                  type="date"
                  className="form-control"
                  value={date}
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={(e) =>
                    checkAvailableSlots(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              {/* TIME SLOTS */}
              {date && (
                <div className="form-group">

                  <label className="form-label">
                    {t("timeSlots")}
                  </label>


                  {/* LEGEND */}
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      flexWrap: "wrap",
                      marginBottom: "15px",
                      fontSize: "12px",
                      fontWeight: 600
                    }}
                  >

                    {/* Available */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center"
                      }}
                    >

                      <span
                        style={{
                          display:
                            "inline-block",

                          width: "13px",

                          height: "13px",

                          background:
                            "#28a745",

                          borderRadius:
                            "3px",

                          marginRight:
                            "6px"
                        }}
                      ></span>

                      {t("available")}

                    </div>


                    {/* Fully Booked */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center"
                      }}
                    >

                      <span
                        style={{
                          display:
                            "inline-block",

                          width: "13px",

                          height: "13px",

                          background:
                            "#dc3545",

                          borderRadius:
                            "3px",

                          marginRight:
                            "6px"
                        }}
                      ></span>

                      {t("fullyBooked")}

                    </div>

                  </div>


                  {/* SLOT LIST */}
                  {slotStatus.length === 0 ? (

                    <div className="alert show alert-danger">
                      {t("noTimeSlotsAvailable")}
                    </div>

                  ) : (

                    <div
                      style={{
                        display: "grid",

                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(120px, 1fr))",

                        gap: "10px"
                      }}
                    >

                      {slotStatus.map(
                        (slot) => (

                          <button
                            key={slot.time}
                            type="button"
                            disabled={
                              slot.booked
                            }
                            onClick={() => {
                              if (
                                !slot.booked
                              ) {
                                setTime(
                                  slot.time
                                );
                              }
                            }}
                            style={{
                              padding:
                                "12px 10px",

                              borderRadius:
                                "8px",

                              border:
                                slot.booked
                                  ? "2px solid #dc3545"
                                  : time ===
                                    slot.time
                                  ? "2px solid #e99905"
                                  : "2px solid #28a745",

                              background:
                                slot.booked
                                  ? "#fde8e8"
                                  : time ===
                                    slot.time
                                  ? "#e99905"
                                  : "#e8f8f0",

                              color:
                                slot.booked
                                  ? "#dc3545"
                                  : time ===
                                    slot.time
                                  ? "#003366"
                                  : "#28a745",

                              fontFamily:
                                "Poppins, sans-serif",

                              fontWeight: 600,

                              cursor:
                                slot.booked
                                  ? "not-allowed"
                                  : "pointer",

                              opacity:
                                slot.booked
                                  ? 0.8
                                  : 1,

                              transition:
                                "0.2s"
                            }}
                          >

                            <div>
                              {slot.time}
                            </div>

                            <div
                              style={{
                                fontSize:
                                  "10px",

                                marginTop:
                                  "3px"
                              }}
                            >
                              {slot.booked
                                ? t("fullyBooked")
                                : t("available")}
                            </div>

                          </button>

                        )
                      )}

                    </div>

                  )}

                </div>
              )}


              {/* SELECTED TIME */}
              {time && (
                <div
                  className="alert show alert-success"
                >
                  {t("selectedTime")}:{" "}
                  <strong>
                    {time}
                  </strong>
                </div>
              )}


              {/* CONFIRM BUTTON */}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  !date || !time
                }
                style={{
                  marginTop: "10px"
                }}
              >
                {t("confirmAppointment")}
              </button>

            </form>

          </div>

        </div>


        {/* =========================
            MY BOOKINGS
        ========================== */}
        <div
          className="card"
          style={{
            marginTop: "20px"
          }}
        >

          <div className="card-header">

            <div className="card-title">
              {t("myBookings")}
            </div>

          </div>


          <div
            className="card-body"
            style={{
              padding: 0
            }}
          >

            {/* LOADING */}
            {loading && (
              <div className="loading">

                <div className="spinner"></div>

                {t("loading")}

              </div>
            )}


            {/* EMPTY */}
            {!loading &&
              bookings.length === 0 && (
                <div className="empty-state">

                  <div className="empty-icon">
                    📭
                  </div>

                  <p>
                    {t("noBookingsYet")}
                  </p>

                </div>
              )}


            {/* BOOKINGS TABLE */}
            {!loading &&
              bookings.length > 0 && (

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

                      {bookings.map(
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
                              {formatDate(
                                appointment.date
                              )}
                            </td>


                            <td>
                              {appointment.time}
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
                                        "8px"
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

export default Book;