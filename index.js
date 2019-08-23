
'use strict';
// Import stylesheets
import './style.css';
import './carousel.scss';
import Carousel from './carousel';

// Write Javascript code!
let carousels = document.querySelectorAll('.gt-carousel');
let carouselsInits = [];
carousels.forEach(carousel => {
  carouselsInits.push(new Carousel(carousel,1));
});

