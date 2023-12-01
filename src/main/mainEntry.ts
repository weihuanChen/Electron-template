import { app, BrowserWindow } from "electron";
import { CustomScheme } from "./CustomScheme";
import { CommonWindowEvent } from "./CommonWindowEvent";
// 渲染进程开发者调试工具的警告
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
// 避免主窗口被js引擎当作垃圾回收
let mainWindow: BrowserWindow;
app.on("browser-window-created", (e, win) => {
  CommonWindowEvent.regWinEvent(win);
});

app.whenReady().then(() => {
  let config = {
    webPreferences: {
      nodeIntegration: true, // node 环境集成至渲染进程
      webSecurity: false,
      allowRunningInsecureContent: true,
      contextIsolation: false, // 在同一个js上下文使用electron api
      webviewTag: true,
      spellcheck: false,
      disableHtmlFullscreenWindowResize: true,
    },
  };
  mainWindow = new BrowserWindow(config);
  mainWindow.webContents.openDevTools({ mode: "undocked" }); // 打开开发者调试工具
  if (process.argv.length >= 3) {
    // 开发环境
    // 命令行参数加载url路径
    mainWindow.loadURL(process.argv[2]);
  } else {
    // 生产环境
    CustomScheme.registerScheme();
    mainWindow.loadURL(`app://index.html`);
  }
  CommonWindowEvent.listen();
  // CommonWindowEvent.regWinEvent(mainWindow);
  app.on("browser-window-created", (e, win) => {
    CommonWindowEvent.regWinEvent(win);
  });
});
