import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../translations/LanguageContext";

function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [alert, setAlert] = useState({
    message: "",
    type: "",
  });

  const [loading, setLoading] = useState(false);

  // Create Admin account if it does not already exist
  useEffect(() => {
    try {
      const storedUsers =
        JSON.parse(localStorage.getItem("clinic_users")) || [];

      const users = Array.isArray(storedUsers)
        ? storedUsers
        : [];

      const adminExists = users.some(
        (user) =>
          user.role === "admin" &&
          user.email &&
          user.email.toLowerCase() === "admin@clinic.com"
      );

      if (!adminExists) {
        const adminUser = {
          id: "admin-001",
          full_name: "Clinic Administrator",
          email: "admin@clinic.com",
          phone: "",
          password: "Admin@123",
          role: "admin",
        };

        users.push(adminUser);

        localStorage.setItem(
          "clinic_users",
          JSON.stringify(users)
        );
      }
    } catch (error) {
      console.error("Admin setup error:", error);
    }
  }, []);

  // Redirect according to role
  const redirectUser = (user) => {
    if (user.role === "patient") {
      navigate("/patient/dashboard");
    } else if (user.role === "nurse") {
      navigate("/nurse/dashboard");
    } else if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      setAlert({
        message: t("accessDenied"),
        type: "danger",
      });

      setLoading(false);
    }
  };

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();

    setLoading(true);

    setAlert({
      message: "",
      type: "",
    });

    try {
      const storedUsers =
        JSON.parse(localStorage.getItem("clinic_users")) || [];

      const users = Array.isArray(storedUsers)
        ? storedUsers
        : [];

      const loginValue = email.trim().toLowerCase();

      // Find matching user
      const user = users.find((u) => {
        if (!u || !u.email || !u.password) {
          return false;
        }

        const userEmail = String(u.email)
          .trim()
          .toLowerCase();

        const userPhone = u.phone
          ? String(u.phone).trim().toLowerCase()
          : "";

        const userPassword = String(u.password);

        // Patient: email OR phone
        if (u.role === "patient") {
          return (
            (userEmail === loginValue ||
              userPhone === loginValue) &&
            userPassword === password
          );
        }

        // Nurse: email only
        if (u.role === "nurse") {
          return (
            userEmail === loginValue &&
            userPassword === password
          );
        }

        // Admin: email only
        if (u.role === "admin") {
          return (
            userEmail === loginValue &&
            userPassword === password
          );
        }

        return false;
      });

      // Login successful
      if (user) {
        localStorage.setItem(
          "clinic_user",
          JSON.stringify(user)
        );

        setAlert({
          message: t("loginSuccessful"),
          type: "success",
        });

        setTimeout(() => {
          redirectUser(user);
        }, 800);

        return;
      }

      // Login failed
      setAlert({
        message: t("loginError"),
        type: "danger",
      });

      setLoading(false);
    } catch (error) {
      console.error("Login error:", error);

      setAlert({
        message: t("somethingWentWrong"),
        type: "danger",
      });

      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Background */}
      <div className="auth-bg"></div>

      {/* Login Card */}
      <div className="auth-card">

        {/* Header */}
        <div className="auth-header">
          <h1>
            KwaDlangezwa<span>Clinic</span>
          </h1>

          <p>
            {t("loginWelcome")}
          </p>
        </div>

        {/* Title */}
        <h2 className="auth-title">
          {t("loginTitle")} 👋
        </h2>

        {/* Alert */}
        {alert.message && (
          <div className={`alert ${alert.type}`}>
            {alert.message}
          </div>
        )}

        {/* Login Form */}
        <form
          id="login-form"
          onSubmit={handleLogin}
        >

          {/* Email / Phone */}
          <div className="form-group">
            <label className="form-label">
              {t("email")} / {t("phone")}
            </label>

            <input
              type="text"
              id="email"
              className="form-control"
              placeholder={`${t("email")} / ${t("phone")}`}
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">
              {t("password")}
            </label>

            <input
              type="password"
              id="password"
              className="form-control"
              placeholder={t("enterPassword")}
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading
              ? t("loggingIn")
              : t("loginButton")}
          </button>

        </form>

        {/* Register */}
        <div className="auth-footer">
          {t("noAccount")}{" "}

          <button
            type="button"
            className="link-button"
            onClick={() =>
              navigate("/register")
            }
          >
            {t("register")}
          </button>
        </div>

        {/* Back to Home */}
        <div className="auth-footer back-home">
          <button
            type="button"
            className="back-link"
            onClick={() =>
              navigate("/")
            }
          >
            ← {t("back")} {t("home")}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;