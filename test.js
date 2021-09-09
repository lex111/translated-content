#!/usr/bin/env node

const dree = require("dree");

const globby = require("globby");

const {execSync} = require("child_process");
const fs = require('fs');
const pathNode = require('path');

const readdirp = require('readdirp');
const rra = require('recursive-readdir-async')


// let folders = await readdirp.promise('files/ru/web', { alwaysStat: IsfileStat, depth: 1, type: 'directories'});

// console.log(folders)

const dirs = [];

// readdirp('/home/lex/repos/mdn/content/files/en-us/web', { type: 'directories', depth: 0 }).on('data', (entry) => {
//     const {path, fullPath} = entry;
    
//     console.log(fullPath)
    
//     dirs.push(fullPath);
    
//     // if (path === 'manifest') {
//     //     // console.log(entry);
//     //     exec('md-file-tree', {cwd: fullPath}, function(error, stdout, stderr) {
//     //       console.log(stdout);
//     //       console.log(stderr, error)
//     //     });
//     // }
// })

async function main() {
    for await (const entry of readdirp('/home/lex/repos/mdn/content/files/en-us/', { type: 'directories', depth: 0 })) {
        const {path, fullPath} = entry;
        
        console.log(pathNode.relative('/home/lex/repos/mdn/content/files/en-us/', fullPath))
        
        if (path !== 'web') {
                // console.log(entry);
            const res = await execSync('md-file-tree', {cwd: fullPath}).toString();
            fs.writeFileSync(`/home/lex/repos/mdn/translated-content/_temp/${path}.md`, res);
            
            // console.log(res);
        }
        
        if (path === 'web') {
            for await (const subEntry of readdirp(fullPath, { type: 'directories', depth: 0 })) {
                console.log(pathNode.relative('/home/lex/repos/mdn/content/files/en-us/', subEntry.fullPath))
                
                const res = await execSync('md-file-tree', {cwd: subEntry.fullPath}).toString();
                fs.writeFileSync(`/home/lex/repos/mdn/translated-content/_temp/web_${subEntry.path}.md`, res);
            }
        }
    }
}

main();
