// Game State
const gameState = {
  currentScreen: "menu", // menu, game, results
  currentGame: null, // email, phone, video
  score: 0,
  totalAnswered: 0,
  currentQuestion: 0,
  answers: [],
  touchStartX: 0,
  touchEndX: 0,
}

// Game Data
const emailGames = [
  {
    id: 1,
    from: "support@paypa1.com",
    fromName: "PayPal Support",
    subject: "Urgent: Verify Your Account",
    body: "Dear Customer,\n\nWe have detected unusual activity on your account. Please click the link below to verify your identity immediately:\n\nhttp://paypa1-verify.com/account\n\nIf you do not verify within 24 hours, your account will be suspended.",
    isPhishing: true,
    hints: [
      'Domain is "paypa1.com" (with number 1) instead of "paypal.com"',
      "Urgent language and threats are common phishing tactics",
      "Legitimate companies don't ask to verify via email links",
      "Suspicious URL with different domain",
    ],
  },
  {
    id: 2,
    from: "noreply@amazon.com",
    fromName: "Amazon",
    subject: "Your Order #123-4567890-1234567 has shipped",
    body: "Your order has been dispatched and is on its way!\n\nTracking Number: 1Z999AA10123456784\n\nYou can track your package at amazon.com/orders\n\nThank you for shopping with Amazon!",
    isPhishing: false,
    hints: [
      "Legitimate domain: amazon.com",
      "No suspicious links or requests",
      "Professional and straightforward message",
      "Includes real order information",
    ],
  },
  {
    id: 3,
    from: "billing@micros0ft.com",
    fromName: "Microsoft Billing",
    subject: "Action Required: Update Payment Method",
    body: "Your Microsoft account payment method has expired. Please update it immediately:\n\nClick here: https://micros0ft-billing.net/update-payment\n\nYour services will be suspended if not updated within 48 hours.",
    isPhishing: true,
    hints: [
      'Domain is "micros0ft.com" (with zero) instead of "microsoft.com"',
      "Suspicious URL with different domain",
      "Threatening language about suspension",
      "Legitimate Microsoft won't ask for payment via email links",
    ],
  },
  {
    id: 4,
    from: "hello@github.com",
    fromName: "GitHub",
    subject: "Welcome to GitHub!",
    body: "Welcome to GitHub! Your account has been created successfully.\n\nYou can now start creating repositories and collaborating with other developers.\n\nVisit github.com to get started.",
    isPhishing: false,
    hints: [
      "Legitimate domain: github.com",
      "No suspicious requests or links",
      "Standard welcome message",
      "Professional tone",
    ],
  },
]

const phoneGames = [
  {
    id: 1,
    callerName: "ATO Compliance Team",
    phoneNumber: "+61 2 8015 4470",
    callerInfo: "Caller claims to be the Australian Taxation Office",
    conversation: [
      { type: "incoming", text: "This is the ATO. We detected irregularities in your tax return." },
      { type: "outgoing", text: "What do I need to do?" },
      { type: "incoming", text: "You must pay today to avoid legal action. Purchase gift cards and read the codes to me." },
      { type: "outgoing", text: "I’d prefer to check via myGov first." },
    ],
    isPhishing: true,
    hints: [
      "ATO will not demand immediate payment over the phone or via gift cards",
      "Threats of arrest are classic coercion tactics",
      "Verify via myGov or call the official ATO number from the website",
      "Caller ID can be spoofed to show a local AU number",
    ],
  },
  {
    id: 2,
    callerName: "Australia Post",
    phoneNumber: "+61 3 7000 1245",
    callerInfo: "Legitimate parcel pickup reminder",
    conversation: [
      { type: "incoming", text: "Hello, Australia Post here — your parcel is ready for pickup at the City branch." },
      { type: "outgoing", text: "Great, what ID do I need?" },
      { type: "incoming", text: "Just bring photo ID. No payment is required by phone." },
      { type: "outgoing", text: "Thanks, I’ll come today." },
    ],
    isPhishing: false,
    hints: [
      "Matches an expected parcel and does not ask for payment details",
      "Provides clear in-person verification (photo ID at pickup)",
      "No threats or urgency pressure",
      "No request for card numbers or one-time codes",
    ],
  },
  {
    id: 3,
    callerName: "NBN Co Technical Support",
    phoneNumber: "+61 2 8880 9011",
    callerInfo: "Tech support claiming malware on your router",
    conversation: [
      { type: "incoming", text: "NBN Co here — your router is infected and attacking our network." },
      { type: "outgoing", text: "That sounds serious. How do I fix it?" },
      { type: "incoming", text: "Install a remote access tool so we can repair it, then pay a service fee today." },
      { type: "outgoing", text: "I’ll call my provider first to confirm." },
    ],
    isPhishing: true,
    hints: [
      "Unsolicited tech support calls are suspicious",
      "Requests for remote access + immediate payment are red flags",
      "NBN Co generally doesn’t provide direct consumer support — your ISP does",
      "Verify by calling your ISP using the number on your bill",
    ],
  },
  {
    id: 4,
    callerName: "Bank Fraud Operations",
    phoneNumber: "+61 7 3150 7788",
    callerInfo: "Impersonation of an Australian bank fraud team",
    conversation: [
      { type: "incoming", text: "We’ve blocked a suspicious transfer. Confirm your card and one-time code now." },
      { type: "outgoing", text: "I can log into my banking app to check." },
      { type: "incoming", text: "No time. Read the one-time code from your SMS quickly!" },
      { type: "outgoing", text: "I will call the bank on the number on my card." },
    ],
    isPhishing: true,
    hints: [
      "Banks will not rush you to read one-time passwords (OTP) over the phone",
      "OTP sharing grants access to your account — never share",
      "Caller ID can be spoofed to look local",
      "Hang up and call the bank using the number on your card",
    ],
  },
  {
    id: 5,
    callerName: "Department of Home Affairs",
    phoneNumber: "+61 2 6100 0000",
    callerInfo: "Threat-based visa/immigration scam",
    conversation: [
      { type: "incoming", text: "Home Affairs — your visa status is non-compliant. Pay a penalty today or face deportation." },
      { type: "outgoing", text: "I’ve never received any notice about this." },
      { type: "incoming", text: "This is urgent. Transfer funds now to avoid immediate action." },
      { type: "outgoing", text: "I’ll verify through my ImmiAccount first." },
    ],
    isPhishing: true,
    hints: [
      "Government agencies won’t demand payment over the phone",
      "Threats of deportation to force payment are typical scams",
      "Verify using your official ImmiAccount or published contact channels",
      "Do not transfer funds to unfamiliar accounts",
    ],
  },
  {
    id: 6,
    callerName: "Energy Provider",
    phoneNumber: "+61 8 7077 2200",
    callerInfo: "Disconnection threat for unpaid bill",
    conversation: [
      { type: "incoming", text: "Your power will be disconnected today unless you pay now by phone." },
      { type: "outgoing", text: "I’ll check my online account first." },
      { type: "incoming", text: "No, pay now by card to avoid immediate cutoff." },
      { type: "outgoing", text: "I won’t give card details by phone." },
    ],
    isPhishing: true,
    hints: [
      "Legitimate providers send notices and accept payment via official portals",
      "Demanding immediate card payment by phone is suspicious",
      "Verify through your online account or bill",
      "High-pressure timelines are red flags",
    ],
  },
  {
    id: 7,
    callerName: "Remote Job Coordinator",
    phoneNumber: "+61 412 345 678",
    callerInfo: "Task-based job scam (WhatsApp/Telegram ‘rating tasks’) linked to overseas rings",
    conversation: [
      { type: "incoming", text: "Easy remote job: complete simple tasks and earn $300/day." },
      { type: "outgoing", text: "What’s required?" },
      { type: "incoming", text: "First deposit a small amount to ‘activate’ your account — you’ll withdraw more later." },
      { type: "outgoing", text: "I won’t deposit money to start a job." },
    ],
    isPhishing: true,
    hints: [
      "Legitimate jobs don’t require upfront deposits",
      "Common pipeline for investment fraud linked to offshore scam compounds",
      "Pressure to deposit quickly is a red flag",
      "Research company and avoid moving chats to encrypted apps blindly",
    ],
  },
  {
    id: 8,
    callerName: "Australian Federal Police",
    phoneNumber: "+61 3 7001 4422",
    callerInfo: "Impersonation claiming there’s a warrant",
    conversation: [
      { type: "incoming", text: "This is the AFP. A warrant has been issued in your name." },
      { type: "outgoing", text: "I’ve received no letters or emails about that." },
      { type: "incoming", text: "To resolve this, pay a security bond now via bank transfer." },
      { type: "outgoing", text: "I will verify with the official AFP contact first." },
    ],
    isPhishing: true,
    hints: [
      "Police do not resolve warrants via phone payments",
      "Demands for bank transfer/crypto indicate fraud",
      "Verify by calling official AFP contact details published on their site",
      "Scammers exploit fear and urgency",
    ],
  },
  {
    id: 9,
    callerName: "Local Council",
    phoneNumber: "+61 2 9011 2233",
    callerInfo: "Legitimate service call (bin collection update)",
    conversation: [
      { type: "incoming", text: "Council here — tomorrow’s bin pickup is delayed to Friday due to a truck issue." },
      { type: "outgoing", text: "Thanks for the heads-up." },
      { type: "incoming", text: "No action needed. Have a good day." },
      { type: "outgoing", text: "Cheers." },
    ],
    isPhishing: false,
    hints: [
      "Clear, local-service context with no payment or sensitive info requests",
      "No pressure language; purely informational",
      "Matches your address/service area",
      "You can verify on the council website if unsure",
    ],
  },
  {
    id: 10,
    callerName: "Telco Technician",
    phoneNumber: "+61 2 8003 9456",
    callerInfo: "Legitimate appointment confirmation",
    conversation: [
      { type: "incoming", text: "Tech visit confirmation for Friday 2–4pm — does that still work for you?" },
      { type: "outgoing", text: "Yes, that time is fine." },
      { type: "incoming", text: "Great. No payment is taken over the phone." },
      { type: "outgoing", text: "See you then." },
    ],
    isPhishing: false,
    hints: [
      "Matches an existing appointment request",
      "No request for payment or codes",
      "Provides verifiable order/appointment context",
      "You can confirm in your telco account",
    ],
  },
  {
    id: 11,
    callerName: "Investment Consultant",
    phoneNumber: "+61 4 5556 7788",
    callerInfo: "‘Romance/investment’ follow-up call after chatting online",
    conversation: [
      { type: "incoming", text: "I found a guaranteed crypto opportunity — we can double your funds in a week." },
      { type: "outgoing", text: "That sounds risky. Is it regulated?" },
      { type: "incoming", text: "Don’t miss out — transfer now and I’ll guide you step-by-step on WhatsApp." },
      { type: "outgoing", text: "I don’t send money to unverified platforms." },
    ],
    isPhishing: true,
    hints: [
      "Promises of guaranteed high returns are fraudulent",
      "Shifting to encrypted apps and urgency to invest are red flags",
      "Common in ‘pig-butchering’ scams tied to overseas rings",
      "Verify licensing on AUSTRAC/ASIC registers and use trusted platforms only",
    ],
  },
]

const videoGames = [
  {
    id: 1,
    title: "Bank CEO Statement — Compensation Policy",
    description: "A bank ‘CEO’ announces a special compensation scheme",
    emoji: "🏦",
    videoSrc: "src/video/au-deepfake-bank.mp4",
    videoType: "video/mp4",
    isDeepfake: true,
    hints: [
      "Lip-sync slightly trails audio during longer sentences",
      "Skin texture inconsistent around cheeks under motion",
      "Lighting reflections don’t match head turns",
      "Corporate wording feels generic and non-specific",
    ],
  },
  {
    id: 2,
    title: "AFP Briefing — Scam Call Centres",
    description: "Official press briefing on transnational scam operations",
    emoji: "🎙️",
    videoSrc: "src/video/afp-briefing.mp4",
    videoType: "video/mp4",
    isDeepfake: false,
    hints: [
      "Natural micro-expressions and eye blinks",
      "Consistent podium lighting and microphone audio",
      "Multiple camera angles with continuous shadows intact",
      "Specific operational details and verifiable references",
    ],
  },
  {
    id: 3,
    title: "ATO Urgent Tax Alert",
    description: "A top official warns about urgent back taxes",
    emoji: "🧾",
    videoSrc: "src/video/ato-urgent-clip.mp4",
    videoType: "video/mp4",
    isDeepfake: true,
    hints: [
      "Mouth corners misalign on plosive sounds",
      "Uniform tone with odd pauses — TTS artifacts",
      "Badge edges shimmer during head movement",
      "Overuse of ‘immediately’ and vague payment instructions",
    ],
  },
  {
    id: 4,
    title: "NBN Scam Awareness PSA",
    description: "Consumer guidance on avoiding fake tech-support calls",
    emoji: "📡",
    videoSrc: "src/video/nbn-psa.mp4",
    videoType: "video/mp4",
    isDeepfake: false,
    hints: [
      "Professional B-roll and consistent VO mix",
      "Clear policy references and links to official site",
      "No uncanny artifacts around eyes/lips",
      "Actionable steps rather than fear-based language",
    ],
  },
]

// Render Functions
function render() {
  const app = document.getElementById("app")

  if (gameState.currentScreen === "menu") {
    app.innerHTML = renderMenu()
  } else if (gameState.currentScreen === "game") {
    app.innerHTML = renderGame()
  } else if (gameState.currentScreen === "results") {
    app.innerHTML = renderResults()
  }

  attachEventListeners()
}

function renderMenu() {
  return `
        <div class="header">
            <div class="header-title">🛡️ Phishing & Deepfake Detector</div>
            <div class="score-display">
                <div class="score-item">
                    <div class="score-label">Total Score</div>
                    <div class="score-value">${gameState.score}/${gameState.totalAnswered || 0}</div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="menu-screen">
                <h1 class="menu-title">Learn to Spot Threats</h1>
                <p class="menu-subtitle">Test your skills in identifying phishing emails, scam calls, and deepfake videos. Can you spot the fakes?</p>
                <div class="games-grid">
                    <div class="game-card" onclick="startGame('email')">
                        <div class="game-icon">📧</div>
                        <h3 class="game-card-title">Email Phishing</h3>
                        <p class="game-card-desc">Identify suspicious emails and learn about domain spoofing</p>
                    </div>
                    <div class="game-card" onclick="startGame('phone')">
                        <div class="game-icon">☎️</div>
                        <h3 class="game-card-title">Phone Scams</h3>
                        <p class="game-card-desc">Detect fraudulent phone calls and social engineering</p>
                    </div>
                    <div class="game-card" onclick="startGame('video')">
                        <div class="game-icon">🎥</div>
                        <h3 class="game-card-title">Deepfake Videos</h3>
                        <p class="game-card-desc">Spot AI-generated deepfake videos with swipe gestures</p>
                    </div>
                </div>
            </div>
        </div>
    `
}

function renderGame() {
  let content = ""

  if (gameState.currentGame === "email") {
    content = renderEmailGame()
  } else if (gameState.currentGame === "phone") {
    content = renderPhoneGame()
  } else if (gameState.currentGame === "video") {
    content = renderVideoGame()
  }

  return `
        <div class="header">
            <div class="header-title">🛡️ Phishing & Deepfake Detector</div>
            <div class="score-display">
                <div class="score-item">
                    <div class="score-label">Score</div>
                    <div class="score-value">${gameState.score}/${gameState.currentQuestion}</div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="game-screen">
                <div class="game-header">
                    <h2 class="game-title">${getGameTitle()}</h2>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(gameState.currentQuestion / getGameLength()) * 100}%"></div>
                    </div>
                </div>
                ${content}
            </div>
        </div>
    `
}

function renderEmailGame() {
  const email = emailGames[gameState.currentQuestion]
  return `
        <div class="email-container">
            <div class="email-header">
                <div class="email-from">
                    <div class="email-avatar">${email.fromName.charAt(0)}</div>
                    <div class="email-from-info">
                        <h3>${email.fromName}</h3>
                        <p>${email.from}</p>
                    </div>
                </div>
                <div class="email-time">Today</div>
            </div>
            <div class="email-subject">${email.subject}</div>
            <div class="email-body">${email.body.replace(/\n/g, "<br>")}</div>
        </div>
        <div style="text-align: center; margin-bottom: 2rem;">
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">Is this email phishing or legitimate?</p>
            <div class="button-group">
                <button class="btn btn-danger btn-large" onclick="answerQuestion(true)">🚨 Phishing</button>
                <button class="btn btn-success btn-large" onclick="answerQuestion(false)">✓ Legitimate</button>
            </div>
        </div>
    `
}
const phoneLookupDB = {
  "+61 2 8015 4470": {
    carrier: "VoIP gateway (AU termination)",
    region: "Sydney, NSW, AU",
    firstSeen: "2024-11-02",
    reports: 312,
    anomaly: "Clusters of ‘ATO payment’ scripts; short ring/recall cycles; suspected spoofing",
  },
  "+61 3 7000 1245": {
    carrier: "Australia Post ops trunk",
    region: "Melbourne, VIC, AU",
    firstSeen: "2019-05-18",
    reports: 0,
    anomaly: "Informational outbound; no payment requests recorded",
  },
  "+61 2 8880 9011": {
    carrier: "Virtual PBX",
    region: "Sydney, NSW, AU",
    firstSeen: "2023-06-27",
    reports: 154,
    anomaly: "Remote-access tool referrals; fee collection attempts post ‘router infection’ script",
  },
  "+61 7 3150 7788": {
    carrier: "VoIP multi-tenant",
    region: "Brisbane, QLD, AU",
    firstSeen: "2024-02-09",
    reports: 198,
    anomaly: "OTP requests tied to ‘bank fraud’ narrative; multiple bank brands in same session",
  },
  "+61 2 6100 0000": {
    carrier: "VoIP enterprise",
    region: "Canberra, ACT, AU",
    firstSeen: "2024-08-15",
    reports: 121,
    anomaly: "Threat-based visa status calls; wire/crypto payment redirections",
  },
  "+61 8 7077 2200": {
    carrier: "SIP trunk",
    region: "Adelaide, SA, AU",
    firstSeen: "2024-04-01",
    reports: 84,
    anomaly: "Same-day ‘disconnection’ pressure; card detail capture attempts",
  },
  "+61 412 345 678": {
    carrier: "Mobile (AU)",
    region: "Unknown (number masking common)",
    firstSeen: "2024-12-03",
    reports: 167,
    anomaly: "‘Deposit to activate job account’ pattern; migration to encrypted apps",
  },
  "+61 3 7001 4422": {
    carrier: "VoIP gateway",
    region: "Melbourne, VIC, AU",
    firstSeen: "2023-12-11",
    reports: 139,
    anomaly: "‘AFP warrant’ claims with bond transfers; scripted call tree",
  },
  "+61 2 9011 2233": {
    carrier: "Council operations line",
    region: "Sydney, NSW, AU",
    firstSeen: "2018-02-07",
    reports: 0,
    anomaly: "Service notifications; no payment capture behaviors observed",
  },
  "+61 2 8003 9456": {
    carrier: "Telco field ops",
    region: "Sydney, NSW, AU",
    firstSeen: "2020-10-19",
    reports: 0,
    anomaly: "Appointment confirmations; correlates with work-order references",
  },
  "+61 4 5556 7788": {
    carrier: "Mobile (AU)",
    region: "Unknown (rotating endpoints)",
    firstSeen: "2025-01-28",
    reports: 203,
    anomaly: "‘Guaranteed returns’ narratives; wallet addresses rotate; off-platform guidance",
  },
}


function renderPhoneGame() {
  const phone = phoneGames[gameState.currentQuestion]
  return `
        <div class="phone-container">
            <div class="phone-header">
                <div class="phone-avatar">☎️</div>
                <div class="phone-name">${phone.callerName}</div>
                <div class="phone-number" 
                  onmouseenter="showNumberLookup(event, '${phone.phoneNumber}')"
                  onmouseleave="hideNumberLookup()"
                  style="position:relative; cursor:help; text-decoration:underline dotted;">
                ${phone.phoneNumber}
              </div>
<div id="lookup-tooltip" class="lookup-tooltip"></div>

            <div class="conversation">
                ${phone.conversation
                  .map(
                    (msg) => `
                    <div class="message ${msg.type}">${msg.text}</div>
                `,
                  )
                  .join("")}
            </div>
            <div style="text-align: center;">
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">Is this call a scam or legitimate?</p>
                <div class="button-group">
                    <button class="btn btn-danger btn-large" onclick="answerQuestion(true)">🚨 Scam</button>
                    <button class="btn btn-success btn-large" onclick="answerQuestion(false)">✓ Legitimate</button>
                </div>
            </div>
        </div>
    `
}

function renderVideoGame() {
  const video = videoGames[gameState.currentQuestion]
  const hasVideo = Boolean(video.videoSrc)
  return `
        <div class="video-container">
            <div class="video-display" id="videoDisplay" ontouchstart="handleTouchStart(event)" ontouchend="handleTouchEnd(event)">
                ${
                  hasVideo
                    ? `<video class="video-player" controls preload="metadata" playsinline>
                            <source src="${video.videoSrc}" type="${video.videoType || "video/mp4"}">
                            Your browser does not support the video tag.
                       </video>`
                    : `<div class="video-placeholder">${video.emoji}</div>`
                }
            </div>
            <div class="video-info">
                <div class="video-title">${video.title}</div>
                <div class="video-description">${video.description}</div>
            </div>
            <div class="swipe-hint">👈 Swipe left for FAKE | Swipe right for REAL 👉</div>
            <div style="text-align: center;">
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">Or use buttons:</p>
                <div class="button-group">
                    <button class="btn btn-danger btn-large" onclick="answerQuestion(true)">👈 Deepfake</button>
                    <button class="btn btn-success btn-large" onclick="answerQuestion(false)">👉 Real</button>
                </div>
            </div>
        </div>
    `
}

function renderResults() {
  let currentData = []
  let isCorrect = false
  let explanation = ""

  if (gameState.currentGame === "email") {
    const email = emailGames[gameState.currentQuestion - 1]
    currentData = email
    isCorrect = gameState.answers[gameState.currentQuestion - 1] === email.isPhishing
    explanation = isCorrect ? "Great job! You correctly identified this email." : "Oops! You missed this one."
  } else if (gameState.currentGame === "phone") {
    const phone = phoneGames[gameState.currentQuestion - 1]
    currentData = phone
    isCorrect = gameState.answers[gameState.currentQuestion - 1] === phone.isPhishing
    explanation = isCorrect ? "Great job! You correctly identified this call." : "Oops! You missed this one."
  } else if (gameState.currentGame === "video") {
    const video = videoGames[gameState.currentQuestion - 1]
    currentData = video
    isCorrect = gameState.answers[gameState.currentQuestion - 1] === video.isDeepfake
    explanation = isCorrect ? "Great job! You correctly identified this video." : "Oops! You missed this one."
  }

  const isLastQuestion = gameState.currentQuestion >= getGameLength()

  return `
        <div class="header">
            <div class="header-title">🛡️ Phishing & Deepfake Detector</div>
            <div class="score-display">
                <div class="score-item">
                    <div class="score-label">Score</div>
                    <div class="score-value">${gameState.score}/${gameState.currentQuestion}</div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="results-screen">
                <h1 class="results-title ${isCorrect ? "results-correct" : "results-incorrect"}">
                    ${isCorrect ? "✓ Correct!" : "✗ Incorrect"}
                </h1>
                <p class="results-message">${explanation}</p>
                
                <div class="results-info">
                    ${renderResultsInfo(currentData)}
                </div>
                
                <div class="button-group">
                    ${
                      isLastQuestion
                        ? `
                        <button class="btn btn-primary btn-large" onclick="finishGame()">📊 View Final Results</button>
                    `
                        : `
                        <button class="btn btn-primary btn-large" onclick="nextQuestion()">Next Question →</button>
                    `
                    }
                    <button class="btn btn-secondary btn-large" onclick="backToMenu()">Back to Menu</button>
                </div>
            </div>
        </div>
    `
}

function renderResultsInfo(data) {
  if (gameState.currentGame === "email") {
    return `
            <div class="info-item">
                <div class="info-label">From</div>
                <div class="info-value">${data.from}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Status</div>
                <div class="info-value">${data.isPhishing ? "🚨 Phishing" : "✓ Legitimate"}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Red Flags & Tips</div>
                <div style="font-size: 0.9rem; line-height: 1.6;">
                    ${data.hints.map((hint) => `<div style="margin-bottom: 0.5rem;">• ${hint}</div>`).join("")}
                </div>
            </div>
        `
  } else if (gameState.currentGame === "phone") {
    return `
            <div class="info-item">
                <div class="info-label">Caller</div>
                <div class="info-value">${data.callerName}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Status</div>
                <div class="info-value">${data.isPhishing ? "🚨 Scam" : "✓ Legitimate"}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Red Flags & Tips</div>
                <div style="font-size: 0.9rem; line-height: 1.6;">
                    ${data.hints.map((hint) => `<div style="margin-bottom: 0.5rem;">• ${hint}</div>`).join("")}
                </div>
            </div>
        `
  } else if (gameState.currentGame === "video") {
    return `
            <div class="info-item">
                <div class="info-label">Video Title</div>
                <div class="info-value">${data.title}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Status</div>
                <div class="info-value">${data.isDeepfake ? "🚨 Deepfake" : "✓ Real"}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Detection Tips</div>
                <div style="font-size: 0.9rem; line-height: 1.6;">
                    ${data.hints.map((hint) => `<div style="margin-bottom: 0.5rem;">• ${hint}</div>`).join("")}
                </div>
            </div>
        `
  }
}

function renderFinalResults() {
  const accuracy = Math.round((gameState.score / gameState.totalAnswered) * 100)

  return `
        <div class="header">
            <div class="header-title">🛡️ Phishing & Deepfake Detector</div>
        </div>
        <div class="container">
            <div class="results-screen">
                <h1 class="results-title">Game Complete!</h1>
                <p class="results-message">You've completed all questions. Here's how you did:</p>
                
                <div class="stats-grid">
                    <div class="stat-box">
                        <div class="stat-label">Correct Answers</div>
                        <div class="stat-value">${gameState.score}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Total Questions</div>
                        <div class="stat-value">${gameState.totalAnswered}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Accuracy</div>
                        <div class="stat-value">${accuracy}%</div>
                    </div>
                </div>
                
                <div class="results-info">
                    <div class="info-item">
                        <div class="info-label">Performance</div>
                        <div class="info-value">
                            ${
                              accuracy >= 80
                                ? "🏆 Excellent! You're a security expert!"
                                : accuracy >= 60
                                  ? "👍 Good job! Keep practicing."
                                  : "📚 Keep learning! Try again to improve."
                            }
                        </div>
                    </div>
                </div>
                
                <div class="button-group">
                    <button class="btn btn-primary btn-large" onclick="backToMenu()">Play Again</button>
                </div>
            </div>
        </div>
    `
}

// Game Logic
function startGame(game) {
  gameState.currentGame = game
  gameState.currentScreen = "game"
  gameState.currentQuestion = 0
  gameState.score = 0
  gameState.answers = []
  gameState.totalAnswered = 0
  render()
}

function answerQuestion(answer) {
  gameState.answers.push(answer)
  gameState.currentQuestion++
  gameState.totalAnswered++

  // Check if answer is correct
  let isCorrect = false
  if (gameState.currentGame === "email") {
    isCorrect = answer === emailGames[gameState.currentQuestion - 1].isPhishing
  } else if (gameState.currentGame === "phone") {
    isCorrect = answer === phoneGames[gameState.currentQuestion - 1].isPhishing
  } else if (gameState.currentGame === "video") {
    isCorrect = answer === videoGames[gameState.currentQuestion - 1].isDeepfake
  }

  if (isCorrect) {
    gameState.score++
  }

  gameState.currentScreen = "results"
  render()
}

function nextQuestion() {
  if (gameState.currentQuestion >= getGameLength()) {
    finishGame()
  } else {
    gameState.currentScreen = "game"
    render()
  }
}

function finishGame() {
  gameState.currentScreen = "results"
  document.getElementById("app").innerHTML = renderFinalResults()
  attachEventListeners()
}

function backToMenu() {
  gameState.currentScreen = "menu"
  gameState.currentGame = null
  gameState.currentQuestion = 0
  gameState.score = 0
  gameState.answers = []
  gameState.totalAnswered = 0
  render()
}

function getGameTitle() {
  if (gameState.currentGame === "email") return "📧 Email Phishing Game"
  if (gameState.currentGame === "phone") return "☎️ Phone Scam Game"
  if (gameState.currentGame === "video") return "🎥 Deepfake Video Game"
  return ""
}

function getGameLength() {
  if (gameState.currentGame === "email") return emailGames.length
  if (gameState.currentGame === "phone") return phoneGames.length
  if (gameState.currentGame === "video") return videoGames.length
  return 0
}

// Touch/Swipe Handling for Video Game
function handleTouchStart(e) {
  gameState.touchStartX = e.changedTouches[0].screenX
}

function handleTouchEnd(e) {
  gameState.touchEndX = e.changedTouches[0].screenX
  handleSwipe()
}

function handleSwipe() {
  if (gameState.currentGame !== "video") return

  const diff = gameState.touchStartX - gameState.touchEndX
  const threshold = 50

  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      // Swiped left - Deepfake
      answerQuestion(true)
    } else {
      // Swiped right - Real
      answerQuestion(false)
    }
  }
}

let lookupVisible = false;

function showNumberLookup(e, number) {
  const tooltip = document.getElementById("lookup-tooltip");
  if (!tooltip) return;

  const data = phoneLookupDB[number] || {
    carrier: "Unknown",
    region: "Unknown",
    firstSeen: "N/A",
    reports: 0,
    anomaly: "No records found"
  };

  tooltip.innerHTML = `
    <div style="font-weight:bold;color:#6cf;">[Number Intelligence Report]</div>
    <div><strong>Line Type:</strong> ${data.carrier}</div>
    <div><strong>Origin:</strong> ${data.region}</div>
    <div><strong>First Logged:</strong> ${data.firstSeen}</div>
    <div><strong>Community Reports:</strong> ${data.reports}</div>
    <div><strong>Reputation Notes:</strong> ${data.anomaly}</div>
  `;

  tooltip.style.display = "block";
  lookupVisible = true;
  positionTooltip(e);
}

function positionTooltip(e) {
  const tooltip = document.getElementById("lookup-tooltip");
  if (!tooltip || !lookupVisible) return;
  tooltip.style.left = e.clientX + 15 + "px";
  tooltip.style.top = e.clientY + 15 + "px";
}

function hideNumberLookup() {
  const tooltip = document.getElementById("lookup-tooltip");
  if (!tooltip) return;
  tooltip.style.display = "none";
  lookupVisible = false;
}

// optional: hide tooltip when mouse leaves the window
window.addEventListener("mouseout", (e) => {
  if (!e.relatedTarget && lookupVisible) hideNumberLookup();
});
window.addEventListener("mousemove", positionTooltip);


// Event Listeners
function attachEventListeners() {
  // Event listeners are attached via onclick attributes in HTML
}

// Initialize
render()
