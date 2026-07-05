const header = document.getElementById("js-header");

window.addEventListener("scroll", function () {
  if (window.scrollY > 0) {
    header.classList.add("is-scrolled");
  } else {
    header.classList.remove("is-scrolled");
  }
});
