if (document.readyState !== "loading") init();
else window.addEventListener("DOMContentLoaded", init);

function init() {
  const menus = document.querySelectorAll('[data-toggle="collapse"]');
  for (const menu of menus) {
    menu.addEventListener("click", () => {
      menu.classList.toggle("collapsed");
    });
  }
}
