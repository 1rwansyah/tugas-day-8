let projects = JSON.parse(localStorage.getItem("projects")) || [
  {
    id: 1,
    title: "Team Liquid PH Wins MPL PH",
    duration: "11 Sep 2025 - 30 Feb 2026",
    desc: "Team Liquid PH are the MPL champions, proving their dominance with an outstanding run this season.",
    image: "https://cdn.oneesports.id/cdn-data/sites/2/2025/06/MLBB-MPLPHS15-Team-Liquid-PH-juara-2025.jpeg"
  },
  {
    id: 2,
    title: "TLPH Juara MSC 2025",
    duration: "1 Bulan",
    desc: "Team Liquid PH crowned MSC champions after showcasing dominance and skill on the international stage.",
    image: "https://garapmedia.com/wp-content/uploads/2025/08/Team-Liquid-PH-Juara-MSC-2025-dengan-Gemilang.png"
  },
  {
    id: 3,
    title: "KarlTzy",
    duration: "1 Bulan",
    desc: "KarlTzy has completed his trophy collection, crowning his legacy as one of Mobile Legends’ greatest players.",
    image: "../assets/images/poto.png"
  }
];

let idCounter = projects.length + 1;

function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function renderProjects(containerId, filterCallback = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  const filtered = filterCallback ? projects.filter(filterCallback) : projects;

  filtered.map(p => {
    container.innerHTML += `
      <div class="content-container">
        <img src="${p.image}" alt="${p.title}">
        <div class="p-3">
          <h3 class="title">${p.title}</h3>
          <p class="duration">${p.duration}</p>
          <p class="desc">${p.desc}</p>
          <a href="/detail-project?id=${p.id}" class="btn btn-dark">Detail</a>
          <div class="actions">
            <button class="btn-edit" onclick="editProject(${p.id})">Edit</button>
            <button class="btn-delete" onclick="deleteProject(${p.id})">Delete</button>
          </div>
        </div>
      </div>
    `;
  });
}

function addProject(event) {
  event.preventDefault();

  const title = document.getElementById("projectName").value;
  const date = document.getElementById("startDate").value;
  const desc = document.getElementById("description").value;
  const imageInput = document.getElementById("image");
  const image = imageInput.files.length > 0 ? URL.createObjectURL(imageInput.files[0]) : "poto.png";

  const newProject = {
    id: idCounter++,
    title,
    duration: date || "Baru Ditambahkan",
    desc,
    image
  };

  projects.push(newProject);
  saveProjects();
  renderProjects("project-list");
  document.querySelector("form").reset();
}

function deleteProject(id) {
  projects = projects.filter(p => p.id !== id);
  saveProjects();
  renderProjects("project-list");
}

function editProject(id) {
  const project = projects.find(p => p.id === id);
  if (!project) return;

  const newTitle = prompt("Edit title:", project.title);
  const newDesc = prompt("Edit description:", project.desc);
  const newDuration = prompt("Edit duration:", project.duration);

  if (newTitle) project.title = newTitle;
  if (newDesc) project.desc = newDesc;
  if (newDuration) project.duration = newDuration;

  saveProjects();
  renderProjects("project-list");
}

function filterProjectsByKeyword(keyword) {
  renderProjects("project-list", p => p.title.toLowerCase().includes(keyword.toLowerCase()));
}

function uppercaseTitles(callback) {
  projects = projects.map(p => ({ ...p, title: callback(p.title) }));
  saveProjects();
  renderProjects("project-list");
}

document.addEventListener("DOMContentLoaded", () => {
  renderProjects("project-list");
});
