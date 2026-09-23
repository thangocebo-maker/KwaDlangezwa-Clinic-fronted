import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ManageWalkins() {
  const navigate = useNavigate();

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
      const storedWalkins =
        JSON.parse(localStorage.getItem("clinic_walkins")) || [];

      setWalkins(storedWalkins);
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
          walkin.queue_number.replace("W", ""),
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

    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword ||
      !department ||
      !priority
    ) {
      showMessage(
        "Please complete all required fields.",
        "danger"
      );
      return;
    }

    if (password !== confirmPassword) {
      showMessage(
        "Passwords do not match.",
        "danger"
      );
      return;
    }

    if (password.length < 6) {
      showMessage(
        "Password must be at least 6 characters.",
        "danger"
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      showMessage(
        "Please enter a valid email address.",
        "danger"
      );
      return;
    }

    try {
      // Existing users
      const existingUsers =
        JSON.parse(localStorage.getItem("clinic_users")) || [];

      // Check email
      const emailExists = existingUsers.some(
        (existingUser) =>
          existingUser.email?.toLowerCase() ===
          email.trim().toLowerCase()
      );

      if (emailExists) {
        showMessage(
          "A patient account with this email already exists.",
          "danger"
        );
        return;
      }

      // Existing walk-ins
      const existingWalkins =
        JSON.parse(localStorage.getItem("clinic_walkins")) || [];

      // Patient ID
      const patientId = Date.now();

      // Queue number
      const queueNumber =
        generateQueueNumber(existingWalkins);

      const now = new Date();

      const currentDate =
        now.toISOString().split("T")[0];

      const currentTime =
        now.toTimeString().slice(0, 5);

      // Patient account
      const patientAccount = {
        id: patientId,
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password: password,
        role: "patient",
        created_at: now.toISOString(),
      };

      // Walk-in record
      const newWalkin = {
        id: Date.now() + 1,
        patient_id: patientId,
        patient_name: fullName.trim(),
        patient_email: email.trim().toLowerCase(),
        patient_phone: phone.trim(),
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

      // Save patient
      const updatedUsers = [
        ...existingUsers,
        patientAccount,
      ];

      localStorage.setItem(
        "clinic_users",
        JSON.stringify(updatedUsers)
      );

      // Save walk-in
      const updatedWalkins = [
        ...existingWalkins,
        newWalkin,
      ];

      localStorage.setItem(
        "clinic_walkins",
        JSON.stringify(updatedWalkins)
      );

      setWalkins(updatedWalkins);

      // Clear form
      setFullName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setDepartment("");
      setPriority("Normal");

      setShowWalkinForm(false);

      showMessage(
        `Walk-in registered successfully. Queue number: ${queueNumber}. The patient can now log in using their email and password.`,
        "success"
      );
    } catch (error) {
      console.error(
        "Error registering walk-in:",
        error
      );

      showMessage(
        "An error occurred while registering the walk-in patient.",
        "danger"
      );
    }
  };

  // =========================================================
  // UPDATE STATUS
  // =========================================================
  const updateWalkinStatus = (
    walkinId,
    newStatus
  ) => {
    const updatedWalkins = walkins.map(
      (walkin) => {
        if (walkin.id === walkinId) {
          return {
            ...walkin,
            status: newStatus,
            updated_at: new Date().toISOString(),
          };
        }

        return walkin;
      }
    );

    setWalkins(updatedWalkins);

    localStorage.setItem(
      "clinic_walkins",
      JSON.stringify(updatedWalkins)
    );

    showMessage(
      `Walk-in status updated to "${newStatus}".`,
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
      `Are you sure you want to remove the walk-in for ${walkinToDelete.patient_name}?`
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

    // Remove linked patient account
    if (walkinToDelete.patient_id) {
      const existingUsers =
        JSON.parse(localStorage.getItem("clinic_users")) || [];

      const updatedUsers = existingUsers.filter(
        (existingUser) =>
          existingUser.id !== walkinToDelete.patient_id
      );

      localStorage.setItem(
        "clinic_users",
        JSON.stringify(updatedUsers)
      );
    }

    showMessage(
      "Walk-in patient removed successfully.",
      "success"
    );
  };

  // =========================================================
  // FILTER WALK-INS
  // =========================================================
  const filteredWalkins = walkins.filter(
    (walkin) => {
      const statusMatch =
        statusFilter === "All" ||
        walkin.status === statusFilter;

      const departmentMatch =
        departmentFilter === "All" ||
        walkin.department === departmentFilter;

      return statusMatch && departmentMatch;
    }
  );

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
  // Matches existing CSS: badge-*
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
              "Nurse"}
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
          Nurse Menu
        </div>

        <nav className="sidebar-nav">
          <button
            className="sidebar-item"
            onClick={() =>
              navigate("/nurse/dashboard")
            }
          >
            <span className="icon">🏠</span>
            <span>Dashboard</span>
          </button>

          <button
            className="sidebar-item"
            onClick={() =>
              navigate("/nurse/appointments")
            }
          >
            <span className="icon">📅</span>
            <span>Manage Appointments</span>
          </button>

          <button
            className="sidebar-item active"
            onClick={() =>
              navigate("/nurse/walkins")
            }
          >
            <span className="icon">🚶</span>
            <span>Manage Walk-ins</span>
          </button>

          <hr className="sidebar-divider" />

          <button
            className="sidebar-item"
            onClick={() =>
              navigate("/nurse/profile")
            }
          >
            <span className="icon">👤</span>
            <span>My Profile</span>
          </button>

          <button
            className="sidebar-item"
            onClick={logout}
          >
            <span className="icon">🚪</span>
            <span>Logout</span>
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
              Manage Walk-in Patients
            </h1>

            <p className="page-subtitle">
              Register and manage patients
              who arrive without an appointment
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
              ? "Close Form"
              : "Register Walk-in"}
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
                  Register Walk-in Patient
                </div>

                <p className="page-subtitle">
                  Create a patient account and
                  add them to the walk-in queue.
                </p>
              </div>
            </div>

            <div className="card-body">

              <form onSubmit={registerWalkin}>

                <div className="form-row">

                  {/* Full Name */}
                  <div className="form-group">
                    <label className="form-label">
                      Full Name *
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
                      placeholder="Enter full name"
                    />
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label">
                      Email *
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
                      placeholder="Enter email address"
                    />
                  </div>

                  {/* Phone */}
                  <div className="form-group">
                    <label className="form-label">
                      Phone *
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
                      placeholder="Enter phone number"
                    />
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <label className="form-label">
                      Password *
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
                      placeholder="Create password"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group">
                    <label className="form-label">
                      Confirm Password *
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
                      placeholder="Confirm password"
                    />
                  </div>

                  {/* Department */}
                  <div className="form-group">
                    <label className="form-label">
                      Department *
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
                        Select Department
                      </option>

                      <option value="General">
                        General
                      </option>

                      <option value="Dental">
                        Dental
                      </option>

                      <option value="Maternal">
                        Maternal
                      </option>

                      <option value="Child Health">
                        Child Health
                      </option>

                      <option value="Chronic">
                        Chronic Care
                      </option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div className="form-group">
                    <label className="form-label">
                      Priority *
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
                        Normal
                      </option>

                      <option value="Urgent">
                        Urgent
                      </option>

                      <option value="Emergency">
                        Emergency
                      </option>
                    </select>
                  </div>

                </div>

                {/* FORM BUTTONS */}
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Register Patient
                </button>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() =>
                    setShowWalkinForm(false)
                  }
                >
                  Cancel
                </button>

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
              Total Walk-ins
            </div>

            <div className="stat-value primary">
              {walkins.length}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              Waiting
            </div>

            <div className="stat-value warning">
              {waitingCount}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              In Progress
            </div>

            <div className="stat-value primary">
              {inProgressCount}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              Completed
            </div>

            <div className="stat-value success">
              {completedCount}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              No-show
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

              <div className="form-group">
                <label className="form-label">
                  Status
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
                    All
                  </option>

                  <option value="Waiting">
                    Waiting
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="No-show">
                    No-show
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Department
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
                    All
                  </option>

                  <option value="General">
                    General
                  </option>

                  <option value="Dental">
                    Dental
                  </option>

                  <option value="Maternal">
                    Maternal
                  </option>

                  <option value="Child Health">
                    Child Health
                  </option>

                  <option value="Chronic">
                    Chronic Care
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
                Walk-in Queue
              </div>

              <p className="page-subtitle">
                View and manage today's
                walk-in patients.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="card-body">
              Loading walk-ins...
            </div>
          ) : filteredWalkins.length === 0 ? (
            <div className="card-body">
              No walk-in patients found.
            </div>
          ) : (
            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>Queue</th>
                    <th>Patient</th>
                    <th>Contact</th>
                    <th>Department</th>
                    <th>Priority</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
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
                          {walkin.department}
                        </td>

                        <td>
                          <span
                            className={getPriorityBadge(
                              walkin.priority
                            )}
                          >
                            {walkin.priority}
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
                            {walkin.status}
                          </span>
                        </td>

                        <td>

                          <div className="action-buttons">

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
                                Start
                              </button>
                            )}

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
                                Complete
                              </button>
                            )}

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
                                  No-show
                                </button>
                              )}

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                deleteWalkin(
                                  walkin.id
                                )
                              }
                            >
                              Delete
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