import path from "path";
import fs from "fs";

class BuildObj {
  // 编译主进程代码
  buildMain() {
    require("esbuild").buildSync({
      entryPoints: ["./src/main/mainEntry.ts"],
      bundle: true,
      platform: "node",
      outfile: "./dist/mainEntry.js",
      external: ["electron"],
    });
  }
  // 为生产环境准备package.json
  buildPackageJson() {
    let pkgJsonPath = path.join(process.cwd(), "package.json");
    let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
    let electronPkgJson = localPkgJson.devDependencies.electron.replace(
      "^",
      ""
    );
    localPkgJson.main = "./mainEntry.js";

    delete localPkgJson.devDependencies;
    delete localPkgJson.scripts;
    localPkgJson.devDependencies = { electron: electronPkgJson };
    let tarJsonPath = path.join(process.cwd(), "dist", "package.json");
    fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson, null, 2));
    fs.mkdirSync(path.join(process.cwd(), "dist/node_modules"), {
      recursive: true,
    });
  }
  // 使用electron-builder打包
  buildeInstaller() {
    let options = {
      config: {
        directories: {
          output: path.join(process.cwd(), "release"),
          app: path.join(process.cwd(), "dist"),
        },
        files: ["**/*"],
        extends: null,
        productName: "electron-vite-template",
        appId: "com.electron-vite-template",
        asar: true,
        nsis: {
          oneClick: true,
          perMachine: true,
          allowToChangeInstallationDirectory: false,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: "electron-vite-template",
        },
        publish: [
          {
            provider: "generic",
            url: "http://localhost:5500/",
          },
        ],
      },
      project: process.cwd(),
    };
    return require("electron-builder").build(options);
  }
}

export { BuildObj };
