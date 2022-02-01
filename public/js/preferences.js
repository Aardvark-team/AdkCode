if('serviceWorker' in navigator) {
  let registration;

  const registerServiceWorker = async () => {
    registration = await          navigator.serviceWorker.register('./service-worker.js');
  };

  registerServiceWorker();
}
// User Preferences Defaults
let userPreferences = {
  layout: "Side By Side", 
  theme: "1"
};

function getUserPreferences() {
  const preferencesStr = localStorage.getItem("prefs");
  let preferences = userPreferences;

  if (preferencesStr) {
    preferences = JSON.parse(preferencesStr);
  }

  return userPreferences = preferences;
}

function saveUserPreferences(data) {
  data=data||userPreferences
  const str = JSON.stringify(data);
  //console.log(str);

  localStorage.setItem("prefs", str);

  return str;
}