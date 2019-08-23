class Carousel {
  constructor(carouselElem, initialSlide = 1) {
    this.carouselWrapper = carouselElem;
    this.carousel = this.carouselWrapper.querySelector('.carousel');
    this.carouselCards = this.carousel.querySelectorAll('.carousel-card');
    this.currentSlide = initialSlide;
    this.carouselCardsLength = 0;
    this.carouselData = [];
    this.navigators = null;
    this.loaderData = {
      element : null
    };
    this.data = {
      prev: {},
      current: {},
      next: {}
    };
    this.dataTypes = ['prev','current', 'next'];
    this.carouselCardsLength = this.carouselCards.length;
    this.prevAnimation = (e) => {
      this.navigateSlide('prev',e);
    };
    this.nextAnimation = (e) => {
      this.navigateSlide('next',e);
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

  navigateSlide(mode,event) {
    if(event && event.type === 'click') {
      debugger; 
      this.loaderData['element'].classList.remove("loader-bar--loading");
      this.loaderData['element'].offsetWidth;
      this.loaderData['element'].classList.add("loader-bar--loading");
    }
    this.dataTypes.forEach(d => {
      const elem = this.navigators.querySelector(`.${d}`);
      const animationClassToAdd = mode === 'prev' ? 'animate--right' : 'animate--left';
      elem.classList.add(animationClassToAdd);
    });
    if (mode === 'prev') {
      this.currentSlide = this.currentSlide === 1 ? this.carouselCardsLength : this.currentSlide - 1;
    } else if (mode === 'next') {
      this.currentSlide = this.currentSlide === this.carouselCardsLength ? 1 : this.currentSlide + 1;
    }
    const carouselCard = document.querySelectorAll('.carousel-card');
    carouselCard.forEach(card => {
      card.style.transform = `translateX(-${100 * (this.currentSlide - 1)}%)`;
    });
    this.recompute();
  }

  computePrevCurrentNextData() {
    let navigator = document.querySelector('.navigators');
    this.data['prev'] = this.carouselData[this.currentSlide === 1 ? this.carouselData.length - 1 : this.currentSlide - 2];
    this.data['current'] = this.carouselData[this.currentSlide - 1];
    this.data['next'] = this.carouselData[this.currentSlide === this.carouselData.length ? 0 : this.currentSlide];
    this.dataTypes.forEach(d => {
      let elem = navigator.querySelector(`.${d}`);
      elem.querySelector('.header').innerText = this['data'][d].header;
      elem.querySelector('.sub-header').innerText = this['data'][d].subHeader;
    });
  }

  computeSeekbarPosition() {
    this.progressSeekbarData['seekbarWidth'] = this.progressbarData['width'] / this.carouselCards.length;
    const prevX1 = this.progressSeekbarData['x1'];
    const prevX2 = this.progressSeekbarData['x2'];
    this.progressSeekbarData['x1'] = (this.currentSlide - 1) * this.progressSeekbarData['seekbarWidth'];
    this.progressSeekbarData['x2'] = this.currentSlide * this.progressSeekbarData['seekbarWidth']; 
    this.progressbar = this.carouselWrapper.querySelector('.progress-bar');
    const seekbar = this.progressbar.querySelector('.seek-bar');
    seekbar.setAttribute('x1',this.progressSeekbarData['x1']);
    seekbar.setAttribute('x2',this.progressSeekbarData['x2']);
  }

  appendTextNavigators() {
    let navigator = document.createElement('div');
    navigator.className = 'navigators';
    let wrapper = document.createElement('div');
    wrapper.className = 'navigators-wrapper';
    this.dataTypes.forEach(type => {
      wrapper.appendChild(this.createHeaders(type));
    });
    navigator.appendChild(wrapper);
    this.carouselWrapper.appendChild(navigator);
    this.navigators = this.carouselWrapper.querySelector('.navigators');
    this.computePrevCurrentNextData();
  }

  appendLoader() {
    let loaderContainer = document.createElement('div');
    loaderContainer.className = "loader";
    let loaderBar = document.createElement('span');
    loaderBar.className = "loader-bar loader-bar--loading";
    loaderBar.addEventListener('animationiteration',this.loaderAnimationIteration.bind(this));
    loaderContainer.appendChild(loaderBar);
    this.carouselWrapper.appendChild(loaderContainer);
    this.loaderData['element'] = this.carouselWrapper.querySelector('.loader').querySelector('.loader-bar');
  }

  loaderAnimationIteration(e) {
    this.navigateSlide('next');
  }

  pauseLoaderAnimation(e) {
    const animationState = e.type === "mouseenter" ? 'paused' : 'running';
    this.loaderData['element'].style.animationPlayState = animationState;
    this.loaderData['element'].style.webkitAnimationPlayState = animationState;
  }

  createHeaders(id) {
    let div = document.createElement('div');
    div.className = id;
    let header = document.createElement('h1');
    header.className = 'header';
    let subHeader = document.createElement('h3');
    subHeader.className = 'sub-header';
    
    if(id === 'prev' || id === 'next') {
      let divWrapper = document.createElement('div');
      divWrapper.className = `wrapper ${id}-wrapper`;
      divWrapper.addEventListener('mouseenter',this.pauseLoaderAnimation.bind(this),false);
      divWrapper.addEventListener('mouseleave',this.pauseLoaderAnimation.bind(this),false);
      if(id === 'prev') {
        div.addEventListener('click',this.prevAnimation,false);
      } else if(id ==='next') {
        div.addEventListener('click',this.nextAnimation,false);
      }
      div.appendChild(header);
      div.appendChild(subHeader);
      divWrapper.appendChild(div); 
      return divWrapper
    } else {
      div.appendChild(header);
      div.appendChild(subHeader);
      return div
    }
  }

  ripCarouselSlideData() {
    this.carouselCards.forEach(card => {
      const targetElem = card.querySelector('.carousel-img');
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