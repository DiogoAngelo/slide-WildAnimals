export default class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        this.dist = { finalPosition: 0, startX: 0, movement: 0 };
    }

    transition(active) {
        this.slide.style.transition = active ? 'transform .3s' : '';
    }

    onStart(event) {
        let moveType;
        if (event.type === 'mousedown') {
            event.preventDefault();
            this.dist.startX = event.clientX;
            moveType = 'mousemove';

        }else {
            this.dist.startX = event.changedTouches[0].clientX;
            moveType = 'touchmove'
        }
        this.wrapper.addEventListener(moveType, this.onMove);
        this.transition(false)
    }

    onMove(event) {
        const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
        const finalPosition = this.updatePosition(pointerPosition);
        this.moveSlide(finalPosition)
     }

    updatePosition(clientX) {
        this.dist.movement =  (clientX - this.dist.startX) * 2;
        return this.dist.finalPosition + this.dist.movement;
    }

    moveSlide(distX) {
        this.dist.movePosition = distX;
        this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
    }

    onEnd(event) {
        const moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
        this.wrapper.removeEventListener(moveType, this.onMove);
        this.dist.finalPosition = this.dist.movePosition;
        this.transition(true);
        this.changeSlideOnEnd();
    }

    changeSlideOnEnd() {
        if (this.dist.movement < -120 && this.index.next !== undefined) {
            this.activeNextSlide();
        } else if(this.dist.movement > 120 && this.index.prev !== undefined) {
            this.activePrevSlide();
        } else {
            this.changeSlideCentered(this.index.active);
        }
        console.log(this.dist.movement);
    }

    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('touchstart', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
        this.wrapper.addEventListener('touchend', this.onEnd);
    }

    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    // Slides Config

    slideCentering(element) {
        const margin = (this.wrapper.offsetWidth - element.offsetWidth) / 2;
        return margin - element.offsetLeft      
    }

    slidesConfig() {
        this.slideArray = [...this.slide.children].map((element) => {
            const position = this.slideCentering(element);
            return { element, position }
        });
    }

    slideIndex(index) {
        const lastItem = this.slideArray.length -1;
        this.index = {
            prev: index ? index - 1 : undefined,
            active: index,
            next: index === lastItem ? undefined : index +1,
        }
    }

    changeSlideCentered(index) {
        const activeSlide = this.slideArray[index];
        this.moveSlide(activeSlide.position);
        this.slideIndex(index);
        this.dist.finalPosition = activeSlide.position;    
    }

    activePrevSlide() {
        if (this.index.prev !== undefined) {
            this.changeSlideCentered(this.index.prev)
        }
    }

    activeNextSlide() {
        if (this.index.next !== undefined) {
            this.changeSlideCentered(this.index.next)
        }
    }

    init() {
        this.bindEvents();
        this.transition(true);
        this.addSlideEvents();
        this.slidesConfig();
        
        return this;
    }
}   