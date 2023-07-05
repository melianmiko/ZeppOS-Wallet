import { AppGesture } from "../lib/AppGesture";
import { ScreenBoardSetup } from "../lib/ScreenBoardSetup";

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
