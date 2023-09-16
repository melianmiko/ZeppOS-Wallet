from PIL import Image
from pathlib import Path
import json
import shutil
import os

project = Path(".").resolve()
common_assets = project / "assets" / "common"
lib_assets = project / "lib" / "mmk" / "assets"

pages = [
  "page/index",
  "page/AboutScreen",
  "page/AdvEditor",
  "page/BackupTool",
  "page/RemoteManScreen",
  "page/CardView",
  "page/NewCardPicker",
  "page/NewCardKeyboardScreen",
  "page/ScreenBoardSetup",
  "page/SettingsScreen",
  "page/WriteBarcode",
  "page/WriteInt2of5",
  "page/WritePDF417",
  "page/WriteQR"
]

with open("app.json", "r") as f:
  app_json = json.load(f)


# Prepare assets
for target_id in app_json["targets"]:
  assets_dir = project / "assets" / target_id
  if assets_dir.is_dir():
    shutil.rmtree(assets_dir)

  # Icon size
  if target_id in ["band-7", "mi-band-7"]:
    icon_size = 24
  else:
    icon_size = 32

  # Include required assets
  shutil.copytree(common_assets / "base", assets_dir)
  shutil.copytree(common_assets / str(icon_size), assets_dir / "icons")

  os.mkdir(assets_dir / "screen_board")
  for f in (lib_assets / "screen_board").iterdir():
    if f.name.endswith(".png"):
      shutil.copy(f, assets_dir / "screen_board" / f.name)

  shutil.copytree(lib_assets / "screen_board" / str(icon_size), 
    assets_dir / "screen_board" / str(icon_size))

  # App.json
  app_json["targets"][target_id]["module"] = {
    "app-side": {
      "path": "app-side/index"
    },
    "page": {
      "pages": pages
    }
  }

with open("app.json", "w") as f:
  f.write(json.dumps(app_json, indent=2))
