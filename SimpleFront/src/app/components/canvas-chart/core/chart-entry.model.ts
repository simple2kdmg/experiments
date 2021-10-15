import { Canvas } from "./canvas.model";

export class ChartEntry {
    private canvas: Canvas;

    constructor(private container: HTMLElement) {
        this.initContext();
    }

    private initContext(): void {
        this.canvas = new Canvas(this.container);
    }
}