import { CanvasTGA } from "../lib/mmk/CanvasTGA.js";
import { deviceRoundRadius } from "../lib/mmk/DeviceIdentifier.js";
import {SCREEN_WIDTH, SCREEN_HEIGHT} from "../lib/mmk/UiParams";

export function autoPrettifyBarcode(canvas) {
	const screenWidth = SCREEN_WIDTH - 8;
	const screenHeight = SCREEN_HEIGHT - 8;

	if(screenHeight > screenWidth) {
		canvas = CanvasTGA.rotate90(canvas);
	}

	const imgDiagonal = Math.ceil(Math.sqrt((canvas.width * canvas.width) + (canvas.height * canvas.height)))
	const screenDiagonal = Math.ceil(Math.sqrt((screenWidth * screenWidth + screenHeight * screenHeight))) 
		- (deviceRoundRadius / 2);

	console.log("diagonal's", imgDiagonal, screenDiagonal);

	if(canvas.height * 2 <= screenHeight && canvas.width * 2 <= screenWidth && imgDiagonal * 2 <= screenDiagonal) {
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