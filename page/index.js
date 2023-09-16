import {Path} from "../lib/mmk/Path";
import {CardsStorage} from "../utils/CardsStorage";
import {TouchEventManager} from "../lib/mmk/TouchEventManager";
import {SCREEN_MARGIN_Y, SCREEN_MARGIN_X, WIDGET_WIDTH, SCREEN_HEIGHT} from "../lib/mmk/UiParams";

class HomePage {
  constructor() {
    this.viewerVisible = false;
    this.lastBrightness = 0;
    this.storage = new CardsStorage();
    this.loadBackup();
  }

  loadBackup() {
    const backup = new Path("assets", "backup.json");
    if(backup.exists()) {
      try {
        const data = backup.fetchJSON();
        this.storage.loadBackup(data);
        backup.remove();
      } catch(e) {
        console.log(e);
        hmUI.showToast({text: "Не удалось восстановить бэкап"});
      }
    }
  }

  start() {
    const data = this.storage.data.cards;
    const viewData = [
      ...data,
      {icon: "action_new", url: "page/NewCardPicker"},
      {icon: "action_setup", url: "page/SettingsScreen"}
    ]

    const cardImageWidth = 92;
    const rowSize = Math.floor((WIDGET_WIDTH / (cardImageWidth + 4)));
    const offsetX = SCREEN_MARGIN_X + (WIDGET_WIDTH - (rowSize * (cardImageWidth + 4))) / 2;

    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: Math.max(SCREEN_HEIGHT, SCREEN_MARGIN_Y + 77 * Math.ceil(viewData.length / rowSize)),
      w: 1,
      h: SCREEN_MARGIN_Y + 1,
      color: 0x0
    })

    viewData.forEach((info, i) => {
      if(info.color) hmUI.createWidget(hmUI.widget.FILL_RECT, {
        x: offsetX + 100 * (i % rowSize), 
        y: SCREEN_MARGIN_Y + 77 * Math.floor(i / rowSize),
        w: 92,
        h: 69,
        radius: 8,
        color: info.color
      });

      if(info.title) hmUI.createWidget(hmUI.widget.TEXT, {
        x: offsetX + 100 * (i % rowSize), 
        y: SCREEN_MARGIN_Y + 77 * Math.floor(i / rowSize),
        w: 92,
        h: 69,
        text: info.title,
        color: 0xFFFFFF,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V
      });

      const b = hmUI.createWidget(hmUI.widget.IMG, {
        x: offsetX + 100 * (i % rowSize), 
        y: SCREEN_MARGIN_Y + 77 * Math.floor(i / rowSize),
        w: 92,
        h: 69,
        src: `cards/${info.icon}.png`
      });

      const events = new TouchEventManager(b);
      events.ontouch = () => {
        if(info.url) return hmApp.gotoPage({url: info.url});

        this.openImage(info);
      };
    });
  }

  openImage(data) {
    const [st, e] = hmFS.stat_asset(data.filename);
    console.log(`View card: ${JSON.stringify(data)}, e=${e}`);
    console.log(JSON.stringify(st));
    
    if(e != 0)
      return CardsStorage.startWrite(data);

    hmApp.gotoPage({
      url: "page/CardView",
      param: JSON.stringify(data)
    });
  }
}


Page({
  onInit() {
    (new HomePage()).start();
  },
  onDestroy() {
    
  }
});
