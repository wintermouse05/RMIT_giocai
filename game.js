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
    callerName: "Bank Security Team",
    phoneNumber: "+1 (555) 123-4567",
    callerInfo: "Unknown caller claiming to be from your bank",
    conversation: [
      {
        type: "incoming",
        text: "Hello, this is the security team from your bank. We detected fraudulent activity on your account.",
      },
      { type: "outgoing", text: "Oh no, what should I do?" },
      {
        type: "incoming",
        text: "We need you to verify your account details. Can you provide your account number and PIN?",
      },
      { type: "outgoing", text: "I'm not sure about that..." },
    ],
    isPhishing: true,
    hints: [
      "Banks never ask for PIN or account numbers over the phone",
      "Legitimate banks have official numbers, not random ones",
      "Pressure tactics are common in phishing calls",
      "Always hang up and call your bank directly",
    ],
  },
  {
    id: 2,
    callerName: "Mom",
    phoneNumber: "+1 (555) 987-6543",
    callerInfo: "Contact saved in your phone",
    conversation: [
      { type: "incoming", text: "Hi honey, how are you doing?" },
      { type: "outgoing", text: "Hi Mom! I'm doing well, how about you?" },
      { type: "incoming", text: "Good! Just wanted to check in. Are you coming to dinner on Sunday?" },
      { type: "outgoing", text: "Yes, I'll be there!" },
    ],
    isPhishing: false,
    hints: [
      "Contact is saved in your phone",
      "Natural conversation flow",
      "No requests for personal information",
      "Legitimate personal call",
    ],
  },
  {
    id: 3,
    callerName: "IRS Tax Department",
    phoneNumber: "+1 (800) 555-0199",
    callerInfo: "Caller ID shows government number",
    conversation: [
      { type: "incoming", text: "This is the IRS. We have detected tax fraud on your account." },
      { type: "outgoing", text: "What? I don't think that's right." },
      {
        type: "incoming",
        text: "You need to pay immediately or we will file charges against you. Send payment via iTunes cards.",
      },
      { type: "outgoing", text: "Wait, that doesn't sound right..." },
    ],
    isPhishing: true,
    hints: [
      "IRS never initiates contact by phone",
      "Requesting iTunes cards is a major red flag",
      "Threatening legal action is a common scam tactic",
      "Government agencies don't demand immediate payment",
    ],
  },
  {
    id: 4,
    callerName: "Pizza Palace",
    phoneNumber: "+1 (555) 234-5678",
    callerInfo: "Local restaurant",
    conversation: [
      { type: "incoming", text: "Hi, this is Pizza Palace. Your order is ready for pickup!" },
      { type: "outgoing", text: "Great! I'll be there in 10 minutes." },
      { type: "incoming", text: "Perfect! See you soon." },
    ],
    isPhishing: false,
    hints: [
      "Legitimate business call",
      "No personal information requested",
      "Simple and straightforward",
      "Expected call about your order",
    ],
  },
]

const videoGames = [
  {
    id: 1,
    title: "Celebrity Interview",
    description: "A famous actor discussing their new movie",
    emoji: "🎬",
    isDeepfake: true,
    hints: [
      "Unnatural lip-sync",
      "Inconsistent lighting",
      "Slight glitches in facial movements",
      "Audio doesn't perfectly match mouth movements",
    ],
  },
  {
    id: 2,
    title: "News Report",
    description: "Breaking news from a major news outlet",
    emoji: "📺",
    isDeepfake: false,
    hints: [
      "Professional production quality",
      "Consistent lighting and audio",
      "Natural facial expressions",
      "Authentic news broadcast",
    ],
  },
  {
    id: 3,
    title: "Political Statement",
    description: "A politician making an announcement",
    emoji: "🎤",
    isDeepfake: true,
    hints: [
      "Slightly blurry around edges",
      "Unnatural eye movements",
      "Inconsistent skin texture",
      "Audio seems slightly out of sync",
    ],
  },
  {
    id: 4,
    title: "Tutorial Video",
    description: "A tech expert explaining a new feature",
    emoji: "💻",
    isDeepfake: false,
    hints: ["Clear and natural movements", "Professional setup", "Consistent quality throughout", "Authentic content"],
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

function renderPhoneGame() {
  const phone = phoneGames[gameState.currentQuestion]
  return `
        <div class="phone-container">
            <div class="phone-header">
                <div class="phone-avatar">☎️</div>
                <div class="phone-name">${phone.callerName}</div>
                <div class="phone-number">${phone.phoneNumber}</div>
                <div class="phone-info">
                    <div class="phone-info-label">Caller Info</div>
                    <div>${phone.callerInfo}</div>
                </div>
            </div>
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
  return `
        <div class="video-container">
            <div class="video-display" id="videoDisplay" ontouchstart="handleTouchStart(event)" ontouchend="handleTouchEnd(event)">
                <div class="video-placeholder">${video.emoji}</div>
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

// Event Listeners
function attachEventListeners() {
  // Event listeners are attached via onclick attributes in HTML
}

// Initialize
render()
