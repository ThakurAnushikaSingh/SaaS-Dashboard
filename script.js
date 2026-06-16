const login = document.querySelector("#login");
const product = document.querySelector("#product");
const loginForm = document.querySelector("#loginForm");
const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");
const notificationToggle = document.querySelector("#notificationToggle");
const notifications = document.querySelector("#notifications");
const themeToggle = document.querySelector("#themeToggle");

const showPage = (pageId) => {
  login.classList.remove("active");
  product.classList.add("active");
  navItems.forEach((nav) => nav.classList.toggle("active", nav.dataset.page === pageId));
  pages.forEach((page) => page.classList.toggle("active", page.id === pageId));
};

if (window.location.hash) {
  const pageId = window.location.hash.replace("#", "");
  if (document.querySelector(`#${pageId}`)) showPage(pageId);
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showPage("dashboard");
  window.location.hash = "dashboard";
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    showPage(item.dataset.page);
    window.location.hash = item.dataset.page;
  });
});

notificationToggle.addEventListener("click", () => {
  notifications.classList.toggle("open");
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
