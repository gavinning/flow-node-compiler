Flow-node-compiler
---
在nodejs中使用flow | use flow in nodejs  

主要是方便在nodejs中使用flow，开发这个包之前找了一下，  
没发现有类似功能的，本人又非常想在nodejs中使用flow，索性就封装了一个    

特点：入侵小，产出源码友好，几乎就是未加flow type标记之前的代码风格，  
当有一天不需要flow了，直接使用产出代码继续开发就好了

主要功能点：  
* 监听``src``目录下的源码文件    
* js文件更改时：  
    * 启用flow检查 [不通过则报错，通过则继续]
    * 同步删除flow type标记
    * 格式化代码
    * 产出到``dist``目录
* 对于非js文件，直接产出到``dist``目录  

``src``和``dist``是配置项，可以自由指定源码目录和产出目录

### Install
```sh
npm i flow-node-compiler --save-dev
```

### Usage
Step 1
```sh
flow init  # 工作目录下执行 如果需要自行配置相关选项
```
Step 2
```json
{
    "script": {
        "dev": "npm run flow & nodemon dist/app.js",
        "flow": "flow-node-compiler --src=src --dist=lib"
    }
}
```
Step 3
```sh
npm run dev  # nodemon 根据自身项目需要决定是否配置
```