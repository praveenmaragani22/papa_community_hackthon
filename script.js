let targetMinutes = 180;
let totalTokens = targetMinutes;
let tokensLeft = totalTokens;
let todayUsed = 0;

// simulated last 7 days (minutes)
let weeklyData = [260, 245, 235, 220, 210, 200, 190];

// elements
const tokensEl = document.getElementById("tokensLeft");
const todayEl = document.getElementById("todayTime");
const weeklyEl = document.getElementById("weeklyAvg");
const targetEl = document.getElementById("targetText");
const slider = document.getElementById("targetSlider");
const sliderValue = document.getElementById("sliderValue");
const progressFill = document.getElementById("progressFill");
const reductionText = document.getElementById("reductionText");

// chart
const ctx = document.getElementById("tokenChart");
const tokenChart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Used Tokens", "Remaining Tokens"],
    datasets: [{
      data: [todayUsed, tokensLeft],
      backgroundColor: ["#e74c3c", "#2ecc71"]
    }]
  },
  options: {
    plugins: { legend: { position: "bottom" } }
  }
});

slider.value = targetMinutes;

function usePhone() {
  if (tokensLeft <= 0) {
    alert("No tokens left for today. Take a break.");
    return;
  }

  todayUsed += 10;
  tokensLeft -= 10;
  updateUI();
}

slider.oninput = function () {
  targetMinutes = parseInt(this.value);
  totalTokens = targetMinutes;
  tokensLeft = Math.max(totalTokens - todayUsed, 0);
  updateUI();
};

function updateUI() {
  tokensEl.innerText = tokensLeft;
  todayEl.innerText = formatTime(todayUsed);
  targetEl.innerText = formatTime(targetMinutes);
  sliderValue.innerText = "Target: " + formatTime(targetMinutes);

  let weeklyAvg =
    weeklyData.reduce((a, b) => a + b, 0) / weeklyData.length;
  weeklyEl.innerText = formatTime(Math.round(weeklyAvg));

  let reduction = weeklyData[0] - todayUsed;
  reductionText.innerText =
    reduction > 0
      ? "↓ Reduced " + reduction + " minutes compared to last week"
      : "No reduction yet";

  let progress = Math.min((todayUsed / targetMinutes) * 100, 100);
  progressFill.style.width = progress + "%";

  tokenChart.data.datasets[0].data = [todayUsed, tokensLeft];
  tokenChart.update();
}

function formatTime(min) {
  let h = Math.floor(min / 60);
  let m = min % 60;
  return h + "h " + (m < 10 ? "0" : "") + m + "m";
}

updateUI();
