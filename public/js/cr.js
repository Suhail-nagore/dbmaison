const sliderImages = document.querySelectorAll(".slider-image");
const previewImages = document.querySelectorAll(".preview-image");
const prevButton = document.querySelector(".prev-button");
const nextButton = document.querySelector(".next-button");

let currentIndex = 0;

function showImage(index) {
  const slider = document.querySelector(".slider-images");
  const slideWidth = sliderImages[0].clientWidth;
  slider.style.transform = `translateX(-${slideWidth * index}px)`;

  sliderImages.forEach((image, i) => {
    if (i === index) {
      image.classList.add("active");
      previewImages[i].classList.add("active");
    } else {
      image.classList.remove("active");
      previewImages[i].classList.remove("active");
    }
  });
}

function showNextImage() {
  currentIndex = (currentIndex + 1) % sliderImages.length;
  showImage(currentIndex);
}

function showPrevImage() {
  currentIndex = (currentIndex - 1 + sliderImages.length) % sliderImages.length;
  showImage(currentIndex);
}

nextButton.addEventListener("click", showNextImage);
prevButton.addEventListener("click", showPrevImage);
previewImages.forEach((image, i) => {
  image.addEventListener("click", () => {
    showImage(i);
    currentIndex = i;
  });
});

showImage(currentIndex);

function toggleOptions(selectElement) {
  var container = selectElement.parentElement;
  if (container.classList.contains("open")) {
    container.classList.remove("open");
  } else {
    container.classList.add("open");
  }
}
