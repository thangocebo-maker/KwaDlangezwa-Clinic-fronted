import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// Home, Login and Register
import Home from "./Home/Home";
import Login from "./Login/Login";
import Register from "./Register/Register";

// Patient pages
import PatientDashboard from "./Patient/Dashboard";
import Book from "./Patient/Book";
import MyAppointments from "./Patient/MyAppointments";
import PatientProfile from "./Patient/Profile";

// Nurse pages
import NurseDashboard from "./Nurse/Dashboard";
import ManageAppointments from "./Nurse/ManageAppointments";
import ManageWalkins from "./Nurse/ManageWalkins";
import NurseProfile from "./Nurse/Profile";

// Admin pages
import AdminDashboard from "./Admin/Dashboard";
import RegisterNurse from "./Admin/RegisterNurse";
import SystemConfiguration from "./Admin/SystemConfiguration";
import Reports from "./Admin/Reports";

// Main CSS
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= HOME ================= */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* ================= LOGIN ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ================= PATIENT REGISTER ================= */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ================= PATIENT ================= */}

        <Route
          path="/patient/dashboard"
          element={<PatientDashboard />}
        />

        <Route
          path="/patient/book"
          element={<Book />}
        />

        <Route
          path="/patient/appointments"
          element={<MyAppointments />}
        />

        <Route
          path="/patient/profile"
          element={<PatientProfile />}
        />

        {/* ================= NURSE ================= */}

        <Route
          path="/nurse/dashboard"
          element={<NurseDashboard />}
        />

        <Route
          path="/nurse/appointments"
          element={<ManageAppointments />}
        />

        <Route
          path="/nurse/walkins"
          element={<ManageWalkins />}
        />

        <Route
          path="/nurse/profile"
          element={<NurseProfile />}
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        {/* REGISTER NURSE */}
        <Route
          path="/admin/register-nurse"
          element={<RegisterNurse />}
        />

        <Route
          path="/admin/configuration"
          element={<SystemConfiguration />}
        />

        <Route
          path="/admin/reports"
          element={<Reports />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;