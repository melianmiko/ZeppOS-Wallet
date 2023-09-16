import { CardsStorage } from "../utils/CardsStorage";
import { CanvasTGA } from "../lib/CanvasTGA.js";
import { autoPrettifyBarcode } from "../utils/CanvasTools";
import { CardWriterUI } from "../utils/CardWriterUI";
import {qrcode} from "../lib/3rd/qrcode";
import {deviceClass, deviceRoundRadius} from "../lib/DeviceIdentifier";
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "../lib/UiParams";

class QRWriter extends CardWriterUI {
  getSize() {
    if(deviceClass == "circle") {
      // Fit into diagonal
      return Math.floor(SCREEN_WIDTH / Math.sqrt(2))
    } else if(deviceClass == "square") {
      // Square rounded
      const screenWidth = SCREEN_WIDTH - 16;
      const screenHeight = SCREEN_HEIGHT - 16;
      const screenDiagonal = Math.ceil(Math.sqrt((screenWidth * screenWidth + screenHeight * screenHeight))) 
        - deviceRoundRadius;
      return Math.floor(screenDiagonal / Math.sqrt(2));
    } else {
      // Band's
      return SCREEN_WIDTH - 10;
    }
  }

  process(params) {
    const data = JSON.parse(params);

    const qr = qrcode(0, "L");
    qr.addData(data.content);
    qr.make();

    const count = qr.getModuleCount();
    const pixelSize = Math.floor((this.getSize()) / count);

    let canvas = new CanvasTGA(count * pixelSize, count * pixelSize);
    qr.renderTo2dContext(canvas, pixelSize);

    // canvas = autoPrettifyBarcode(canvas);

    const storage = new CardsStorage();
    this.result = storage.addCard(data, canvas);
  }
}

Page({
  onInit(params) {
    (new QRWriter()).start(params)
  }
});
