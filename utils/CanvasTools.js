import { CanvasTGA } from "../lib/CanvasTGA.js";
import {SCREEN_WIDTH, SCREEN_HEIGHT} from "../lib/UiParams";

export function autoPrettifyBarcode(canvas) {
	canvas = CanvasTGA.rotate90(canvas);

	if(canvas.height * 2 <= SCREEN_WIDTH && canvas.width * 2 <= SCREEN_HEIGHT) {
		// Scale x2
		console.log("Perform scale x2");

		const newCanvas = new CanvasTGA(canvas.width * 2, canvas.height * 2);
		newCanvas.addPalette(canvas.currentPalette);

		for(let x = 0; x < canvas.width; x++) {
			for(let y = 0; y < canvas.height; y++) {
				const val = canvas._getPixel(x, y);
				newCanvas.fillStyle = newCanvas.palette[val];
				newCanvas.fillRect(x * 2, y * 2, 2, 2);
			}
		}

		canvas = newCanvas;
	}

	return canvas;
}