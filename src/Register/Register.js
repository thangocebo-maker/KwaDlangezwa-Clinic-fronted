import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../translations/LanguageContext";

function Register() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [alert, setAlert] = useState({
    message: "",
    type: "",
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();

    setAlert({
      message: "",
      type: "",
    });

    // Password length
    if (password.length < 6) {
      setAlert({
        message: t("passwordTooShort"),
        type: "danger",
      });
      return;
    }

    // Check passwords
    if (password !== confirmPassword) {
      setAlert({
        message: t("passwordsDoNotMatch"),
        type: "danger",
      });
      return;
    }

    setLoading(true);

    // Get existing users
    const users =
      JSON.parse(localStorage.getItem("clinic_users")) || [];

    // Check if email already exists
    const emailExists = users.some(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      setAlert({
        message: t("emailAlreadyExists"),
        type: "danger",
      });

      setLoading(false);
      return;
    }

    // Every public registration is automatically a PATIENT
    const newUser = {
      id: Date.now(),
      full_name: fullName,
      email: email,
      phone: phone,
      password: password,
      role: "patient",
    };

    // Add user
    users.push(newUser);

    // Save users
    localStorage.setItem(
      "clinic_users",
      JSON.stringify(users)
    );

    // Save logged-in user
    localStorage.setItem(
      "clinic_user",
      JSON.stringify(newUser)
    );

    // Success message
    setAlert({
      message: t("registrationSuccessful"),
      type: "success",
    });

    // Redirect patient to dashboard
    setTimeout(() => {
      navigate("/patient/dashboard");
    }, 800);
  };

  return (
    <div className="auth-page">

      {/* Background */}
      <div className="auth-bg"></div>

      {/* Registration Header */}
      <div className="auth-form">
        <h1>
          Clinic<span>Booking</span>
        </h1>

        <p>{t("registerInstruction")}</p>
      </div>

      {/* Alert Message */}
      {alert.message && (
        <div
          className={`alert show ${
            alert.type === "success"
              ? "alert-success"
              : "alert-danger"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Registration Form */}
      <form id="register-form" onSubmit={handleRegister}>

        {/* Full Name */}
        <div className="form-group">
          <label className="form-label">
            {t("fullName")}
          </label>

          <input
            type="text"
            id="full_name"
            className="form-control"
            placeholder={t("enterFullName")}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        {/* Email and Phone */}
        <div className="form-row">

          <div className="form-group">
            <label className="form-label">
              {t("email")}
            </label>

            <input
              type="email"
              id="email"
              className="form-control"
              placeholder={t("enterEmail")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label
              className="form-label"
              htmlFor="phone"
            >
              {t("phone")}
            </label>

            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-control"
              placeholder={t("enterPhone")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

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
            minLength="6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label
            className="form-label"
            htmlFor="confirmPassword"
          >
            {t("confirmYourPassword")}
          </label>

          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="form-control"
            placeholder={t("confirmYourPassword")}
            minLength="6"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            required
          />
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="btn btn-primary register-btn"
          disabled={loading}
        >
          {loading
            ? t("creatingAccount")
            : t("registerButton")}
        </button>

      </form>

      {/* Login Link */}
      <div className="auth-footer">
        {t("alreadyAccount")}{" "}

        <button
          type="button"
          className="link-button"
          onClick={() => navigate("/login")}
        >
          {t("loginHere")}
        </button>
      </div>

      {/* Home Link */}
      <div className="auth-footer back-home">
        <button
          type="button"
          className="back-link"
          onClick={() => navigate("/")}
        >
          ← {t("back")} {t("home")}
        </button>
      </div>

    </div>
  );
}

export default Register;