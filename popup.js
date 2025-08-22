const timeEl = document.getElementById("time");
const resetBtn = document.getElementById("reset");

// Load stored time
function updateTime() {
  chrome.storage.local.get(["fiverrTime"], (result) => {
    let seconds = result.fiverrTime || 0;
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;
    timeEl.textContent = `${hours}h ${minutes}m ${secs}s`;
  });
}

// Reset timer
resetBtn.addEventListener("click", () => {
  chrome.storage.local.set({ fiverrTime: 0 }, updateTime);
});

// Update every second
setInterval(updateTime, 1000);
updateTime();
