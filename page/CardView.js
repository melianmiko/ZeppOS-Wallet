import { CardsStorage } from "../utils/CardsStorage";
import { goBack } from "../lib/mmk/bugWorkaround";
import { AppGesture } from "../lib/mmk/AppGesture";
import {
  SCREEN_MARGIN_X, 
  SCREEN_MARGIN_Y, 
  SCREEN_WIDTH, 
  SCREEN_HEIGHT, 
  WIDGET_WIDTH,
  BASE_FONT_SIZE
} from "../lib/mmk/UiParams";

class CardViewScreen {
  constructor(params) {
    this.paramsSource = params;
    this.params = JSON.parse(params);
    this.editPaneVisible = false;
  }

  build() {
    this.lastBrightness = hmSetting.getBrightness();
    this.lastAutoBrightState = hmSetting.getScreenAutoBright();

    hmSetting.setScreenAutoBright(false);
    hmSetting.setBrightScreen(180);
    hmSetting.setBrightness(100);
    hmUI.setStatusBarVisible(false);

    this.initGestures();

    const x = (SCREEN_WIDTH - this.params.width) / 2;
    const y = (SCREEN_HEIGHT - this.params.height) / 2;

    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: SCREEN_WIDTH,
      h: SCREEN_HEIGHT,
      color: 0xffffff,
    });
    hmUI.createWidget(hmUI.widget.IMG, {
      x,
      y,
      w: this.params.width,
      h: this.params.height,
      src: this.params.filename,
    });
  }

  initGestures() {
    AppGesture.on("up", () => {
      if(this.editPaneVisible) this.hideEditPane();
    });
    AppGesture.on("down", () => {
      if(!this.editPaneVisible) this.showEditPane();
    });
    AppGesture.withYellowWorkaround("left", {
      appid: 18858,
      url: "page/CardView",
      param: this.paramsSource,
    });
    AppGesture.withHighLoadBackWorkaround();
    AppGesture.init();
  }

  showEditPane() {
    const buttonStyle = {
      x: SCREEN_MARGIN_X,
      y: SCREEN_MARGIN_Y,
      w: WIDGET_WIDTH,
      text_size: BASE_FONT_SIZE,
      h: 64,
      color: 0x0,
      normal_color: 0xffffff,
      press_color: 0xf4f4f4,
      radius: 8,
    };

    this.editPane = [];
    this.editPaneVisible = true;

    this.editPane.push(
      hmUI.createWidget(hmUI.widget.FILL_RECT, {
        x: 0,
        y: 0,
        w: SCREEN_WIDTH,
        h: SCREEN_HEIGHT,
        color: 0xeeeeee,
      })
    );

    this.editPane.push(
      hmUI.createWidget(hmUI.widget.BUTTON, {
        ...buttonStyle,
        color: 0xff0000,
        text: "Удалить",
        click_func: () => {
          const storage = new CardsStorage();
          storage.deleteCard(this.params);
          goBack();
        },
      })
    );

    this.editPane.push(
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: SCREEN_MARGIN_X,
        y: SCREEN_MARGIN_Y + 72,
        w: WIDGET_WIDTH,
        h: 64,
        text_size: BASE_FONT_SIZE,
        color: 0x777777,
        text: `${this.params.width}x${this.params.height} | ${this.params.filename}`
      })
    )
  }

  hideEditPane() {
    this.editPaneVisible = false;
    for (let w of this.editPane) hmUI.deleteWidget(w);
  }

  finish() {
    hmSetting.setScreenAutoBright(this.lastAutoBrightState);
    hmSetting.setBrightness(this.lastBrightness);
    hmSetting.setBrightScreenCancel();
    hmApp.unregisterGestureEvent();
  }
}

let current;
Page({
  onInit(p) {
    current = new CardViewScreen(p);
    current.build();
  },
  onDestroy() {
    current.finish();
  },
});
