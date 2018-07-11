const fs = require('fs-extra')
const lab = require('linco.lab')
const path = require('path')
const glob = require('glob')
const Gaze = require('gaze').Gaze
const flow = require('flow-bin')
const prettier = require('prettier')
const { execFile, exec, execSync } = require('child_process')
const flowRemoveTypes = require('flow-remove-types')


class Compiler {
    constructor(options) {
        this.src = options.src
        this.dist = options.dist
        this.options = options
    }

    watch() {
        const gaze = new Gaze('**/*.*', {cwd: this.src, ignore: this.options.ignore})

        // 启动监听的时候
        // 1.flow check
        // 2.执行一次全量编译，以保证程序可以顺利运行
        gaze.on('ready', watcher => {
            this.check()
            this.compile(this.getFiles())
        })

        // 后续所有更新事件
        // 1.全量 flow check
        // 2.执行单文件编译
        gaze.on('all', (event, filepath) => {
            this.check()
            this.compile(filepath)
        })
    }

    run() {
        this.watch()
    }

    /// 清理js文件的flowType标记
    compile(files) {
        (Array.isArray(files) ? files : [files]).map(filepath => {
            this.isFlow(filepath) ? this.flow(filepath) : this.clone(filepath)
        })
    }

    isFlow(filepath) {
        return path.extname(filepath) === '.js'
    }

    /// 这一步清理flow type标记
    flow(filepath) {
        let dist = filepath.replace(this.src, this.dist)
        let input = fs.readFileSync(filepath).toString('utf8')
        let output = flowRemoveTypes(input).toString()
        lab.mkdir(path.dirname(dist))
        // 输出美化后的代码
        // 1.去除多余空白
        // 2.格式化代码
        fs.writeFileSync(dist, prettier.format(output, {
            tabWidth: 4, // 4个空格
            useTabs: false, // 使用空格而不使用tab
            semi: false, // 不需要分号
            parser: "babylon"
        }))
    }

    /// 复制不需要执行flow type清理的文件到dist目录
    clone(filepath) {
        if (lab.isFile(filepath)) {
            let dist = filepath.replace(this.src, this.dist)
            fs.copySync(filepath, dist)
        }
    }

    getFiles() {
        return glob.sync(path.join(this.src, '**/*'), {nodir: true})
    }

    check() {
        execFile(flow, ['check', '--color=always'], (err, stdout) => {
            console.log(stdout)
        })
    }
}

module.exports = Compiler

