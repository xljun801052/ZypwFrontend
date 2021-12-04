const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  lintOnSave: false,
  // 配置别名alias
  chainWebpack: config => {
    config.resolve.alias
      // set第一个参数：设置的别名，第二个参数：设置的路径
      .set("assets", resolve("src/assets"))
      .set("common", resolve("src/common"))
      .set("network", resolve("src/network"))
      .set("components", resolve("src/components"))
      .set("views", resolve("src/views"));

    // 配置插件，显示markdown文本【该插件可以将markdown文件加载成vue组件】
    config.module
      .rule("md")
      .test(/\.md/)
      .use("vue-loader")
        .loader("vue-loader")
        .end()
      .use("vue-markdown-loader")
        .loader("vue-markdown-loader/lib/markdown-compiler")
        .options({
          raw: true
        });

    // svg-loader configure
    const svgRule = config.module.rule("svg"); // 找到svg-loader
    svgRule.uses.clear(); // 清除已有的loader, 如果不这样做会添加在此loader之后
    svgRule.exclude.add(/node_modules/); // 正则匹配排除node_modules目录
    svgRule // 添加svg新的loader处理
      .test(/\.svg$/)
      .use("svg-sprite-loader")
        .loader("svg-sprite-loader")
        .options({
          symbolId: "icon-[name]"
        });

    // 修改images loader 添加svg处理
    const imagesRule = config.module.rule("images");
    imagesRule.exclude.add(resolve("src/assets/svgs"));
    config.module
      .rule("images")
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/);
  }
};
