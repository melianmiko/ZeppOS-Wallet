import {ScreenBoard} from "../lib/ScreenBoard";
import { AppGesture } from "../lib/AppGesture";
import {CardTypes} from "../utils/database";
import {CardsStorage} from "../utils/CardsStorage";
import {SCREEN_WIDTH, SCREEN_HEIGHT} from "../lib/UiParams";

class NewCardKeyboardScreen {
  constructor(id) {
    this.dataID = id;
    this.data = CardTypes[id];
  }

  build() {
    const type = this.data.keyboard;
    const renderer = type[0] == "numbers" ? "t9" : null;

    this.board = new ScreenBoard(type, renderer);
    this.board.title = "Введите\nномер с карты";
    this.board.confirmButtonText = "Создать";
    this.board.onConfirm = (v) => this.process(v);

    if(this.data.displayFormat)
      this.board.displayFormat = this.data.displayFormat;
  }

  process(value) {
    let format = this.data.format;

    if(this.data.inputValidate) {
      const result = this.data.inputValidate(value);
      if(!result) return hmUI.showToast({
        text: "Некорректный код"
      })
    }

    if(this.data.codePostProcessing) {
      value = this.data.codePostProcessing(value);
    }

    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: SCREEN_WIDTH,
      h: SCREEN_HEIGHT,
      color: 0x0
    });

    const t = timer.createTimer(0, 250, () => {
      timer.stopTimer(t);

      CardsStorage.startWrite({
        icon: this.dataID, 
        content: value,
        format
      });
    })
  }
}

Page({
  onInit(id) {
    AppGesture.withYellowWorkaround("left", {
      appid: 18858,
      url: "page/NewCardKeyboardScreen",
    });
    AppGesture.withHighLoadBackWorkaround();
    AppGesture.init();

    hmSetting.setBrightScreen(600);
    hmUI.setStatusBarVisible(false);
    (new NewCardKeyboardScreen(id)).build();
  },
});
