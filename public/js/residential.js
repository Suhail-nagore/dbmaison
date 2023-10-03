const projects = [
  {
    title: "Emaar Urban Oasis",
    type: "residential",
    imageUrl: "images/urbanemaar01.webp",
    url: "property/urbanemaar.html",
  },
  {
    title: "Elan The Presidential",
    type: "residential",
    imageUrl: "images/elanpmainmin.webp",
    url: "property/elanpresidential.html",
  },
  {
    title: "Central Park",
    type: "residential",
    imageUrl: "images/centralmain.webp",
    url: "property/centralpark.html",
  },
  {
    title: "Smartworld Dxp one",
    type: "residential",
    imageUrl: "images/SW-113min.webp",
    url: "property/starworlddxpone.html",
  },
  {
    title: "M3m Crown",
    type: "residential",
    imageUrl: "images/m3mcrownnew.jpg",
    url: "property/m3mcrown.html",
  },
  {
    title: "Emaar",
    type: "residential",
    imageUrl: "images/emaar1min.webp",
    url: "property/emaar.html",
  },
  {
    title: "M3m Golf Hills",
    type: "residential",
    imageUrl: "images/m3mgolf1.jpg",
    url: "property/m3mgolfhill.html",
  },
  {
    title: "Sobha City",
    type: "residential",
    imageUrl: "images/sobha1.webp",
    url: "property/sobhacity.html",
  },
  // Add more projects...
];

const projectsPerPage = 6; // Number of projects to display per page
let currentPage = 1; // Current page number

function createProjectCard(project) {
  const projectCard = document.createElement("div");
  projectCard.classList.add("col-lg-4", "col-md-6", "mb-4");

  const imageElement = document.createElement("img");
  imageElement.src = project.imageUrl;
  imageElement.classList.add("project-image");
  imageElement.addEventListener("click", () => {
    window.location.href = project.url; // Redirect to the project URL
  });
  projectCard.appendChild(imageElement);

  const titleElement = document.createElement("h2");
  const titleLink = document.createElement("a");
  titleLink.href = project.url;
  titleLink.textContent = project.title;
  titleLink.classList.add("custom-link");
  titleElement.appendChild(titleLink);
  projectCard.appendChild(titleElement);

  return projectCard;
}

function displayProjects(filteredProjects, page) {
  const projectContainer = document.getElementById("project-container");
  projectContainer.innerHTML = ""; // Clear the container before adding new projects

  const startIndex = (page - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  if (paginatedProjects.length === 0) {
    const noResultsElement = document.createElement("div");
    noResultsElement.classList.add("col-12");
    noResultsElement.textContent = "No projects found.";
    projectContainer.appendChild(noResultsElement);
  } else {
    paginatedProjects.forEach((project) => {
      const projectCard = createProjectCard(project);
      projectContainer.appendChild(projectCard);
    });
  }
}

function updatePagination(filteredProjects) {
  const paginationContainer = document.getElementById("pagination-container");
  paginationContainer.innerHTML = ""; // Clear the container before adding new links

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = i;
    link.classList.add("pagination-link");

    if (i === currentPage) {
      link.classList.add("active");
    }

    link.addEventListener("click", () => {
      currentPage = i;
      displayProjects(filteredProjects, currentPage);
      updatePagination(filteredProjects);
    });

    const listItem = document.createElement("li");
    listItem.classList.add("page-item");
    listItem.appendChild(link);

    paginationContainer.appendChild(listItem);
  }
}

function handleSearch() {
  const searchInput = document
    .getElementById("search-input")
    .value.trim()
    .toLowerCase();
  const searchOption = document.getElementById("search-option").value;
  let filteredProjects = projects;

  if (searchOption !== "all") {
    filteredProjects = projects.filter(
      (project) => project.type === searchOption
    );
  }

  filteredProjects = filteredProjects.filter((project) =>
    project.title.toLowerCase().includes(searchInput)
  );

  currentPage = 1;
  displayProjects(filteredProjects, currentPage);
  updatePagination(filteredProjects);
}

document.getElementById("search-input").addEventListener("input", handleSearch);

// Initial display of all projects
displayProjects(projects, currentPage);
updatePagination(projects);

const searchInput = document.getElementById("search-input");
const searchOptions = {
  getValue: "title",
  list: {
    match: {
      enabled: true,
    },
  },
};
const autocomplete = new autoComplete({
  selector: searchInput,
  minChars: 1,
  cache: false,
  source: function (term, suggest) {
    const suggestions = projects.filter((project) =>
      project.title.toLowerCase().startsWith(term.toLowerCase())
    );
    suggest(suggestions);
  },
});
