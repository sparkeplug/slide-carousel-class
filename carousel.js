class Carousel {
  constructor(carouselElem, initialSlide = 1) {
    this.gtCarousel = carouselElem;
    this.cardsWrapper = this.gtCarousel.querySelector(".gt-carousel__cards");
    this.cards = this.cardsWrapper.querySelectorAll(".gt-carousel__card");
    this.currentSlide = initialSlide;
    this.carouselCardsLength = 0;
    this.carouselData = [];
    this.navigators = null;
    this.loaderData = {
      element: null
    };
    this.data = {
      prev: {},
      current: {},
      next: {}
    };
    this.dataTypes = ["prev", "current", "next"];
    this.carouselCardsLength = this.cards.length;
    this.prevAnimation = e => {
      this.navigateSlide("prev", e);
    };
    this.nextAnimation = e => {
      this.navigateSlide("next", e);
    };
    this.init();
  }

  init() {
    this.ripCarouselSlideData();
    this.appendTextNavigators();
    this.appendLoader();
    this.recompute();
  }

  recompute() {
    this.computePrevCurrentNextData();
  }

  navigateSlide(mode, event) {
    if (event && event.type === "click") {
      this.loaderData["element"].classList.remove("gt-carousel__loader-bar--loading");
      this.loaderData["element"].offsetWidth;
      this.loaderData["element"].classList.add("gt-carousel__loader-bar--loading");
    }
    this.dataTypes.forEach(d => {
      const elem = this.navigators.querySelector(`.${d}`);
      const animationClassToAdd =
        mode === "prev" ? "animate--right" : "animate--left";
      elem.classList.add(animationClassToAdd);
    });
    if (mode === "prev") {
      this.currentSlide =
        this.currentSlide === 1
          ? this.carouselCardsLength
          : this.currentSlide - 1;
    } else if (mode === "next") {
      this.currentSlide =
        this.currentSlide === this.carouselCardsLength
          ? 1
          : this.currentSlide + 1;
    }
    // const carouselCard = document.querySelectorAll(".gt-carousel__card");
    this.cards.forEach(card => {
      card.style.transform = `translateX(-${100 * (this.currentSlide - 1)}%)`;
    });
    this.recompute();
  }

  computePrevCurrentNextData() {
    let navigator = document.querySelector(".gt-carousel__navigators");
    this.data["prev"] = this.carouselData[
      this.currentSlide === 1
        ? this.carouselData.length - 1
        : this.currentSlide - 2
    ];
    this.data["current"] = this.carouselData[this.currentSlide - 1];
    this.data["next"] = this.carouselData[
      this.currentSlide === this.carouselData.length ? 0 : this.currentSlide
    ];
    this.dataTypes.forEach(d => {
      let elem = navigator.querySelector(`.${d}`);
      elem.querySelector(".header").innerText = this["data"][d].header;
      elem.querySelector(".sub-header").innerText = this["data"][d].subHeader;
    });
  }

  appendTextNavigators() {
    let navigator = document.createElement("div");
    navigator.className = "gt-carousel__navigators";
    let wrapper = document.createElement("div");
    wrapper.className = "gt-carousel__navigators-nav";
    this.dataTypes.forEach(type => {
      wrapper.appendChild(this.createHeaders(type));
    });
    navigator.appendChild(wrapper);
    this.gtCarousel.appendChild(navigator);
    this.navigators = this.gtCarousel.querySelector(".gt-carousel__navigators");
    this.computePrevCurrentNextData();
  }

  appendLoader() {
    let loaderContainer = document.createElement("div");
    loaderContainer.className = "gt-carousel__loader";
    let loaderBar = document.createElement("span");
    loaderBar.className = "gt-carousel__loader-bar gt-carousel__loader-bar--loading";
    loaderBar.addEventListener(
      "animationiteration",
      this.loaderAnimationIteration.bind(this)
    );
    loaderContainer.appendChild(loaderBar);
    this.gtCarousel.appendChild(loaderContainer);
    this.loaderData["element"] = this.gtCarousel
      .querySelector(".gt-carousel__loader")
      .querySelector(".gt-carousel__loader-bar");
  }

  loaderAnimationIteration(e) {
    this.navigateSlide("next");
  }

  pauseLoaderAnimation(e) {
    const animationState = e.type === "mouseenter" ? "paused" : "running";
    this.loaderData["element"].style.animationPlayState = animationState;
    this.loaderData["element"].style.webkitAnimationPlayState = animationState;
  }

  createHeaders(id) {
    let div = document.createElement("div");
    div.className = id;
    let header = document.createElement("h1");
    header.className = "header";
    let subHeader = document.createElement("h3");
    subHeader.className = "sub-header";

    if (id === "prev" || id === "next") {
      let divWrapper = document.createElement("div");
      divWrapper.className = `wrapper ${id}-wrapper`;
      divWrapper.addEventListener(
        "mouseenter",
        this.pauseLoaderAnimation.bind(this),
        false
      );
      divWrapper.addEventListener(
        "mouseleave",
        this.pauseLoaderAnimation.bind(this),
        false
      );
      if (id === "prev") {
        div.addEventListener("click", this.prevAnimation, false);
      } else if (id === "next") {
        div.addEventListener("click", this.nextAnimation, false);
      }
      div.appendChild(header);
      div.appendChild(subHeader);
      divWrapper.appendChild(div);
      return divWrapper;
    } else {
      div.appendChild(header);
      div.appendChild(subHeader);
      return div;
    }
  }

  ripCarouselSlideData() {
    this.cards.forEach(card => {
      const targetElem = card.querySelector(".gt-carousel__card-img");
      const header = targetElem.dataset.header;
      const subHeader = targetElem.dataset.subHeader;
      this.carouselData.push({
        header,
        subHeader
      });
    });
  }
}

export default Carousel;