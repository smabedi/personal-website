class ApplicationController {
    constructor() {
        this.cursor = document.querySelector('.custom-cursor');

        // Track mouse position and cursor position
        this.mouse = {x: -100, y: -100};
        this.pos = {x: 0, y: 0};
        this.speed = 0.15; // Lower = smoother/slower, Higher = snappier

        this.init();
    }

    init() {
        console.log("Boot sequence initiated for smabedi.ir.");
        this.bindEvents();
        this.render(); // Start the animation loop
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    render() {
        // 1. Calculate the distance moved this frame
        const deltaX = this.mouse.x - this.pos.x;
        const deltaY = this.mouse.y - this.pos.y;

        // 2. Interpolate position
        this.pos.x += deltaX * this.speed;
        this.pos.y += deltaY * this.speed;

        // 3. Calculate Speed (magnitude of movement)
        const speed = Math.hypot(deltaX, deltaY);

        // 4. Set Target Scale
        // Base size is 1. When moving, it grows up
        const targetScale = 1 + 0.25 * Math.sqrt(speed);

        // 5. Smoothly interpolate the scale (Lerp)
        // We update 'this.scale' by a fraction of the difference each frame
        if (!this.scale) this.scale = 1;
        this.scale += (targetScale - this.scale) * 0.1;

        // 6. Apply transform (Position + Scale)
        this.cursor.style.transform = `
        translate3d(${this.pos.x - 16}px, ${this.pos.y - 16}px, 0) 
        scale(${this.scale})
    `;

        requestAnimationFrame(() => this.render());
    }
}

// Bootstrap the application
const app = new ApplicationController();