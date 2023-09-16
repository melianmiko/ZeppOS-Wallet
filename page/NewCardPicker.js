import {TouchEventManager} from "../lib/TouchEventManager";
import {CardTypes} from "../utils/database";
import { AppGesture } from "../lib/AppGesture";
import {
  SCREEN_MARGIN_Y, 
  SCREEN_MARGIN_X, 
  BASE_FONT_SIZE, 
  WIDGET_WIDTH, 
  SCREEN_WIDTH, 
  SCREEN_HEIGHT
} from "../lib/UiParams";

class NewCardPicker {
  build() {
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: SCREEN_MARGIN_X,
      y: 48,
      w: WIDGET_WIDTH,
      h: 48,
      align_h: hmUI.align.CENTER_H,
      text_size: BASE_FONT_SIZE,
      text: "Новая карта",
      color: 0xffffff,
    })

    const cardImageWidth = 92;
    const rowSize = Math.floor((WIDGET_WIDTH / (cardImageWidth + 4)));
    const offsetX = SCREEN_MARGIN_X + (WIDGET_WIDTH - (rowSize * (cardImageWidth + 4))) / 2;

    let i = 0, y = 96;
    for(const ID in CardTypes) {
      this.drawCardButton(ID, offsetX + 100 * (i % rowSize), y);
      if(i % rowSize == rowSize - 1) y += 77;
      i++;
    }

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 0,
      y,
      w: SCREEN_WIDTH,
      h: 96,
      font_size: BASE_FONT_SIZE,
      text: "Вручную",
      color: 0xAAAAAA,
      click_func: () => {
        hmApp.reloadPage({
          url: "page/AdvEditor"
        })
      }
    })
  }

  drawCardButton(id, x, y) {
    const b = hmUI.createWidget(hmUI.widget.IMG, {
      x, y,
      src: `cards/${id}.png`
    });

    const events = new TouchEventManager(b);
    events.ontouch = () => {
      this.onItemClick(id);
    };
  }

  onItemClick(id) {
    if(CardTypes[id].info) {
      hmApp.setLayerY(0);
      hmUI.createWidget(hmUI.widget.FILL_RECT, {
        x: 0,
        y: 0,
        w: SCREEN_WIDTH,
        h: SCREEN_HEIGHT,
      })
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: 0,
        y: 0,
        w: SCREEN_WIDTH,
        h: SCREEN_HEIGHT,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V,
        text_style: hmUI.text_style.WRAP,
        text_size: 20,
        color: 0xFFFFFF,
        text: CardTypes[id].info + "\n\nКоснитесь, чтобы продолжить"
      }).addEventListener(hmUI.event.CLICK_DOWN, () => {
        this.nextScreen(id);
      })

      return;
    }

    this.nextScreen(id);
  }

  nextScreen(id) {
    hmApp.gotoPage({
      url: "page/NewCardKeyboardScreen",
      param: id
    })
  }
}

Page({
  onInit() {
    AppGesture.withYellowWorkaround("left", {
      appid: 18858,
      url: "page/NewCardPicker",
    });
    AppGesture.withHighLoadBackWorkaround();
    AppGesture.init();

    hmSetting.setBrightScreen(600);
    (new NewCardPicker()).build();
  },
  // onDestroy() {
  //   hmApp.unregisterGestureEvent();
  // }
});
