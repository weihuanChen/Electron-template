// vite编译插件
import { ViteDevServer } from "vite";
export let devPlugin = () => {
  return {
    name: "dev-plugin",
    configureServer(server: ViteDevServer) {
      require("esbuild").buildSync({
        entryPoints: ["./src/main/mainEntry.ts"],
        bundle: true,
        platform: "node",
        outfile: "./dist/mainEntry.js",
        external: ["electron"],
      });

      server.httpServer?.once("listening", () => {
        let { spawn } = require("child_process");
        // let addressInfo = server.httpServer?.address() as any;
        // let httpAddress = `http://${addressInfo.address}:${addressInfo.prot}`;
        let addressInfo = server.httpServer?.address() as any;
        let httpAddress = `http://${addressInfo.address}:${addressInfo.port}`;

        let electronProcess = spawn(
          require("electron").toString(),
          ["./dist/mainEntry.js", httpAddress],
          {
            cwd: process.cwd(),
            stdio: "inherit",
          }
        );

        electronProcess.on("close", () => {
          server.close();
          process.exit();
        });
      });
    },
  };
};
// 内置模块列表
export let getReplacer = () => {
  // node 模块
  let externalModels = [
    "os",
    "fs",
    "path",
    "events",
    "child_process",
    "crypto",
    "http",
    "buffer",
    "url",
    "better-sqlite3",
    "knex",
  ];
  let result: any = {};
  for (let item of externalModels) {
    result[item] = () => ({
      find: new RegExp(`^${item}$`),
      code: `const ${item} = require('${item}');export { ${item} as default }`,
    });
  }
  // electron模块
  result["electron"] = () => {
    let electronModules = [
      "clipboard",
      "ipcRenderer",
      "nativeImage",
      "shell",
      "webFrame",
    ].join(",");
    return {
      find: new RegExp(`^electron$`),
      code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
    };
  };
  return result;
};