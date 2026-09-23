import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../translations/LanguageContext";

function Reports() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [user, setUser] = useState(null);
  const [weeklyReport, setWeeklyReport] = useState([]);
  const [monthlyReport, setMonthlyReport] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate weekly report
  const generateWeeklyReport = useCallback((records) => {
    const weeks = {};

    records.forEach((record) => {
      if (!record.date) {
        return;
      }

      const date = new Date(
        `${record.date}T00:00:00`
      );

      if (isNaN(date.getTime())) {
        return;
      }

      // Find Monday of the week
      const day = date.getDay();

      const difference =
        day === 0 ? -6 : 1 - day;

      const monday = new Date(date);

      monday.setDate(
        date.getDate() + difference
      );

      const sunday = new Date(monday);

      sunday.setDate(
        monday.getDate() + 6
      );

      const weekKey =
        monday.toISOString().split("T")[0];

      const weekLabel =
        `${monday.toLocaleDateString(
          "en-ZA",
          {
            day: "2-digit",
            month: "short",
          }
        )} - ${sunday.toLocaleDateString(
          "en-ZA",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )}`;

      if (!weeks[weekKey]) {
        weeks[weekKey] = {
          week_label: weekLabel,
          total: 0,
          appointments: 0,
          walkins: 0,
          completed: 0,
          cancelled: 0,
        };
      }

      weeks[weekKey].total++;

      if (record.recordType === "Appointment") {
        weeks[weekKey].appointments++;
      }

      if (record.recordType === "Walk-in") {
        weeks[weekKey].walkins++;
      }

      if (record.status === "Completed") {
        weeks[weekKey].completed++;
      }

      if (
        record.status === "Cancelled" ||
        record.status === "No-show"
      ) {
        weeks[weekKey].cancelled++;
      }
    });

    const report = Object.keys(weeks)
      .sort()
      .reverse()
      .map((key) => weeks[key]);

    setWeeklyReport(report);
  }, []);

  // Generate monthly report
  const generateMonthlyReport = useCallback((records) => {
    const months = {};

    records.forEach((record) => {
      if (!record.date) {
        return;
      }

      const date = new Date(
        `${record.date}T00:00:00`
      );

      if (isNaN(date.getTime())) {
        return;
      }

      const year = date.getFullYear();
      const month = date.getMonth();

      const monthKey =
        `${year}-${String(
          month + 1
        ).padStart(2, "0")}`;

      const monthLabel =
        date.toLocaleDateString(
          "en-ZA",
          {
            month: "long",
            year: "numeric",
          }
        );

      if (!months[monthKey]) {
        months[monthKey] = {
          month_label: monthLabel,
          total: 0,
          appointments: 0,
          walkins: 0,
          completed: 0,
          cancelled: 0,
        };
      }

      months[monthKey].total++;

      if (record.recordType === "Appointment") {
        months[monthKey].appointments++;
      }

      if (record.recordType === "Walk-in") {
        months[monthKey].walkins++;
      }

      if (record.status === "Completed") {
        months[monthKey].completed++;
      }

      if (
        record.status === "Cancelled" ||
        record.status === "No-show"
      ) {
        months[monthKey].cancelled++;
      }
    });

    const report = Object.keys(months)
      .sort()
      .reverse()
      .map((key) => months[key]);

    setMonthlyReport(report);
  }, []);

  // Load reports
  const loadReports = useCallback(() => {
    setLoading(true);

    try {
      const savedAppointments =
        JSON.parse(
          localStorage.getItem("clinic_appointments")
        ) || [];

      const savedWalkins =
        JSON.parse(
          localStorage.getItem("clinic_walkins")
        ) || [];

      const appointments = Array.isArray(
        savedAppointments
      )
        ? savedAppointments
        : [];

      const walkins = Array.isArray(savedWalkins)
        ? savedWalkins
        : [];

      // Combine appointments and walk-ins
      const allRecords = [
        ...appointments.map((appointment) => ({
          ...appointment,
          recordType: "Appointment",
        })),

        ...walkins.map((walkin) => ({
          ...walkin,
          recordType: "Walk-in",
        })),
      ];

      generateWeeklyReport(allRecords);
      generateMonthlyReport(allRecords);
    } catch (error) {
      console.error(
        "Error loading reports:",
        error
      );

      setWeeklyReport([]);
      setMonthlyReport([]);
    }

    setLoading(false);
  }, [
    generateWeeklyReport,
    generateMonthlyReport,
  ]);

  // Check Admin authentication and load reports
  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("clinic_user")
    );

    // Only Admin can access this page
    if (
      !storedUser ||
      storedUser.role !== "admin"
    ) {
      navigate("/login");
      return;
    }

    setUser(storedUser);
    loadReports();
  }, [navigate, loadReports]);

  // Logout
  const logout = () => {
    localStorage.removeItem("clinic_user");
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
          KwaDlangezwa<span>Clinic</span>
        </div>

        <div className="topbar-user">

          <span>
            {user.full_name ||
              user.name ||
              t("administrator")}
          </span>

          <div className="topbar-avatar">
            📊
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
        <button
          type="button"
          className="sidebar-item"
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
        </button>

        {/* Register Nurse */}
        <button
          type="button"
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
        </button>

        {/* System Configuration */}
        <button
          type="button"
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
        </button>

        {/* Reports */}
        <button
          type="button"
          className="sidebar-item active"
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
        </button>

        <hr className="sidebar-divider" />

        {/* Logout */}
        <button
          type="button"
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
            {t("reportsAnalytics")} 📈
          </div>

          <div className="page-subtitle">
            {t("reportsOverview")}
          </div>

        </div>

        {/* =========================
            WEEKLY REPORT
        ========================== */}

        <div className="card">

          <div className="card-header">

            <div className="card-title">
              {t("weeklyReport")}
            </div>

          </div>

          <div
            className="card-body"
            style={{ padding: 0 }}
          >

            {loading ? (

              <div className="loading">

                <div className="spinner"></div>

                {t("loadingWeeklyData")}

              </div>

            ) : weeklyReport.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  📊
                </div>

                <p>
                  {t("noWeeklyData")}
                </p>

              </div>

            ) : (

              <div className="table-wrap">

                <table>

                  <thead>

                    <tr>

                      <th>
                        {t("week")}
                      </th>

                      <th>
                        {t("totalPatients")}
                      </th>

                      <th>
                        {t("appointments")}
                      </th>

                      <th>
                        {t("walkIns")}
                      </th>

                      <th>
                        {t("completed")}
                      </th>

                      <th>
                        {t("cancelled")}
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {weeklyReport.map(
                      (week, index) => (

                        <tr key={index}>

                          <td>
                            {week.week_label}
                          </td>

                          <td>
                            {week.total}
                          </td>

                          <td>
                            {week.appointments}
                          </td>

                          <td>
                            {week.walkins}
                          </td>

                          <td>
                            {week.completed}
                          </td>

                          <td>
                            {week.cancelled}
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

        {/* =========================
            MONTHLY REPORT
        ========================== */}

        <div
          className="card"
          style={{ marginTop: "20px" }}
        >

          <div className="card-header">

            <div className="card-title">
              {t("monthlyReport")}
            </div>

          </div>

          <div
            className="card-body"
            style={{ padding: 0 }}
          >

            {loading ? (

              <div className="loading">

                <div className="spinner"></div>

                {t("loadingMonthlyData")}

              </div>

            ) : monthlyReport.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  📊
                </div>

                <p>
                  {t("noMonthlyData")}
                </p>

              </div>

            ) : (

              <div className="table-wrap">

                <table>

                  <thead>

                    <tr>

                      <th>
                        {t("month")}
                      </th>

                      <th>
                        {t("totalPatients")}
                      </th>

                      <th>
                        {t("appointments")}
                      </th>

                      <th>
                        {t("walkIns")}
                      </th>

                      <th>
                        {t("completed")}
                      </th>

                      <th>
                        {t("cancelled")}
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {monthlyReport.map(
                      (month, index) => (

                        <tr key={index}>

                          <td>
                            {month.month_label}
                          </td>

                          <td>
                            {month.total}
                          </td>

                          <td>
                            {month.appointments}
                          </td>

                          <td>
                            {month.walkins}
                          </td>

                          <td>
                            {month.completed}
                          </td>

                          <td>
                            {month.cancelled}
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

        {/* =========================
            VISUAL ANALYTICS
        ========================== */}

        <div
          className="card"
          style={{ marginTop: "20px" }}
        >

          <div className="card-header">

            <div className="card-title">
              {t("visualAnalytics")}
            </div>

          </div>

          <div className="card-body">

            {monthlyReport.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  📈
                </div>

                <p>
                  {t("noVisualAnalyticsData")}
                </p>

              </div>

            ) : (

              <div
                style={{
                  width: "100%",
                  overflowX: "auto",
                }}
              >

                <div
                  style={{
                    minWidth:
                      Math.max(
                        600,
                        monthlyReport.length *
                          140
                      ),
                    height: "320px",
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "20px",
                    padding:
                      "20px 10px 40px",
                    borderBottom:
                      "1px solid var(--border)",
                  }}
                >

                  {monthlyReport
                    .slice()
                    .reverse()
                    .map(
                      (month, index) => {

                        const maxValue =
                          Math.max(
                            ...monthlyReport.map(
                              (item) =>
                                Math.max(
                                  item.appointments,
                                  item.walkins,
                                  item.completed,
                                  item.cancelled
                                )
                            ),
                            1
                          );

                        return (
                          <div
                            key={index}
                            style={{
                              flex: 1,
                              minWidth:
                                "110px",
                              height:
                                "100%",
                              display:
                                "flex",
                              flexDirection:
                                "column",
                              justifyContent:
                                "flex-end",
                              alignItems:
                                "center",
                              gap: "5px",
                            }}
                          >

                            <div
                              style={{
                                width:
                                  "100%",
                                display:
                                  "flex",
                                alignItems:
                                  "flex-end",
                                justifyContent:
                                  "center",
                                gap: "4px",
                                height:
                                  "240px",
                              }}
                            >

                              {/* APPOINTMENTS */}
                              <div
                                title={`${t(
                                  "appointments"
                                )}: ${
                                  month.appointments
                                }`}
                                style={{
                                  width:
                                    "18px",
                                  height: `${Math.max(
                                    4,
                                    (month.appointments /
                                      maxValue) *
                                      220
                                  )}px`,
                                  background:
                                    "#003366",
                                  borderRadius:
                                    "4px 4px 0 0",
                                }}
                              ></div>

                              {/* WALK-INS */}
                              <div
                                title={`${t(
                                  "walkIns"
                                )}: ${
                                  month.walkins
                                }`}
                                style={{
                                  width:
                                    "18px",
                                  height: `${Math.max(
                                    4,
                                    (month.walkins /
                                      maxValue) *
                                      220
                                  )}px`,
                                  background:
                                    "#e99905",
                                  borderRadius:
                                    "4px 4px 0 0",
                                }}
                              ></div>

                              {/* COMPLETED */}
                              <div
                                title={`${t(
                                  "completed"
                                )}: ${
                                  month.completed
                                }`}
                                style={{
                                  width:
                                    "18px",
                                  height: `${Math.max(
                                    4,
                                    (month.completed /
                                      maxValue) *
                                      220
                                  )}px`,
                                  background:
                                    "#28a745",
                                  borderRadius:
                                    "4px 4px 0 0",
                                }}
                              ></div>

                              {/* CANCELLED */}
                              <div
                                title={`${t(
                                  "cancelled"
                                )}: ${
                                  month.cancelled
                                }`}
                                style={{
                                  width:
                                    "18px",
                                  height: `${Math.max(
                                    4,
                                    (month.cancelled /
                                      maxValue) *
                                      220
                                  )}px`,
                                  background:
                                    "#dc3545",
                                  borderRadius:
                                    "4px 4px 0 0",
                                }}
                              ></div>

                            </div>

                            <div
                              style={{
                                fontSize:
                                  "11px",
                                textAlign:
                                  "center",
                                color:
                                  "var(--text-secondary)",
                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {month.month_label}
                            </div>

                          </div>
                        );
                      }
                    )}

                </div>

                {/* CHART LEGEND */}
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "center",
                    gap: "20px",
                    flexWrap:
                      "wrap",
                    marginTop:
                      "20px",
                    fontSize:
                      "12px",
                  }}
                >

                  <span>

                    <span
                      style={{
                        display:
                          "inline-block",
                        width:
                          "12px",
                        height:
                          "12px",
                        background:
                          "#003366",
                        marginRight:
                          "5px",
                        borderRadius:
                          "2px",
                      }}
                    ></span>

                    {t("appointments")}

                  </span>

                  <span>

                    <span
                      style={{
                        display:
                          "inline-block",
                        width:
                          "12px",
                        height:
                          "12px",
                        background:
                          "#e99905",
                        marginRight:
                          "5px",
                        borderRadius:
                          "2px",
                      }}
                    ></span>

                    {t("walkIns")}

                  </span>

                  <span>

                    <span
                      style={{
                        display:
                          "inline-block",
                        width:
                          "12px",
                        height:
                          "12px",
                        background:
                          "#28a745",
                        marginRight:
                          "5px",
                        borderRadius:
                          "2px",
                      }}
                    ></span>

                    {t("completed")}

                  </span>

                  <span>

                    <span
                      style={{
                        display:
                          "inline-block",
                        width:
                          "12px",
                        height:
                          "12px",
                        background:
                          "#dc3545",
                        marginRight:
                          "5px",
                        borderRadius:
                          "2px",
                      }}
                    ></span>

                    {t("cancelled")}

                  </span>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>
    </>
  );
}

export default Reports;