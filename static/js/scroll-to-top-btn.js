// JavaScript to show/hide and handle button click
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.querySelector(".scroll-top-btn").style.display = "block";
  } else {
    document.querySelector(".scroll-top-btn").style.display = "none";
  }
}

// Smooth scrolling on button click
document.querySelector(".scroll-top-btn").addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
