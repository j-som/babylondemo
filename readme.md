原文：[https://doc.babylonjs.com/how_to/page2](https://doc.babylonjs.com/how_to/page2)

[TOC]

## 创建一个项目

首先你需要设置你项目的位置。

1. 创建一个文件夹用来存储你的项目文件
2. 在根目录中新建以下文件夹：
   *  dist
   * public
   * src

3. 主要文件

   * 进入src文件夹并创建`app.ts`文件

   * 进入public文件夹并创建`index.html`文件

   * 你的html文件应该看起来像这样：

     ```html
     <!DOCTYPE html>
     <html>
     <head>
       <meta charset="UTF-8">
       <title>Title of Your Project</title>
     </head>
     <body>
     </body>
     </html>
     ```

     注意当前我们的html body里面啥也没有，后面我们会在app.ts文件中创建一个画布。

## 安装Babylon.js

1. 生成package.json文件

   ```shell
   npm init
   ```

   您可以立即填写这些内容，也可以继续按Enter并稍后将其填写在package.json中

2. 在项目根路径下，打开终端

3. 安装Babylon.js

   ```shell
   npm install --save-dev @babylonjs/core
   npm install -场景-save-dev @babylonjs/inspector
   ```

   这将安装你需要的所有babylon依赖项

4. Typescript支持

   ```shell
   tsc --init
   ```

   这会创建一个默认的tsconfig.json文件，你可以用以下内容覆盖它：

   ```json
   {
   "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "noResolve": false,
    "noImplicitAny": false,
    "sourceMap": true,
    "preserveConstEnums":true,
    "lib": [
        "dom",
        "es6"
    ],
    "rootDir": "src"
   }
   }
   ```

## 设置webpack

### 安装依赖

现在我们有一个生成的package.json文件，我们需要安装使用webpack的开发依赖。

```shell
npm install --save-dev typescript webpack ts-loader webpack-cli
```

如果失败了多试几次。

### 配置webpack

现在我们需要配置webpack来确定要做什么。在项目根目录中创建一个`webpack.config.js文件，该例子的配置看起来如下：

```js
const path = require("path");
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
    entry: path.resolve(appDirectory, "src/app.ts"), //path to the main .ts file
    output: {
        filename: 'js/bundleName.js' //name for the javascript file that is created/compiled in memory
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    module: {
        rules: [
            {
              test: /\.tsx?$/,
              use: "ts-loader",
              exclude: /node_modules/
            },
        ]
    },
    mode: "development"
};
```

### 插件

另外，我们安装一些帮助我们在本地运行更新，和清理捆绑内容。

```shell
npm install --save-dev html-webpack-plugin
npm install --save-dev clean-webpack-plugin
npm install --save-dev webpack-dev-server
```

安装完这些东西，我们需要将它们添加到webpack.config.js文件中，添加完的webpack.config.js如下：

```js
const path = require("path");
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
    entry: path.resolve(appDirectory, "src/app.ts"), //path to the main .ts file
    output: {
        filename: 'js/bundleName.js' //name for the js file that is created/compiled in memory
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    devServer: {
        host: '0.0.0.0',
        port: 8080, //port that we're using for local host (localhost:8080)
        disableHostCheck: true,
        contentBase: path.resolve(appDirectory, "public"), //tells webpack to serve from the public folder
        publicPath: '/',
        hot: true
    },
    module: {
        rules: [
            {
              test: /\.tsx?$/,
              use: "ts-loader",
              exclude: /node_modules/
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(appDirectory, "public/index.html")
        }),
        new CleanWebpackPlugin()
    ],
    mode: "development"
};
```

现在我们构建并运行项目时，如果作了什么修改，浏览器都会自动刷新使我们马上看到变化。另外，HTML Webpack插件正在获取已编译的javascript捆绑文件，并将其注入到我们的index.html文件中，该.js捆绑包将显示在dist文件夹内。

## 创建场景

我们将app.ts作为我们项目的主要入口点。

### 设置并创建App类

App类将作为我们整个游戏应用

这是一个非常简单的示例，说明如何设置场景，应将其分为不同的功能，并在项目进行过程中使用类变量，

app.ts

```ts
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder } from "@babylonjs/core";

class App {
    constructor() {
        // create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
        var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });

        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
    }
}
new App();
```

## 捆绑项目并在本地运行

现在我们的项目已经设置好了，怎么在本地运行呢？我们需要在package.json文件中配置任务，在你的package.json文件中，用下面代码覆盖"scripts":

```json
    "scripts": {
        "build": "webpack",
        "start": "webpack-dev-server --port 8080"
    },

```

现在我们需要做的是：

```shell
npm run build
npm run start
```

然后打开浏览器浏览[localhost:8080](localhost:8080)，你会看到一个球。



