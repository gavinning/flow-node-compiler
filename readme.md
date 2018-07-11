Flow-node-compiler
---
在nodejs中使用flow  
每次更新文件都会触发flow check

### Install
```js
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
```js
npm run dev
```