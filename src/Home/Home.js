import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../translations/LanguageContext";

function Home() {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();

  const [activeNav, setActiveNav] = useState(0);

  // Navigation
  const handleNavigation = (index) => {
    setActiveNav(index);

    if (index === 0) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    if (index === 1) {
      navigate("/register");
    }

    if (index === 2) {
      navigate("/login");
    }

    if (index === 3) {
      document.getElementById("about")?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  // Language selection
  const handleLanguageSelect = (lang) => {
    changeLanguage(lang);
  };

  const navItems = [
    t("home"),
    t("register"),
    t("login"),
    t("about"),
  ];

  return (
    <div className="page">

      {/* ================= NAVIGATION ================= */}

      <nav className="navbar">

        <button
          className="brand"
          onClick={() => handleNavigation(0)}
        >
          <span className="brand-mark">+</span>

          <span className="brand-copy">
            <strong>KwaDlangezwa</strong>
            <small>CLINIC PORTAL</small>
          </span>
        </button>

        <div className="nav-links">

          {navItems.map((item, index) => (
            <button
              key={index}
              className={`nav-link ${
                activeNav === index ? "active" : ""
              } ${
                index === 1 ? "register-btn" : ""
              }`}
              onClick={() => handleNavigation(index)}
            >
              {item}
            </button>
          ))}

        </div>
      </nav>

      {/* ================= HERO ================= */}

      <header className="hero">

        {/* Decorative healthcare artwork */}

        <div
          className="hero-art"
          aria-hidden="true"
        >
          <span className="art-blue" />
          <span className="art-burgundy" />
          <span className="art-gold" />
          <span className="art-silver" />
          <span className="art-charcoal" />
          <span className="art-stethoscope" />

          <svg
            className="healthcare-illustration"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="50"
              cy="30"
              r="8"
              fill="none"
              stroke="rgba(31, 78, 140, 0.2)"
              strokeWidth="1.5"
            />

            <path
              d="M 42 38 Q 35 45 30 50"
              fill="none"
              stroke="rgba(31, 78, 140, 0.2)"
              strokeWidth="1.5"
            />

            <path
              d="M 58 38 Q 65 45 70 50"
              fill="none"
              stroke="rgba(31, 78, 140, 0.2)"
              strokeWidth="1.5"
            />

            <circle
              cx="25"
              cy="60"
              r="5"
              fill="none"
              stroke="rgba(31, 78, 140, 0.2)"
              strokeWidth="1.5"
            />

            <circle
              cx="75"
              cy="60"
              r="5"
              fill="none"
              stroke="rgba(46, 139, 87, 0.2)"
              strokeWidth="1.5"
            />

            <g transform="translate(50, 70)">
              <rect
                x="-3"
                y="-10"
                width="6"
                height="20"
                fill="rgba(142, 69, 69, 0.15)"
              />

              <rect
                x="-10"
                y="-3"
                width="20"
                height="6"
                fill="rgba(142, 69, 69, 0.15)"
              />
            </g>

            <path
              d="M 20 85 L 25 85 L 27 82 L 30 88 L 33 80 L 35 85 L 40 85"
              fill="none"
              stroke="rgba(228, 184, 74, 0.25)"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div className="app-content">

          {/* ================= HERO TEXT ================= */}

          <section className="hero-copy">

            <div className="welcome-badge">
              {t("welcome")}
            </div>

            <h1 className="hero-title">
              <span className="title-blue">
                KwaDlangezwa
              </span>{" "}
              <span className="title-maroon">
                Clinic
              </span>
            </h1>

            <p className="hero-tagline">
              {t("tagline")}
            </p>

            <p className="hero-subtitle">
              {t("subtitle")}
            </p>

            <p className="hero-access-message">
              {t("accessMessage")}
            </p>

            <p className="trust-indicator">
              {t("trustIndicator")}
            </p>

            <div className="hero-rule" />

          </section>

          {/* ================= LANGUAGE PANEL ================= */}

          <section className="hero-overlay language-panel">

            <div className="panel-heading">
              <h2 className="choose-language">
                {t("chooseLanguage")}
              </h2>
            </div>

            <div className="lang-cards">

              {/* ================= ISIZULU ================= */}

              <button
                className={`lang-card ${
                  language === "zu" ? "selected" : ""
                }`}
                onClick={() =>
                  handleLanguageSelect("zu")
                }
              >
                <span className="lang-icon">
                  🗣️
                </span>

                <span className="lang-text">

                  <span className="lang-name">
                    {t("zuluName")}
                  </span>

                  <span className="lang-sub">
                    {t("zuluSub")}
                  </span>

                </span>

                <span className="lang-arrow">
                  →
                </span>
              </button>

              {/* ================= ENGLISH ================= */}

              <button
                className={`lang-card ${
                  language === "en" ? "selected" : ""
                }`}
                onClick={() =>
                  handleLanguageSelect("en")
                }
              >
                <span className="lang-icon">
                  🌐
                </span>

                <span className="lang-text">

                  <span className="lang-name">
                    {t("englishName")}
                  </span>

                  <span className="lang-sub">
                    {t("englishSub")}
                  </span>

                </span>

                <span className="lang-arrow">
                  →
                </span>
              </button>

            </div>

            <p className="panel-note">
              {t("secureAccess")}
            </p>

            <p className="lang-confirm">
              {language === "zu"
                ? t("continuingZulu")
                : t("continuingEnglish")}
            </p>

          </section>

        </div>
      </header>

      {/* ================= ACTION CARDS ================= */}

      <section
        className="action-cards-section"
        aria-label={t("clinicServices")}
      >

        <h2 className="action-heading">
          {t("actionHeading")}
        </h2>

        <div className="action-cards">

          {/* BOOK APPOINTMENT */}

          <div className="action-card">

            <span className="action-icon">
              📅
            </span>

            <h3>
              {t("bookAppointment")}
            </h3>

            <p>
              {t("bookAppointmentDesc")}
            </p>

          </div>

          {/* WALK-IN */}

          <div className="action-card">

            <span className="action-icon">
              🚶
            </span>

            <h3>
              {t("walkInQueue")}
            </h3>

            <p>
              {t("walkInQueueDesc")}
            </p>

          </div>

          {/* CHECK VISIT */}

          <div className="action-card">

            <span className="action-icon">
              🔎
            </span>

            <h3>
              {t("checkVisit")}
            </h3>

            <p>
              {t("checkVisitDesc")}
            </p>

          </div>

        </div>
      </section>

      {/* ================= FEATURES ================= */}

      <section
        className="feature-strip"
        aria-label={t("clinicBenefits")}
      >

        <div className="feature-item">

          <span className="feature-icon feature-icon-0" />

          <strong>
            {t("communityFocused")}
          </strong>

        </div>

        <div className="feature-item">

          <span className="feature-icon feature-icon-1" />

          <strong>
            {t("bilingualAccess")}
          </strong>

        </div>

        <div className="feature-item">

          <span className="feature-icon feature-icon-2" />

          <strong>
            {t("securePrivate")}
          </strong>

        </div>

      </section>

      {/* ================= ABOUT ================= */}

      <section
        id="about"
        className="about-section"
      >

        <h2>
          {t("aboutClinic")}
        </h2>

        <p>
          {t("aboutClinicText")}
        </p>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="site-footer">

        <strong>
          KwaDlangezwa Clinic Portal
        </strong>

        <p>
          {t("footerMessage")}
        </p>

        <nav
          className="footer-links"
          aria-label={t("footerNavigation")}
        >

          <a href="#privacy">
            {t("privacy")}
          </a>

          <a href="#accessibility">
            {t("accessibility")}
          </a>

          <a href="#help">
            {t("help")}
          </a>

        </nav>

        {/* ================= HELP ================= */}

        <div className="footer-help-section">

          <h3 className="footer-help-title">
            {t("needHelp")}
          </h3>

          <p className="footer-help-text">
            {t("helpAssistance")}
          </p>

          <div className="footer-help-icons">

            <a
              href="#help"
              className="help-icon"
              title={t("help")}
            >
              ❓
            </a>

            <a
              href="#privacy"
              className="help-icon"
              title={t("privacyPolicy")}
            >
              🔒
            </a>

            <a
              href="#contact"
              className="help-icon"
              title={t("contact")}
            >
              📞
            </a>

          </div>

        </div>

        <small>
          © 2026 KwaDlangezwa Clinic
        </small>

      </footer>

    </div>
  );
}

export default Home;