 // JavaScript to handle loading more projects
    let visibleProjects = 6; // Number of initially visible projects
    const projects = document.querySelectorAll('.project'); // Select all project elements
    const loadMoreButton = document.getElementById('load-more');

    function toggleProjects() {
        // Show/hide projects based on the calculated number
        projects.forEach((project, index) => {
            if (index < visibleProjects) {
                project.style.display = 'block';
            } else {
                project.style.display = 'none';
            }
        });

        // Toggle the "Load More" button visibility
        loadMoreButton.style.display = visibleProjects < projects.length ? 'block' : 'none';
    }

    function loadMoreProjects() {
        visibleProjects += 3; // Increase by 3 projects
        toggleProjects();
    }

    // Attach the click event handler to the "Load More" button
    loadMoreButton.addEventListener('click', loadMoreProjects);

    // Initially toggle the projects and button visibility
    toggleProjects();
