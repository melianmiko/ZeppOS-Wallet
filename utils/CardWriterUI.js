import {SCREEN_WIDTH, SCREEN_HEIGHT, BASE_FONT_SIZE} from "../lib/UiParams";

export class CardWriterUI {
  start(params) {
    const allowed = hmFS.SysProGetBool("mmk_c_aw");
    if(!allowed) return hmApp.goBack();

    hmUI.setStatusBarVisible(false);
    hmSetting.setBrightScreen(60);
    this.viewText = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: Math.floor((SCREEN_HEIGHT - 48) / 2),
      w: SCREEN_WIDTH,
      h: 48,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      color: 0xaaaaaa,
      text_size: BASE_FONT_SIZE,
      text: "Обработка...",
    });

    const t = timer.createTimer(0, 1000, () => {
      timer.stopTimer(t);
      try {
        this.process(params);
      } catch(e) {
        console.log(e);
        hmUI.showToast({text: "Что-то пошло не так"});
      }
      this.finish();
    });
  }

  finish() {
    hmUI.deleteWidget(this.viewText);
    hmFS.SysProSetBool("mmk_c_aw", false);

    const t = timer.createTimer(0, 500, () => {
      timer.stopTimer(t);
      hmApp.gotoPage({
        url: "page/CardView",
        param: JSON.stringify(this.result),
      });
    });
  }
}
