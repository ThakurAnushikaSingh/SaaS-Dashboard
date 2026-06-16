const login = document.querySelector("#login");
const product = document.querySelector("#product");
const loginForm = document.querySelector("#loginForm");
const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");
const notificationToggle = document.querySelector("#notificationToggle");
const notifications = document.querySelector("#notifications");
const notificationDot = document.querySelector("#notificationDot");
const markRead = document.querySelector("#markRead");
const themeToggle = document.querySelector("#themeToggle");
const menuToggle = document.querySelector("#menuToggle");
const sidebar = document.querySelector("#sidebar");
const globalSearch = document.querySelector("#globalSearch");
const searchResults = document.querySelector("#searchResults");
const projectRows = document.querySelector("#projectRows");
const projectFilters = document.querySelector("#projectFilters");
const projectCount = document.querySelector("#projectCount");
const projectModal = document.querySelector("#projectModal");
const createProject = document.querySelector("#createProject");
const modalProjectName = document.querySelector("#modalProjectName");
const modalProjectOwner = document.querySelector("#modalProjectOwner");
const toast = document.querySelector("#toast");
const kanban = document.querySelector("#kanban");
const teamGrid = document.querySelector("#teamGrid");
const periodFilters = document.querySelector("#periodFilters");

const projects = [
  { name: "Website Redesign", team: "5 Members", status: "Active", owner: "Emma", progress: 80 },
  { name: "Mobile App", team: "7 Members", status: "Active", owner: "Alex", progress: 65 },
  { name: "CRM Portal", team: "4 Members", status: "Review", owner: "Sarah", progress: 95 },
  { name: "Partner Onboarding", team: "3 Members", status: "Completed", owner: "John", progress: 100 },
  { name: "Dashboard Revamp", team: "6 Members", status: "Active", owner: "Maya", progress: 58 }
];

const tasks = [
  { title: "Finalize dashboard copy", detail: "Owner: Emma", status: "todo" },
  { title: "Prepare stakeholder notes", detail: "Owner: Sarah", status: "todo" },
  { title: "Analytics event mapping", detail: "Owner: Alex", status: "doing" },
  { title: "Mobile app wireframes", detail: "Owner: Emma", status: "doing" },
  { title: "UI Design", detail: "Shipped yesterday", status: "done" },
  { title: "Prototype approval", detail: "Client approved", status: "done" }
];

const team = [
  { initials: "EW", name: "Emma Watson", role: "UI Designer", email: "emma@taskflow.com", score: 94 },
  { initials: "AK", name: "Alex Kim", role: "Developer", email: "alex@taskflow.com", score: 91 },
  { initials: "SL", name: "Sarah Lee", role: "Product Manager", email: "sarah@taskflow.com", score: 97 },
  { initials: "JR", name: "John Rivera", role: "QA Lead", email: "john@taskflow.com", score: 88 },
  { initials: "MP", name: "Maya Patel", role: "Growth Lead", email: "maya@taskflow.com", score: 90 },
  { initials: "NO", name: "Noah Ortiz", role: "Data Analyst", email: "noah@taskflow.com", score: 86 }
];

const revenuePoints = {
  30: "20,180 120,145 220,158 320,95 420,112 560,45",
  90: "20,172 120,138 220,118 320,92 420,72 560,38",
  365: "20,190 120,170 220,142 320,104 420,62 560,28"
};

let activeProjectFilter = "All";
let completedBase = 1284;

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
};

const showPage = (pageId) => {
  login.classList.remove("active");
  product.classList.add("active");
  navItems.forEach((nav) => nav.classList.toggle("active", nav.dataset.page === pageId));
  pages.forEach((page) => page.classList.toggle("active", page.id === pageId));
  sidebar.classList.remove("open");
};

const renderProjects = () => {
  const visibleProjects = projects.filter((project) => activeProjectFilter === "All" || project.status === activeProjectFilter);
  projectCount.textContent = `${visibleProjects.length} project${visibleProjects.length === 1 ? "" : "s"}`;
  projectRows.innerHTML = visibleProjects.map((project) => {
    const statusClass = project.status.toLowerCase();
    return `
      <tr>
        <td>${project.name}</td>
        <td>${project.team}</td>
        <td><span class="pill ${statusClass}">${project.status}</span></td>
        <td>${project.owner}</td>
        <td><div class="progress"><span style="width:${project.progress}%"></span></div>${project.progress}%</td>
        <td><button class="row-action" data-project="${project.name}">Open</button></td>
      </tr>
    `;
  }).join("");
};

const renderTasks = () => {
  document.querySelectorAll(".task-column").forEach((column) => {
    const status = column.dataset.status;
    const columnTasks = tasks.filter((task) => task.status === status);
    column.querySelector(".panel-header span").textContent = columnTasks.length;
    column.querySelectorAll(".task-card").forEach((card) => card.remove());
    columnTasks.forEach((task) => {
      const card = document.createElement("div");
      card.className = "task-card";
      card.innerHTML = `
        <strong>${task.title}</strong>
        <p>${task.detail}</p>
        <div class="task-actions">
          ${status !== "todo" ? `<button data-move="todo" data-task="${task.title}">To Do</button>` : ""}
          ${status !== "doing" ? `<button data-move="doing" data-task="${task.title}">Start</button>` : ""}
          ${status !== "done" ? `<button data-move="done" data-task="${task.title}">Done</button>` : ""}
        </div>
      `;
      column.appendChild(card);
    });
  });
};

const renderTeam = (sort = false) => {
  const members = [...team].sort((a, b) => sort ? b.score - a.score : 0);
  teamGrid.innerHTML = members.map((member) => `
    <article class="member-card">
      <div class="member-top">
        <div class="photo">${member.initials}</div>
        <div>
          <h3>${member.name}</h3>
          <p>${member.role}</p>
        </div>
      </div>
      <span>${member.email}</span>
      <b>Performance ${member.score}</b>
      <div class="score"><span style="width:${member.score}%"></span></div>
    </article>
  `).join("");
};

const runSearch = (query) => {
  const q = query.trim().toLowerCase();
  if (!q) {
    searchResults.classList.remove("active");
    searchResults.textContent = "";
    return;
  }
  const matches = [
    ...projects.map((item) => ({ label: item.name, page: "projects" })),
    ...tasks.map((item) => ({ label: item.title, page: "tasks" })),
    ...team.map((item) => ({ label: item.name, page: "team" }))
  ].filter((item) => item.label.toLowerCase().includes(q));

  searchResults.classList.add("active");
  if (matches.length === 0) {
    searchResults.textContent = `No results for "${query}".`;
    return;
  }
  searchResults.innerHTML = `Found ${matches.length} result${matches.length === 1 ? "" : "s"}: ${matches.slice(0, 4).map((match) => `<button class="ghost-btn" data-page-target="${match.page}">${match.label}</button>`).join(" ")}`;
};

if (window.location.hash) {
  const pageId = window.location.hash.replace("#", "");
  if (document.querySelector(`#${pageId}`)) showPage(pageId);
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showPage("dashboard");
  window.location.hash = "dashboard";
  showToast("Signed in to TaskFlow MVP.");
});

document.querySelector("#forgotPassword").addEventListener("click", (event) => {
  event.preventDefault();
  document.querySelector("#loginNote").textContent = "Password reset link prepared for the demo account.";
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    showPage(item.dataset.page);
    window.location.hash = item.dataset.page;
  });
});

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-page-target]");
  if (!target) return;
  showPage(target.dataset.pageTarget);
  window.location.hash = target.dataset.pageTarget;
});

notificationToggle.addEventListener("click", () => notifications.classList.toggle("open"));

markRead.addEventListener("click", () => {
  notificationToggle.classList.add("read");
  notificationDot.hidden = true;
  showToast("Notifications marked as read.");
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  showToast(document.body.classList.contains("dark") ? "Dark mode enabled." : "Light mode enabled.");
});

menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));

globalSearch.addEventListener("input", (event) => runSearch(event.target.value));

projectFilters.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  activeProjectFilter = button.dataset.filter;
  projectFilters.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
  renderProjects();
});

projectRows.addEventListener("click", (event) => {
  const button = event.target.closest(".row-action");
  if (!button) return;
  showToast(`${button.dataset.project} opened in preview mode.`);
});

document.querySelectorAll(".new-project-btn").forEach((button) => {
  button.addEventListener("click", () => {
    modalProjectName.value = "";
    modalProjectOwner.value = "";
    projectModal.showModal();
  });
});

createProject.addEventListener("click", (event) => {
  event.preventDefault();
  const name = modalProjectName.value.trim() || "New MVP Project";
  const owner = modalProjectOwner.value.trim() || "Anushika";
  projects.unshift({ name, team: "1 Member", status: "Active", owner, progress: 5 });
  activeProjectFilter = "All";
  projectFilters.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button.dataset.filter === "All"));
  renderProjects();
  projectModal.close();
  showPage("projects");
  window.location.hash = "projects";
  showToast(`${name} created.`);
});

kanban.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-move]");
  if (!button) return;
  const task = tasks.find((item) => item.title === button.dataset.task);
  if (!task) return;
  const wasDone = task.status === "done";
  task.status = button.dataset.move;
  if (!wasDone && task.status === "done") {
    completedBase += 1;
    document.querySelector("#completedStat").textContent = completedBase.toLocaleString();
  }
  renderTasks();
  showToast(`Task moved to ${task.status}.`);
});

document.querySelector("#addTask").addEventListener("click", () => {
  tasks.unshift({ title: "New MVP follow-up", detail: "Owner: You", status: "todo" });
  renderTasks();
  showToast("Task added to To Do.");
});

document.querySelector("#sortTeam").addEventListener("click", () => {
  renderTeam(true);
  showToast("Team sorted by performance score.");
});

periodFilters.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  periodFilters.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
  const points = revenuePoints[button.dataset.period];
  document.querySelector("#revenueLine").setAttribute("points", points);
  document.querySelector("#revenueArea").setAttribute("d", `M${points.replaceAll(" ", " L")} L560 220 L20 220 Z`);
  document.querySelector("#revenueLabel").textContent = button.dataset.period === "365" ? "$211k ARR" : button.dataset.period === "90" ? "$52k QTR" : "$18.4k MRR";
});

document.querySelector("#saveSettings").addEventListener("click", () => showToast("Settings saved."));

renderProjects();
renderTasks();
renderTeam();
