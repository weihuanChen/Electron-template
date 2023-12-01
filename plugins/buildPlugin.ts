import { BuildObj } from "./buildObj";
// rollup插件
export let buildPlugin = () => {
  return {
    name: "build-plugin",
    apply: "build",
    closeBundle() {
      let buildObj = new BuildObj();
      buildObj.buildMain();
      buildObj.buildPackageJson();
      buildObj.buildeInstaller();
    },
  };
};
