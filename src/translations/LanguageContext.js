import React, { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    // =========================
    // GENERAL
    // =========================
    home: "Home",
    register: "Register",
    login: "Login",
    logout: "Logout",
    about: "About",
    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    update: "Update",
    delete: "Delete",
    edit: "Edit",
    back: "Back",
    next: "Next",
    close: "Close",
    search: "Search",
    loading: "Loading...",
    confirm: "Confirm",
    yes: "Yes",
    no: "No",

    // =========================
    // HOME
    // =========================
    welcome: "Welcome to the KwaDlangezwa Clinic",
    clinicName: "KwaDlangezwa Clinic",
    subtitle: "Bilingual Appointments and Walk-in Management System",
    tagline: "Simple, accessible and reliable clinic services",
    accessMessage: "Access clinic services quickly and easily.",
    trustIndicator: "Secure and trusted clinic management",
    chooseLanguage: "Choose your language",
    actionHeading: "How can we help you?",
    bookAppointment: "Book an Appointment",
    bookAppointmentDesc: "Schedule your clinic visit in advance.",
    walkInQueue: "Walk-in Queue",
    walkInQueueDesc: "Check in and manage your walk-in visit.",
    checkVisit: "Check Your Visit",
    checkVisitDesc: "View your appointment or walk-in status.",
    zuluName: "isiZulu",
    zuluSub: "Qhubeka ngesiZulu",
    englishName: "English",
    englishSub: "Continue in English",
    secureAccess: "Secure access",
    continuingZulu: "Continuing in isiZulu",
    continuingEnglish: "Continuing in English",
    clinicServices: "Clinic Services",
    clinicBenefits: "Clinic Benefits",
    communityFocused: "Community focused",
    bilingualAccess: "English and isiZulu access",
    securePrivate: "Secure and private",
    aboutClinic: "About the Clinic",
    aboutClinicText:
      "KwaDlangezwa Clinic provides accessible healthcare services to the community.",
    footerMessage: "Serving the KwaDlangezwa community",
    footerNavigation: "Navigation",
    privacy: "Privacy",
    accessibility: "Accessibility",
    help: "Help",
    privacyPolicy: "Privacy Policy",
    contact: "Contact",
    needHelp: "Need Help?",
    helpAssistance: "Contact the clinic for assistance.",

    // =========================
    // LOGIN
    // =========================
    loginTitle: "Login",
    loginWelcome: "Welcome Back",
    loginInstruction: "Enter your details to access your account.",
    email: "Email",
    phone: "Phone",
    password: "Password",
    confirmPassword: "Confirm Password",
    loginButton: "Login",
    loginSuccessful: "Login successful.",
    loggingIn: "Logging in...",
    noAccount: "Don't have an account?",
    createAccount: "Create an account",
    loginError: "Invalid email or password.",
    loginRequired: "Please enter your email and password.",
    invalidEmail: "Please enter a valid email address.",
    invalidPassword: "Please enter your password.",

    // =========================
    // REGISTER
    // =========================
    registerTitle: "Register",
    registerWelcome: "Create Your Account",
    registerInstruction: "Complete the form below to create a patient account.",
    fullName: "Full Name",
    enterFullName: "Enter your full name",
    enterEmail: "Enter your email",
    enterPhone: "Enter your phone number",
    enterPassword: "Enter your password",
    confirmYourPassword: "Confirm your password",
    registerButton: "Register",
    alreadyAccount: "Already have an account?",
    loginHere: "Login here",
    passwordsDoNotMatch: "Passwords do not match.",
    registrationSuccessful: "Registration successful.",
    emailAlreadyExists: "An account with this email already exists.",
    passwordMinLength: "Password must be at least 6 characters.",
    accountCreatedRedirecting: "Account created. Redirecting...",
    createPatientAccount: "Create Patient Account",
    creatingAccount: "Creating account...",
    backToHome: "Back to Home",
    emailAddress: "Email Address",

    // =========================
    // PATIENT
    // =========================
    patient: "Patient",
    patientMenu: "Patient Menu",
    patientDashboard: "Patient Dashboard",
    dashboard: "Dashboard",
    myAppointments: "My Appointments",
    profile: "Profile",
    welcomeBack: "Welcome back",
    welcomePatient: "Welcome, Patient",
    patientDashboardSubtitle:
      "Manage your appointments and clinic visits from one place.",
    totalVisits: "Total Visits",
    upcomingAppointments: "Upcoming Appointments",
    walkInVisits: "Walk-in Visits",
    completedVisits: "Completed Visits",
    cancelledNoShows: "Cancelled / No-shows",
    recentAppointments: "Recent Appointments",
    viewAll: "View All",
    loadingYourAppointments: "Loading your appointments...",
    noAppointmentsYet: "You have no appointments yet.",
    bookAnAppointment: "Book an Appointment",
    bookNewAppointment: "Book New Appointment",
    viewMyAppointments: "View My Appointments",
    clinicAppointment: "Clinic Appointment",
    clinicStaff: "Clinic Staff",
    doctor: "Doctor",
    service: "Service",
    currentWalkIn: "Current Walk-in",
    queueNumber: "Queue Number",
    department: "Department",
    priority: "Priority",
    currentStatus: "Current Status",
    waitingInClinicQueue: "Waiting in clinic queue",
    beingAttendedByStaff: "Being attended by staff",
    visitCompleted: "Visit completed",
    walkInNoShow: "Walk-in no-show",

    // =========================
    // BOOK APPOINTMENT
    // =========================
    bookTitle: "Book an Appointment",
    bookInstruction: "Choose a date and available time for your visit.",
    chooseDateTimeForVisit: "Choose date and time for your visit",
    newAppointment: "New Appointment",
    selectDate: "Select Date",
    selectDateRequired: "Please select a date.",
    timeSlots: "Time Slots",
    selectTime: "Select Time",
    available: "Available",
    unavailable: "Unavailable",
    fullyBooked: "Fully Booked",
    noTimeSlotsAvailable: "No time slots available.",
    selectedTime: "Selected Time",
    confirmAppointment: "Confirm Appointment",
    myBookings: "My Bookings",
    noBookingsYet: "You have no bookings yet.",
    actions: "Actions",
    reschedule: "Reschedule",
    selectAvailableTime: "Select an available time",
    loginFirst: "Please login first.",
    timeSlotJustBooked: "This time slot was just booked. Please choose another.",
    appointmentConfirmedAwaitingApproval:
      "Appointment booked and awaiting staff approval.",
    enterNewDate: "Enter new date",
    enterNewTime: "Enter new time",
    newTimeSlotAlreadyBooked:
      "The new time slot is already booked. Please choose another.",
    appointmentRescheduledAwaitingApproval:
      "Appointment rescheduled and awaiting staff approval.",
    confirmCancelAppointment:
      "Are you sure you want to cancel this appointment?",
    appointmentReason: "Appointment Reason",
    enterReason: "Enter appointment reason",
    appointmentBooked: "Appointment booked successfully.",
    appointmentConflict:
      "You already have an appointment at this time.",
    bookingFailed: "Unable to book appointment.",

    // =========================
    // MY APPOINTMENTS
    // =========================
    appointmentTitle: "My Appointments",
    appointmentsWalkInsOverview:
      "View and manage your appointments and walk-in visits.",
    myWalkInVisits: "My Walk-in Visits",
    appointmentHistory: "Appointment History",
    appointmentDate: "Date",
    appointmentTime: "Time",
    appointmentDepartment: "Department",
    appointmentStatus: "Status",
    appointmentActions: "Actions",
    cancelAppointment: "Cancel Appointment",
    appointmentCancelled: "Appointment cancelled successfully.",
    appointmentUpdated: "Appointment updated successfully.",
    appointmentRescheduledAwaitingStaffApproval:
      "Appointment rescheduled and awaiting staff approval.",
    unableRescheduleAppointment: "Unable to reschedule appointment.",
    unableCancelAppointment: "Unable to cancel appointment.",
    timeSlotAlreadyBookedChooseAnother:
      "This time slot is already booked. Please choose another.",
    noUpcomingAppointments: "No upcoming appointments.",
    bookYourFirstAppointment: "Book your first appointment.",

    // =========================
    // PATIENT PROFILE
    // =========================
    profileTitle: "My Profile",
    personalInformation: "Personal Information",
    name: "Name",
    phoneNumber: "Phone Number",
    updateProfile: "Update Profile",
    profileUpdated: "Profile updated successfully.",
    profileDetails: "Profile Details",
    profileDetailsSubtitle: "View and update your personal information.",
    patientProfile: "Patient Profile",
    dateOfBirth: "Date of Birth",
    language: "Language",
    preferredLanguage: "Preferred Language",
    address: "Address",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",
    profileUpdatedSuccessfully: "Profile updated successfully.",
    profileUpdateFailed: "Unable to update profile.",

    // =========================
    // NURSE
    // =========================
    nurse: "Nurse",
    nurseMenu: "Nurse Menu",
    nurseDashboard: "Nurse Dashboard",
    nurseDashboardSubtitle:
      "Manage appointments, walk-ins and daily clinic activities.",
    manageAppointments: "Manage Appointments",
    manageWalkIns: "Manage Walk-ins",
    myProfile: "My Profile",
    nurseProfile: "Nurse Profile",
    totalPatients: "Total Patients",
    scheduledAppointments: "Scheduled Appointments",
    walkInPatients: "Walk-in Patients",
    completed: "Completed",
    todayAppointments: "Today's Appointments",
    todayWalkins: "Today's Walk-ins",
    noScheduledAppointments: "No scheduled appointments.",
    noWalkins: "No walk-in patients.",
    clinicFlowReportsSchedule: "Clinic flow, reports and schedule",
    walkInsRegistered: "Walk-ins Registered",
    loadingSchedule: "Loading schedule...",
    noAppointmentsOrWalkIns: "No appointments or walk-ins found.",

    // =========================
    // MANAGE APPOINTMENTS
    // =========================
    appointmentManagement: "Appointment Management",
    manageAppointmentsSubtitle:
      "View, approve and manage patient appointments.",
    patientAppointments: "Patient Appointments",
    allStatuses: "All Statuses",
    loadingAppointments: "Loading appointments...",
    noAppointmentsFound: "No appointments found.",
    appointmentsFound: "appointments found",
    patientName: "Patient Name",
    patientEmail: "Patient Email",
    appointmentId: "Appointment ID",
    appointmentDetails: "Appointment Details",
    markCompleted: "Mark Completed",
    markCancelled: "Mark Cancelled",
    markNoShow: "Mark No-show",
    approve: "Approve",
    reject: "Reject",
    complete: "Complete",
    appointment: "Appointment",
    successfully: "successfully",
    appointmentApprovedSuccessfully:
      "Appointment approved successfully.",
    appointmentRejectedSuccessfully:
      "Appointment rejected successfully.",
    appointmentCompletedSuccessfully:
      "Appointment completed successfully.",
    appointmentNoShowSuccessfully:
      "Appointment marked as no-show successfully.",
    appointmentCancelledSuccessfully:
      "Appointment cancelled successfully.",
    appointmentStatusUpdated:
      "Appointment status updated successfully.",
    unableUpdateAppointment: "Unable to update appointment.",

    // =========================
    // WALK-INS
    // =========================
    walkInTitle: "Walk-in Management",
    manageWalkInPatients: "Manage Walk-in Patients",
    manageWalkInPatientsSubtitle:
      "Register and manage patients who arrive without appointments.",
    registerWalkIn: "Register Walk-in",
    registerWalkInPatient: "Register Walk-in Patient",
    createPatientWalkInQueue: "Create patient and add them to the walk-in queue",
    closeForm: "Close Form",
    walkInRegistration: "Walk-in Registration",
    arrivalTime: "Arrival Time",
    checkIn: "Check In",
    waiting: "Waiting",
    inProgress: "In Progress",
    walkInCompleted: "Completed",
    walkInCancelled: "Cancelled",
    startConsultation: "Start Consultation",
    completeVisit: "Complete Visit",
    walkInRegistered: "Walk-in registered successfully.",
    walkInUpdated: "Walk-in updated successfully.",
    completeRequiredFields: "Please complete all required fields.",
    patientAccountEmailExists:
      "A patient account with this email already exists.",
    walkinRegisteredSuccessfully:
      "Walk-in patient registered successfully.",
    patientCanLogin:
      "The patient can use their account to log in.",
    walkinRegistrationError:
      "Unable to register walk-in patient.",
    walkinStatusUpdated:
      "Walk-in status updated successfully.",
    removeWalkinConfirmation:
      "Are you sure you want to remove this walk-in patient?",
    walkinPatientRemoved:
      "Walk-in patient removed successfully.",
    totalWalkIns: "Total Walk-ins",
    all: "All",
    viewManageTodaysWalkIns: "View and manage today's walk-in patients.",
    loadingWalkIns: "Loading walk-ins...",
    noWalkInPatientsFound: "No walk-in patients found.",
    queue: "Queue",
    start: "Start",
    normal: "Normal",
    urgent: "Urgent",
    emergency: "Emergency",
    dental: "Dental",

    // =========================
    // NURSE PROFILE
    // =========================
    nurseInformation: "Nurse Information",
    staffId: "Staff ID",
    role: "Role",
    nurseDepartment: "Department",
    invalidImageFile: "Please select a valid image file.",
    emailAlreadyInUse: "This email is already in use.",
    nurseProfileUpdated: "Nurse profile updated successfully.",
    nurseAvatar: "Nurse Avatar",
    nurseProfileSubtitle:
      "Manage your personal information and profile picture.",
    profilePicture: "Profile Picture",
    schedule: "Schedule",
    editNurseProfile: "Edit Nurse Profile",
    uploadJpgPng: "Upload JPG or PNG",
    profilePreview: "Profile Preview",

    // =========================
    // ADMIN
    // =========================
    admin: "Admin",
    administrator: "Administrator",
    adminMenu: "Admin Menu",
    adminDashboard: "Admin Dashboard",
    clinicOverview: "Clinic Overview",
    clinicOverviewSubtitle:
      "Monitor clinic activity and manage the system.",
    registerNurse: "Register Nurse",
    systemConfig: "System Configuration",
    systemConfiguration: "System Configuration",
    reports: "Reports",
    nurseManagement: "Nurse Management",
    nurseActivity: "Nurse Activity",
    registeredNurses: "Registered Nurses",
    appointments: "Appointments",
    walkIns: "Walk-ins",
    nursesActive: "Active Nurses",
    noNursesRegistered: "No nurses registered.",
    generalDepartment: "General",
    pendingHighPriority: "Pending High Priority",
    pendingHighPriorityAppointments:
      "Pending High Priority Appointments",
    status: "Status",
    type: "Type",
    date: "Date",
    unknownPatient: "Unknown Patient",
    generalConsultation: "General Consultation",
    booked: "Booked",
    noPendingUrgentAppointments:
      "No pending urgent appointments.",
    noUrgentAppointments:
      "No urgent appointments at this time.",
    adminOverviewDescription:
      "View clinic activity, appointments, walk-ins and staff information.",

    // =========================
    // ADMIN - REGISTER NURSE
    // =========================
    registerNurseTitle: "Register Nurse",
    registerNurseSubtitle: "Create a new nurse account.",
    registerNurseDescription:
      "Register a nurse by entering their personal and staff information.",
    nurseRegistration: "Nurse Registration",
    nurseAccountDetails: "Nurse Account Details",
    nurseStaffId: "Nurse Staff ID",
    selectDepartment: "Select Department",
    general: "General",
    maternal: "Maternal",
    childHealth: "Child Health",
    chronicCare: "Chronic Care",
    other: "Other",
    minimum6Characters: "Minimum 6 characters",
    minimumSixCharacters: "Minimum 6 characters",
    accountRole: "Account Role",
    nurseRole: "Nurse",
    roleAutomaticallyNurse: "Nurse",
    nurseRoleAutomaticallySet:
      "The account role is automatically set to Nurse.",
    registeringNurse: "Registering Nurse...",
    noNursesRegisteredYet: "No nurses registered yet.",
    staffIdDuplicate: "This staff ID already exists.",
    staffIdExists: "A nurse with this staff ID already exists.",
    nurseRegistrationSuccess:
      "Nurse registered successfully.",
    nurseRegisteredSuccessfully:
      "Nurse registered successfully.",
    unableRegisterNurse:
      "Unable to register nurse.",
    unableToRegisterNurse:
      "Unable to register nurse.",
    nurseFullNamePlaceholder: "Enter nurse full name",
    nurseEmailPlaceholder: "Enter nurse email",
    staffIdPlaceholder: "Enter staff ID",
    reEnterPassword: "Re-enter password",
    passwordTooShort: "Password must be at least 6 characters.",
    extendedPermissions:
      "Allows appointments and walk-in management.",

    // =========================
    // ADMIN - SYSTEM CONFIGURATION
    // =========================
    configurationTitle: "Configuration",
    systemConfigurationTitle: "System Configuration",
    systemConfigurationSubtitle:
      "Configure clinic appointment and walk-in settings.",
    clinicSettings: "Clinic Settings",
    dailyAppointmentCapacity: "Daily Appointment Capacity",
    appointmentCapacity: "Appointment Capacity",
    appointmentSlotDuration: "Appointment Slot Duration",
    slotDuration: "Slot Duration",
    minutesInBrackets: "minutes",
    minutes: "minutes",
    walkInLimitPerDay: "Walk-in Limit Per Day",
    restrictedWalkInHours: "Restricted Walk-in Hours",
    walkInRestriction: "Walk-in Restriction",
    walkInTimeExample: "Example: 08:00 - 16:00",
    nursePermissions: "Nurse Permissions",
    basicAppointmentsOnly: "Basic - Appointments Only",
    extendedAppointmentsWalkIns:
      "Extended - Appointments and Walk-ins",
    fullAppointmentsWalkInsReports:
      "Full - Appointments, Walk-ins and Reports",
    saveConfiguration: "Save Configuration",
    configurationSaved: "Configuration saved successfully.",
    configurationUpdated: "Configuration updated successfully.",
    currentConfiguration: "Current Configuration",
    dailyCapacity: "Daily Capacity",
    restrictedHours: "Restricted Hours",
    walkInLimit: "Walk-in Limit",
    none: "None",
    basic: "Basic",
    extended: "Extended",
    full: "Full",
    unableSaveConfiguration:
      "Unable to save configuration.",

    // =========================
    // ADMIN - REPORTS
    // =========================
    reportsTitle: "Reports",
    reportsAnalytics: "Reports & Analytics",
    reportsAnalyticsSubtitle:
      "View clinic appointment and walk-in statistics.",
    reportsOverview: "Reports Overview",
    weeklyReport: "Weekly Report",
    monthlyReport: "Monthly Report",
    loadingWeeklyData: "Loading weekly data...",
    loadingMonthlyData: "Loading monthly data...",
    noWeeklyData: "No weekly data available.",
    noMonthlyData: "No monthly data available.",
    visualAnalytics: "Visual Analytics",
    noVisualAnalyticsData:
      "No visual analytics data available.",
    week: "Week",
    month: "Month",
    generateWeekly: "Generate Weekly Report",
    generateMonthly: "Generate Monthly Report",
    reportDate: "Date",
    reportAppointments: "Appointments",
    reportWalkins: "Walk-ins",
    reportCompleted: "Completed",
    reportCancelled: "Cancelled",
    reportNoShows: "No-shows",
    noReportData: "No report data available.",

    // =========================
    // STATUS
    // =========================
    pending: "Pending",
    confirmed: "Confirmed",
    scheduled: "Scheduled",
    cancelled: "Cancelled",
    completedStatus: "Completed",
    noShow: "No-show",
    rejected: "Rejected",
    open: "Open",
    walkIn: "Walk-in",

    // =========================
    // MESSAGES
    // =========================
    requiredFields: "Please complete all required fields.",
    somethingWentWrong: "Something went wrong.",
    accessDenied: "Access denied.",
    sessionExpired: "Your session has expired.",
    logoutConfirmation: "Are you sure you want to logout?",

    // =========================
    // LANGUAGE
    // =========================
    english: "English",
    isizulu: "isiZulu",
  },

  // ============================================================
  // ISIZULU
  // ============================================================
  zu: {
    // =========================
    // GENERAL
    // =========================
    home: "Ekhaya",
    register: "Bhalisa",
    login: "Ngena",
    logout: "Phuma",
    about: "Mayelana",
    save: "Gcina",
    cancel: "Khansela",
    submit: "Thumela",
    update: "Buyekeza",
    delete: "Susa",
    edit: "Hlela",
    back: "Emuva",
    next: "Okulandelayo",
    close: "Vala",
    search: "Sesha",
    loading: "Iyalayisha...",
    confirm: "Qinisekisa",
    yes: "Yebo",
    no: "Cha",

    // =========================
    // HOME
    // =========================
    welcome: "Siyakwamukela eKwaDlangezwa Clinic",
    clinicName: "KwaDlangezwa Clinic",
    subtitle:
      "Uhlelo Lokuphatha Ama-Appointment kanye Neziguli Ezifika Ngaphandle Kwe-Appointment",
    tagline: "Izinsiza zezempilo ezilula, ezifinyeleleka futhi ezithembekile",
    accessMessage: "Finyelela ezinsizeni zomtholampilo ngokushesha nangendlela elula.",
    trustIndicator: "Uhlelo oluphephile noluthembekile lokuphatha umtholampilo",
    chooseLanguage: "Khetha ulimi lwakho",
    actionHeading: "Singakusiza kanjani?",
    bookAppointment: "Bhuka I-Appointment",
    bookAppointmentDesc: "Hlela ukuvakashela kwakho emtholampilo kusenesikhathi.",
    walkInQueue: "Ulayini Weziguli Ezifikile",
    walkInQueueDesc: "Bhalisa futhi uphathe ukuvakasha kwakho ngaphandle kwe-appointment.",
    checkVisit: "Hlola Ukuvakasha Kwakho",
    checkVisitDesc: "Buka isimo se-appointment noma sokufika kwakho.",
    zuluName: "isiZulu",
    zuluSub: "Qhubeka ngesiZulu",
    englishName: "English",
    englishSub: "Qhubeka ngesiNgisi",
    secureAccess: "Ukufinyelela okuphephile",
    continuingZulu: "Uqhubeka ngesiZulu",
    continuingEnglish: "Uqhubeka ngesiNgisi",
    clinicServices: "Izinsiza Zomtholampilo",
    clinicBenefits: "Izinzuzo Zomtholampilo",
    communityFocused: "Igxile emphakathini",
    bilingualAccess: "Ukufinyelela ngesiNgisi nangesiZulu",
    securePrivate: "Kuphephile futhi kuyimfihlo",
    aboutClinic: "Mayelana Nomtholampilo",
    aboutClinicText:
      "KwaDlangezwa Clinic ihlinzeka ngezinsiza zezempilo ezifinyeleleka emphakathini.",
    footerMessage: "Sisebenzela umphakathi waseKwaDlangezwa",
    footerNavigation: "Ukuhamba",
    privacy: "Ubumfihlo",
    accessibility: "Ukufinyeleleka",
    help: "Usizo",
    privacyPolicy: "Inqubomgomo Yobumfihlo",
    contact: "Xhumana Nathi",
    needHelp: "Udinga Usizo?",
    helpAssistance: "Xhumana nomtholampilo ukuze uthole usizo.",

    // =========================
    // LOGIN
    // =========================
    loginTitle: "Ngena",
    loginWelcome: "Siyakwamukela Futhi",
    loginInstruction: "Faka imininingwane yakho ukuze ungene ku-akhawunti yakho.",
    email: "I-imeyili",
    phone: "Ucingo",
    password: "Iphasiwedi",
    confirmPassword: "Qinisekisa Iphasiwedi",
    loginButton: "Ngena",
    loginSuccessful: "Ukungena kuphumelele.",
    loggingIn: "Kuyangena...",
    noAccount: "Awunayo i-akhawunti?",
    createAccount: "Dala i-akhawunti",
    loginError: "I-imeyili noma iphasiwedi ayilungile.",
    loginRequired: "Sicela ufake i-imeyili nephasiwedi.",
    invalidEmail: "Sicela ufake i-imeyili evumelekile.",
    invalidPassword: "Sicela ufake iphasiwedi.",

    // =========================
    // REGISTER
    // =========================
    registerTitle: "Bhalisa",
    registerWelcome: "Dala I-Akhawunti Yakho",
    registerInstruction: "Gcwalisa ifomu elingezansi ukuze wakhe i-akhawunti yesiguli.",
    fullName: "Igama Eligcwele",
    enterFullName: "Faka igama lakho eligcwele",
    enterEmail: "Faka i-imeyili yakho",
    enterPhone: "Faka inombolo yakho yocingo",
    enterPassword: "Faka iphasiwedi yakho",
    confirmYourPassword: "Qinisekisa iphasiwedi yakho",
    registerButton: "Bhalisa",
    alreadyAccount: "Usunayo i-akhawunti?",
    loginHere: "Ngena lapha",
    passwordsDoNotMatch: "Amaphasiwedi awafani.",
    registrationSuccessful: "Ukubhalisa kuphumelele.",
    emailAlreadyExists: "I-akhawunti enale imeyili isivele ikhona.",
    passwordMinLength: "Iphasiwedi kumele ibe nezinhlamvu okungenani eziyisi-6.",
    accountCreatedRedirecting: "I-akhawunti idaliwe. Kuyadluliselwa...",
    createPatientAccount: "Dala I-Akhawunti Yesiguli",
    creatingAccount: "Kwakhiwa i-akhawunti...",
    backToHome: "Buyela Ekhaya",
    emailAddress: "Ikheli Le-imeyili",

    // =========================
    // PATIENT
    // =========================
    patient: "Isiguli",
    patientMenu: "Imenyu Yesiguli",
    patientDashboard: "Ikhasi Lesiguli",
    dashboard: "Ikhasi Elikhulu",
    myAppointments: "Ama-Appointment Ami",
    profile: "Iphrofayela",
    welcomeBack: "Siyakwamukela futhi",
    welcomePatient: "Siyakwamukela, Siguli",
    patientDashboardSubtitle:
      "Phatha ama-appointment akho nokuvakasha emtholampilo endaweni eyodwa.",
    totalVisits: "Ukuvakasha Sekukonke",
    upcomingAppointments: "Ama-Appointment Azayo",
    walkInVisits: "Ukuvakasha Ngaphandle Kwe-Appointment",
    completedVisits: "Ukuvakasha Okuqediwe",
    cancelledNoShows: "Okukhanseliwe / Abangafikanga",
    recentAppointments: "Ama-Appointment Akamuva",
    viewAll: "Buka Konke",
    loadingYourAppointments: "Kulayishwa ama-appointment akho...",
    noAppointmentsYet: "Awunawo ama-appointment okwamanje.",
    bookAnAppointment: "Bhuka I-Appointment",
    bookNewAppointment: "Bhuka I-Appointment Entsha",
    viewMyAppointments: "Buka Ama-Appointment Ami",
    clinicAppointment: "I-Appointment Yomtholampilo",
    clinicStaff: "Abasebenzi Bomtholampilo",
    doctor: "Udokotela",
    service: "Inkonzo",
    currentWalkIn: "Ukuvakasha Kwamanje",
    queueNumber: "Inombolo Yolayini",
    department: "Umnyango",
    priority: "Okubalulekile",
    currentStatus: "Isimo Samanje",
    waitingInClinicQueue: "Ilinde kulayini womtholampilo",
    beingAttendedByStaff: "Iyasizwa umsebenzi",
    visitCompleted: "Ukuvakasha kuqediwe",
    walkInNoShow: "Isiguli esingafikanga",

    // =========================
    // BOOK APPOINTMENT
    // =========================
    bookTitle: "Bhuka I-Appointment",
    bookInstruction: "Khetha usuku nesikhathi esitholakalayo sokuvakasha kwakho.",
    chooseDateTimeForVisit: "Khetha usuku nesikhathi sokuvakasha kwakho",
    newAppointment: "I-Appointment Entsha",
    selectDate: "Khetha Usuku",
    selectDateRequired: "Sicela ukhethe usuku.",
    timeSlots: "Izikhathi",
    selectTime: "Khetha Isikhathi",
    available: "Kuyatholakala",
    unavailable: "Akutholakali",
    fullyBooked: "Sekugcwele",
    noTimeSlotsAvailable: "Azikho izikhathi ezitholakalayo.",
    selectedTime: "Isikhathi Esikhethiwe",
    confirmAppointment: "Qinisekisa I-Appointment",
    myBookings: "Ama-Booking Ami",
    noBookingsYet: "Awunawo ama-booking okwamanje.",
    actions: "Izenzo",
    reschedule: "Shintsha Isikhathi",
    selectAvailableTime: "Khetha isikhathi esitholakalayo",
    loginFirst: "Sicela ungene kuqala.",
    timeSlotJustBooked:
      "Lesi sikhathi sisanda kubhukelwa. Sicela ukhethe esinye.",
    appointmentConfirmedAwaitingApproval:
      "I-appointment ibhukhiwe futhi ilinde ukugunyazwa ngumsebenzi.",
    enterNewDate: "Faka usuku olusha",
    enterNewTime: "Faka isikhathi esisha",
    newTimeSlotAlreadyBooked:
      "Isikhathi esisha sesibhukelwe. Sicela ukhethe esinye.",
    appointmentRescheduledAwaitingApproval:
      "I-appointment ishintshiwe futhi ilinde ukugunyazwa.",
    confirmCancelAppointment:
      "Uyaqiniseka ukuthi ufuna ukukhansela le appointment?",
    appointmentReason: "Isizathu Se-Appointment",
    enterReason: "Faka isizathu se-appointment",
    appointmentBooked: "I-appointment ibhukhiwe ngempumelelo.",
    appointmentConflict:
      "Usunayo enye i-appointment ngalesi sikhathi.",
    bookingFailed: "Ayikwazanga ukubhukha i-appointment.",

    // =========================
    // MY APPOINTMENTS
    // =========================
    appointmentTitle: "Ama-Appointment Ami",
    appointmentsWalkInsOverview:
      "Buka futhi uphathe ama-appointment nokuvakasha ngaphandle kwe-appointment.",
    myWalkInVisits: "Ukuvakasha Kwami Ngaphandle Kwe-Appointment",
    appointmentHistory: "Umlando Wama-Appointment",
    appointmentDate: "Usuku",
    appointmentTime: "Isikhathi",
    appointmentDepartment: "Umnyango",
    appointmentStatus: "Isimo",
    appointmentActions: "Izenzo",
    cancelAppointment: "Khansela I-Appointment",
    appointmentCancelled: "I-appointment ikhanseliwe ngempumelelo.",
    appointmentUpdated: "I-appointment ibuyekeziwe ngempumelelo.",
    appointmentRescheduledAwaitingStaffApproval:
      "I-appointment ishintshiwe futhi ilinde ukugunyazwa ngumsebenzi.",
    unableRescheduleAppointment:
      "Ayikwazanga ukushintsha i-appointment.",
    unableCancelAppointment:
      "Ayikwazanga ukukhansela i-appointment.",
    timeSlotAlreadyBookedChooseAnother:
      "Lesi sikhathi sesibhukelwe. Sicela ukhethe esinye.",
    noUpcomingAppointments: "Azikho izikhathi ezizayo.",
    bookYourFirstAppointment: "Bhuka i-appointment yakho yokuqala.",

    // =========================
    // PATIENT PROFILE
    // =========================
    profileTitle: "Iphrofayela Yami",
    personalInformation: "Ulwazi Lomuntu",
    name: "Igama",
    phoneNumber: "Inombolo Yocingo",
    updateProfile: "Buyekeza Iphrofayela",
    profileUpdated: "Iphrofayela ibuyekeziwe ngempumelelo.",
    profileDetails: "Imininingwane Yephrofayela",
    profileDetailsSubtitle:
      "Buka futhi ubuyekeze imininingwane yakho.",
    patientProfile: "Iphrofayela Yesiguli",
    dateOfBirth: "Usuku Lokuzalwa",
    language: "Ulimi",
    preferredLanguage: "Ulimi Olukhethwayo",
    address: "Ikheli",
    editProfile: "Hlela Iphrofayela",
    saveChanges: "Gcina Izinguquko",
    profileUpdatedSuccessfully:
      "Iphrofayela ibuyekeziwe ngempumelelo.",
    profileUpdateFailed:
      "Ayikwazanga ukubuyekeza iphrofayela.",

    // =========================
    // NURSE
    // =========================
    nurse: "Umhlengikazi",
    nurseMenu: "Imenyu Yomhlengikazi",
    nurseDashboard: "Ikhasi Lomhlengikazi",
    nurseDashboardSubtitle:
      "Phatha ama-appointment, iziguli ezifikayo kanye nemisebenzi yansuku zonke yomtholampilo.",
    manageAppointments: "Phatha Ama-Appointment",
    manageWalkIns: "Phatha Iziguli Ezifikayo",
    myProfile: "Iphrofayela Yami",
    nurseProfile: "Iphrofayela Yomhlengikazi",
    totalPatients: "Iziguli Sekukonke",
    scheduledAppointments: "Ama-Appointment Ahleliwe",
    walkInPatients: "Iziguli Ezifikile",
    completed: "Kuqediwe",
    todayAppointments: "Ama-Appointment Anamuhla",
    todayWalkins: "Iziguli Ezifikile Namuhla",
    noScheduledAppointments: "Awekho ama-appointment ahleliwe.",
    noWalkins: "Azikho iziguli ezifikile.",
    clinicFlowReportsSchedule: "Ukuhamba komtholampilo, imibiko nohlelo",
    walkInsRegistered: "Iziguli Ezifikile Ezibhalisiwe",
    loadingSchedule: "Kulayishwa uhlelo...",
    noAppointmentsOrWalkIns:
      "Awekho ama-appointment noma iziguli ezifikile.",

    // =========================
    // MANAGE APPOINTMENTS
    // =========================
    appointmentManagement: "Ukuphathwa Kwama-Appointment",
    manageAppointmentsSubtitle:
      "Buka, gunyaza futhi uphathe ama-appointment eziguli.",
    patientAppointments: "Ama-Appointment Eziguli",
    allStatuses: "Zonke Izimo",
    loadingAppointments: "Kulayishwa ama-appointment...",
    noAppointmentsFound: "Awekho ama-appointment atholakele.",
    appointmentsFound: "ama-appointment atholakele",
    patientName: "Igama Lesiguli",
    patientEmail: "I-imeyili Yesiguli",
    appointmentId: "I-ID Ye-Appointment",
    appointmentDetails: "Imininingwane Ye-Appointment",
    markCompleted: "Maka Njengokuqediwe",
    markCancelled: "Maka Njengokukhanseliwe",
    markNoShow: "Maka Njengongafikanga",
    approve: "Gunyaza",
    reject: "Nqaba",
    complete: "Qeda",
    appointment: "I-Appointment",
    successfully: "ngempumelelo",
    appointmentApprovedSuccessfully:
      "I-appointment igunyazwe ngempumelelo.",
    appointmentRejectedSuccessfully:
      "I-appointment yenqatshiwe ngempumelelo.",
    appointmentCompletedSuccessfully:
      "I-appointment iqediwe ngempumelelo.",
    appointmentNoShowSuccessfully:
      "I-appointment imakwe njengongafikanga.",
    appointmentCancelledSuccessfully:
      "I-appointment ikhanseliwe ngempumelelo.",
    appointmentStatusUpdated:
      "Isimo se-appointment sibuyekeziwe ngempumelelo.",
    unableUpdateAppointment:
      "Ayikwazanga ukubuyekeza i-appointment.",

    // =========================
    // WALK-INS
    // =========================
    walkInTitle: "Ukuphathwa Kweziguli Ezifikayo",
    manageWalkInPatients: "Phatha Iziguli Ezifikayo",
    manageWalkInPatientsSubtitle:
      "Bhalisa futhi uphathe iziguli ezifika ngaphandle kwama-appointment.",
    registerWalkIn: "Bhalisa Isiguli Esifikile",
    registerWalkInPatient: "Bhalisa Isiguli Esifikile",
    createPatientWalkInQueue:
      "Dala isiguli bese usifaka kulayini",
    closeForm: "Vala Ifomu",
    walkInRegistration: "Ukubhalisa Isiguli Esifikile",
    arrivalTime: "Isikhathi Sokufika",
    checkIn: "Ngena",
    waiting: "Ilindile",
    inProgress: "Kuyaqhubeka",
    walkInCompleted: "Kuqediwe",
    walkInCancelled: "Kukhanseliwe",
    startConsultation: "Qala Ukubonana",
    completeVisit: "Qeda Ukuvakasha",
    walkInRegistered:
      "Isiguli esifikile sibhaliswe ngempumelelo.",
    walkInUpdated:
      "Imininingwane yesiguli esifikile ibuyekeziwe.",
    completeRequiredFields:
      "Sicela ugcwalise zonke izindawo ezidingekayo.",
    patientAccountEmailExists:
      "I-akhawunti yesiguli enale imeyili isivele ikhona.",
    walkinRegisteredSuccessfully:
      "Isiguli esifikile sibhaliswe ngempumelelo.",
    patientCanLogin:
      "Isiguli singasebenzisa i-akhawunti yaso ukungena.",
    walkinRegistrationError:
      "Ayikwazanga ukubhalisa isiguli esifikile.",
    walkinStatusUpdated:
      "Isimo sesiguli esifikile sibuyekeziwe ngempumelelo.",
    removeWalkinConfirmation:
      "Uyaqiniseka ukuthi ufuna ukususa lesi siguli?",
    walkinPatientRemoved:
      "Isiguli esifikile sisusiwe ngempumelelo.",
    totalWalkIns: "Iziguli Ezifikile Sekukonke",
    all: "Konke",
    viewManageTodaysWalkIns:
      "Buka futhi uphathe iziguli ezifikile namuhla.",
    loadingWalkIns: "Kulayishwa iziguli ezifikile...",
    noWalkInPatientsFound:
      "Azikho iziguli ezifikile ezitholakele.",
    queue: "Ulayini",
    start: "Qala",
    normal: "Okuvamile",
    urgent: "Okuphuthumayo",
    emergency: "Isimo Esiphuthumayo",
    dental: "Amazinyo",

    // =========================
    // NURSE PROFILE
    // =========================
    nurseInformation: "Ulwazi Lomhlengikazi",
    staffId: "I-ID Yomsebenzi",
    role: "Indima",
    nurseDepartment: "Umnyango",
    invalidImageFile: "Sicela ukhethe isithombe esivumelekile.",
    emailAlreadyInUse: "Le imeyili isivele iyasetshenziswa.",
    nurseProfileUpdated:
      "Iphrofayela yomhlengikazi ibuyekeziwe.",
    nurseAvatar: "Isithombe Somhlengikazi",
    nurseProfileSubtitle:
      "Phatha imininingwane yakho nesithombe sephrofayela.",
    profilePicture: "Isithombe Sephrofayela",
    schedule: "Uhlelo",
    editNurseProfile: "Hlela Iphrofayela Yomhlengikazi",
    uploadJpgPng: "Layisha i-JPG noma i-PNG",
    profilePreview: "Ukubuka Isithombe",

    // =========================
    // ADMIN
    // =========================
    admin: "Umphathi",
    administrator: "Umphathi Wesistimu",
    adminMenu: "Imenyu Yomphathi",
    adminDashboard: "Ikhasi Lomphathi",
    clinicOverview: "Ukubuka Komtholampilo",
    clinicOverviewSubtitle:
      "Bheka umsebenzi womtholampilo futhi uphathe uhlelo.",
    registerNurse: "Bhalisa Umhlengikazi",
    systemConfig: "Ukucushwa Kwesistimu",
    systemConfiguration: "Ukucushwa Kwesistimu",
    reports: "Imibiko",
    nurseManagement: "Ukuphathwa Kwabahlengikazi",
    nurseActivity: "Umsebenzi Wabahlengikazi",
    registeredNurses: "Abahlengikazi Ababhalisiwe",
    appointments: "Ama-Appointment",
    walkIns: "Iziguli Ezifikile",
    nursesActive: "Abahlengikazi Abasebenzayo",
    noNursesRegistered: "Abekho abahlengikazi ababhalisiwe.",
    generalDepartment: "Jikelele",
    pendingHighPriority: "Okubalulekile Okusalindile",
    pendingHighPriorityAppointments:
      "Ama-Appointment Abalulekile Asalindile",
    status: "Isimo",
    type: "Uhlobo",
    date: "Usuku",
    unknownPatient: "Isiguli Esingaziwa",
    generalConsultation: "Ukubonana Okujwayelekile",
    booked: "Kubhukhiwe",
    noPendingUrgentAppointments:
      "Awekho ama-appointment aphuthumayo asalindile.",
    noUrgentAppointments:
      "Awekho ama-appointment aphuthumayo okwamanje.",
    adminOverviewDescription:
      "Buka umsebenzi womtholampilo, ama-appointment, iziguli ezifikile kanye nabasebenzi.",

    // =========================
    // ADMIN - REGISTER NURSE
    // =========================
    registerNurseTitle: "Bhalisa Umhlengikazi",
    registerNurseSubtitle: "Dala i-akhawunti entsha yomhlengikazi.",
    registerNurseDescription:
      "Bhalisa umhlengikazi ngokufaka imininingwane yakhe kanye nolwazi lomsebenzi.",
    nurseRegistration: "Ukubhaliswa Komhlengikazi",
    nurseAccountDetails: "Imininingwane Ye-Akhawunti Yomhlengikazi",
    nurseStaffId: "I-ID Yomsebenzi Womhlengikazi",
    selectDepartment: "Khetha Umnyango",
    general: "Jikelele",
    maternal: "Omama",
    childHealth: "Impilo Yezingane",
    chronicCare: "Ukunakekelwa Kwezifo Ezingamahlalakhona",
    other: "Okunye",
    minimum6Characters: "Okungenani izinhlamvu eziyisi-6",
    minimumSixCharacters: "Okungenani izinhlamvu eziyisi-6",
    accountRole: "Indima Ye-Akhawunti",
    nurseRole: "Umhlengikazi",
    roleAutomaticallyNurse: "Umhlengikazi",
    nurseRoleAutomaticallySet:
      "Indima ye-akhawunti isethwa ngokuzenzakalelayo ibe Umhlengikazi.",
    registeringNurse: "Kubhaliswa umhlengikazi...",
    noNursesRegisteredYet:
      "Abekho abahlengikazi ababhalisiwe okwamanje.",
    staffIdDuplicate: "Le-ID yomsebenzi isivele ikhona.",
    staffIdExists:
      "Umhlengikazi onale-ID yomsebenzi usevele ekhona.",
    nurseRegistrationSuccess:
      "Umhlengikazi ubhaliswe ngempumelelo.",
    nurseRegisteredSuccessfully:
      "Umhlengikazi ubhaliswe ngempumelelo.",
    unableRegisterNurse:
      "Ayikwazanga ukubhalisa umhlengikazi.",
    unableToRegisterNurse:
      "Ayikwazanga ukubhalisa umhlengikazi.",
    nurseFullNamePlaceholder: "Faka igama eligcwele lomhlengikazi",
    nurseEmailPlaceholder: "Faka i-imeyili yomhlengikazi",
    staffIdPlaceholder: "Faka i-ID yomsebenzi",
    reEnterPassword: "Faka iphasiwedi futhi",
    passwordTooShort:
      "Iphasiwedi kumele ibe nezinhlamvu okungenani eziyisi-6.",
    extendedPermissions:
      "Ivumela ukuphathwa kwama-appointment neziguli ezifikayo.",

    // =========================
    // ADMIN - SYSTEM CONFIGURATION
    // =========================
    configurationTitle: "Ukucushwa",
    systemConfigurationTitle: "Ukucushwa Kwesistimu",
    systemConfigurationSubtitle:
      "Lungisa izilungiselelo zama-appointment neziguli ezifikayo.",
    clinicSettings: "Izilungiselelo Zomtholampilo",
    dailyAppointmentCapacity:
      "Inani Lama-Appointment Ngosuku",
    appointmentCapacity: "Umthamo Wama-Appointment",
    appointmentSlotDuration:
      "Ubude Besikhathi Se-Appointment",
    slotDuration: "Ubude Besikhathi",
    minutesInBrackets: "imizuzu",
    minutes: "imizuzu",
    walkInLimitPerDay:
      "Umkhawulo Weziguli Ezifikayo Ngosuku",
    restrictedWalkInHours:
      "Amahora Avinjelwe Eziguli Ezifikayo",
    walkInRestriction:
      "Umkhawulo Weziguli Ezifikayo",
    walkInTimeExample: "Isibonelo: 08:00 - 16:00",
    nursePermissions: "Izimvume Zomhlengikazi",
    basicAppointmentsOnly:
      "Okuyisisekelo - Ama-Appointment Kuphela",
    extendedAppointmentsWalkIns:
      "Okunwetshiwe - Ama-Appointment Neziguli Ezifikayo",
    fullAppointmentsWalkInsReports:
      "Okugcwele - Ama-Appointment, Iziguli Ezifikayo Nemibiko",
    saveConfiguration: "Gcina Ukucushwa",
    configurationSaved:
      "Ukucushwa kugcinwe ngempumelelo.",
    configurationUpdated:
      "Ukucushwa kubuyekeziwe ngempumelelo.",
    currentConfiguration: "Ukucushwa Kwamanje",
    dailyCapacity: "Umthamo Wansuku Zonke",
    restrictedHours: "Amahora Avinjelwe",
    walkInLimit: "Umkhawulo Weziguli Ezifikayo",
    none: "Akukho",
    basic: "Okuyisisekelo",
    extended: "Okunwetshiwe",
    full: "Okugcwele",
    unableSaveConfiguration:
      "Ayikwazanga ukugcina ukucushwa.",

    // =========================
    // ADMIN - REPORTS
    // =========================
    reportsTitle: "Imibiko",
    reportsAnalytics: "Imibiko Nezibalo",
    reportsAnalyticsSubtitle:
      "Buka izibalo zama-appointment neziguli ezifikayo.",
    reportsOverview: "Ukubuka Kwemibiko",
    weeklyReport: "Umbiko Wamaviki",
    monthlyReport: "Umbiko Wenyanga",
    loadingWeeklyData: "Kulayishwa idatha yeviki...",
    loadingMonthlyData: "Kulayishwa idatha yenyanga...",
    noWeeklyData: "Ayikho idatha yeviki.",
    noMonthlyData: "Ayikho idatha yenyanga.",
    visualAnalytics: "Izibalo Ezibonakalayo",
    noVisualAnalyticsData:
      "Ayikho idatha yezibalo ezibonakalayo.",
    week: "Iviki",
    month: "Inyanga",
    generateWeekly: "Dala Umbiko Wamaviki",
    generateMonthly: "Dala Umbiko Wenyanga",
    reportDate: "Usuku",
    reportAppointments: "Ama-Appointment",
    reportWalkins: "Iziguli Ezifikile",
    reportCompleted: "Okuqediwe",
    reportCancelled: "Okukhanseliwe",
    reportNoShows: "Abangafikanga",
    noReportData: "Ayikho idatha yombiko.",

    // =========================
    // STATUS
    // =========================
    pending: "Kusalindile",
    confirmed: "Kuqinisekisiwe",
    scheduled: "Kuhleliwe",
    cancelled: "Kukhanseliwe",
    completedStatus: "Kuqediwe",
    noShow: "Akafikanga",
    rejected: "Kunqatshiwe",
    open: "Kuvuliwe",
    walkIn: "Isiguli Esifikile",

    // =========================
    // MESSAGES
    // =========================
    requiredFields:
      "Sicela ugcwalise zonke izindawo ezidingekayo.",
    somethingWentWrong: "Kukhona okungahambanga kahle.",
    accessDenied: "Ukufinyelela kunqatshelwe.",
    sessionExpired: "Isikhathi sakho sokungena siphelile.",
    logoutConfirmation:
      "Uyaqiniseka ukuthi ufuna ukuphuma?",

    // =========================
    // LANGUAGE
    // =========================
    english: "English",
    isizulu: "isiZulu",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("clinic_lang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("clinic_lang", language);
  }, [language]);

  const changeLanguage = (lang) => {
    if (lang === "en" || lang === "zu") {
      setLanguage(lang);
      localStorage.setItem("clinic_lang", lang);
    }
  };

  const t = (key) => {
    return (
      translations[language]?.[key] ||
      translations.en[key] ||
      key
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};

export default LanguageContext;