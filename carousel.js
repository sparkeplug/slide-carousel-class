class Carousel {
  constructor(carouselElem, initialSlide = 1) {
    this.carouselWrapper = carouselElem;
    this.carousel = this.carouselWrapper.querySelector('.carousel');
    this.carouselCards = this.carousel.querySelectorAll('.carousel-card');
    this.currentSlide = initialSlide;
    this.carouselCardsLength = 0;
    this.carouselData = [];
    this.navigators = null;
    this.data = {
      prev: {},
      current: {},
      next: {}
    };
    this.dataTypes = ['prev','current', 'next'];
    this.carouselCardsLength = this.carouselCards.length;
    this.prevAnimation = (e) => {
      this.navigateSlide('prev');
    };
    this.nextAnimation = (e) => {
      this.navigateSlide('next');
    };
    this.__init__();
  }

  __init__() {
    this.ripCarouselSlideData();
    this.appendTextNavigators();
    this.appendSeekBar();
  }

  navigateSlide(mode) {
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
    this.computePrevCurrentNextData();
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

  appendSeekBar() {
    let bar = document.createElementNS('http://www.w3.org/2000/svg','svg');
    bar.className.baseVal = "progress-bar";
    bar.setAttribute('height','100');
    bar.setAttribute('width','200');
    let line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1','0');
    line.setAttribute('y1','50');
    line.setAttribute('x2','200');
    line.setAttribute('y2','50');
    bar.append(line);
    this.carouselWrapper.appendChild(bar);
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

  addRemoveNavigatorAnimations(mode,direction) {
    // this.navigators.forEach();
  }
}

export default Carousel;