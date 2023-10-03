const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("contact-number");
const errorMessage = document.getElementById("errorMessage");

emailInput.addEventListener("input", validateEmail);
phoneInput.addEventListener("input", validatePhone);
const phonePattern = /^\d{10}$/;
const phoneValue = phoneInput.value.trim();

function validateEmail() {
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

if (!emailPattern.test(emailInput.value)) {
  errorMessage.style.visibility = "visible";
  emailInput.style.borderColor = "red";
} else {
  errorMessage.style.visibility = "hidden";
  emailInput.style.borderColor = "initial";
}
}
function validatePhone() {
const phonePattern = /^\+?\d{10,}$/;
let phoneValue = phoneInput.value.trim();

// Remove non-numeric characters
phoneValue = phoneValue.replace(/[^\d+]/g, '');

//   if (phoneValue.length > 10) {
//     phoneValue = phoneValue.substr(0, 10);
//   }

phoneInput.value = phoneValue;


}
