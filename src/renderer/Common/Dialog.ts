export let createDialog = (url: string, config: any): Promise<Window> => {
  return new Promise((resolve, reject) => {
    let windowProxy = window.open(url, "__blank", JSON.stringify(config));
    let readyHandler = (e) => {
      let msg = e.data;
      if (msg["msgName"] === "__dialoagReady") {
        window.removeEventListener("message", readyHandler);
        resolve(windowProxy as any);
      }
    };
    window.addEventListener("message", readyHandler);
  });
};

// 通知父窗口加载已经完成
export let dialogReady = () => {
  let msg = { msgName: `__dialogReady` };
  window.opener.postMessage(msg);
};
