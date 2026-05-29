import React, { useState, useEffect, useRef } from 'react';

// ============================================================
// PREMIUM HELPLINE SERVICE PROVIDERS DATABASE
// ============================================================
const SERVICE_PROVIDERS = [
  {
    icon: "⚡",
    category: "ઇલેક્ટ્રિશિયન",
    providers: [
      { name: "રમેશ ઇ. સર્વિ.", phone: "9825001234", rating: "4.8", experience: "12 વર્ષ" },
      { name: "મહેશ ઇ. સ.", phone: "9712345678", rating: "4.6", experience: "8 વર્ષ" },
      { name: "જયેશ પટેલ", phone: "9898009900", rating: "4.9", experience: "15 વર્ષ" }
    ]
  },
  {
    icon: "🔧",
    category: "પ્લમ્બર",
    providers: [
      { name: "સુ. પ્લ. સ.", phone: "9824100001", rating: "4.7", experience: "10 વર્ષ" },
      { name: "વિ. ફ.-ટ.", phone: "9737212121", rating: "4.5", experience: "7 વર્ષ" },
      { name: "અ. પ.-ક.", phone: "9909882211", rating: "4.8", experience: "14 વર્ષ" }
    ]
  },
  {
    icon: "🪚",
    category: "કાર્પેન્ટર / સુથાર",
    providers: [
      { name: "ભૂ. ફ. .", phone: "9825991100", rating: "4.9", experience: "20 વર્ષ" },
      { name: "ધ્ર. વૂ.", phone: "9712009988", rating: "4.6", experience: "9 વર્ષ" },
      { name: "કાંતિ સ.", phone: "9898765432", rating: "4.7", experience: "18 વર્ષ" }
    ]
  },
  {
    icon: "🚗",
    category: "ડ્રાઈવર / ચાલક",
    providers: [
      { name: "અ. ડ્ર.", phone: "9824777333", rating: "4.8", experience: "6 વર્ષ" },
      { name: "પ્ર. ટ્ર.", phone: "9737555000", rating: "4.7", experience: "11 વર્ષ" },
      { name: "મ. ચ.", phone: "9909111222", rating: "4.9", experience: "8 વર્ષ" }
    ]
  },
  {
    icon: "🪟",
    category: "ફેબ્રિ. & કાચ",
    providers: [
      { name: "ઇ. ફ. .", phone: "9825444556", rating: "4.7", experience: "13 વર્ષ" },
      { name: "ગ.-ટ. .", phone: "9712988712", rating: "4.5", experience: "7 વર્ષ" },
      { name: "ગ. વ.", phone: "9898012098", rating: "4.8", experience: "16 વર્ષ" }
    ]
  },
  {
    icon: "🧹",
    category: "ઘરકામ / મેઇડ",
    providers: [
      { name: "સ્વ. ક્લ.", phone: "9824323232", rating: "4.9", experience: "5 વર્ષ" },
      { name: "ઉ. હો.-ક.", phone: "9737234567", rating: "4.6", experience: "8 વર્ષ" },
      { name: "ભ. ક્લ.", phone: "9909654321", rating: "4.7", experience: "4 વર્ષ" }
    ]
  },
  {
    icon: "🎨",
    category: "પેઇ. / કલ.",
    providers: [
      { name: "દ. ક. .", phone: "9825870001", rating: "4.8", experience: "17 વર્ષ" },
      { name: "ક. ક. .", phone: "9712876543", rating: "4.6", experience: "10 વર્ષ" },
      { name: "ર. ક. .", phone: "9898543210", rating: "4.9", experience: "22 વર્ષ" }
    ]
  }
];

// ============================================================
// DEFAULT SOCIETY DATA
// ============================================================
const DEFAULT_SOCIETY_DATA = {
  societyInfo: {
    name: "સનરાઇઝ એ. (Sunrise Apartment)",
    address: "સાકાર રોડ, નવ.",
    city: "અમ.",
    state: "Gujarat",
    totalFlats: 12,
    adminName: "Rajesh Patel",
    adminPhone: "9825001234",
    registrationDate: "15 જ. ૨૦૨૫",
    maintenanceAmount: 2500,
    dueDate: "10",
    bankName: "State Bank of India",
    accountNumber: "3456 7890 1234",
    ifscCode: "SBIN0001234",
    upiId: "sunrise@sbi",
    upiName: "Sunrise Apartment Society",
    emergencyNumbers: [
      { label: "ફ. સ્ટ.", number: "101", icon: "local_fire_department" },
      { label: "પો. સ્ટ.", number: "100", icon: "local_police" },
      { label: "એ. .", number: "108", icon: "emergency" },
      { label: "ઇ.ઇ.", number: "1912", icon: "electrical_services" },
    ]
  },
  flats: [
    { id: "A-101", ownerName: "Rajesh Patel", tenantName: null, phone: "9825001234", status: "Paid", amountPaid: 2500, arrears: 0, payDate: "05-05-2026", payMode: "UPI" },
    { id: "A-102", ownerName: "Meena Shah", tenantName: "Nitin Joshi", phone: "9712345678", status: "Unpaid", amountPaid: 0, arrears: 5000, payDate: null, payMode: null },
    { id: "A-103", ownerName: "Bharat Desai", tenantName: null, phone: "9898765432", status: "Partial", amountPaid: 1000, arrears: 1500, payDate: "02-05-2026", payMode: "Cash" },
    { id: "B-101", ownerName: "Suresh Kumar", tenantName: null, phone: "9824100001", status: "Paid", amountPaid: 2500, arrears: 0, payDate: "07-05-2026", payMode: "NEFT" },
    { id: "B-102", ownerName: "Kavita Mehta", tenantName: "Hardik Thaker", phone: "9737212121", status: "Unpaid", amountPaid: 0, arrears: 2500, payDate: null, payMode: null },
    { id: "B-103", ownerName: "Dinesh Praj.", tenantName: null, phone: "9909882211", status: "Advance", amountPaid: 5000, arrears: 0, payDate: "01-04-2026", payMode: "UPI" },
    { id: "C-101", ownerName: "Priya Jain", tenantName: null, phone: "9825991100", status: "Paid", amountPaid: 2500, arrears: 0, payDate: "09-05-2026", payMode: "UPI" },
    { id: "C-102", ownerName: "Mahesh Trivedi", tenantName: "Rita Chauhan", phone: "9712009988", status: "Unpaid", amountPaid: 0, arrears: 7500, payDate: null, payMode: null },
    { id: "C-103", ownerName: "Jayesh Modi", tenantName: null, phone: "9898009900", status: "Paid", amountPaid: 2500, arrears: 0, payDate: "04-05-2026", payMode: "Cash" },
    { id: "D-101", ownerName: "Anita Parmar", tenantName: null, phone: "9824777333", status: "Partial", amountPaid: 500, arrears: 2000, payDate: "06-05-2026", payMode: "Cash" },
    { id: "D-102", ownerName: "Vikram Sol.", tenantName: null, phone: "9737555000", status: "Paid", amountPaid: 2500, arrears: 0, payDate: "03-05-2026", payMode: "UPI" },
    { id: "D-103", ownerName: "Geeta Rana", tenantName: "Amit Rathod", phone: "9909111222", status: "Unpaid", amountPaid: 0, arrears: 2500, payDate: null, payMode: null },
  ],
  announcements: [
    { id: 1, title: "સો. ક્લ. ડ્.", body: "આ રવ. સ. ૮ વ. સૌ ભ. થઈ ક. .", date: "25-05-2026", priority: "high", author: "Rajesh Patel (Admin)" },
    { id: 2, title: "CCTV અ.", body: "2 જૂ. ૨૦૨૬ CCTV ટ. ટ. ૧-૫ PM.", date: "22-05-2026", priority: "medium", author: "Rajesh Patel (Admin)" },
    { id: 3, title: "ઉ.: પ. ટ.", body: "ઉ. ૧૦ AM - ૫ PM. .", date: "18-05-2026", priority: "low", author: "Admin" }
  ],
  expenses: [
    { id: 1, desc: "ગ. ક. મ.", category: "Maintenance", amount: 15000, date: "10-05-2026", paidTo: "Clean City Services", payMode: "NEFT" },
    { id: 2, desc: "LED Light Upgrade", category: "Electrical", amount: 8500, date: "05-05-2026", paidTo: "Modern Electricals", payMode: "UPI" },
    { id: 3, desc: "Watchman Salary", category: "Salary", amount: 12000, date: "01-05-2026", paidTo: "Ramu Watchman", payMode: "Cash" },
  ],
  complaints: [
    { id: 1, flatId: "A-102", category: "Plumbing", desc: "3rd fl. pipe leak", status: "Open", reportedDate: "20-05-2026" },
    { id: 2, flatId: "B-101", category: "Electrical", desc: "Lobby light fault", status: "Resolved", reportedDate: "15-05-2026" },
  ],
  sinkingFunds: [
    { id: 1, name: "ટ. ર.", target: 200000, collected: 45000, color: "from-blue-400 to-indigo-500" },
    { id: 2, name: "P. R.", target: 80000, collected: 62000, color: "from-emerald-400 to-teal-500" },
    { id: 3, name: "ઇ. .", target: 50000, collected: 18000, color: "from-amber-400 to-orange-500" },
  ],
  polls: [
    { id: 1, question: "Parking Time?", options: ["7 AM", "6 AM", "8 AM"], votes: [4, 7, 1], deadline: "30-05-2026", isActive: true },
    { id: 2, question: "Gym Installation?", options: ["Yes", "No"], votes: [9, 3], deadline: "25-05-2026", isActive: false },
  ],
  agmMeetings: [
    { id: 1, date: "15 Oct 2025", time: "11:00 AM", attendanceCount: 10, agenda: "1. Annual Budget\n2. CCTV Install\n3. Watchman salary", minutes: "AGM 2025:\n1. Budget approved: Rs 3.5L\n2. CCTV approved\n3. Salary: Rs 12000" }
  ],
  pendingRequests: [
    { id: "REQ001", name: "Hetal Gajjar", uniqueId: "GJ-APP-HG-2026M1234", phone: "9825111222", flatId: "E-201", requestedAt: "2026-05-24" },
    { id: "REQ002", name: "Jigar Raval", uniqueId: "GJ-APP-JR-2026M5678", phone: "9712888999", flatId: "E-202", requestedAt: "2026-05-25" },
  ],
  pendingPayments: [
    { id: "PAY001", flatId: "A-102", flatOwner: "Meena Shah", month: "એ. 2026", amount: "2500", utrId: "UTR421897654321", screenshot: "GPay_Receipt_789.png", status: "Pending", submittedAt: "25/5/2026, 10:30" },
    { id: "PAY002", flatId: "C-102", flatOwner: "Mahesh Trivedi", month: "મે 2026", amount: "2500", utrId: "UTR9988776655", screenshot: "PhonePe_Rcpt_456.jpg", status: "Pending", submittedAt: "26/5/2026, 09:15" },
  ]
};

const GUJARAT_CITIES_SOCIETIES = {
  "અમ.": ["સ. A. (Nav.)", "ગ્રી. C. (Bo.)", "Royal Res. (SG Hwy)", "Om Shanti (Man.)"],
  "સ.": ["ઉ. P. (Adajan)", "ધ. P. (Varachha)", "New Star (Katargam)"],
  "વ.": ["Sunrise Heights (Gotri)", "Nav Jeevan (Alkapuri)"],
  "ર.": ["Jay Shreeji (R. Baug)", "S. R."],
  "ભ.": ["Vijay C.", "ક. ."],
  "ગ.": ["Sec-21 Apt.", "InfoCity Res."],
};

// Unique ID Generator
const generateUniqueId = (name, year, month) => {
  const initials = name.trim().split(' ').map(w => w[0]?.toUpperCase() || 'X').join('').slice(0, 2);
  const rand = Math.floor(1000 + Math.random() * 8999);
  return `GJ-APP-${initials}-${year}M${rand}`;
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function MariSociety() {
  const canvasRef = useRef(null);

  // Load persisted data from localStorage
  const [society, setSociety] = useState(() => {
    try {
      const saved = localStorage.getItem('otlo_society_data');
      return saved ? { ...DEFAULT_SOCIETY_DATA, ...JSON.parse(saved) } : DEFAULT_SOCIETY_DATA;
    } catch { return DEFAULT_SOCIETY_DATA; }
  });

  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('otlo_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  // UI state
  const [isAdmin, setIsAdmin] = useState(false);
  const [subTab, setSubTab] = useState("dashboard");
  const [showJoinFlow, setShowJoinFlow] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(!userProfile);

  // Onboarding form
  const [onboardName, setOnboardName] = useState("");
  const [onboardPhone, setOnboardPhone] = useState("");

  // Join flow
  const [joinStep, setJoinStep] = useState(1);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSociety, setSelectedSociety] = useState("");
  const [selectedFlat, setSelectedFlat] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [societySearch, setSocietySearch] = useState("");

  // Admin invite
  const [invitePhone, setInvitePhone] = useState("");
  const [inviteUniqueId, setInviteUniqueId] = useState("");
  const [inviteFlatId, setInviteFlatId] = useState("");

  // Setup
  const [setupBlocks, setSetupBlocks] = useState("A, B, C, D");
  const [setupFloors, setSetupFloors] = useState(3);
  const [setupFlatsPerFloor, setSetupFlatsPerFloor] = useState(3);

  // Payment modal (admin pay flat directly)
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPayFlat, setSelectedPayFlat] = useState(null);
  const [payAmount, setPayAmount] = useState(2500);
  const [payMode, setPayMode] = useState("Cash");
  const [payNote, setPayNote] = useState("");

  // UPI edit modal
  const [showEditUpiModal, setShowEditUpiModal] = useState(false);
  const [upiIdInput, setUpiIdInput] = useState("");
  const [upiNameInput, setUpiNameInput] = useState("");

  // Expense form
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpDesc, setNewExpDesc] = useState("");
  const [newExpAmount, setNewExpAmount] = useState("");
  const [newExpCategory, setNewExpCategory] = useState("Maintenance");
  const [newExpPayMode, setNewExpPayMode] = useState("Cash");
  const [newExpPaidTo, setNewExpPaidTo] = useState("");

  // Announcement form
  const [showAddAnn, setShowAddAnn] = useState(false);
  const [newAnnTitle, setNewAnnTitle] = useState("");
  const [newAnnBody, setNewAnnBody] = useState("");
  const [newAnnPriority, setNewAnnPriority] = useState("medium");

  // Poll form
  const [showAddPoll, setShowAddPoll] = useState(false);
  const [newPollQ, setNewPollQ] = useState("");
  const [newPollOptions, setNewPollOptions] = useState("Yes\nNo");
  const [newPollDays, setNewPollDays] = useState(5);

  // Complaint form
  const [showAddComplaint, setShowAddComplaint] = useState(false);
  const [newCompCat, setNewCompCat] = useState("Plumbing");
  const [newCompDesc, setNewCompDesc] = useState("");
  const [newCompFlat, setNewCompFlat] = useState("A-101");

  const [votedPolls, setVotedPolls] = useState({});

  // Emergency
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);
  const [pendingEmergencyAlert, setPendingEmergencyAlert] = useState("");
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(5);
  const [countdownIntervalId, setCountdownIntervalId] = useState(null);

  // ---- NEW: Payment Verification State ----
  const [showReportPaymentModal, setShowReportPaymentModal] = useState(false);
  const [reportFlatId, setReportFlatId] = useState("");
  const [reportMonth, setReportMonth] = useState("મે ૨૦૨૬");
  const [reportAmount, setReportAmount] = useState("2500");
  const [reportUtr, setReportUtr] = useState("");
  const [reportScreenshot, setReportScreenshot] = useState("GPay_Receipt_345.png");

  // Admin receipt view modal
  const [showReceiptViewModal, setShowReceiptViewModal] = useState(false);
  const [selectedPaymentDetail, setSelectedPaymentDetail] = useState(null);

  // Requests sub-tab
  const [requestsSubTab, setRequestsSubTab] = useState("joins");

  // Call simulator
  const [activeCallProvider, setActiveCallProvider] = useState(null);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // ---- Call timer effect ----
  useEffect(() => {
    let connTimer, durationTimer;
    if (activeCallProvider) {
      connTimer = setTimeout(() => setIsCallConnected(true), 2500);
      durationTimer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setIsCallConnected(false);
      setCallDuration(0);
    }
    return () => {
      clearTimeout(connTimer);
      clearInterval(durationTimer);
    };
  }, [activeCallProvider]);

  // Persist society data
  useEffect(() => {
    localStorage.setItem('otlo_society_data', JSON.stringify(society));
  }, [society]);

  const triggerToast = (msg) => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: msg } }));
  };

  const maskPhoneNumber = (phone) => {
    if (!phone) return "";
    const c = phone.replace(/\D/g, "");
    return c.length >= 10 ? c.slice(0, 3) + "*****" + c.slice(-2) : phone;
  };

  const getFundPercentage = (collected, target) =>
    target > 0 ? Math.min(100, Math.round((collected / target) * 100)) : 0;

  // ---- Handler: Approve/Reject Payment ----
  const handleApprovePayment = (payId) => {
    const payReq = (society.pendingPayments || []).find(p => p.id === payId);
    if (!payReq) return;
    setSociety(prev => ({
      ...prev,
      flats: prev.flats.map(f => f.id === payReq.flatId
        ? { ...f, status: "Paid", amountPaid: f.amountPaid + parseFloat(payReq.amount), payDate: new Date().toLocaleDateString('gu-IN'), payMode: "UPI (App)", arrears: Math.max(0, f.arrears - parseFloat(payReq.amount)) }
        : f),
      pendingPayments: prev.pendingPayments.map(p => p.id === payId ? { ...p, status: "Approved" } : p)
    }));
    triggerToast(`✅ ફ્લેટ ${payReq.flatId} નું ₹${payReq.amount} મંજૂર!`);
  };

  const handleRejectPayment = (payId) => {
    setSociety(prev => ({
      ...prev,
      pendingPayments: prev.pendingPayments.map(p => p.id === payId ? { ...p, status: "Rejected" } : p)
    }));
    triggerToast("❌ પેમ. ના-મ.");
  };

  // ---- Handler: Approve/Reject Join Request ----
  const handleApproveRequest = (reqId) => {
    const req = (society.pendingRequests || []).find(r => r.id === reqId);
    if (!req) return;
    setSociety(prev => ({
      ...prev,
      pendingRequests: (prev.pendingRequests || []).filter(r => r.id !== reqId),
      flats: prev.flats.map(f => f.id === req.flatId ? { ...f, ownerName: req.name, phone: req.phone } : f)
    }));
    triggerToast(`✅ ${req.name} ને ${req.flatId} માં મ.!`);
  };

  const handleRejectRequest = (reqId) => {
    setSociety(prev => ({ ...prev, pendingRequests: (prev.pendingRequests || []).filter(r => r.id !== reqId) }));
    triggerToast("❌ વ. ના-મ.");
  };

  // ---- Handler: Direct Admin Pay ----
  const handlePayFlat = (e) => {
    e.preventDefault();
    if (!selectedPayFlat) return;
    setSociety(prev => ({
      ...prev,
      flats: prev.flats.map(f => f.id === selectedPayFlat.id
        ? { ...f, status: parseFloat(payAmount) >= 2500 ? "Paid" : "Partial", amountPaid: f.amountPaid + parseFloat(payAmount), arrears: Math.max(0, f.arrears - parseFloat(payAmount)), payDate: new Date().toLocaleDateString('gu-IN'), payMode: payMode }
        : f)
    }));
    setShowPayModal(false);
    triggerToast(`✅ ₹${parseFloat(payAmount).toLocaleString('en-IN')} ${selectedPayFlat.id} ની ચ.!`);
  };

  // ---- Canvas Receipt ----
  const generateCanvasReceipt = (flatId, amount, mode) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600; canvas.height = 400;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 600, 400);
    ctx.fillStyle = '#d97706'; ctx.fillRect(0, 0, 600, 80);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 28px sans-serif';
    ctx.fillText('SUNRISE APT. RECEIPT', 20, 50);
    ctx.fillStyle = '#000'; ctx.font = '18px sans-serif';
    ctx.fillText(`Flat: ${flatId}`, 20, 120);
    ctx.fillText(`Amount: Rs. ${amount}`, 20, 155);
    ctx.fillText(`Mode: ${mode}`, 20, 190);
    ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 20, 225);
    ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 1;
    ctx.strokeRect(10, 95, 580, 285);
    const link = document.createElement('a');
    link.download = `receipt_${flatId}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const downloadUpiQrCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 500; canvas.height = 300;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fef8f1'; ctx.fillRect(0, 0, 500, 300);
    ctx.fillStyle = '#d97706'; ctx.font = 'bold 20px sans-serif';
    ctx.fillText('UPI QR – ' + society.societyInfo.upiName, 20, 40);
    ctx.fillStyle = '#333'; ctx.font = '16px sans-serif';
    ctx.fillText('UPI ID: ' + society.societyInfo.upiId, 20, 80);
    ctx.fillText('Maintenance: Rs. ' + society.societyInfo.maintenanceAmount, 20, 115);
    const link = document.createElement('a');
    link.download = 'society_upi_qr.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // ---- Emergency Alert ----
  const triggerEmergencyAlert = (msg) => {
    setPendingEmergencyAlert(msg);
    setShowEmergencyConfirm(true);
  };
  const cancelEmergencyConfirm = () => { setShowEmergencyConfirm(false); setPendingEmergencyAlert(""); };
  const startCountdown = () => {
    setShowEmergencyConfirm(false);
    setCountdownActive(true);
    setCountdownSeconds(5);
    const id = setInterval(() => {
      setCountdownSeconds(s => {
        if (s <= 1) {
          clearInterval(id);
          setCountdownActive(false);
          const text = encodeURIComponent(pendingEmergencyAlert);
          window.open(`https://api.whatsapp.com/send?text=${text}`);
          triggerToast("🚨 E. alert sent!");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    setCountdownIntervalId(id);
  };
  const cancelCountdown = () => {
    if (countdownIntervalId) clearInterval(countdownIntervalId);
    setCountdownActive(false);
    triggerToast("✅ Alert cancelled.");
  };

  useEffect(() => {
    return () => { if (countdownIntervalId) clearInterval(countdownIntervalId); };
  }, [countdownIntervalId]);

  // ---- Setup: Generate flat structure ----
  const handleGenerateFlatStructure = (e) => {
    e.preventDefault();
    const blocks = setupBlocks.split(',').map(b => b.trim()).filter(Boolean);
    const newFlats = [];
    blocks.forEach(block => {
      for (let floor = 1; floor <= parseInt(setupFloors); floor++) {
        for (let unit = 1; unit <= parseInt(setupFlatsPerFloor); unit++) {
          newFlats.push({
            id: `${block}-${floor}0${unit}`,
            ownerName: "---",
            tenantName: null,
            phone: "",
            status: "Unpaid",
            amountPaid: 0,
            arrears: society.societyInfo.maintenanceAmount,
            payDate: null,
            payMode: null
          });
        }
      }
    });
    setSociety(prev => ({ ...prev, flats: newFlats }));
    triggerToast(`✅ ${newFlats.length} flats generated!`);
  };

  // ---- Onboarding submit ----
  const handleOnboardSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    const uid = generateUniqueId(onboardName, now.getFullYear(), now.getMonth() + 1);
    const profile = { name: onboardName, phone: onboardPhone, uniqueId: uid, joinedAt: now.toISOString(), flatId: null };
    setUserProfile(profile);
    localStorage.setItem('otlo_user_profile', JSON.stringify(profile));
    setShowOnboarding(false);
  };

  // Totals
  const totalAmountCollected = society.flats.reduce((s, f) => s + (f.amountPaid || 0), 0);
  const totalArrears = society.flats.reduce((s, f) => s + (f.arrears || 0), 0);
  const paidCount = society.flats.filter(f => f.status === 'Paid' || f.status === 'Advance').length;

  // ============================================================
  // ONBOARDING SCREEN
  // ============================================================
  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fef8f1] via-white to-amber-50/30 dark:from-[#0d0805] dark:via-stone-950 dark:to-stone-900 flex items-center justify-center p-6">
        <div className="max-w-sm w-full space-y-8">
          <div className="text-center space-y-2">
            <div className="h-20 w-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/25">
              <span className="text-4xl">🏠</span>
            </div>
            <h1 className="font-gujarati font-black text-2xl text-stone-850 dark:text-stone-100">મારી સોસાયટી</h1>
            <p className="font-gujarati text-sm text-stone-450">ગુજરાતની સ્માર્ટ સોસાયટી મેનેજ.</p>
          </div>
          <form onSubmit={handleOnboardSubmit} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2.5rem] p-8 space-y-5 shadow-xl">
            <div className="space-y-1.5">
              <label className="font-gujarati font-bold text-xs text-stone-555">નામ *</label>
              <input type="text" value={onboardName} onChange={e => setOnboardName(e.target.value)} placeholder="Rajesh Patel" required className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface" />
            </div>
            <div className="space-y-1.5">
              <label className="font-gujarati font-bold text-xs text-stone-555">મોબાઈલ નંબર *</label>
              <input type="tel" value={onboardPhone} onChange={e => setOnboardPhone(e.target.value)} placeholder="9825XXXXXX" required pattern="[6-9][0-9]{9}" className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-headline text-sm focus:outline-none focus:border-primary text-on-surface" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white py-4 rounded-2xl font-gujarati font-black text-sm shadow-lg active:scale-95 transition-transform cursor-pointer">
              શરૂ કરો ➔
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================
  // JOIN FLOW SCREEN
  // ============================================================
  if (showJoinFlow) {
    const filteredCities = Object.keys(GUJARAT_CITIES_SOCIETIES).filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));
    const societies = selectedCity ? GUJARAT_CITIES_SOCIETIES[selectedCity] || [] : [];
    const filteredSocieties = societies.filter(s => s.toLowerCase().includes(societySearch.toLowerCase()));
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fef8f1] via-white to-amber-50/30 dark:from-[#0d0805] dark:via-stone-950 dark:to-stone-900 flex items-center justify-center p-6">
        <div className="max-w-sm w-full space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => { setShowJoinFlow(false); setJoinStep(1); setSelectedCity(""); setSelectedSociety(""); }} className="h-10 w-10 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-center cursor-pointer">
              <span className="material-symbols-outlined text-sm text-stone-600 dark:text-stone-300">arrow_back</span>
            </button>
            <h2 className="font-gujarati font-black text-lg text-stone-850 dark:text-stone-100">
              {joinStep === 1 ? "🏙️ શહેર પસંદ કરો" : joinStep === 2 ? "🏢 સોસાયટી પસંદ કરો" : "🏠 ફ્લેટ પસંદ કરો"}
            </h2>
          </div>
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2.5rem] p-6 space-y-4 shadow-xl">
            {joinStep === 1 && (
              <>
                <input value={citySearch} onChange={e => setCitySearch(e.target.value)} placeholder="શહેર શોધો..." className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface" />
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredCities.map(city => (
                    <button key={city} onClick={() => { setSelectedCity(city); setJoinStep(2); setCitySearch(""); }} className="w-full text-left px-4 py-3 bg-stone-50 dark:bg-stone-950 hover:bg-amber-50 dark:hover:bg-amber-950/20 border border-stone-200 dark:border-stone-800 rounded-2xl font-gujarati text-sm transition-all cursor-pointer text-on-surface">
                      🏙️ {city}
                    </button>
                  ))}
                </div>
              </>
            )}
            {joinStep === 2 && (
              <>
                <p className="font-gujarati text-xs text-stone-400">🏙️ {selectedCity}</p>
                <input value={societySearch} onChange={e => setSocietySearch(e.target.value)} placeholder="સોસાયટી શોધો..." className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface" />
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredSocieties.map(soc => (
                    <button key={soc} onClick={() => { setSelectedSociety(soc); setJoinStep(3); setSocietySearch(""); }} className="w-full text-left px-4 py-3 bg-stone-50 dark:bg-stone-950 hover:bg-amber-50 dark:hover:bg-amber-950/20 border border-stone-200 dark:border-stone-800 rounded-2xl font-gujarati text-sm transition-all cursor-pointer text-on-surface">
                      🏢 {soc}
                    </button>
                  ))}
                </div>
              </>
            )}
            {joinStep === 3 && (
              <>
                <p className="font-gujarati text-xs text-stone-400">🏢 {selectedSociety}</p>
                <select value={selectedFlat} onChange={e => setSelectedFlat(e.target.value)} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface cursor-pointer">
                  <option value="">ફ્લેટ પસંદ કરો</option>
                  {society.flats.map(f => <option key={f.id} value={f.id}>{f.id} – {f.ownerName}</option>)}
                </select>
                <button
                  onClick={() => {
                    if (!selectedFlat) { triggerToast("ફ્લેટ પસંદ કરો!"); return; }
                    const newReq = { id: `REQ${Date.now()}`, name: userProfile?.name || "User", uniqueId: userProfile?.uniqueId || "GJ-APP-XX-0000M0000", phone: userProfile?.phone || "", flatId: selectedFlat, requestedAt: new Date().toISOString().slice(0, 10) };
                    setSociety(prev => ({ ...prev, pendingRequests: [...(prev.pendingRequests || []), newReq] }));
                    setShowJoinFlow(false);
                    setJoinStep(1);
                    triggerToast("✅ વિનંતી મોકલાઈ!");
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-2xl font-gujarati font-black text-sm shadow-md active:scale-95 transition-transform cursor-pointer"
                >
                  વિનંતી મોકલો ➔
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN APP RENDER
  // ============================================================
  return (
    <div className="space-y-6 pb-8">
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="bg-gradient-to-br from-[#1c0a00] to-[#3b1a00] text-white rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden border border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-0.5 rounded-full text-[10px] font-black uppercase inline-block">
              {isAdmin ? "🛡️ Admin View" : "👤 Member View"}
            </span>
            <h2 className="font-gujarati font-black text-2xl text-white">{society.societyInfo.name}</h2>
            <p className="font-gujarati text-xs text-amber-100/70">{society.societyInfo.address} · {society.societyInfo.city}</p>
          </div>
          <div className="flex items-center gap-2">
            {!userProfile?.flatId && (
              <button onClick={() => setShowJoinFlow(true)} className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-200 px-3 py-1.5 rounded-xl font-gujarati font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer">
                <span className="material-symbols-outlined text-sm">group_add</span>
                સોસાયટી જોઈન કરો?
              </button>
            )}
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`px-4 py-2 rounded-xl font-gujarati font-black text-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${isAdmin ? 'bg-amber-500 text-white shadow-md' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            >
              <span className="material-symbols-outlined text-sm">{isAdmin ? 'admin_panel_settings' : 'person'}</span>
              {isAdmin ? "Admin" : "Member"}
            </button>
          </div>
        </div>
        {userProfile && (
          <div className="relative z-10 mt-4 bg-white/8 border border-white/10 rounded-2xl px-4 py-2 flex items-center justify-between">
            <div>
              <p className="font-gujarati text-[10px] text-amber-300/70">logged in as</p>
              <p className="font-gujarati font-bold text-xs text-white">{userProfile.name}</p>
            </div>
            <p className="font-headline text-[10px] text-amber-300/80 tracking-wider">{userProfile.uniqueId}</p>
          </div>
        )}
      </div>

      {/* Sub-tab navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { id: "dashboard", label: "📊 ડેશબોર્ડ", icon: "dashboard" },
          { id: "maintenance", label: "💰 મેઈન્ટેનન્સ", icon: "payments" },
          { id: "expenses", label: "📋 સોસાયટી ખર્ચ", icon: "receipt_long" },
          { id: "announcements", label: "📢 જાહેરાતો", icon: "campaign" },
          { id: "complaints", label: "⚠️ ફરિયાદો", icon: "report_problem" },
          { id: "polls", label: "🗳️ લોકમત", icon: "how_to_vote" },
          { id: "agm", label: "📅 AGM મીટિંગ", icon: "event_note" },
          { id: "directory", label: "📞 સભ્યોની યાદી", icon: "contact_page" },
          { id: "helpline", label: "🛠️ હેલ્પલાઇન", icon: "support_agent" },
          ...(isAdmin ? [
            { id: "requests", label: "⏳ વિનંતીઓ", icon: "group_add" },
            { id: "setup", label: "🏗️ સેટઅપ", icon: "construction" }
          ] : [])
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`flex-shrink-0 px-4 py-2.5 rounded-full font-gujarati font-bold text-xs border transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
              subTab === t.id
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-850 text-stone-600 dark:text-stone-400'
            }`}
          >
            <span className="material-symbols-outlined text-sm">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ========================================================
          1. DASHBOARD
          ======================================================== */}
      {subTab === "dashboard" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-500/10 border border-emerald-500/25 p-6 rounded-[2rem] shadow-sm flex flex-col justify-between gap-4">
              <span className="material-symbols-outlined text-emerald-600 text-4xl">savings</span>
              <div>
                <p className="font-gujarati text-[10px] text-stone-400 uppercase font-black tracking-widest">કુલ ઉઘરાણું</p>
                <h3 className="font-headline font-black text-3xl text-emerald-650 mt-1">₹ {totalAmountCollected.toLocaleString('en-IN')}</h3>
              </div>
            </div>
            <div className="bg-rose-500/10 border border-rose-500/25 p-6 rounded-[2rem] shadow-sm flex flex-col justify-between gap-4">
              <span className="material-symbols-outlined text-rose-600 text-4xl">hourglass_empty</span>
              <div>
                <p className="font-gujarati text-[10px] text-stone-400 uppercase font-black tracking-widest">કુલ બાકી</p>
                <h3 className="font-headline font-black text-3xl text-rose-650 mt-1">₹ {totalArrears.toLocaleString('en-IN')}</h3>
              </div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/25 p-6 rounded-[2rem] shadow-sm flex flex-col justify-between gap-4">
              <span className="material-symbols-outlined text-amber-600 text-4xl">apartment</span>
              <div>
                <p className="font-gujarati text-[10px] text-stone-400 uppercase font-black tracking-widest">ભરેલા ફ્લેટ્સ / કુલ</p>
                <h3 className="font-headline font-black text-3xl text-amber-650 mt-1">{paidCount} / {society.flats.length}</h3>
              </div>
            </div>
          </div>

          {/* Emergency Alerts */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2.5rem] p-6 shadow-sm space-y-4">
            <h3 className="font-gujarati font-black text-base text-stone-850 dark:text-stone-100">🚨 ઇમરજન્સી એલર્ટ</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(society.societyInfo.emergencyNumbers || []).map(e => (
                <button key={e.label} onClick={() => triggerEmergencyAlert(`🚨 Emergency: ${e.label} – ${e.number}! Please respond immediately.`)} className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 text-rose-700 rounded-2xl p-3 text-center space-y-1 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-all active:scale-95 cursor-pointer">
                  <span className="material-symbols-outlined text-xl">{e.icon}</span>
                  <p className="font-gujarati text-[10px] font-black">{e.label}</p>
                  <p className="font-headline font-black text-sm">{e.number}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Sinking Funds */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2.5rem] p-6 shadow-sm space-y-4">
            <h3 className="font-gujarati font-black text-base text-stone-850 dark:text-stone-100">🏦 સિંકિંગ ફંડ</h3>
            <div className="space-y-4">
              {society.sinkingFunds.map(fund => {
                const pct = getFundPercentage(fund.collected, fund.target);
                return (
                  <div key={fund.id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="font-gujarati text-stone-700 dark:text-stone-300">{fund.name}</span>
                      <span className="font-headline text-[10px] text-stone-400">₹ {fund.collected.toLocaleString('en-IN')} / {fund.target.toLocaleString('en-IN')} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-stone-100 dark:bg-stone-950 h-3 rounded-full overflow-hidden border border-black/5">
                      <div className={`h-full bg-gradient-to-r ${fund.color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bank & UPI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#2b1400] text-amber-100 rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden border border-amber-500/20 flex flex-col justify-between min-h-[220px]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-800/10 via-[#2b1400]/50 to-stone-950 pointer-events-none"></div>
              <div className="relative z-10 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-0.5 rounded-full text-[10px] font-black uppercase inline-block">Bank A/C</span>
                  <h4 className="font-gujarati font-black text-xl text-white mt-1">{society.societyInfo.bankName}</h4>
                  <p className="font-headline text-xs opacity-75">A/C: {society.societyInfo.accountNumber} · IFSC: {society.societyInfo.ifscCode}</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/25 px-5 py-3 rounded-2xl">
                  <p className="font-gujarati text-[9px] text-amber-300">માસિક મેઈન્ટેનન્સ</p>
                  <h4 className="font-headline font-black text-2xl text-white mt-0.5">₹ {society.societyInfo.maintenanceAmount}</h4>
                  <p className="font-gujarati text-[9px] text-amber-300/70">{society.societyInfo.dueDate} તારીખ સુધીમાં</p>
                </div>
              </div>
              {isAdmin && (
                <button onClick={() => { setUpiIdInput(society.societyInfo.upiId); setUpiNameInput(society.societyInfo.upiName); setShowEditUpiModal(true); }} className="relative z-10 mt-4 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl font-gujarati font-bold text-[11px] active:scale-95 transition-all shadow-md self-start cursor-pointer">
                  ⚙️ UPI સેટ કરો
                </button>
              )}
            </div>
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2.5rem] p-6 shadow-sm flex flex-col justify-between gap-4 min-h-[220px]">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-gujarati font-black text-base text-stone-850 dark:text-stone-100">UPI QR</h4>
                  <p className="font-gujarati text-xs text-stone-455 mt-0.5">ઝડપી પેમેન્ટ</p>
                </div>
                <span className="material-symbols-outlined text-primary text-2xl">qr_code_2</span>
              </div>
              <div className="bg-[#fef8f1] dark:bg-stone-950 p-4 rounded-2xl border border-primary/5 flex items-center gap-4">
                <div className="h-14 w-14 bg-white rounded-lg p-1 border border-stone-200 shrink-0 flex items-center justify-center relative overflow-hidden">
                  <div className="grid grid-cols-2 gap-0.5 w-full h-full opacity-80">
                    <div className="border-2 border-black rounded-xs"></div>
                    <div className="border-2 border-black rounded-xs"></div>
                    <div className="border-2 border-black rounded-xs"></div>
                    <div className="bg-black rounded-xs"></div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent pointer-events-none"></div>
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  <h5 className="font-gujarati font-bold text-xs text-stone-705 dark:text-stone-300 truncate">{society.societyInfo.upiName}</h5>
                  <p className="font-headline text-[10px] text-stone-450 truncate">{society.societyInfo.upiId}</p>
                  <p className="font-gujarati text-[9px] text-emerald-600 bg-emerald-500/5 px-2 py-0.5 rounded-full inline-block">UPI ✓</p>
                </div>
              </div>
              <button onClick={downloadUpiQrCard} className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-2xl font-gujarati font-black text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <span className="material-symbols-outlined text-sm font-bold">download</span>
                QR Download (PNG)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          2. MAINTENANCE LIST
          ======================================================== */}
      {subTab === "maintenance" && (
        <div className="space-y-4 animate-fade-in">

          {/* Member's own flat summary */}
          {!isAdmin && userProfile && userProfile.flatId && (() => {
            const myFlat = society.flats.find(f => f.id === userProfile.flatId);
            if (!myFlat) return null;
            const pendingPay = (society.pendingPayments || []).find(p => p.flatId === myFlat.id && p.status === "Pending");
            return (
              <div className="bg-[#fef8f1] dark:bg-stone-905 border border-primary/20 p-6 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase">તમારો ફ્લેટ</span>
                  <h4 className="font-gujarati font-black text-lg text-stone-850 dark:text-stone-100">
                    ફ્લેટ નંબર: <span className="text-primary">{myFlat.id}</span> · {myFlat.ownerName}
                  </h4>
                  <p className="font-gujarati text-xs text-stone-550">
                    બાકી: ₹{myFlat.arrears.toLocaleString('en-IN')} ·{' '}
                    <span className={`font-black ${myFlat.status === 'Paid' ? 'text-emerald-600' : myFlat.status === 'Advance' ? 'text-blue-600' : myFlat.status === 'Partial' ? 'text-amber-600' : 'text-rose-600'}`}>
                      {myFlat.status === 'Paid' ? 'ભરેલ ✓' : myFlat.status === 'Advance' ? 'Advance' : myFlat.status === 'Partial' ? 'Partial' : 'બાકી ❌'}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  {pendingPay ? (
                    <div className="bg-amber-500/10 text-amber-700 px-4 py-3 rounded-2xl border border-amber-350 text-xs font-black font-gujarati flex items-center gap-1.5 animate-pulse">
                      <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                      ચ. ⏳ UTR: {pendingPay.utrId}
                    </div>
                  ) : (
                    (myFlat.status === 'Unpaid' || myFlat.status === 'Partial') && (
                      <button
                        onClick={() => { setReportFlatId(myFlat.id); setReportAmount(String(myFlat.arrears || 2500)); setReportUtr(""); setShowReportPaymentModal(true); }}
                        className="bg-primary hover:bg-amber-600 text-white px-5 py-3 rounded-2xl font-gujarati font-black text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">upload_file</span>
                        પેમેન્ટ રિપોર્ટ મોકલો 📄
                      </button>
                    )
                  )}
                  {(myFlat.status === 'Paid' || myFlat.status === 'Advance' || myFlat.status === 'Partial') && (
                    <button
                      onClick={() => { generateCanvasReceipt(myFlat.id, myFlat.amountPaid, myFlat.payMode || "UPI"); triggerToast("📋 "); }}
                      className="bg-white hover:bg-stone-50 dark:bg-stone-850 text-stone-705 dark:text-stone-200 border border-stone-200 dark:border-stone-750 px-5 py-3 rounded-2xl font-gujarati font-black text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">download</span>
                      રસીદ ડાઉનલોડ
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          <div className="bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-gujarati font-black text-xl text-stone-800 dark:text-stone-100">મેઈન્ટેનન્સ હિસાબ અને પાવતીઓ</h3>
              <p className="font-gujarati text-xs text-stone-400 mt-1">સોસાયટીની પાવતીઓ અને સભ્યોની ચૂકવણીની સ્થિતિ.</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => { const t = `🚩 નમસ્તે સભ્યો, ${society.societyInfo.name} નું મેઈન્ટેનન્સ ₹${society.societyInfo.maintenanceAmount} ચૂકવવા માટે વિનંતી છે.`; window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(t)}`); triggerToast("📲 Reminder sent!"); }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-gujarati font-black text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">share</span>
                WhatsApp Notice
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-gujarati text-sm">
                <tbody className="divide-y divide-stone-100 dark:divide-stone-850 text-stone-700 dark:text-stone-300">
                  {society.flats.map(flat => (
                    <tr key={flat.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-950/20">
                      <td className="p-4 pl-6 font-bold">{flat.id}</td>
                      <td className="p-4">{flat.ownerName}</td>
                      <td className="p-4 text-stone-400">{flat.tenantName ? `👤 ${flat.tenantName}` : "Owner"}</td>
                      <td className="p-4 text-right font-headline font-bold text-rose-600">₹ {flat.arrears.toLocaleString('en-IN')}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider inline-block ${
                          flat.status === 'Paid' ? 'bg-emerald-50 border-emerald-300 text-emerald-755' :
                          flat.status === 'Advance' ? 'bg-blue-50 border-blue-300 text-blue-755' :
                          flat.status === 'Partial' ? 'bg-amber-50 border-amber-300 text-amber-755' :
                          'bg-rose-50 border-rose-300 text-rose-755'
                        }`}>
                          {flat.status === 'Paid' ? 'ભરેલ ✓' : flat.status === 'Advance' ? 'Advance' : flat.status === 'Partial' ? 'Partial' : 'બાકી ❌'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {flat.status === 'Paid' || flat.status === 'Advance' ? (
                            <button onClick={() => { generateCanvasReceipt(flat.id, flat.amountPaid, flat.payMode || "UPI"); triggerToast("📋"); }} className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 active:scale-95 cursor-pointer">
                              <span className="material-symbols-outlined text-xs">download</span>ડાઉનલોડ
                            </button>
                          ) : (() => {
                            const pendingPay = (society.pendingPayments || []).find(p => p.flatId === flat.id && p.status === "Pending");
                            if (pendingPay) {
                              return (
                                <div className="flex items-center gap-2">
                                  <span className="bg-amber-50 dark:bg-amber-950/20 border border-amber-300 text-amber-700 px-2 py-1 rounded-lg text-[10px] font-black uppercase">⏳ Pending</span>
                                  <button onClick={() => { setSelectedPaymentDetail(pendingPay); setShowReceiptViewModal(true); }} className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-850 text-stone-600 dark:text-stone-300 px-2.5 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center gap-0.5 cursor-pointer" title="View Slip">
                                    <span className="material-symbols-outlined text-xs">visibility</span>પહોંચ
                                  </button>
                                </div>
                              );
                            }
                            return (
                              <>
                                {flat.status === 'Partial' && (
                                  <button onClick={() => { generateCanvasReceipt(flat.id, flat.amountPaid, flat.payMode || "Cash"); triggerToast("📋"); }} className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-0.5 active:scale-95 cursor-pointer mr-1">
                                    <span className="material-symbols-outlined text-[10px]">download</span>ભાગતઃ
                                  </button>
                                )}
                                {isAdmin ? (
                                  <button onClick={() => { setSelectedPayFlat(flat); setPayAmount(society.societyInfo.maintenanceAmount + flat.arrears); setShowPayModal(true); }} className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 active:scale-95 cursor-pointer">
                                    <span className="material-symbols-outlined text-xs">check_circle</span>ચૂકવો
                                  </button>
                                ) : (
                                  <button onClick={() => { setReportFlatId(flat.id); setReportAmount(String(flat.arrears || 2500)); setReportUtr(""); setShowReportPaymentModal(true); }} className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 active:scale-95 shadow-sm cursor-pointer">
                                    <span className="material-symbols-outlined text-xs">upload_file</span>રિપોર્ટ
                                  </button>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          3. EXPENSE TRACKER
          ======================================================== */}
      {subTab === "expenses" && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-gujarati font-black text-xl text-stone-800 dark:text-stone-100">ખર્ચ ટ્રેકર</h3>
              <p className="font-gujarati text-xs text-stone-400 mt-1">સોસાયટીના ખર્ચની વિગતો અને ટ્રેકિંગ.</p>
            </div>
            {isAdmin && (
              <button onClick={() => setShowAddExpense(true)} className="bg-primary hover:bg-amber-600 text-white px-5 py-3 rounded-2xl font-gujarati font-black text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer">
                <span className="material-symbols-outlined text-sm">add</span>ખર્ચ ઉમેરો
              </button>
            )}
          </div>
          <div className="space-y-3">
            {society.expenses.map(exp => (
              <div key={exp.id} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2.5rem] p-5 shadow-sm flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="bg-stone-100 dark:bg-stone-950 text-stone-500 px-2 py-0.5 rounded-full text-[9px] font-black uppercase">{exp.category}</span>
                  <h4 className="font-gujarati font-bold text-sm text-stone-850 dark:text-stone-100">{exp.desc}</h4>
                  <p className="font-gujarati text-[10px] text-stone-400">{exp.paidTo} · {exp.date} · {exp.payMode}</p>
                </div>
                <div className="text-right shrink-0">
                  <h3 className="font-headline font-black text-xl text-rose-650">₹{exp.amount.toLocaleString('en-IN')}</h3>
                </div>
              </div>
            ))}
          </div>
          {showAddExpense && isAdmin && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] border border-stone-200 dark:border-stone-800 p-8 max-w-md w-full shadow-2xl space-y-5 animate-fade-in text-on-surface">
                <div className="flex items-center justify-between">
                  <h3 className="font-gujarati font-black text-lg">નવો ખર્ચ</h3>
                  <button onClick={() => setShowAddExpense(false)} className="h-9 w-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center cursor-pointer"><span className="material-symbols-outlined text-sm">close</span></button>
                </div>
                <div className="space-y-3">
                  <input value={newExpDesc} onChange={e => setNewExpDesc(e.target.value)} placeholder="ખર્ચનું નામ/વિગત" className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface" />
                  <input type="number" value={newExpAmount} onChange={e => setNewExpAmount(e.target.value)} placeholder="₹ 0" className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-headline text-sm focus:outline-none focus:border-primary text-on-surface" />
                  <select value={newExpCategory} onChange={e => setNewExpCategory(e.target.value)} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface cursor-pointer">
                    {["Maintenance","Electrical","Plumbing","Salary","Security","Other"].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input value={newExpPaidTo} onChange={e => setNewExpPaidTo(e.target.value)} placeholder="Paid To" className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface" />
                  <select value={newExpPayMode} onChange={e => setNewExpPayMode(e.target.value)} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface cursor-pointer">
                    {["Cash","UPI","NEFT","Cheque"].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { if (!newExpDesc || !newExpAmount) return; const ne = { id: Date.now(), desc: newExpDesc, category: newExpCategory, amount: parseFloat(newExpAmount), date: new Date().toLocaleDateString(), paidTo: newExpPaidTo, payMode: newExpPayMode }; setSociety(prev => ({ ...prev, expenses: [ne, ...prev.expenses] })); setShowAddExpense(false); setNewExpDesc(""); setNewExpAmount(""); setNewExpPaidTo(""); triggerToast("✅ "); }} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-2xl font-gujarati font-black text-sm shadow-md active:scale-95 transition-transform cursor-pointer">Save</button>
                  <button onClick={() => setShowAddExpense(false)} className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-5 py-3 rounded-2xl font-gujarati font-bold text-sm active:scale-95 transition-transform cursor-pointer">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          4. ANNOUNCEMENTS
          ======================================================== */}
      {subTab === "announcements" && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-gujarati font-black text-xl text-stone-800 dark:text-stone-100">📢 જાહેરાતો</h3>
              <p className="font-gujarati text-xs text-stone-400 mt-1">સોસાયટીની અગત્યની જાહેરાતો અને નોટિસ બોર્ડ.</p>
            </div>
            {isAdmin && (
              <button onClick={() => setShowAddAnn(true)} className="bg-primary hover:bg-amber-600 text-white px-5 py-3 rounded-2xl font-gujarati font-black text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer">
                <span className="material-symbols-outlined text-sm">add</span>નવી જાહેરાત
              </button>
            )}
          </div>
          <div className="space-y-4">
            {society.announcements.map(ann => (
              <div key={ann.id} className={`bg-white dark:bg-stone-900 border rounded-[2.5rem] p-6 shadow-sm space-y-3 ${ann.priority === 'high' ? 'border-rose-200 dark:border-rose-900/50' : ann.priority === 'medium' ? 'border-amber-200 dark:border-amber-900/50' : 'border-stone-200 dark:border-stone-800'}`}>
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${ann.priority === 'high' ? 'bg-rose-50 text-rose-700 border border-rose-200' : ann.priority === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-stone-50 text-stone-500 border border-stone-200'}`}>
                    {ann.priority === 'high' ? '🔴 High' : ann.priority === 'medium' ? '🟡 Medium' : '🟢 Low'}
                  </span>
                  <span className="font-gujarati text-[10px] text-stone-400">{ann.date}</span>
                </div>
                <h4 className="font-gujarati font-black text-base text-stone-850 dark:text-stone-100">{ann.title}</h4>
                <p className="font-gujarati text-xs text-stone-555 dark:text-stone-400 leading-relaxed">{ann.body}</p>
                <p className="font-gujarati text-[10px] text-stone-350">— {ann.author}</p>
              </div>
            ))}
          </div>
          {showAddAnn && isAdmin && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] border border-stone-200 dark:border-stone-800 p-8 max-w-md w-full shadow-2xl space-y-5 animate-fade-in text-on-surface">
                <div className="flex items-center justify-between">
                  <h3 className="font-gujarati font-black text-lg">નવી જાહેરાત</h3>
                  <button onClick={() => setShowAddAnn(false)} className="h-9 w-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center cursor-pointer"><span className="material-symbols-outlined text-sm">close</span></button>
                </div>
                <div className="space-y-3">
                  <input value={newAnnTitle} onChange={e => setNewAnnTitle(e.target.value)} placeholder="Title" className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface" />
                  <textarea value={newAnnBody} onChange={e => setNewAnnBody(e.target.value)} placeholder="Body..." rows={4} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface resize-none" />
                  <select value={newAnnPriority} onChange={e => setNewAnnPriority(e.target.value)} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface cursor-pointer">
                    <option value="high">High 🔴</option>
                    <option value="medium">Medium 🟡</option>
                    <option value="low">Low 🟢</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { if (!newAnnTitle) return; const na = { id: Date.now(), title: newAnnTitle, body: newAnnBody, priority: newAnnPriority, date: new Date().toLocaleDateString(), author: "Admin" }; setSociety(prev => ({ ...prev, announcements: [na, ...prev.announcements] })); setShowAddAnn(false); setNewAnnTitle(""); setNewAnnBody(""); triggerToast("✅"); }} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-2xl font-gujarati font-black text-sm shadow-md active:scale-95 transition-transform cursor-pointer">Post</button>
                  <button onClick={() => setShowAddAnn(false)} className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-5 py-3 rounded-2xl font-gujarati font-bold text-sm active:scale-95 transition-transform cursor-pointer">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          5. COMPLAINTS
          ======================================================== */}
      {subTab === "complaints" && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-gujarati font-black text-xl text-stone-800 dark:text-stone-100">⚠️ ફરિયાદો</h3>
              <p className="font-gujarati text-xs text-stone-400 mt-1">સભ્યોની ફરિયાદો અને નિરાકરણ સ્થિતિ.</p>
            </div>
            <button onClick={() => setShowAddComplaint(true)} className="bg-primary hover:bg-amber-600 text-white px-5 py-3 rounded-2xl font-gujarati font-black text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer">
              <span className="material-symbols-outlined text-sm">add</span>નવી ફરિયાદ
            </button>
          </div>
          <div className="space-y-3">
            {society.complaints.map(comp => (
              <div key={comp.id} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2.5rem] p-5 shadow-sm flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-stone-100 dark:bg-stone-950 text-stone-500 px-2 py-0.5 rounded-full text-[9px] font-black uppercase">{comp.category}</span>
                    <span className="font-gujarati font-bold text-xs text-primary">{comp.flatId}</span>
                  </div>
                  <h4 className="font-gujarati font-bold text-sm text-stone-850 dark:text-stone-100">{comp.desc}</h4>
                  <p className="font-gujarati text-[10px] text-stone-400">{comp.reportedDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase ${comp.status === 'Resolved' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-rose-50 border-rose-300 text-rose-700'}`}>
                    {comp.status}
                  </span>
                  {isAdmin && comp.status !== 'Resolved' && (
                    <button onClick={() => { setSociety(prev => ({ ...prev, complaints: prev.complaints.map(c => c.id === comp.id ? { ...c, status: 'Resolved' } : c) })); triggerToast("✅"); }} className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-black active:scale-95 cursor-pointer">Resolve</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {showAddComplaint && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] border border-stone-200 dark:border-stone-800 p-8 max-w-md w-full shadow-2xl space-y-5 animate-fade-in text-on-surface">
                <div className="flex items-center justify-between">
                  <h3 className="font-gujarati font-black text-lg">ન. .).</h3>
                  <button onClick={() => setShowAddComplaint(false)} className="h-9 w-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center cursor-pointer"><span className="material-symbols-outlined text-sm">close</span></button>
                </div>
                <div className="space-y-3">
                  <select value={newCompFlat} onChange={e => setNewCompFlat(e.target.value)} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface cursor-pointer">
                    {society.flats.map(f => <option key={f.id} value={f.id}>{f.id}</option>)}
                  </select>
                  <select value={newCompCat} onChange={e => setNewCompCat(e.target.value)} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface cursor-pointer">
                    {["Plumbing","Electrical","Structural","Security","Cleanliness","Other"].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <textarea value={newCompDesc} onChange={e => setNewCompDesc(e.target.value)} placeholder="Description..." rows={3} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface resize-none" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { if (!newCompDesc) return; const nc = { id: Date.now(), flatId: newCompFlat, category: newCompCat, desc: newCompDesc, status: "Open", reportedDate: new Date().toLocaleDateString() }; setSociety(prev => ({ ...prev, complaints: [nc, ...prev.complaints] })); setShowAddComplaint(false); setNewCompDesc(""); triggerToast("✅"); }} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-2xl font-gujarati font-black text-sm shadow-md active:scale-95 transition-transform cursor-pointer">Submit</button>
                  <button onClick={() => setShowAddComplaint(false)} className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-5 py-3 rounded-2xl font-gujarati font-bold text-sm active:scale-95 transition-transform cursor-pointer">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          6. POLLS
          ======================================================== */}
      {subTab === "polls" && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between gap-4">
            <h3 className="font-gujarati font-black text-xl text-stone-800 dark:text-stone-100">🗳️ લોકમત / પોલ્સ</h3>
            {isAdmin && <button onClick={() => setShowAddPoll(true)} className="bg-primary hover:bg-amber-600 text-white px-5 py-3 rounded-2xl font-gujarati font-black text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"><span className="material-symbols-outlined text-sm">add</span>નવો પોલ</button>}
          </div>
          <div className="space-y-4">
            {society.polls.map(poll => {
              const totalVotes = poll.votes.reduce((a, b) => a + b, 0);
              const hasVoted = votedPolls[poll.id] !== undefined;
              return (
                <div key={poll.id} className={`bg-white dark:bg-stone-900 border rounded-[2.5rem] p-6 shadow-sm space-y-4 ${poll.isActive ? 'border-amber-200 dark:border-amber-900/50' : 'border-stone-200 dark:border-stone-800'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${poll.isActive ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-stone-50 text-stone-400 border border-stone-200'}`}>{poll.isActive ? '🔴 Live' : '✅ Closed'}</span>
                    <span className="font-gujarati text-[10px] text-stone-400">Deadline: {poll.deadline}</span>
                  </div>
                  <h4 className="font-gujarati font-black text-base text-stone-850 dark:text-stone-100">{poll.question}</h4>
                  <div className="space-y-2">
                    {poll.options.map((opt, oi) => {
                      const pct = totalVotes > 0 ? Math.round((poll.votes[oi] / totalVotes) * 100) : 0;
                      return (
                        <button key={oi} onClick={() => { if (!poll.isActive || hasVoted) return; setSociety(prev => ({ ...prev, polls: prev.polls.map(p => p.id === poll.id ? { ...p, votes: p.votes.map((v, i) => i === oi ? v + 1 : v) } : p) })); setVotedPolls(prev => ({ ...prev, [poll.id]: oi })); triggerToast("🗳️ Vote recorded!"); }} className={`w-full text-left p-3 rounded-2xl border transition-all relative overflow-hidden ${poll.isActive && !hasVoted ? 'hover:bg-amber-50 dark:hover:bg-amber-950/20 border-stone-200 dark:border-stone-800 cursor-pointer' : 'border-stone-100 dark:border-stone-850 cursor-default'}`}>
                          <div className="absolute inset-0 bg-primary/8 transition-all" style={{ width: `${pct}%` }} />
                          <div className="relative z-10 flex items-center justify-between">
                            <span className="font-gujarati font-bold text-sm text-stone-800 dark:text-stone-200">{opt}</span>
                            <span className="font-headline font-black text-xs text-stone-500">{poll.votes[oi]} · {pct}%</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="font-gujarati text-[10px] text-stone-400">Total: {totalVotes} votes</p>
                </div>
              );
            })}
          </div>
          {showAddPoll && isAdmin && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] border border-stone-200 dark:border-stone-800 p-8 max-w-md w-full shadow-2xl space-y-5 animate-fade-in text-on-surface">
                <div className="flex items-center justify-between">
                  <h3 className="font-gujarati font-black text-lg">નવો પોલ</h3>
                  <button onClick={() => setShowAddPoll(false)} className="h-9 w-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center cursor-pointer"><span className="material-symbols-outlined text-sm">close</span></button>
                </div>
                <div className="space-y-3">
                  <input value={newPollQ} onChange={e => setNewPollQ(e.target.value)} placeholder="પ્રશ્ન?" className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface" />
                  <textarea value={newPollOptions} onChange={e => setNewPollOptions(e.target.value)} placeholder="વિકલ્પો (દરેક નવી લાઈન પર)" rows={4} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface resize-none" />
                  <input type="number" value={newPollDays} onChange={e => setNewPollDays(e.target.value)} min={1} max={30} placeholder="દિવસો" className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-headline text-sm focus:outline-none focus:border-primary text-on-surface" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { if (!newPollQ) return; const opts = newPollOptions.split('\n').map(o => o.trim()).filter(Boolean); if (opts.length < 2) return; const deadline = new Date(); deadline.setDate(deadline.getDate() + parseInt(newPollDays)); const np = { id: Date.now(), question: newPollQ, options: opts, votes: opts.map(() => 0), deadline: deadline.toLocaleDateString(), isActive: true }; setSociety(prev => ({ ...prev, polls: [np, ...prev.polls] })); setShowAddPoll(false); setNewPollQ(""); setNewPollOptions("Yes\nNo"); triggerToast("✅"); }} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-2xl font-gujarati font-black text-sm shadow-md active:scale-95 transition-transform cursor-pointer">બનાવો</button>
                  <button onClick={() => setShowAddPoll(false)} className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-5 py-3 rounded-2xl font-gujarati font-bold text-sm active:scale-95 transition-transform cursor-pointer">રદ કરો</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          7. AGM REGISTER
          ======================================================== */}
      {subTab === "agm" && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 shadow-sm">
            <h3 className="font-gujarati font-black text-xl text-stone-800 dark:text-stone-100">📅 AGM સભા રજીસ્ટર</h3>
            <p className="font-gujarati text-xs text-stone-450 mt-1">સોસાયટીની વાર્ષિક સભાની વિગતો અને નિર્ણયો.</p>
          </div>
          {society.agmMeetings.map(meeting => (
            <div key={meeting.id} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-[2.5rem] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4 gap-2">
                <div>
                  <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-0.5 rounded-full text-[10px] font-black uppercase inline-block">AGM 🛡️</span>
                  <h4 className="font-gujarati font-black text-base text-stone-800 dark:text-stone-100 mt-1">તારીખ: {meeting.date} ({meeting.time})</h4>
                </div>
                <div className="bg-stone-50 dark:bg-stone-950 px-4 py-2 rounded-2xl text-center border border-black/5">
                  <p className="font-gujarati text-[10px] text-stone-450">હાજરી</p>
                  <p className="text-sm font-black text-on-surface">{meeting.attendanceCount} ફ્લેટ</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#fef8f1] dark:bg-stone-950/40 p-5 rounded-3xl border border-primary/5">
                  <h5 className="font-gujarati font-black text-sm text-primary mb-2">એજન્ડા</h5>
                  <p className="font-gujarati text-xs text-stone-605 dark:text-stone-300 leading-relaxed whitespace-pre-line">{meeting.agenda}</p>
                </div>
                <div className="bg-stone-50 dark:bg-stone-950/40 p-5 rounded-3xl border border-black/5">
                  <h5 className="font-gujarati font-black text-sm text-stone-705 dark:text-stone-300 mb-2">નિર્ણયો</h5>
                  <p className="font-gujarati text-xs text-stone-505 leading-relaxed whitespace-pre-line">{meeting.minutes}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================
          8. MEMBER DIRECTORY
          ======================================================== */}
      {subTab === "directory" && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 shadow-sm">
            <h3 className="font-gujarati font-black text-xl text-stone-800 dark:text-stone-100">📞 સભ્યોની ડિરેક્ટરી</h3>
            <p className="font-gujarati text-xs text-stone-450 mt-1">સોસાયટીના તમામ સભ્યોની યાદી.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {society.flats.map(flat => (
              <div key={flat.id} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-[2.5rem] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="h-10 w-10 bg-amber-500/10 text-primary dark:text-dark-accent rounded-xl flex items-center justify-center font-headline font-black text-base">{flat.id}</span>
                  <span className="bg-stone-100 dark:bg-stone-950 px-2 py-0.5 rounded-full text-[9px] font-black text-stone-455 border border-black/5 uppercase">{flat.tenantName ? "ભાડૂત" : "માલિક"}</span>
                </div>
                <div className="space-y-1">
                  <p className="font-gujarati text-[10px] text-stone-400">માલિક:</p>
                  <h4 className="font-gujarati font-black text-base text-stone-850 dark:text-stone-100">{flat.ownerName}</h4>
                  {flat.tenantName && (
                    <>
                      <p className="font-gujarati text-[10px] text-stone-400 pt-1.5">ભાડૂત:</p>
                      <h4 className="font-gujarati font-bold text-sm text-stone-700 dark:text-stone-300">👤 {flat.tenantName}</h4>
                    </>
                  )}
                </div>
                <div className="border-t border-stone-100 dark:border-stone-800 pt-3 flex justify-between items-center text-[11px] font-bold text-stone-550">
                  <span className="font-gujarati">Contact:</span>
                  <span className="font-headline">{maskPhoneNumber(flat.phone)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          9. HELPLINE & PREMIUM SERVICES (NEW)
          ======================================================== */}
      {subTab === "helpline" && (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#1c0a00] to-[#3b1a00] text-white rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden border border-amber-500/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none"></div>
            <div className="relative z-10 space-y-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-0.5 rounded-full text-[10px] font-black uppercase inline-block">✅ વેરિફાઇડ પ્રીમિયમ પાર્ટનર્સ</span>
              <h3 className="font-gujarati font-black text-xl text-white">🛠️ સોસાયટી હેલ્પલાઇન</h3>
              <p className="font-gujarati text-xs text-amber-100/70 leading-relaxed">
                નીચેના સેવા આપનારાઓ ₹૫૦/૧૦૦ પ્રીમિયમ સબ્સ્ક્રિપ્શન સાથે વેરિફાઇડ છે. ફોન કરો અને ઉત્તમ સેવા મેળવો!
              </p>
            </div>
          </div>

          {/* Monetization Banner */}
          <div className="bg-amber-500/8 border border-amber-400/30 rounded-3xl p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-amber-500 text-2xl shrink-0 mt-0.5">workspace_premium</span>
            <p className="font-gujarati text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              <strong className="text-amber-600">પ્રીમિયમ લિસ્ટિંગ:</strong>{" "}
              આ લિસ્ટિંગ ₹૫૦/૧૦૦ પ્રતિ મહિને સબ્સ્ક્રિપ્શન મોડલ પર ચાલે છે. તમારા વ્યવસાયને અહિયાં લિસ્ટ કરવા માટે <strong>એડમિનનો સંપર્ક કરો.</strong>
            </p>
          </div>

          {/* Service Cards */}
          {SERVICE_PROVIDERS.map((cat, catIdx) => (
            <div key={catIdx} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2.5rem] p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cat.icon}</span>
                <div>
                  <h4 className="font-gujarati font-black text-base text-stone-850 dark:text-stone-100">{cat.category}</h4>
                  <span className="bg-amber-500/10 text-amber-700 border border-amber-300/50 px-2 py-0.5 rounded-full text-[9px] font-black uppercase">Premium · {cat.providers.length} providers</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {cat.providers.map((prov, provIdx) => (
                  <div key={provIdx} className="bg-[#fef8f1] dark:bg-stone-950 border border-primary/10 rounded-3xl p-4 space-y-3 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-1">
                        <h5 className="font-gujarati font-black text-sm text-stone-850 dark:text-stone-100 leading-tight">{prov.name}</h5>
                        <div className="flex items-center gap-0.5 bg-amber-500/10 px-2 py-0.5 rounded-full shrink-0">
                          <span className="text-amber-500 text-xs">★</span>
                          <span className="font-headline font-black text-[10px] text-amber-700">{prov.rating}</span>
                        </div>
                      </div>
                      <p className="font-gujarati text-[10px] text-stone-450">{prov.experience}</p>
                      <p className="font-headline text-[11px] text-stone-500 dark:text-stone-400 tracking-widest">{maskPhoneNumber(prov.phone)}</p>
                    </div>
                    <button
                      onClick={() => { setActiveCallProvider({ ...prov, profession: cat.category }); setIsCallConnected(false); setCallDuration(0); }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-2xl font-gujarati font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">call</span>
                      Call
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================
          10. PENDING REQUESTS — ADMIN ONLY (SPLIT: JOINS + PAYMENTS)
          ======================================================== */}
      {subTab === "requests" && isAdmin && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 shadow-sm">
            <h3 className="font-gujarati font-black text-xl text-stone-800 dark:text-stone-100">⏳ એડમિન પેનલ</h3>
            <p className="font-gujarati text-xs text-stone-450 mt-1">જોઈન થવાની વિનંતીઓ અને પેમેન્ટ મંજૂરીઓ.</p>
          </div>

          {/* Sub-tab switcher */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setRequestsSubTab("joins")}
              className={`px-5 py-2.5 rounded-full font-gujarati font-bold text-xs border transition-all flex items-center gap-1.5 cursor-pointer ${requestsSubTab === "joins" ? "bg-amber-600 text-white border-amber-600 shadow-sm" : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400"}`}
            >
              <span className="material-symbols-outlined text-sm">group_add</span>
              જોઈન વિનંતીઓ ({(society.pendingRequests || []).length})
            </button>
            <button
              onClick={() => setRequestsSubTab("payments")}
              className={`px-5 py-2.5 rounded-full font-gujarati font-bold text-xs border transition-all flex items-center gap-1.5 cursor-pointer ${requestsSubTab === "payments" ? "bg-amber-600 text-white border-amber-600 shadow-sm" : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400"}`}
            >
              <span className="material-symbols-outlined text-sm">receipt_long</span>
              પેમેન્ટ મંજૂરીઓ ({(society.pendingPayments || []).filter(p => p.status === "Pending").length})
            </button>
          </div>

          {/* JOIN REQUESTS */}
          {requestsSubTab === "joins" && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2.5rem] shadow-sm overflow-hidden">
              {(society.pendingRequests || []).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-gujarati text-sm">
                    <thead>
                      <tr className="bg-stone-50 dark:bg-stone-950 border-b border-stone-100 dark:border-stone-850 text-stone-605 dark:text-stone-400 font-bold">
                        <th className="p-4 pl-6">નામ</th>
                        <th className="p-4">યુનિક આઈડી</th>
                        <th className="p-4">મોબાઈલ</th>
                        <th className="p-4">ફ્લેટ</th>
                        <th className="p-4 text-center">ક્રિયાઓ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-850 text-stone-700 dark:text-stone-300">
                      {(society.pendingRequests || []).map(req => (
                        <tr key={req.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-950/20">
                          <td className="p-4 pl-6 font-bold">{req.name}</td>
                          <td className="p-4 font-headline text-xs">{req.uniqueId}</td>
                          <td className="p-4 font-headline">{maskPhoneNumber(req.phone)}</td>
                          <td className="p-4 font-bold text-primary">{req.flatId}</td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => handleApproveRequest(req.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-1 cursor-pointer">
                                <span className="material-symbols-outlined text-xs">done</span>મંજૂર કરો
                              </button>
                              <button onClick={() => handleRejectRequest(req.id)} className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-rose-600 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1 cursor-pointer">
                                <span className="material-symbols-outlined text-xs">close</span>અસ્વીકાર
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center space-y-2">
                  <span className="material-symbols-outlined text-4xl text-stone-300">hourglass_disabled</span>
                  <p className="font-gujarati text-sm text-stone-400">કોઈ જોઈન વિનંતીઓ પેન્ડિંગ નથી.</p>
                </div>
              )}
            </div>
          )}

          {/* PAYMENT APPROVALS */}
          {requestsSubTab === "payments" && (
            <div className="space-y-4">
              {(society.pendingPayments || []).filter(p => p.status === "Pending").length > 0 ? (
                (society.pendingPayments || []).filter(p => p.status === "Pending").map(pay => (
                  <div key={pay.id} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2.5rem] p-6 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="bg-amber-500/10 text-amber-700 border border-amber-300/50 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase inline-block">⏳ ચકાસણી પેન્ડિંગ</span>
                        <h4 className="font-gujarati font-black text-base text-stone-850 dark:text-stone-100">ફ્લેટ {pay.flatId} — {pay.flatOwner}</h4>
                        <p className="font-gujarati text-xs text-stone-450">
                          UTR: <span className="font-bold font-headline text-stone-700 dark:text-stone-300">{pay.utrId}</span> · મહિનો: <span className="font-bold">{pay.month}</span>
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-gujarati text-[10px] text-stone-400">રકમ</p>
                        <h3 className="font-headline font-black text-2xl text-emerald-650">₹{parseFloat(pay.amount).toLocaleString('en-IN')}</h3>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                      <button onClick={() => { setSelectedPaymentDetail(pay); setShowReceiptViewModal(true); }} className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-4 py-2 rounded-xl font-gujarati font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer">
                        <span className="material-symbols-outlined text-sm">visibility</span>પહોંચ જુઓ
                      </button>
                      <button onClick={() => handleApprovePayment(pay.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-gujarati font-black text-xs transition-all active:scale-95 flex items-center gap-1.5 shadow-sm cursor-pointer">
                        <span className="material-symbols-outlined text-sm">check_circle</span>મંજૂર કરો ✓
                      </button>
                      <button onClick={() => handleRejectPayment(pay.id)} className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 border border-rose-200/50 px-4 py-2 rounded-xl font-gujarati font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer">
                        <span className="material-symbols-outlined text-sm">cancel</span>અસ્વીકાર
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2.5rem] p-12 text-center space-y-3">
                  <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-4xl text-emerald-500">check_circle</span>
                  </div>
                  <h4 className="font-gujarati font-black text-base text-stone-700 dark:text-stone-300">બધા પેમેન્ટ વેરીફાય થઈ ગયા છે!</h4>
                  <p className="font-gujarati text-xs text-stone-400">કોઈ પેન્ડિંગ પેમેન્ટ મંજૂરીઓ નથી.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          11. SOCIETY SETUP (ADMIN ONLY)
          ======================================================== */}
      {subTab === "setup" && isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {/* Flat Generator */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-[2.5rem] shadow-sm space-y-6">
            <div>
              <h3 className="font-gujarati font-black text-lg text-stone-850 dark:text-stone-100">🏗️ ફ્લેટ સેટઅપ</h3>
              <p className="font-gujarati text-xs text-stone-450 mt-1">સોસાયટી ફ્લેટ માળખું બનાવવા માટેનું જનરેટર.</p>
            </div>
            <form onSubmit={handleGenerateFlatStructure} className="space-y-4 bg-[#fef8f1] dark:bg-stone-950 p-6 rounded-3xl border border-primary/10">
              <div className="space-y-1">
                <label className="font-gujarati font-bold text-xs text-stone-555">બ્લોક્સ (કોમાથી અલગ કરો, જેમ કે A, B, C) *</label>
                <input type="text" value={setupBlocks} onChange={e => setSetupBlocks(e.target.value)} placeholder="A, B, C, D" className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-gujarati font-bold text-xs text-stone-555">માળની કુલ સંખ્યા *</label>
                  <input type="number" value={setupFloors} onChange={e => setSetupFloors(e.target.value)} min="1" max="20" className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface" required />
                </div>
                <div className="space-y-1">
                  <label className="font-gujarati font-bold text-xs text-stone-555">દરેક માળ પર ફ્લેટની સંખ્યા *</label>
                  <input type="number" value={setupFlatsPerFloor} onChange={e => setSetupFlatsPerFloor(e.target.value)} min="1" max="10" className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface" required />
                </div>
              </div>
              <div className="bg-rose-500/5 text-rose-700 dark:text-rose-450 p-3 rounded-2xl border border-rose-500/10 text-[11px] font-gujarati leading-relaxed">
                ⚠️ ચેતવણી: આ કરવાથી સોસાયટીનો હાલનો બધો સભ્ય ડેટા ડિલીટ થઈ જશે. ફક્ત પ્રારંભિક સેટઅપ વખતે જ ઉપયોગ કરો.
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white py-3 rounded-2xl font-gujarati font-black text-xs shadow-md active:scale-95 transition-transform cursor-pointer">
                ફ્લેટ માળખું બનાવો 🏗️
              </button>
            </form>
          </div>

          {/* Member Invite */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-[2.5rem] shadow-sm space-y-6">
            <div>
              <h3 className="font-gujarati font-black text-lg text-stone-850 dark:text-stone-100">📩 સભ્યને આમંત્રિત કરો</h3>
              <p className="font-gujarati text-xs text-stone-450 mt-1">ફોન નંબર અથવા યુનિક આઈડી દ્વારા સભ્ય ઉમેરો.</p>
            </div>
            <div className="space-y-4 bg-[#fef8f1] dark:bg-stone-950 p-6 rounded-3xl border border-primary/10">
              <div className="space-y-1">
                <label className="font-gujarati font-bold text-xs text-stone-555">ફોન નંબર / યુનિક આઈડી</label>
                <input type="text" value={invitePhone} onChange={e => setInvitePhone(e.target.value)} placeholder="9825XXXXXX or GJ-APP-XX-YYYYMXXXX" className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-headline text-sm focus:outline-none focus:border-primary text-on-surface" />
              </div>
              <div className="space-y-1">
                <label className="font-gujarati font-bold text-xs text-stone-555">ફ્લેટ ફાળવો</label>
                <select value={inviteFlatId} onChange={e => setInviteFlatId(e.target.value)} className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface cursor-pointer">
                  <option value="">ફ્લેટ પસંદ કરો</option>
                  {society.flats.map(f => <option key={f.id} value={f.id}>{f.id} – {f.ownerName}</option>)}
                </select>
              </div>
              <button
                onClick={() => {
                  if (!invitePhone || !inviteFlatId) { triggerToast("બધી વિગતો ભરો!"); return; }
                  triggerToast(`✅ આમંત્રણ મોકલાઈ ગયું!`);
                  setInvitePhone(""); setInviteFlatId("");
                }}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-2xl font-gujarati font-black text-xs shadow-md active:scale-95 transition-transform cursor-pointer"
              >
                આમંત્રણ મોકલો 📩
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODALS
          ============================================================ */}

      {/* MODAL 1: Admin Pay Flat */}
      {showPayModal && selectedPayFlat && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] border border-stone-200 dark:border-stone-800 p-8 max-w-md w-full shadow-2xl space-y-6 animate-fade-in text-on-surface">
            <div className="flex items-center justify-between">
              <h3 className="font-gujarati font-black text-lg">💰 પેમેન્ટ રેકોર્ડ કરો</h3>
              <button onClick={() => setShowPayModal(false)} className="h-9 w-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center cursor-pointer"><span className="material-symbols-outlined text-sm">close</span></button>
            </div>
            <form onSubmit={handlePayFlat} className="space-y-4">
              <p className="font-gujarati text-xs text-stone-400">ફ્લેટ: <strong className="text-primary">{selectedPayFlat.id}</strong> – {selectedPayFlat.ownerName}</p>
              <input type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-headline text-sm focus:outline-none focus:border-primary text-on-surface" required />
              <select value={payMode} onChange={e => setPayMode(e.target.value)} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface cursor-pointer">
                {["Cash","UPI","NEFT","Cheque"].map(m => <option key={m}>{m}</option>)}
              </select>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-2xl font-gujarati font-black text-sm shadow-md active:scale-95 transition-transform cursor-pointer">રેકોર્ડ કરો ✓</button>
                <button type="button" onClick={() => setShowPayModal(false)} className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-5 py-3 rounded-2xl font-gujarati font-bold text-sm active:scale-95 transition-transform cursor-pointer">રદ કરો</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit UPI */}
      {showEditUpiModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] border border-stone-200 dark:border-stone-800 p-8 max-w-md w-full shadow-2xl space-y-6 animate-fade-in text-on-surface">
            <div className="flex items-center justify-between">
              <h3 className="font-gujarati font-black text-lg">⚙️ UPI સુધારો</h3>
              <button onClick={() => setShowEditUpiModal(false)} className="h-9 w-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center cursor-pointer"><span className="material-symbols-outlined text-sm">close</span></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-gujarati font-bold text-xs text-stone-555">UPI આઈડી *</label>
                <input type="text" value={upiIdInput} onChange={e => setUpiIdInput(e.target.value)} placeholder="sunrise@sbi" className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-headline text-sm focus:outline-none focus:border-primary text-on-surface" />
              </div>
              <div className="space-y-1.5">
                <label className="font-gujarati font-bold text-xs text-stone-555">ડિસ્પ્લે નામ *</label>
                <input type="text" value={upiNameInput} onChange={e => setUpiNameInput(e.target.value)} placeholder="Society Name" className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setSociety(prev => ({ ...prev, societyInfo: { ...prev.societyInfo, upiId: upiIdInput, upiName: upiNameInput } })); setShowEditUpiModal(false); triggerToast("✅ UPI updated!"); }} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-2xl font-gujarati font-black text-sm shadow-md active:scale-95 transition-transform cursor-pointer">સાચવો</button>
              <button onClick={() => setShowEditUpiModal(false)} className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-5 py-3 rounded-2xl font-gujarati font-bold text-sm active:scale-95 transition-transform cursor-pointer">રદ કરો</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Report Payment (Member uploads UTR/screenshot) */}
      {showReportPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] border border-stone-200 dark:border-stone-800 p-8 max-w-md w-full shadow-2xl space-y-6 animate-fade-in text-on-surface max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-gujarati font-black text-lg text-stone-850 dark:text-stone-100">📄 પેમેન્ટ રિપોર્ટ</h3>
                <p className="font-gujarati text-xs text-stone-450 mt-0.5">ફ્લેટ: <strong className="text-primary">{reportFlatId}</strong></p>
              </div>
              <button onClick={() => setShowReportPaymentModal(false)} className="h-9 w-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center hover:bg-stone-200 transition-all cursor-pointer shrink-0">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-gujarati font-bold text-xs text-stone-555">મહિનો *</label>
                <select value={reportMonth} onChange={e => setReportMonth(e.target.value)} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface cursor-pointer">
                  {["Jan 2026","Feb 2026","Mar 2026","Apr 2026","May 2026","Jun 2026"].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="font-gujarati font-bold text-xs text-stone-555">રકમ (₹) *</label>
                <input type="number" value={reportAmount} onChange={e => setReportAmount(e.target.value)} placeholder="2500" className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-headline text-sm focus:outline-none focus:border-primary text-on-surface" />
              </div>
              <div className="space-y-1.5">
                <label className="font-gujarati font-bold text-xs text-stone-555">UTR / ટ્રાન્ઝેક્શન આઈડી *</label>
                <input type="text" value={reportUtr} onChange={e => setReportUtr(e.target.value)} placeholder="e.g. 421897654321" className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-headline text-sm focus:outline-none focus:border-primary text-on-surface" />
              </div>
              {/* Simulated Screenshot */}
              <div className="space-y-1.5">
                <label className="font-gujarati font-bold text-xs text-stone-555">પેમેન્ટ સ્ક્રીનશોટ</label>
                <div className="bg-[#fef8f1] dark:bg-stone-950 border-2 border-dashed border-primary/30 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-emerald-600 text-2xl">receipt</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-headline font-bold text-xs text-stone-700 dark:text-stone-300 truncate">{reportScreenshot}</p>
                      <p className="font-gujarati text-[10px] text-stone-400">GPay / PhonePe / BHIM</p>
                    </div>
                    <button type="button" onClick={() => { const files = ["GPay_Rcpt_345.png","PhonePe_Txn_8821.jpg","BHIM_Rcpt_112.png","Paytm_Slip_9934.jpg","UPI_Pay_5563.png"]; setReportScreenshot(files[Math.floor(Math.random() * files.length)]); triggerToast("Screenshot selected!"); }} className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl font-gujarati text-[10px] font-black hover:bg-primary/20 transition-all cursor-pointer shrink-0">
                      બદલો
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-300/30 rounded-xl px-3 py-1.5">
                    <span className="material-symbols-outlined text-emerald-600 text-xs">check_circle</span>
                    <span className="font-gujarati text-[10px] text-emerald-700 font-bold">ફાઈલ તૈયાર છે ✓</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  if (!reportUtr.trim()) { triggerToast("⚠️ UTR/ટ્રાન્ઝેક્શન આઈડી લખો!"); return; }
                  const flat = society.flats.find(f => f.id === reportFlatId);
                  const newPayment = { id: `PAY-${Date.now()}`, flatId: reportFlatId, flatOwner: flat ? flat.ownerName : reportFlatId, month: reportMonth, amount: reportAmount, utrId: reportUtr, screenshot: reportScreenshot, status: "Pending", submittedAt: new Date().toLocaleString() };
                  setSociety(prev => ({ ...prev, pendingPayments: [...(prev.pendingPayments || []), newPayment] }));
                  setShowReportPaymentModal(false);
                  setReportUtr("");
                  triggerToast("✅ વિગત મોકલાઈ ગઈ! એડમિન વેરીફાય કરશે.");
                }}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white py-3 rounded-2xl font-gujarati font-black text-sm shadow-md active:scale-95 transition-transform cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">send</span>એડમિનને મોકલો
              </button>
              <button onClick={() => setShowReportPaymentModal(false)} className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-5 py-3 rounded-2xl font-gujarati font-bold text-sm active:scale-95 transition-transform cursor-pointer">રદ કરો</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Receipt View (GPay-style slip) */}
      {showReceiptViewModal && selectedPaymentDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] border border-stone-200 dark:border-stone-800 p-8 max-w-sm w-full shadow-2xl space-y-6 animate-fade-in text-on-surface">
            <div className="flex items-center justify-between">
              <h3 className="font-gujarati font-black text-lg text-stone-850 dark:text-stone-100">🧾 પેમેન્ટની પહોંચ</h3>
              <button onClick={() => { setShowReceiptViewModal(false); setSelectedPaymentDetail(null); }} className="h-9 w-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center hover:bg-stone-200 transition-all cursor-pointer">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            {/* GPay-style receipt */}
            <div className="bg-gradient-to-b from-[#075e54] to-[#128c7e] rounded-3xl p-6 text-white space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-lg">account_balance</span>
                  </div>
                  <div>
                    <p className="font-headline font-black text-xs text-white/80">BHIM UPI Pay</p>
                    <p className="font-gujarati text-[10px] text-white/60">{selectedPaymentDetail.submittedAt}</p>
                  </div>
                </div>
                <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-1 rounded-full text-[10px] font-black">સફળ ચૂકવણી ✓</span>
              </div>
              <div className="text-center py-2">
                <p className="font-gujarati text-xs text-white/70">ચૂકવેલ રકમ</p>
                <h2 className="font-headline font-black text-4xl text-white mt-1">₹{parseFloat(selectedPaymentDetail.amount).toLocaleString('en-IN')}</h2>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 space-y-2.5 text-xs">
                {[
                  ["ફ્લેટ", `${selectedPaymentDetail.flatId} · ${selectedPaymentDetail.flatOwner}`],
                  ["ટ્રાન્ઝેક્શન UTR", selectedPaymentDetail.utrId],
                  ["મહિનો", selectedPaymentDetail.month],
                  ["સ્ક્રીનશોટ", selectedPaymentDetail.screenshot],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between gap-2">
                    <span className="text-white/60 font-gujarati shrink-0">{label}</span>
                    <span className="font-headline font-bold text-white text-right break-all text-[10px]">{val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { handleApprovePayment(selectedPaymentDetail.id); setShowReceiptViewModal(false); setSelectedPaymentDetail(null); }} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-gujarati font-black text-sm shadow-md active:scale-95 transition-transform flex items-center justify-center gap-1.5 cursor-pointer">
                <span className="material-symbols-outlined text-sm">check_circle</span>મંજૂર કરો
              </button>
              <button onClick={() => { handleRejectPayment(selectedPaymentDetail.id); setShowReceiptViewModal(false); setSelectedPaymentDetail(null); }} className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 border border-rose-200/50 px-5 py-3 rounded-2xl font-gujarati font-bold text-sm active:scale-95 transition-transform cursor-pointer">
                અસ્વીકાર
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY 5: Call Simulator */}
      {activeCallProvider && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#1a1a2e] rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl space-y-8 text-center animate-fade-in">
            <div className="space-y-3">
              <div className="relative h-24 w-24 mx-auto">
                {!isCallConnected && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 animate-ping"></div>
                    <div className="absolute inset-2 rounded-full border-2 border-amber-500/20 animate-ping" style={{animationDelay:'0.4s'}}></div>
                  </>
                )}
                <div className="absolute inset-0 h-24 w-24 bg-gradient-to-br from-amber-500/30 to-orange-500/20 border-2 border-amber-500/40 rounded-full flex items-center justify-center">
                  <span className="text-4xl">👷</span>
                </div>
              </div>
              <div>
                <h3 className="font-gujarati font-black text-xl text-white">{activeCallProvider.name}</h3>
                <p className="font-gujarati text-sm text-white/60">{activeCallProvider.profession}</p>
                <p className="font-headline text-base text-white/80 tracking-widest mt-1">
                  {isCallConnected ? activeCallProvider.phone : maskPhoneNumber(activeCallProvider.phone)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {isCallConnected ? (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="font-gujarati text-sm text-emerald-400 font-bold">કોલ જોડાયેલ છે</span>
                  </div>
                  <p className="font-headline font-black text-3xl text-white">
                    {String(Math.floor(callDuration / 60)).padStart(2,'0')}:{String(callDuration % 60).padStart(2,'0')}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-2 w-2 bg-amber-400 rounded-full animate-pulse"></div>
                    <span className="font-gujarati text-sm text-amber-400">કોલ થઈ રહ્યો છે...</span>
                  </div>
                  <p className="font-gujarati text-xs text-white/40">કનેક્ટ થઈ રહ્યું છે...</p>
                </>
              )}
            </div>

            <div className="flex items-center justify-center gap-8">
              <div className="flex flex-col items-center gap-1">
                <button className="h-14 w-14 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
                  <span className="material-symbols-outlined text-white text-2xl">volume_up</span>
                </button>
                <span className="font-gujarati text-[10px] text-white/50">સ્પીકર</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => { setActiveCallProvider(null); setIsCallConnected(false); setCallDuration(0); }}
                  className="h-16 w-16 bg-rose-600 hover:bg-rose-700 rounded-full flex items-center justify-center shadow-lg shadow-rose-600/30 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-white text-2xl">call_end</span>
                </button>
                <span className="font-gujarati text-[10px] text-white/50">કોલ કાપો</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <button className="h-14 w-14 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
                  <span className="material-symbols-outlined text-white text-2xl">mic_off</span>
                </button>
                <span className="font-gujarati text-[10px] text-white/50">મ્યૂટ</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Emergency Confirm */}
      {showEmergencyConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6">
          <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] border border-red-500/20 p-8 max-w-sm w-full shadow-2xl space-y-6 animate-fade-in text-on-surface text-center">
            <div className="h-16 w-16 bg-red-500/10 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-4xl font-bold">warning</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-gujarati font-black text-xl text-stone-850 dark:text-stone-100">🚨 ઇમરજન્સી એલર્ટ</h3>
              <p className="font-gujarati text-xs text-stone-500 leading-relaxed">સોસાયટીના તમામ સભ્યોને ઇમરજન્સી મેસેજ મોકલવો છે?</p>
              <div className="bg-rose-50 dark:bg-rose-950/20 p-3 rounded-2xl border border-red-200/30 text-rose-700 dark:text-rose-450 font-gujarati text-xs font-black">"{pendingEmergencyAlert}"</div>
            </div>
            <div className="flex gap-2">
              <button onClick={startCountdown} className="flex-1 bg-gradient-to-r from-red-500 to-rose-650 hover:from-red-400 hover:to-rose-550 text-white py-3 rounded-2xl font-gujarati font-black text-xs shadow-md active:scale-95 transition-transform cursor-pointer">મોકલો ➔</button>
              <button onClick={cancelEmergencyConfirm} className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-605 dark:text-stone-300 px-4 py-3 rounded-2xl font-gujarati font-bold text-xs active:scale-95 transition-transform cursor-pointer">રદ કરો</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: Emergency Countdown */}
      {countdownActive && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6">
          <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] border border-red-500/30 p-8 max-w-sm w-full shadow-2xl space-y-6 animate-fade-in text-on-surface text-center">
            <div className="relative h-24 w-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-rose-100 dark:border-rose-950"></div>
              <div className="absolute inset-0 rounded-full border-4 border-red-600 animate-spin border-t-transparent"></div>
              <span className="font-headline font-black text-4xl text-red-650 animate-pulse">{countdownSeconds}</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-gujarati font-black text-lg text-rose-800 dark:text-rose-455">🚨 એલર્ટ મોકલાઈ રહ્યું છે...</h3>
              <p className="font-gujarati text-xs text-stone-500">રદ કરવા માટે સમય મર્યાદામાં નીચે ક્લિક કરો.</p>
              <div className="bg-rose-50 dark:bg-rose-950/20 p-3 rounded-2xl border border-red-200/30 text-rose-700 dark:text-rose-400 font-gujarati text-xs font-bold">"{pendingEmergencyAlert}"</div>
            </div>
            <button onClick={cancelCountdown} className="w-full bg-stone-900 hover:bg-stone-850 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 py-3.5 rounded-2xl font-gujarati font-black text-xs shadow-md active:scale-95 transition-transform flex items-center justify-center gap-1.5 cursor-pointer">
              <span className="material-symbols-outlined text-sm font-bold">cancel</span>
              એલર્ટ રદ કરો ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
