import { CanvasDimensions } from "./canvas-dimensions.model";

export class Canvas {
    public context: CanvasRenderingContext2D;

    private instance: HTMLCanvasElement;
    private dimensions: CanvasDimensions;
    private resizeTimer: ReturnType<typeof setTimeout>;

    constructor(private container: HTMLElement) {
        this.updateDimensions = this.updateDimensions.bind(this);
        this.instance = document.createElement('canvas');
        this.context = this.instance.getContext('2d');
        this.updateDimensions();
        container.appendChild(this.instance);
        this.listenToContainerResize();
    }

    private listenToContainerResize(): void {
        window.addEventListener('resize', this.updateDimensions);
    }

    private updateDimensions(): void {
        if (this.resizeTimer) clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            if (!this.dimensions) {
                this.dimensions = new CanvasDimensions(this.container);
            } else {
                this.dimensions.update();
            }
            this.instance.setAttribute('height', `${this.dimensions.height}`);
            this.instance.setAttribute('width', `${this.dimensions.width}`);
        }, 500);
    }
}