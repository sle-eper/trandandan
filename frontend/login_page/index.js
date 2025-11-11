const images = {
  "login-page": "images/pingpong2.jpg",
  "signup-page": "images/pingpong1.jpg",
  "forgot-page": "images/pingpong3.jpg",
  "change-page": "images/pingpong1.jpg",
};

// Function to show one page and hide others
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('[id$="-page"]').forEach(div => div.classList.add('hidden'));

  // Show the requested one
  const targetPage = document.getElementById(pageId);
  if (targetPage) targetPage.classList.remove('hidden');

  // Update the right-side illustration image
  const imageElement = document.getElementById("page-image");
  if (imageElement && images[pageId]) {
    imageElement.src = images[pageId];
  }
}

// ---- Event Listeners for Navigation ----

// Login page → Go to Signup
document.addEventListener("click", (e) => {
  if (e.target.id === "signup-link") showPage("signup-page");
  else if (e.target.id === "login-link") showPage("login-page");
  else if (e.target.id === "forgot-link") showPage("forgot-page");
  else if (e.target.id === "change-link") showPage("change-page");
});

// Default page on load
window.addEventListener("DOMContentLoaded", () => {
  showPage("login-page"); // you can change this to start with another page
});
