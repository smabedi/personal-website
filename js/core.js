const SITE_ROUTES = {
    "Main": [
        { name: "Home", path: "/index.html" }
    ],
    "Experimental": [
        { name: "Counter", path: "/pages/counter.html" },
        { name: "Pathfinder", path: "/pages/pathfinder.html" }
    ],
    "Theory": [
        { name: "Game Theory", path: "/pages/game-theory.html" }
    ]
};

class SiteNavigation extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        let navHTML = `<nav class="site-nav"><ul class="nav-categories">`;

        for (const [category, links] of Object.entries(SITE_ROUTES)) {
            navHTML += `<li class="nav-category">
                            <span class="category-title">${category}</span>
                            <ul class="category-links">`;

            links.forEach(link => {
                navHTML += `<li><a href="${link.path}" class="nav-link">${link.name}</a></li>`;
            });

            navHTML += `</ul></li>`;
        }

        navHTML += `</ul></nav>`;

        this.innerHTML = navHTML;
    }
}

// Register our custom element with the browser
customElements.define('site-nav', SiteNavigation);

class CoreApp {
    constructor() {
        this.cursor = document.querySelector('.custom-cursor');

        this.pointer = {x: -100, y: -100};
        this.pos = {x: 0, y: 0};

        this.speed = 0.15;
        this.scale = 1;
        this.cursorOffset = 10;
        this.isHovering = false;

        this.isTouchDevice = !window.matchMedia("(pointer: fine)").matches;

        this.init();
    }

    init() {
        console.log("Core initialized for CORTEXT.");

        // Clean up the DOM element entirely on mobile to prevent ghost-clicks
        if (this.isTouchDevice && this.cursor) {
            this.cursor.remove();
            this.cursor = null;
        }

        this.bindEvents();
        this.render(); // Start the animation loop
    }

    bindEvents() {
        window.addEventListener('pointermove', (e) => {
            this.pointer.x = e.clientX;
            this.pointer.y = e.clientY;
        });

        if (this.cursor) {
            document.addEventListener('mouseover', (e) => {
                if (e.target.closest('a, button')) {
                    this.cursor.classList.add('is-hovering');
                    this.isHovering = true;
                }
            });

            document.addEventListener('mouseout', (e) => {
                if (e.target.closest('a, button')) {
                    this.cursor.classList.remove('is-hovering');
                    this.isHovering = false;
                }
            });
        }
    }

    render() {
        // FUTURE BACKGROUND LOGIC GOES HERE

        if (this.cursor) {
            this.updateCursorMath();
        }

        requestAnimationFrame(() => this.render());
    }

    updateCursorMath() {
        const deltaX = this.pointer.x - this.pos.x;
        const deltaY = this.pointer.y - this.pos.y;

        this.pos.x += deltaX * this.speed;
        this.pos.y += deltaY * this.speed;

        const velocity = Math.hypot(deltaX, deltaY);
        let targetScale = 1 + 0.1 * Math.sqrt(velocity);

        if (this.isHovering) {
            targetScale *= 1.5;
        }

        this.scale += (targetScale - this.scale) * 0.1;
        this.cursor.style.transform = `translate3d(${this.pos.x - this.cursorOffset}px, ${this.pos.y - this.cursorOffset}px, 0) scale(${this.scale})`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.App = new CoreApp();
});
