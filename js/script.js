import Slide from "./slide.js";

const slide = new Slide('.slide', '.slide-wrapper');
slide.init();

slide.changeSlideCentered(1)
slide.activePrevSlide()