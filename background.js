let startTime = null;
let totalTime = 0; // in seconds

// Load saved time on startup
chrome.storage.local.get(["fiverrTime"], (result) => {
  if (result.fiverrTime) totalTime = result.fiverrTime;
});

// Track active tab time
function startTracking(tabId, changeInfo, tab) {
  if (tab.url && tab.url.includes("fiverr.com")) {
    if (!startTime) startTime = Date.now();
  } else {
    if (startTime) {
      totalTime += Math.floor((Date.now() - startTime) / 1000);
      chrome.storage.local.set({ fiverrTime: totalTime });
      startTime = null;
    }
  }
}

// Track when tabs are updated (like navigation)
chrome.tabs.onUpdated.addListener(startTracking);

// Track when switching tabs
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  startTracking(activeInfo.tabId, null, tab);
});

// Pause timer when Chrome is idle or computer locked
chrome.idle.onStateChanged.addListener((state) => {
  if (state !== "active" && startTime) {
    totalTime += Math.floor((Date.now() - startTime) / 1000);
    chrome.storage.local.set({ fiverrTime: totalTime });
    startTime = null;
  }
});

// Optional: save time every 10 seconds in case extension closes
setInterval(() => {
  if (startTime) {
    totalTime += Math.floor((Date.now() - startTime) / 1000);
    chrome.storage.local.set({ fiverrTime: totalTime });
    startTime = Date.now();
  }
}, 10000);
