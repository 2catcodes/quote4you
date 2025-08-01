
document.getElementById("quoteForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const pages = parseInt(document.getElementById("pages").value);
  const booking = document.getElementById("booking").value === "yes";
  const contentProvided = document.getElementById("content").value === "yes";
  const launchDate = new Date(document.getElementById("launchDate").value);
  const maintenance = document.getElementById("maintenance").value === "yes";

  let total = pages === 1 ? 200 : 200 + (pages - 1) * 75;
  if (booking) total += 100;
  if (contentProvided) total -= 75;

  const today = new Date();
  const diffDays = Math.ceil((launchDate - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 14) total += 100;

  const result = \`
    <strong>🔥 Your Epic Quote is: $${total} 🔥</strong><br/>
    This includes a ${pages}-page site${booking ? ", booking system" : ""}${!contentProvided ? ", content creation" : ", client-provided content"}${diffDays < 14 ? ", rush fee applied" : ""}.${maintenance ? " Maintenance will be included." : ""}
  \`;

  const resultDiv = document.getElementById("quoteResult");
  resultDiv.innerHTML = result;
  resultDiv.classList.remove("hidden");

  launchConfetti();
});

function launchConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  for (let i = 0; i < 150; i++) {
    drawConfetti(ctx);
  }

  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 1500);
}

function drawConfetti(ctx) {
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  const size = Math.random() * 8 + 2;
  const colors = ["#00ffcc", "#ff0099", "#ffff66", "#66ff66", "#ff6600"];
  ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
}
