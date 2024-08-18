const toggleSwitch = document.getElementById("toggleSwitch");
const focusLength = document.getElementById("focusLength");
const focusLengthValue = document.getElementById("focusLengthValue");
const darkModeToggle = document.getElementById("darkModeToggle");
const darkModeToggle2 = document.getElementById("darkModeToggle2");

chrome.storage.sync.get(["isEnabled", "focusLength", "isDarkMode", "isDarkMode2"], ({ isEnabled, focusLength: savedFocusLength, isDarkMode, isDarkMode2 }) => {
  toggleSwitch.checked = isEnabled;
  focusLength.value = savedFocusLength || 2;
  focusLengthValue.textContent = focusLength.value;
  darkModeToggle.checked = isDarkMode;
  darkModeToggle2.checked = isDarkMode2;
});

toggleSwitch.addEventListener("change", () => {
  const isEnabled = toggleSwitch.checked;
  chrome.storage.sync.set({ isEnabled });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: isEnabled ? "activateBionicReading" : "deactivateBionicReading",
    });
  });
});

focusLength.addEventListener("input", () => {
  const value = focusLength.value;
  focusLengthValue.textContent = value;
  chrome.storage.sync.set({ focusLength: value });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "updateFocusLength", focusLength: value });
  });
});

//两按钮功能互斥，所以一开则另一关
darkModeToggle.addEventListener("change", () => {  
  const isDarkMode = darkModeToggle.checked;  
  chrome.storage.sync.set({ isDarkMode });  

  if (isDarkMode && darkModeToggle2.checked) {  
    darkModeToggle2.checked = false;  
    chrome.storage.sync.set({ isDarkMode2: false });  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {  
      chrome.tabs.sendMessage(tabs[0].id, { action: "toggleDarkMode2", isDarkMode2: false });  
    });  
  }  

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {  
    chrome.tabs.sendMessage(tabs[0].id, { action: "toggleDarkMode", isDarkMode });  
  });  
});  

darkModeToggle2.addEventListener("change", () => {  
  const isDarkMode2 = darkModeToggle2.checked;  
  chrome.storage.sync.set({ isDarkMode2 });  

  if (isDarkMode2 && darkModeToggle.checked) {  
    darkModeToggle.checked = false;  
    chrome.storage.sync.set({ isDarkMode: false });  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {  
      chrome.tabs.sendMessage(tabs[0].id, { action: "toggleDarkMode", isDarkMode: false });  
    });  
  }  

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {  
    chrome.tabs.sendMessage(tabs[0].id, { action: "toggleDarkMode2", isDarkMode2 });  
  });  
});  
