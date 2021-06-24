export class CanvasDimensions {
    height: number;
    width: number;

    constructor(private container: HTMLElement) {
        this.update();
    }

    public update(): void {
        this.height = this.container.offsetHeight;
        this.width = this.container.offsetWidth;
    }
}