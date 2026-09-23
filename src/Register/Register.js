import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

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
        message: "Password must be at least 6 characters.",
        type: "danger",
      });
      return;
    }

    // Check passwords
    if (password !== confirmPassword) {
      setAlert({
        message: "Passwords do not match.",
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
        message: "An account with this email already exists.",
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
      message: "Account created! Redirecting...",
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

        <p>Register to access your patient account</p>
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
            Full Name
          </label>

          <input
            type="text"
            id="full_name"
            className="form-control"
            placeholder="e.g. Cebo Thango"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        {/* Email and Phone */}
        <div className="form-row">

          <div className="form-group">
            <label className="form-label">
              Email Address
            </label>

            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="your@email.com"
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
              Phone number
            </label>

            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-control"
              placeholder="e.g. 072 345 6789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label">
            Password
          </label>

          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Min 6 characters"
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
            Confirm password
          </label>

          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="form-control"
            placeholder="Re-enter password"
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
            ? "Creating account..."
            : "Create Patient Account"}
        </button>

      </form>

      {/* Login Link */}
      <div className="auth-footer">
        Already have an account?{" "}

        <button
          type="button"
          className="link-button"
          onClick={() => navigate("/login")}
        >
          Login here
        </button>
      </div>

      {/* Home Link */}
      <div className="auth-footer back-home">
        <button
          type="button"
          className="back-link"
          onClick={() => navigate("/")}
        >
          ← Back to home
        </button>
      </div>

    </div>
  );
}

export default Register;