#!/usr/bin/env node

const path = require('path')
const lab = require('linco.lab')
const Compiler = require('..')
const argv = process.argv.slice(2)

const defaults = {
    src: 'src',
    dist: 'lib'
}

if (argv.length === 0) {
    warnning()
}

if (argv[0] === '-h' || argv[0] === '--help' || argv[0] === 'help') {
    return help()
}

function help() {
    console.log('')
    console.log('  Usage:')
    console.log('')
    console.log('    flow-node-compiler --src=<your-src-dir> --dist=<your-dist-dir>')
    console.log('')
    console.log('  Example:')
    console.log('')
    console.log('    flow-node-compiler --src=src --dist=lib')
    console.log('')
}

function warnning() {
    console.log('')
    console.log('  The default src: src')
    console.log('  The default dist: lib')
    console.log('')
}

function parseArgv(argv) {
    let args = {}
    let command

    if (argv[0] && argv[0].indexOf('-') !== 0) {
        command = argv.shift()
    }

    argv.map(arg => {
        let arr = arg.split('=')
        args[arr[0].replace(/^-*/, '')] = arr[1]
    })

    return {
        command, args
    }
}

const { args } = parseArgv(argv)
const src = path.join(process.cwd(), args.src || defaults.src)
const dist = path.join(process.cwd(), args.dist || defaults.dist)

if (!lab.isDir(src)) {
    return console.warn('\n  Warnning: the src is not a folder.\n')
}


let compiler = new Compiler({ src, dist })

compiler.run()

/// todo
/// 1.现在 flow check 会命中全局，待优化
/// 2.删除事件并未清除dist目录对应文件，待优化