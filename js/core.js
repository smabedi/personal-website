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
        this.parallaxLayer = document.getElementById('parallax-layer');

        this.pointer = {x: -100, y: -100};
        this.pos = {x: 0, y: 0};

        this.speed = 0.15;
        this.scale = 1;
        this.cursorOffset = 10;
        this.isHovering = false;

        this.isTouchDevice = !window.matchMedia("(pointer: fine)").matches;

        // Initialize the custom grid algorithm
        this.gridSystem = new GridAlgorithm();

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
        // Parallax Background Logic
        if (this.parallaxLayer && !this.isTouchDevice) {
            // Calculate offset: maps mouse position from -1 to 1, multiplied by intensity (20px)
            const xOffset = ((this.pointer.x / window.innerWidth) - 0.5) * -20;
            const yOffset = ((this.pointer.y / window.innerHeight) - 0.5) * -20;
            this.parallaxLayer.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
        }

        // Grid Algorithm loop
        if (this.gridSystem) {
            this.gridSystem.update();
            this.gridSystem.draw();
        }

        // Cursor Logic
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
        const angle = Math.atan2(deltaY, deltaX);
        let targetScale = 1 + 0.1 * Math.sqrt(velocity);

        if (this.isHovering) {
            targetScale *= 0.75;
        }

        this.scale += (targetScale - this.scale) * 0.1;

        const stretchAmount = Math.min(velocity * 0.025, 0.4);
        const scaleX = this.scale + stretchAmount;
        const scaleY = this.scale - (stretchAmount * 0.2);

        this.cursor.style.transform = `
        translate3d(${this.pos.x - this.cursorOffset}px, ${this.pos.y - this.cursorOffset}px, 0)
        rotate(${angle}rad)
        scale(${scaleX}, ${scaleY})
        `;
    }
}

class GridAlgorithm {
    constructor() {
        this.canvas = document.getElementById('grid-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.blockSize = 20; // 20px squares

        // Handle resizing
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.cols = Math.floor(this.canvas.width / this.blockSize);
        this.rows = Math.floor(this.canvas.height / this.blockSize);

        // TODO: Initialize the 2D arrays here based on new cols/rows
    }

    update() {
        // TODO: CELLULAR AUTOMATA ALGORITHM HERE
    }

    draw() {
        if (!this.ctx) return;

        // Clear previous frame
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // TODO: Draw the cells here.
        // Example:
        // this.ctx.fillStyle = 'rgba(100, 235, 22, 0.2)'; // Faint accent color
        // this.ctx.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
    }
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
    window.App = new CoreApp();
});
