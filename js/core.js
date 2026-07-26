class CoreApp {
    constructor() {
        this.cursor = document.querySelector('.custom-cursor');

        this.mouse = {x: -100, y: -100};
        this.pos = {x: 0, y: 0};

        this.speed = 0.15;
        this.scale = 1;
        this.cursorOffset = 10;
        this.isHovering = false;

        this.init();
    }

    init() {
        console.log("Core initialized for smabedi.ir.");
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, site-nav')) {
                this.cursor.classList.add('is-hovering');
                this.isHovering = true;
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('a, button, site-nav')) {
                this.cursor.classList.remove('is-hovering');
                this.isHovering = false;
            }
        });
    }

    render() {
        if (!this.cursor) return;

        const deltaX = this.mouse.x - this.pos.x;
        const deltaY = this.mouse.y - this.pos.y;

        this.pos.x += deltaX * this.speed;
        this.pos.y += deltaY * this.speed;

        const velocity = Math.hypot(deltaX, deltaY);
        let targetScale = 1 + 0.15 * Math.sqrt(velocity);
        if (this.isHovering) {
            targetScale *= 1.5;
        }

        this.scale += (targetScale - this.scale) * 0.1;
        this.cursor.style.transform = `translate3d(${this.pos.x - this.cursorOffset}px, ${this.pos.y - this.cursorOffset}px, 0) scale(${this.scale})`;

        requestAnimationFrame(() => this.render());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.App = new CoreApp();
});