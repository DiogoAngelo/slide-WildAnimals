export class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        this.dist = { finalPosition: 0, startX: 0, movement: 0 }
    }

    transition(status) {
        this.slide.style.transition = status ? 'transform .3s' : '';
    }

    onStart(event) {
        let moveType;
        if (event.type === 'mousedown') {
            event.preventDefault();
            this.dist.startX = event.clientX;
            moveType = 'mousemove';
        } else {
            this.dist.startX = event.changedTouches[0].clientX;
            moveType = 'touchmove';
        }
        this.wrapper.addEventListener(moveType, this.onMove);
        this.transition(false);
    }

    updateFinalPosition(distX) {
        this.dist.movement = (distX - this.dist.startX) * 2;
        return this.dist.finalPosition + this.dist.movement;
    }

    onMove(event) {
        const eventType = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
        const finalPosition = this.updateFinalPosition(eventType);
        this.moveSlide(finalPosition);
    }

    moveSlide(finalPosition) {
        this.dist.totalDistance = finalPosition;
        this.slide.style.transform = `translate3d(${finalPosition}px, 0, 0)`
    }

    onEnd(event) {
        const moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
        this.wrapper.removeEventListener(moveType, this.onMove);
        this.dist.finalPosition = this.dist.totalDistance;
        this.transition(true);

        this.changeSlideOnEnd();
    }

    // Slide Config 

    centerElements(element) {
        const margin = (this.wrapper.offsetWidth - element.offsetWidth) / 2;
        return margin - element.offsetLeft
    }

    getPosition() {
        this.slideArray = [...this.slide.children].map((element) => {
        const position = this.centerElements(element);
        
            return { element, position }
        });
    }

    slideIndex(index) {
        const lastItem = this.slideArray.length - 1;
        this.index = {
            prev: index ? index - 1 : undefined,
            active: index,
            next: index === lastItem ? undefined : index + 1,
        } 
    }

    moveCenteredSlide(index) {
        this.moveSlide(this.slideArray[index].position);
        this.slideIndex(index);
        this.dist.finalPosition = this.slideArray[index].position;
        this.addActiveClass();
    }

    addActiveClass() {
        this.slideArray.forEach((item) => {
            item.element.classList.remove('ativo');
        })
        this.slideArray[this.index.active].element.classList.add('ativo');
    }

    activePrevSlide() {
        if (this.index.prev !== undefined) {
            this.moveCenteredSlide(this.index.prev);
        }
    }

    activeNextSlide() {
        if (this.index.next !== undefined) {
            this.moveCenteredSlide(this.index.next);
        }
    }

    changeSlideOnEnd() {
        if (this.dist.movement < -120 && this.index.next !== undefined) {
            this.activeNextSlide();
        } else if (this.dist.movement > 120 && this.index.prev !== undefined) {
            this.activePrevSlide();
        } else {
            this.moveCenteredSlide(this.index.active);
        }
    }

    addEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
        this.wrapper.addEventListener('touchstart', this.onStart);
        this.wrapper.addEventListener('touchend', this.onEnd);
    }
    // adjust slide on screen when resized
    onResize() {
        setTimeout(() => {
            this.getPosition();
            this.moveCenteredSlide(this.index.active);
        }, 500);
    }

    addResizeEvent() {
        window.addEventListener('resize', this.onResize);
    }
    // ---------------------------------------------------------
    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onEnd = this.onEnd.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onResize = this.onResize.bind(this);
        this.activePrevSlide = this.activePrevSlide.bind(this);
        this.activeNextSlide = this.activeNextSlide.bind(this);
    }

    init() {
        this.bindEvents();
        this.transition(true);
        this.addEvents();

        this.getPosition();
        this.addResizeEvent();
        this.moveCenteredSlide(0);
    }
}

export class SlideNav extends Slide {
    addArrow(prev, next) {
        this.prevElement = document.querySelector(prev);
        this.nextElement = document.querySelector(next);
        this.addArrowEvent();
    }
    addArrowEvent() {
        this.prevElement.addEventListener('click', this.activePrevSlide);
        this.nextElement.addEventListener('click', this.activeNextSlide);
    }

}