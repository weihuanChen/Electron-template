import { protocol } from "electron";
import fs from "fs";
import path from "path";

//为自定义的app协议提供特权
let schemeConfig = {
  standard: true,
  supportFetchAPI: true,
  bypassCSP: true,
  corsEnabled: true,
  stream: true,
};
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: schemeConfig },
]);
export class CustomScheme {
  private static getMimeType(extension: string) {
    let mimeType = "";
    if (extension === ".js") {
      mimeType = "text/javascript";
    } else if (extension === ".html") {
      mimeType = "text/html";
    } else if (extension === ".css") {
      mimeType = "text/css";
    } else if (extension === ".svg") {
      mimeType = "image/svg+xml";
    } else if (extension === ".json") {
      mimeType = "application/json";
    }
    return mimeType;
  }
  // 注册自定义协议
  static registerScheme() {
    protocol.handle("app", (request) => {
      let { pathname: pathName } = new URL(request.url);
      let extension = path.extname(pathName).toLocaleLowerCase();
      if (extension === "") {
        pathName = "index.html";
        extension = ".html";
      }
      const tarFile = path.join(__dirname, pathName);
      // callback({
      //   statusCode: 200,
      //   headers: { "content-type": this.getMimeType(extension) },
      //   data: fs.createReadStream(tarFile),
      // });
      return new Response(fs.readFileSync(tarFile), {
        status: 200,
        headers: { "content-type": this.getMimeType(extension) },
      });
    });
  }
}
