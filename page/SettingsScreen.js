import { AppGesture } from "../lib/mmk/AppGesture";
import { ListScreen } from "../lib/mmk/ListScreen";

class SettingsScreen extends ListScreen {
  start() {
    this.row({
      text: "О программе...",
      icon: "icons/about.png",
      callback: () => hmApp.gotoPage({
        url: "page/AboutScreen"
      })
    });

    this.headline("Дополнительно:");
    this.row({
      text: "Настройки клавиатуры",
      icon: "icons/keyboard.png",
      callback: () => hmApp.gotoPage({
        url: "page/ScreenBoardSetup"
      })
    });
    this.row({
      text: "Создать бэкап",
      icon: "icons/backup.png",
      callback: () => hmApp.gotoPage({
        url: "page/BackupTool"
      })
    });
    this.row({
      text: "Sync",
      icon: "icons/backup.png",
      callback: () => hmApp.gotoPage({
        url: "page/RemoteManScreen"
      })
    });

    this.offset();
  }
}

Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 18858,
      url: "page/SettingsScreen",
    });
    AppGesture.init();

    new SettingsScreen().start();
  }
});
