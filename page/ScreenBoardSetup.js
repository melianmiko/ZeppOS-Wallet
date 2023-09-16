import { AppGesture } from "../lib/mmk/AppGesture";
import { ScreenBoardSetup } from "../lib/mmk/ScreenBoardSetup";

Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 18858,
      url: "page/ScreenBoardSetup",
    });
    AppGesture.init();

    new ScreenBoardSetup().start();
  }
});
