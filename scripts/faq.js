if (document.readyState !== "loading") init();
else window.addEventListener("DOMContentLoaded", init);

function init() {
  adjustTheme();
  const menus = document.querySelectorAll('[data-toggle="collapse"]');
  for (const menu of menus) {
    menu.addEventListener("click", () => {
      menu.classList.toggle("collapsed");
    });
  }
}

function adjustTheme() {
  const darkMode =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
  const isDarkMode = darkMode && darkMode.matches;

  const val = getSettingValue("theme");
  let v;
  if (!val) v = isDarkMode ? "dark" : "light";
  else v = val == "systemPreference" ? (isDarkMode ? "dark" : "light") : val;
  document.getElementsByTagName("html")[0].setAttribute("theme", v);
}

function getSettingValue(setting) {
  return localStorage.getItem(`setting_${setting}`);
}
