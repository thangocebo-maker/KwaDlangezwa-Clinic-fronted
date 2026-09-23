import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [language, setLanguage] = useState("English");
  const [address, setAddress] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("clinic_user")
    );

    if (!storedUser || storedUser.role !== "patient") {
      navigate("/login");
      return;
    }

    setUser(storedUser);
    loadProfile(storedUser.id);
  }, [navigate]);

  const loadProfile = (userId) => {
    try {
      const users =
        JSON.parse(
          localStorage.getItem("clinic_users")
        ) || [];

      // Convert both IDs to strings so number/string IDs match correctly
      const profile = users.find(
        (u) => String(u.id) === String(userId)
      );

      if (profile) {
        setFullName(profile.full_name || "");
        setEmail(profile.email || "");
        setPhone(profile.phone || "");
        setDob(profile.dob || "");
        setLanguage(
          profile.language || "English"
        );
        setAddress(profile.address || "");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }

    setLoading(false);
  };

  const saveProfile = (e) => {
    e.preventDefault();

    try {
      const users =
        JSON.parse(
          localStorage.getItem("clinic_users")
        ) || [];

      const updatedUsers = users.map((item) => {
        // Convert both IDs to strings for reliable matching
        if (
          String(item.id) === String(user.id)
        ) {
          return {
            ...item,
            full_name: fullName,
            email,
            phone,
            dob,
            language,
            address,
          };
        }

        return item;
      });

      localStorage.setItem(
        "clinic_users",
        JSON.stringify(updatedUsers)
      );

      // Also update the currently logged-in user
      const updatedUser = {
        ...user,
        full_name: fullName,
        email,
        phone,
        dob,
        language,
        address,
      };

      localStorage.setItem(
        "clinic_user",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);

      setEditing(false);

      setMessage(
        "Profile updated successfully!"
      );
      setMessageType("success");
    } catch (error) {
      console.error(
        "Error saving profile:",
        error
      );

      setMessage(
        "Failed to update profile."
      );
      setMessageType("danger");
    }
  };

  const logout = () => {
    localStorage.removeItem("clinic_user");
    navigate("/login");
  };

  if (loading || !user) {
    return null;
  }

  return (
    <>
      {/* TOPBAR */}
      <div className="topbar">
        <div className="topbar-brand">
          KwaDlangezwa<span>Clinic</span>
        </div>

        <div className="topbar-user">
          <span>{fullName}</span>

          <div className="topbar-avatar">
            {fullName.charAt(0).toUpperCase()}
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
            navigate("/patient/dashboard")
          }
        >
          <span>🏠</span>
          <span>Dashboard</span>
        </button>

        <button
          className="sidebar-item"
          onClick={() =>
            navigate("/patient/book")
          }
        >
          <span>📅</span>
          <span>Book Appointment</span>
        </button>

        <button
          className="sidebar-item"
          onClick={() =>
            navigate("/patient/appointments")
          }
        >
          <span>🗂</span>
          <span>Appointments</span>
        </button>

        <button
          className="sidebar-item active"
          onClick={() =>
            navigate("/patient/profile")
          }
        >
          <span>👤</span>
          <span>Profile</span>
        </button>

        <hr className="sidebar-divider" />

        <button
          className="sidebar-item"
          onClick={logout}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">

        <div className="page-title">
          Profile Details
        </div>

        <div className="page-subtitle">
          View and update your personal information
        </div>

        <br />

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

        {/* PROFILE DISPLAY */}
        <div className="card">

          <div className="card-header">
            <div className="card-title">
              Patient Profile
            </div>

            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                setEditing(!editing)
              }
            >
              {editing
                ? "Close"
                : "Edit Profile"}
            </button>
          </div>

          <div className="card-body">

            <div className="profile-row">
              <strong>Full Name:</strong>{" "}
              {fullName}
            </div>

            <div className="profile-row">
              <strong>Email:</strong>{" "}
              {email}
            </div>

            <div className="profile-row">
              <strong>Phone:</strong>{" "}
              {phone || "-"}
            </div>

            <div className="profile-row">
              <strong>Date of Birth:</strong>{" "}
              {dob || "-"}
            </div>

            <div className="profile-row">
              <strong>Language:</strong>{" "}
              {language}
            </div>

            <div className="profile-row">
              <strong>Address:</strong>{" "}
              {address || "-"}
            </div>

          </div>
        </div>

        {/* EDIT FORM */}
        {editing && (
          <div className="card">

            <div className="card-header">
              <div className="card-title">
                Edit Profile
              </div>
            </div>

            <div className="card-body">

              <form onSubmit={saveProfile}>

                <div className="form-group">
                  <label className="form-label">
                    Full Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Phone
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    value={dob}
                    onChange={(e) =>
                      setDob(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Preferred Language
                  </label>

                  <select
                    className="form-control"
                    value={language}
                    onChange={(e) =>
                      setLanguage(
                        e.target.value
                      )
                    }
                  >
                    <option value="English">
                      English
                    </option>

                    <option value="isiZulu">
                      isiZulu
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Address
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={address}
                    onChange={(e) =>
                      setAddress(
                        e.target.value
                      )
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success"
                >
                  💾 Save Changes
                </button>

              </form>

            </div>

          </div>
        )}

      </div>
    </>
  );
}

export default Profile;