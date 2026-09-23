import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../translations/LanguageContext";

function ManageWalkins() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [user, setUser] = useState(null);
  const [walkins, setWalkins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWalkinForm, setShowWalkinForm] = useState(false);

  // Walk-in form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [priority, setPriority] = useState("Normal");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  // =========================================================
  // CHECK USER
  // =========================================================
  useEffect(() => {
    const storedUser = localStorage.getItem("clinic_user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.role !== "nurse") {
        navigate("/login");
        return;
      }

      setUser(parsedUser);
      loadWalkins();
    } catch (error) {
      console.error("Invalid user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  // =========================================================
  // LOAD WALK-INS
  // =========================================================
  const loadWalkins = () => {
    setLoading(true);

    try {
      const storedWalkins = JSON.parse(
        localStorage.getItem("clinic_walkins") || "[]"
      );

      if (Array.isArray(storedWalkins)) {
        setWalkins(storedWalkins);
      } else {
        setWalkins([]);
      }
    } catch (error) {
      console.error("Error loading walk-ins:", error);
      setWalkins([]);
    }

    setLoading(false);
  };

  // =========================================================
  // MESSAGE
  // =========================================================
  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  // =========================================================
  // QUEUE NUMBER
  // =========================================================
  const generateQueueNumber = (existingWalkins) => {
    let highestNumber = 0;

    existingWalkins.forEach((walkin) => {
      if (walkin.queue_number) {
        const number = parseInt(
          String(walkin.queue_number).replace("W", ""),
          10
        );

        if (!isNaN(number) && number > highestNumber) {
          highestNumber = number;
        }
      }
    });

    return `W${String(highestNumber + 1).padStart(3, "0")}`;
  };

  // =========================================================
  // REGISTER WALK-IN
  // =========================================================
  const registerWalkin = (event) => {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    // -----------------------------------------
    // Validate required fields
    // -----------------------------------------
    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword ||
      !department ||
      !priority
    ) {
      showMessage(t("completeRequiredFields"), "danger");
      return;
    }

    // -----------------------------------------
    // Validate password
    // -----------------------------------------
    if (password !== confirmPassword) {
      showMessage(t("passwordsDoNotMatch"), "danger");
      return;
    }

    if (password.length < 6) {
      showMessage(t("minimum6Characters"), "danger");
      return;
    }

    // -----------------------------------------
    // Validate email
    // -----------------------------------------
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const cleanEmail = email.trim().toLowerCase();

    if (!emailRegex.test(cleanEmail)) {
      showMessage(t("invalidEmail"), "danger");
      return;
    }

    try {
      // =====================================================
      // GET EXISTING USERS
      // =====================================================
      let existingUsers = [];

      try {
        const storedUsers = JSON.parse(
          localStorage.getItem("clinic_users") || "[]"
        );

        if (Array.isArray(storedUsers)) {
          existingUsers = storedUsers;
        }
      } catch (error) {
        console.error("Error reading clinic_users:", error);
        existingUsers = [];
      }

      // =====================================================
      // CHECK IF EMAIL ALREADY EXISTS
      // =====================================================
      const emailExists = existingUsers.some(
        (existingUser) =>
          existingUser.email?.trim().toLowerCase() === cleanEmail
      );

      if (emailExists) {
        showMessage(t("patientAccountEmailExists"), "danger");
        return;
      }

      // =====================================================
      // CHECK IF PHONE ALREADY EXISTS
      // =====================================================
      const cleanPhone = phone.trim();

      const phoneExists = existingUsers.some(
        (existingUser) =>
          existingUser.phone?.trim() === cleanPhone
      );

      if (phoneExists) {
        showMessage(
          "A patient account with this phone number already exists.",
          "danger"
        );
        return;
      }

      // =====================================================
      // GET EXISTING WALK-INS
      // =====================================================
      let existingWalkins = [];

      try {
        const storedWalkins = JSON.parse(
          localStorage.getItem("clinic_walkins") || "[]"
        );

        if (Array.isArray(storedWalkins)) {
          existingWalkins = storedWalkins;
        }
      } catch (error) {
        console.error("Error reading clinic_walkins:", error);
        existingWalkins = [];
      }

      // =====================================================
      // GENERATE IDS
      // =====================================================
      const timestamp = Date.now();

      const patientId = timestamp;

      const walkinId = timestamp + 1;

      // =====================================================
      // GENERATE QUEUE NUMBER
      // =====================================================
      const queueNumber = generateQueueNumber(existingWalkins);

      // =====================================================
      // CURRENT DATE AND TIME
      // =====================================================
      const now = new Date();

      const currentDate = now.toISOString().split("T")[0];

      const currentTime = now.toTimeString().slice(0, 5);

      // =====================================================
      // CREATE PATIENT ACCOUNT
      // =====================================================
      const patientAccount = {
        id: patientId,

        // Keep both names for compatibility
        name: fullName.trim(),
        full_name: fullName.trim(),

        email: cleanEmail,

        phone: cleanPhone,

        password: password,

        role: "patient",

        created_at: now.toISOString(),
      };

      // =====================================================
      // CREATE WALK-IN RECORD
      // =====================================================
      const newWalkin = {
        id: walkinId,

        patient_id: patientId,

        patient_name: fullName.trim(),

        patient_email: cleanEmail,

        patient_phone: cleanPhone,

        queue_number: queueNumber,

        department: department,

        priority: priority,

        status: "Waiting",

        date: currentDate,

        time: currentTime,

        registered_by: user?.id || null,

        type: "Walk-in",

        created_at: now.toISOString(),
      };

      // =====================================================
      // SAVE PATIENT ACCOUNT
      // =====================================================
      const updatedUsers = [
        ...existingUsers,
        patientAccount,
      ];

      localStorage.setItem(
        "clinic_users",
        JSON.stringify(updatedUsers)
      );

      // =====================================================
      // SAVE WALK-IN
      // =====================================================
      const updatedWalkins = [
        ...existingWalkins,
        newWalkin,
      ];

      localStorage.setItem(
        "clinic_walkins",
        JSON.stringify(updatedWalkins)
      );

      // =====================================================
      // UPDATE SCREEN
      // =====================================================
      setWalkins(updatedWalkins);

      // =====================================================
      // CLEAR FORM
      // =====================================================
      setFullName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setDepartment("");
      setPriority("Normal");

      setShowWalkinForm(false);

      // =====================================================
      // SUCCESS MESSAGE
      // =====================================================
      showMessage(
        `${t("walkinRegisteredSuccessfully")} ${t(
          "queueNumber"
        )}: ${queueNumber}. ${t("patientCanLogin")}`,
        "success"
      );

      console.log("Walk-in patient registered:", {
        patientAccount,
        newWalkin,
      });
    } catch (error) {
      console.error("Error registering walk-in:", error);

      showMessage(
        t("walkinRegistrationError"),
        "danger"
      );
    }
  };

  // =========================================================
  // UPDATE STATUS
  // =========================================================
  const updateWalkinStatus = (walkinId, newStatus) => {
    const updatedWalkins = walkins.map((walkin) => {
      if (walkin.id === walkinId) {
        return {
          ...walkin,
          status: newStatus,
          updated_at: new Date().toISOString(),
        };
      }

      return walkin;
    });

    setWalkins(updatedWalkins);

    localStorage.setItem(
      "clinic_walkins",
      JSON.stringify(updatedWalkins)
    );

    showMessage(
      `${t("walkinStatusUpdated")} "${newStatus}".`,
      "success"
    );
  };

  // =========================================================
  // DELETE WALK-IN
  // =========================================================
  const deleteWalkin = (walkinId) => {
    const walkinToDelete = walkins.find(
      (walkin) => walkin.id === walkinId
    );

    if (!walkinToDelete) {
      return;
    }

    const confirmed = window.confirm(
      `${t("removeWalkinConfirmation")} ${walkinToDelete.patient_name}?`
    );

    if (!confirmed) {
      return;
    }

    const updatedWalkins = walkins.filter(
      (walkin) => walkin.id !== walkinId
    );

    setWalkins(updatedWalkins);

    localStorage.setItem(
      "clinic_walkins",
      JSON.stringify(updatedWalkins)
    );

    // -----------------------------------------
    // Remove linked patient account
    // -----------------------------------------
    if (walkinToDelete.patient_id) {
      try {
        const existingUsers = JSON.parse(
          localStorage.getItem("clinic_users") || "[]"
        );

        const updatedUsers = existingUsers.filter(
          (existingUser) =>
            existingUser.id !== walkinToDelete.patient_id
        );

        localStorage.setItem(
          "clinic_users",
          JSON.stringify(updatedUsers)
        );
      } catch (error) {
        console.error(
          "Error removing patient account:",
          error
        );
      }
    }

    showMessage(
      t("walkinPatientRemoved"),
      "success"
    );
  };

  // =========================================================
  // FILTER WALK-INS
  // =========================================================
  const filteredWalkins = walkins.filter((walkin) => {
    const statusMatch =
      statusFilter === "All" ||
      walkin.status === statusFilter;

    const departmentMatch =
      departmentFilter === "All" ||
      walkin.department === departmentFilter;

    return statusMatch && departmentMatch;
  });

  // =========================================================
  // STATISTICS
  // =========================================================
  const waitingCount = walkins.filter(
    (walkin) => walkin.status === "Waiting"
  ).length;

  const inProgressCount = walkins.filter(
    (walkin) => walkin.status === "In Progress"
  ).length;

  const completedCount = walkins.filter(
    (walkin) => walkin.status === "Completed"
  ).length;

  const noShowCount = walkins.filter(
    (walkin) => walkin.status === "No-show"
  ).length;

  // =========================================================
  // LOGOUT
  // =========================================================
  const logout = () => {
    localStorage.removeItem("clinic_user");
    navigate("/login");
  };

  // =========================================================
  // STATUS BADGE
  // =========================================================
  const getStatusBadge = (status) => {
    switch (status) {
      case "Waiting":
        return "badge badge-waiting";

      case "In Progress":
        return "badge badge-in-progress";

      case "Completed":
        return "badge badge-completed";

      case "No-show":
        return "badge badge-noshow";

      default:
        return "badge badge-pending";
    }
  };

  // =========================================================
  // PRIORITY BADGE
  // =========================================================
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Emergency":
        return "badge badge-cancelled";

      case "Urgent":
        return "badge badge-pending";

      default:
        return "badge badge-scheduled";
    }
  };

  // =========================================================
  // TRANSLATED STATUS
  // =========================================================
  const translatedStatus = {
    Waiting: t("waiting"),
    "In Progress": t("inProgress"),
    Completed: t("completed"),
    "No-show": t("noShow"),
  };

  // =========================================================
  // TRANSLATED PRIORITY
  // =========================================================
  const translatedPriority = {
    Normal: t("normal"),
    Urgent: t("urgent"),
    Emergency: t("emergency"),
  };

  // =========================================================
  // TRANSLATED DEPARTMENT
  // =========================================================
  const translatedDepartment = {
    General: t("general"),
    Dental: t("dental"),
    Maternal: t("maternal"),
    "Child Health": t("childHealth"),
    Chronic: t("chronicCare"),
  };

  // =========================================================
  // WAIT FOR USER
  // =========================================================
  if (!user) {
    return null;
  }

  return (
    <>
      {/* =====================================================
          TOPBAR
      ===================================================== */}
      <div className="topbar">
        <div className="topbar-brand">
          KwaDlangezwa <span>Clinic</span>
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

      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <aside className="sidebar">
        <div className="sidebar-section">
          {t("nurseMenu")}
        </div>

        <nav className="sidebar-nav">
          <button
            className="sidebar-item"
            onClick={() =>
              navigate("/nurse/dashboard")
            }
          >
            <span className="icon">🏠</span>
            <span>{t("dashboard")}</span>
          </button>

          <button
            className="sidebar-item"
            onClick={() =>
              navigate("/nurse/appointments")
            }
          >
            <span className="icon">📅</span>
            <span>{t("manageAppointments")}</span>
          </button>

          <button
            className="sidebar-item active"
            onClick={() =>
              navigate("/nurse/walkins")
            }
          >
            <span className="icon">🚶</span>
            <span>{t("manageWalkIns")}</span>
          </button>

          <hr className="sidebar-divider" />

          <button
            className="sidebar-item"
            onClick={() =>
              navigate("/nurse/profile")
            }
          >
            <span className="icon">👤</span>
            <span>{t("myProfile")}</span>
          </button>

          <button
            className="sidebar-item"
            onClick={logout}
          >
            <span className="icon">🚪</span>
            <span>{t("logout")}</span>
          </button>
        </nav>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <main className="main-content">

        {/* PAGE HEADER */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              {t("manageWalkInPatients")}
            </h1>

            <p className="page-subtitle">
              {t("manageWalkInPatientsSubtitle")}
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() =>
              setShowWalkinForm(
                !showWalkinForm
              )
            }
          >
            {showWalkinForm
              ? t("closeForm")
              : t("registerWalkIn")}
          </button>
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            className={`alert show ${
              messageType === "success"
                ? "alert-success"
                : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}

        {/* =================================================
            REGISTER WALK-IN FORM
        ================================================= */}
        {showWalkinForm && (
          <section className="card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  {t("registerWalkInPatient")}
                </div>

                <p className="page-subtitle">
                  {t("createPatientWalkInQueue")}
                </p>
              </div>
            </div>

            <div className="card-body">
              <form onSubmit={registerWalkin}>

                <div className="form-row">

                  {/* Full Name */}
                  <div className="form-group">
                    <label className="form-label">
                      {t("fullName")} *
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={fullName}
                      onChange={(event) =>
                        setFullName(
                          event.target.value
                        )
                      }
                      placeholder={t("enterFullName")}
                    />
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label">
                      {t("email")} *
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value
                        )
                      }
                      placeholder={
                        t("emailAddress")
                      }
                    />
                  </div>

                  {/* Phone */}
                  <div className="form-group">
                    <label className="form-label">
                      {t("phone")} *
                    </label>

                    <input
                      type="tel"
                      className="form-control"
                      value={phone}
                      onChange={(event) =>
                        setPhone(
                          event.target.value
                        )
                      }
                      placeholder={t("phoneNumber")}
                    />
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <label className="form-label">
                      {t("password")} *
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      placeholder={
                        t("minimum6Characters")
                      }
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group">
                    <label className="form-label">
                      {t("confirmPassword")} *
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      placeholder={
                        t("confirmPassword")
                      }
                    />
                  </div>

                  {/* Department */}
                  <div className="form-group">
                    <label className="form-label">
                      {t("department")} *
                    </label>

                    <select
                      className="form-control"
                      value={department}
                      onChange={(event) =>
                        setDepartment(
                          event.target.value
                        )
                      }
                    >
                      <option value="">
                        {t("selectDepartment")}
                      </option>

                      <option value="General">
                        {t("general")}
                      </option>

                      <option value="Dental">
                        {t("dental")}
                      </option>

                      <option value="Maternal">
                        {t("maternal")}
                      </option>

                      <option value="Child Health">
                        {t("childHealth")}
                      </option>

                      <option value="Chronic">
                        {t("chronicCare")}
                      </option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div className="form-group">
                    <label className="form-label">
                      {t("priority")} *
                    </label>

                    <select
                      className="form-control"
                      value={priority}
                      onChange={(event) =>
                        setPriority(
                          event.target.value
                        )
                      }
                    >
                      <option value="Normal">
                        {t("normal")}
                      </option>

                      <option value="Urgent">
                        {t("urgent")}
                      </option>

                      <option value="Emergency">
                        {t("emergency")}
                      </option>
                    </select>
                  </div>
                </div>

                {/* FORM BUTTONS */}
                <div className="action-buttons">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {t("registerWalkIn")}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() =>
                      setShowWalkinForm(false)
                    }
                  >
                    {t("cancel")}
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* =================================================
            STATISTICS
        ================================================= */}
        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-label">
              {t("totalWalkIns")}
            </div>

            <div className="stat-value primary">
              {walkins.length}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              {t("waiting")}
            </div>

            <div className="stat-value warning">
              {waitingCount}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              {t("inProgress")}
            </div>

            <div className="stat-value primary">
              {inProgressCount}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              {t("completed")}
            </div>

            <div className="stat-value success">
              {completedCount}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              {t("noShow")}
            </div>

            <div className="stat-value danger">
              {noShowCount}
            </div>
          </div>
        </div>

        {/* =================================================
            FILTERS
        ================================================= */}
        <section className="card">
          <div className="card-body">
            <div className="form-row">

              {/* Status Filter */}
              <div className="form-group">
                <label className="form-label">
                  {t("status")}
                </label>

                <select
                  className="form-control"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                >
                  <option value="All">
                    {t("all")}
                  </option>

                  <option value="Waiting">
                    {t("waiting")}
                  </option>

                  <option value="In Progress">
                    {t("inProgress")}
                  </option>

                  <option value="Completed">
                    {t("completed")}
                  </option>

                  <option value="No-show">
                    {t("noShow")}
                  </option>
                </select>
              </div>

              {/* Department Filter */}
              <div className="form-group">
                <label className="form-label">
                  {t("department")}
                </label>

                <select
                  className="form-control"
                  value={departmentFilter}
                  onChange={(event) =>
                    setDepartmentFilter(
                      event.target.value
                    )
                  }
                >
                  <option value="All">
                    {t("all")}
                  </option>

                  <option value="General">
                    {t("general")}
                  </option>

                  <option value="Dental">
                    {t("dental")}
                  </option>

                  <option value="Maternal">
                    {t("maternal")}
                  </option>

                  <option value="Child Health">
                    {t("childHealth")}
                  </option>

                  <option value="Chronic">
                    {t("chronicCare")}
                  </option>
                </select>
              </div>

            </div>
          </div>
        </section>

        {/* =================================================
            WALK-IN QUEUE
        ================================================= */}
        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                {t("walkInQueue")}
              </div>

              <p className="page-subtitle">
                {t("viewManageTodaysWalkIns")}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="card-body">
              {t("loadingWalkIns")}
            </div>
          ) : filteredWalkins.length === 0 ? (
            <div className="card-body">
              {t("noWalkInPatientsFound")}
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>{t("queue")}</th>
                    <th>{t("patient")}</th>
                    <th>{t("contact")}</th>
                    <th>{t("department")}</th>
                    <th>{t("priority")}</th>
                    <th>{t("date")}</th>
                    <th>{t("time")}</th>
                    <th>{t("status")}</th>
                    <th>{t("actions")}</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredWalkins.map(
                    (walkin) => (
                      <tr key={walkin.id}>

                        <td>
                          <strong>
                            {walkin.queue_number}
                          </strong>
                        </td>

                        <td>
                          {walkin.patient_name}
                        </td>

                        <td>
                          <div>
                            {walkin.patient_email}
                          </div>

                          <small>
                            {walkin.patient_phone}
                          </small>
                        </td>

                        <td>
                          {translatedDepartment[
                            walkin.department
                          ] ||
                            walkin.department}
                        </td>

                        <td>
                          <span
                            className={getPriorityBadge(
                              walkin.priority
                            )}
                          >
                            {translatedPriority[
                              walkin.priority
                            ] ||
                              walkin.priority}
                          </span>
                        </td>

                        <td>
                          {walkin.date}
                        </td>

                        <td>
                          {walkin.time}
                        </td>

                        <td>
                          <span
                            className={getStatusBadge(
                              walkin.status
                            )}
                          >
                            {translatedStatus[
                              walkin.status
                            ] ||
                              walkin.status}
                          </span>
                        </td>

                        <td>
                          <div className="action-buttons">

                            {/* START */}
                            {walkin.status ===
                              "Waiting" && (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  updateWalkinStatus(
                                    walkin.id,
                                    "In Progress"
                                  )
                                }
                              >
                                {t("start")}
                              </button>
                            )}

                            {/* COMPLETE */}
                            {walkin.status ===
                              "In Progress" && (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() =>
                                  updateWalkinStatus(
                                    walkin.id,
                                    "Completed"
                                  )
                                }
                              >
                                {t("complete")}
                              </button>
                            )}

                            {/* NO-SHOW */}
                            {walkin.status !==
                              "Completed" &&
                              walkin.status !==
                                "No-show" && (
                                <button
                                  className="btn btn-outline btn-sm"
                                  onClick={() =>
                                    updateWalkinStatus(
                                      walkin.id,
                                      "No-show"
                                    )
                                  }
                                >
                                  {t("noShow")}
                                </button>
                              )}

                            {/* DELETE */}
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                deleteWalkin(
                                  walkin.id
                                )
                              }
                            >
                              {t("delete")}
                            </button>

                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default ManageWalkins;