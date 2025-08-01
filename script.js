// Chatbot Logic
const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const confettiCanvas = document.getElementById('confetti');
let confettiCtx;

const questions = [
  { key: 'pages', text: 'How many pages do you need for your website?' },
  { key: 'booking', text: 'Do you need booking/scheduling functionality? (yes/no)' },
  { key: 'content', text: 'Will you provide all content (text/images)? (yes/no)' },
  { key: 'launchDate', text: 'What is your desired launch date? (YYYY-MM-DD)' },
  { key: 'maintenance', text: 'Do you want ongoing maintenance? (yes/no)' }
];

let answers = {};
let currentQ = 0;

function appendMessage(text, sender='bot') {
  const msg = document.createElement('div');
  msg.className = 'message ' + sender;
  msg.innerText = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function startChat() {
  appendMessage('Welcome to Quote4You! I will help you get a custom website quote.');
  setTimeout(() => askQuestion(), 500);
}

function askQuestion() {
  if (currentQ < questions.length) {
    appendMessage(questions[currentQ].text);
  } else {
    computeQuote();
  }
}

function computeQuote() {
  // Extract and parse answers
  const pages = parseInt(answers.pages) || 1;
  let cost = pages === 1 ? 200 : 200 + (pages - 1) * 75;
  if (answers.booking.toLowerCase() === 'yes') cost += 100;
  if (answers.content.toLowerCase() === 'yes') cost -= 75;
  const launch = new Date(answers.launchDate);
  const today = new Date();
  const diffDays = Math.ceil((launch - today) / (1000*60*60*24));
  if (!isNaN(diffDays) && diffDays < 14) cost += 100;

  // Build response
  let response = `Great! Based on your requirements: a ${pages}-page site`;
  if (answers.booking.toLowerCase() === 'yes') response += ', booking feature';
  if (answers.content.toLowerCase() === 'no') response += ', content creation by us';
  if (diffDays < 14) response += ', rush service';
  if (answers.maintenance.toLowerCase() === 'yes') response += ', and maintenance plan';
  response += `. Your customized quote is $${cost}. Thank you!`;

  appendMessage(response);
  launchConfetti();
}

sendBtn.addEventListener('click', () => {
  const text = userInput.value.trim();
  if (!text) return;
  appendMessage(text, 'user');
  answers[questions[currentQ].key] = text;
  userInput.value = '';
  currentQ++;
  setTimeout(() => askQuestion(), 500);
});

// Confetti
function initConfetti() {
  confettiCtx = confettiCanvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function launchConfetti() {
  for (let i = 0; i < 100; i++) {
    drawConfetti();
  }
  setTimeout(() => confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height), 2000);
}

function drawConfetti() {
  const x = Math.random() * confettiCanvas.width;
  const y = Math.random() * confettiCanvas.height;
  const size = Math.random() * 6 + 4;
  const colors = ['#00ffea', '#ff0099', '#ffff00'];
  confettiCtx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
  confettiCtx.beginPath();
  confettiCtx.arc(x, y, size, 0, 2 * Math.PI);
  confettiCtx.fill();
}

initConfetti();
startChat();
