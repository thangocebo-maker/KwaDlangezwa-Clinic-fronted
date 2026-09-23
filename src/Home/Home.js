import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("en");
  const [activeNav, setActiveNav] = useState(0);

  const translations = {
    en: {
      nav: ["Home", "Register", "Log in", "About"],

      welcome: "Welcome to",
      clinicName: "KwaDlangezwa Clinic",
      subtitle: "Bilingual Appointment and Walk-in Management System",
      tagline: "Quality care, closer to you.",
      accessMessage:
        "Your health. Our care. Our community.",
      trustIndicator: "Simple • Accessible",

      chooseLanguage:
        "Choose your preferred language",

      actionHeading: "What can I do?",

      bookAppointment: "Book an Appointment",
      bookAppointmentDesc:
        "Plan your clinic visit.",

      walkInQueue: "Join the Walk-in Queue",
      walkInQueueDesc:
        "Check in without waiting unnecessarily.",

      checkVisit: "Check My Visit",
      checkVisitDesc:
        "View your appointment or queue status.",

      zuluName: "IsiZulu",
      zuluSub: "Qhubekela ngesiZulu",

      englishName: "English",
      englishSub: "Proceed in English",

      secureAccess:
        "Secure access to your clinic services.",

      features: [
        "Community Focused",
        "Bilingual Access",
        "Secure & Private",
      ],

      footerMessage:
        "Healthcare made simpler for our community.",

      footerLinks: [
        "Privacy",
        "Accessibility",
        "Help",
      ],

      needHelp: "Need help?",
      helpAssistance:
        "Contact the clinic reception for assistance.",
    },

    zu: {
      nav: ["Ikhaya", "Bhalisa", "Ngena", "Mayelana"],

      welcome: "Siyakwamukela e-",
      clinicName: "KwaDlangezwa Clinic",
      subtitle:
        "Uhlelo lwe-Appointment ne-Walk-in Management ngezilimi ezimbili.",
      tagline:
        "Ukunakekelwa okuhle, kufuphi nawe.",
      accessMessage:
        "Impilo yakho. Ukunakekelwa kwethu. Umphakathi wethu.",
      trustIndicator: "Lula • Kuyafinyeleleka",

      chooseLanguage:
        "Khetha ulimi oluthandayo",

      actionHeading: "Ungenzani?",

      bookAppointment: "Bhalisa i-Appointment",
      bookAppointmentDesc:
        "Hlela ukuvakasha kwakho e-clinic.",

      walkInQueue: "Joyina i-Walk-in Queue",
      walkInQueueDesc:
        "Ngena ngaphandle kokulinda isikhathi eside.",

      checkVisit: "Hlola I-Visit Yami",
      checkVisitDesc:
        "Buka i-appointment noma isimo se-queue.",

      zuluName: "IsiZulu",
      zuluSub: "Qhubekela ngesiZulu",

      englishName: "IsiNgisi",
      englishSub: "Qhubeka ngesiNgisi",

      secureAccess:
        "Ukufinyelela okuphephile ezinsizeni zomtholampilo.",

      features: [
        "Umphakathi",
        "Izilimi ezimbili",
        "Kuphephile futhi kuyimfihlo",
      ],

      footerMessage:
        "Ukunakekelwa kwezempilo kwenziwe lula emphakathini wethu.",

      footerLinks: [
        "Ubumfihlo",
        "Ukufinyeleleka",
        "Usizo",
      ],

      needHelp: "Udinga usizo?",
      helpAssistance:
        "Xhumana ne-reception ye-clinic ukuze uthole usizo.",
    },
  };

  const currentLanguage =
    translations[language] || translations.en;

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
      document
        .getElementById("about")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }
  };

  // Language selection
  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    localStorage.setItem("clinic_lang", lang);
  };

  return (
    <div className="page">

      {/* NAVIGATION */}
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

          {currentLanguage.nav.map(
            (item, index) => (
              <button
                key={item}
                className={`nav-link ${
                  activeNav === index
                    ? "active"
                    : ""
                } ${
                  index === 1
                    ? "register-btn"
                    : ""
                }`}
                onClick={() =>
                  handleNavigation(index)
                }
              >
                {item}
              </button>
            )
          )}

        </div>
      </nav>

      {/* HERO */}
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

          {/* HERO TEXT */}
          <section className="hero-copy">

            <div className="welcome-badge">
              {currentLanguage.welcome}
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
              {currentLanguage.tagline}
            </p>

            <p className="hero-subtitle">
              {currentLanguage.subtitle}
            </p>

            <p className="hero-access-message">
              {currentLanguage.accessMessage}
            </p>

            <p className="trust-indicator">
              {currentLanguage.trustIndicator}
            </p>

            <div className="hero-rule" />

          </section>

          {/* LANGUAGE PANEL */}
          <section className="hero-overlay language-panel">

            <div className="panel-heading">
              <h2 className="choose-language">
                {currentLanguage.chooseLanguage}
              </h2>
            </div>

            <div className="lang-cards">

              {/* ISIZULU */}
              <button
                className={`lang-card ${
                  language === "zu"
                    ? "selected"
                    : ""
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
                    {currentLanguage.zuluName}
                  </span>

                  <span className="lang-sub">
                    {currentLanguage.zuluSub}
                  </span>
                </span>

                <span className="lang-arrow">
                  →
                </span>
              </button>

              {/* ENGLISH */}
              <button
                className={`lang-card ${
                  language === "en"
                    ? "selected"
                    : ""
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
                    {currentLanguage.englishName}
                  </span>

                  <span className="lang-sub">
                    {currentLanguage.englishSub}
                  </span>
                </span>

                <span className="lang-arrow">
                  →
                </span>
              </button>

            </div>

            <p className="panel-note">
              {currentLanguage.secureAccess}
            </p>

            {language && (
              <p className="lang-confirm">
                {language === "zu"
                  ? "Uqhubeka ngesiZulu..."
                  : "Continuing in English..."}
              </p>
            )}

          </section>

        </div>
      </header>

      {/* ACTION CARDS */}
      <section
        className="action-cards-section"
        aria-label="Clinic services"
      >

        <h2 className="action-heading">
          {currentLanguage.actionHeading}
        </h2>

        <div className="action-cards">

          {/* BOOK - STATIC */}
          <div className="action-card">
            <span className="action-icon">
              📅
            </span>

            <h3>
              {currentLanguage.bookAppointment}
            </h3>

            <p>
              {currentLanguage.bookAppointmentDesc}
            </p>
          </div>

          {/* WALK-IN - STATIC */}
          <div className="action-card">
            <span className="action-icon">
              🚶
            </span>

            <h3>
              {currentLanguage.walkInQueue}
            </h3>

            <p>
              {currentLanguage.walkInQueueDesc}
            </p>
          </div>

          {/* CHECK VISIT - STATIC */}
          <div className="action-card">
            <span className="action-icon">
              🔎
            </span>

            <h3>
              {currentLanguage.checkVisit}
            </h3>

            <p>
              {currentLanguage.checkVisitDesc}
            </p>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section
        className="feature-strip"
        aria-label="Clinic benefits"
      >

        {currentLanguage.features.map(
          (feature, index) => (
            <div
              className="feature-item"
              key={feature}
            >
              <span
                className={`feature-icon feature-icon-${index}`}
              />

              <strong>
                {feature}
              </strong>
            </div>
          )
        )}

      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="about-section"
      >
        <h2>About KwaDlangezwa Clinic</h2>

        <p>
          The KwaDlangezwa Clinic Portal provides
          a simple and accessible way for patients
          to manage appointments and clinic visits.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">

        <strong>
          KwaDlangezwa Clinic Portal
        </strong>

        <p>
          {currentLanguage.footerMessage}
        </p>

        <nav
          className="footer-links"
          aria-label="Footer links"
        >
          {currentLanguage.footerLinks.map(
            (link) => (
              <a
                href={`#${link
                  .toLowerCase()
                  .replaceAll(" ", "-")}`}
                key={link}
              >
                {link}
              </a>
            )
          )}
        </nav>

        <div className="footer-help-section">

          <h3 className="footer-help-title">
            {currentLanguage.needHelp}
          </h3>

          <p className="footer-help-text">
            {currentLanguage.helpAssistance}
          </p>

          <div className="footer-help-icons">

            <a
              href="#help"
              className="help-icon"
              title="Help"
            >
              ❓
            </a>

            <a
              href="#privacy"
              className="help-icon"
              title="Privacy Policy"
            >
              🔒
            </a>

            <a
              href="#contact"
              className="help-icon"
              title="Contact"
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