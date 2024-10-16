const sliders = [...document.querySelectorAll(".slide")];
const directionBtn = [...document.querySelectorAll(".direction-btn")];

/***Creation de mon object pour la gestion des slides */
const sliderData = {
  locked: false,
  direction: 0,
  slideOutIndex: 0,
  slideInIndex: 0,
};

directionBtn.forEach((btn) => btn.addEventListener("click", handleClick));

function handleClick(e) {
  if (sliderData.locked) return;
  sliderData.locked = true;
  getDirection(e.target);
  slideOut();
}

function getDirection(btn) {
  sliderData.direction = btn.classList.contains("right") ? 1 : -1;
  sliderData.slideOutIndex = sliders.findIndex((slide) =>
    slide.classList.contains("slider_active")
  );
  if (sliderData.slideOutIndex + sliderData.direction > sliders.length - 1) {
    sliderData.slideInIndex = 0;
  } else if (sliderData.slideOutIndex + sliderData.direction < 0) {
    sliderData.slideInIndex = sliders.length - 1;
  } else {
    sliderData.slideInIndex = sliderData.slideOutIndex + sliderData.direction;
  }
}

function slideOut() {
  slideAnimation({
    el: sliders[sliderData.slideInIndex],
    props: {
      display: "flex",
      transform: `translateX(${sliderData.direction < 0 ? "100%" : "-100%"})`,
      opacity: 0,
    },
  });
  slideAnimation({
    el: sliders[sliderData.slideOutIndex],
    props: {
      transition:
        "transform 0.4s cubic-bezier(0.74, -0.34, 1, 1.19), opacity 0.4s ease-out",
      transform: `translateX(${sliderData.direction < 0 ? "-100%" : "100%"})`,
      opacity: 0,
    },
  });
  sliders[sliderData.slideOutIndex].addEventListener("transitionend", slideIn);
}

function slideAnimation(animationObject) {
  for (const prop in animationObject.props) {
    animationObject.el.style[prop] = animationObject.props[prop];
  }
}

function slideIn(e) {
  slideAnimation({
    el: sliders[sliderData.slideInIndex],
    props: {
      transition: "transform 0.4s ease-out, opacity 0.8s ease-out",
      transform: "translate(0%)",
      opacity: 1,
    },
  });

  sliders[sliderData.slideInIndex].classList.add("slider_active");
  sliders[sliderData.slideOutIndex].classList.remove("slider_active");
  e.target.removeEventListener("tansitionend", slideIn);
  sliders[sliderData.slideOutIndex].style.display = "none";
  setTimeout(() => {
    sliderData.locked = false;
  }, 400);
}
