import { AppGesture } from "../lib/mmk/AppGesture";
import { qrcode } from "../lib/mmk/3rd/qrcode";
import { CanvasTGA } from "../lib/mmk/CanvasTGA.js";
import {Path} from "../lib/mmk/Path";
import {SCREEN_MARGIN_X, SCREEN_WIDTH, WIDGET_WIDTH, SCREEN_HEIGHT} from "../lib/mmk/UiParams";

class BackupTool {
	start() {
		hmSetting.setBrightScreen(600);
    hmUI.setStatusBarVisible(false);

		hmUI.createWidget(hmUI.widget.TEXT, {
			x: SCREEN_MARGIN_X + 8,
			y: 12,
			w: WIDGET_WIDTH - 8,
      align_h: hmUI.align.CENTER_H,
			h: 24,
			color: 0xffffff,
			text: "Работаем...",
		});

		const t = timer.createTimer(0, 500, () => {
			timer.stopTimer(t);
			this.process();
		});
	}

	process() {
		const out = new Path("data", "wallet.json").fetchText();
		(new QrDumpScreen(out)).start();
	}

	display(size, fn) {
		hmUI.createWidget(hmUI.widget.FILL_RECT, {
			x: 0,
			y: 0,
			w: SCREEN_WIDTH,
			h: SCREEN_HEIGHT,
			color: 0xFFFFFF
		})

		hmUI.createWidget(hmUI.widget.IMG, {
			x: (SCREEN_WIDTH-size) / 2,
			y: (SCREEN_HEIGHT-size) / 2,
			src: fn
		});
	}
}


class QrDumpScreen {
  constructor(data) {
  	this.data = data;
    this.tmp = null;

    this.canvas = new CanvasTGA(192, 192);
    this.canvas.contextOffsetX = 3;
    this.canvas.contextOffsetY = 3;

    this.position = 0;
  }

  start() {
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: SCREEN_WIDTH,
      h: SCREEN_HEIGHT,
      color: 0xFFFFFF
    });

    this.info = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 12,
      w: SCREEN_WIDTH,
      h: 40,
      text: "wait...",
      align_h: hmUI.align.CENTER_H,
      color: 0x0
    });

    this.image = hmUI.createWidget(hmUI.widget.IMG, {
      x: 0,
      y: 0,
      w: SCREEN_WIDTH,
      h: SCREEN_HEIGHT,
      pos_x: 0,
      pos_y: 149,
      src: "wait..."
    });

    this.image.addEventListener(hmUI.event.CLICK_UP, () => {
      this.nextPage();
    })

    const t = timer.createTimer(0, 1000, () => {
      timer.stopTimer(t);
      try {
	      this.nextPage();
      } catch(e) {
      	console.log(e);
      	hmUI.showToast({text: String(e)});
      }
    })
  }

  nextPage() {
    if(this.position >= this.data.length) {
      try {
        this.tmp.remove();
      } catch(e) {}

      hmApp.goBack();
      console.log("END");
      return;
    }

    this.pageData();
  }

  pageData() {
    const len = Math.min(90, this.data.length - this.position);
    const data = this.data.substring(this.position, this.position + len);
    this.position += len;

  	console.log(data);
    const qr = qrcode(5, "L");
    qr.addData(data);
    qr.make();

    qr.renderTo2dContext(this.canvas, 5);
    this.setState(this.position + "/" + this.data.length);
    this.reloadImage();
  }

  reloadImage() {
    if(this.tmp !== null) this.tmp.remove();

    const fn = "tmp_" + Math.round(Math.random() * 1e10) + ".png";
    this.tmp = new Path("assets", fn);
    this.canvas.saveAsset(fn);
    this.image.setProperty(hmUI.prop.MORE, {
      w: SCREEN_WIDTH,
      h: SCREEN_HEIGHT,
      pos_x: (SCREEN_WIDTH-192)/2,
      pos_y: (SCREEN_HEIGHT-192)/2,
      src: fn
    });
  }

  setState(p) {
    this.info.setProperty(hmUI.prop.TEXT, p);
  }
}


Page({
	onInit(params) {
    AppGesture.withYellowWorkaround("left", {
      appid: 18858,
      url: "page/BackupTool",
    });
    AppGesture.withHighLoadBackWorkaround();
    AppGesture.init();

		new BackupTool().start();
	},
});
