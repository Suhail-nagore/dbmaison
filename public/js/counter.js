function animateCounters() {
  const counters = document.querySelectorAll(".ag-counter");

  counters.forEach((counter) => {
    const target = parseInt(counter.textContent);
    const increment = Math.ceil(target / 350); // Adjust the increment as per your preference
    let currentCount = 0;

    const counterAnimation = setInterval(() => {
      currentCount += increment;
      counter.textContent = currentCount;

      if (currentCount >= target) {
        counter.textContent = target;
        clearInterval(counterAnimation);
      }
    }, 10); // Adjust the interval duration as per your preference
  });
}

// Trigger the counter animation when the element is in the viewport
const countersContainer = document.querySelector(".counter");
const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.5,
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounters();
      observer.unobserve(entry.target);
    }
  });
}, options);

observer.observe(countersContainer);
