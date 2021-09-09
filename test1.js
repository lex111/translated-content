                const addLb = true;
                const insideDir = data['index.html'] && data['index.html'].replace(/^\/+/, '').replace('/index.html', '');
                
                output += addIndentation(indentation) + directoryName(key, addLb, data['index.html'] ? `${process.cwd()}/${insideDir}` : null);
                
                if (!!addLb) {
                    delete data['index.html']
                }
                
                parseResult(data, !addLb);
                
                
#!/usr/bin/env node
'use strict';

const tree = require('./walker');
const {resolve, extname} = require('path');
const nthLine = require('read-nth-line');
const relative = require('relative');
const {existsSync} = require('fs');

// console.log(process.argv[2])

function escapeMarkdown(text) {
  // @see https://core.telegram.org/bots/api#markdownv2-style
  const escapedChars = [
    '_',
    '*',
    '[',
    ']',
    '(',
    ')',
    '~',
    '`',
    '>',
    '#',
    '+',
    '-',
    '=',
    '|',
    '{',
    '}',
    '.',
    '!',
  ];
  return escapedChars.reduce((msg, char) => msg.split(char).join(`\\${char}`), text);
}
const emoji = process.argv.includes('--emoji') || process.argv.includes('-e');
const cleanMarkdown = name => name.replace(/([\\\/_*|-])/g, '\\$1');
const directoryName = (name, lineBreak = true, fullPath) => {
    let title = cleanMarkdown(name);
    
    if (fullPath) {
        const file = fullPath + '/index.html';
        const url = 'https://github.com/mdn/content/blob/main/' + relative('/home/lex/repos/mdn/content/', file);
        const title = escapeMarkdown(nthLine.readSync(resolve(fullPath, `./index.html`), 1).replace('title: ', '').trimRight());
        const transFile = file.replace('home/lex/repos/mdn/content/files/en-us', 'home/lex/repos/mdn/translated-content/files/ru');
        let transLink = '';
        
        if (existsSync(transFile)) {
            // console.log(1111, relative('/home/lex/repos/mdn/translated-content/', transFile));
            const transTitle = escapeMarkdown(nthLine.readSync(transFile, 1).replace('title: ', '').trimRight()); 
            const transPath = 'https://github.com/mdn/translated-content/blob/main/' + relative('/home/lex/repos/mdn/translated-content/', transFile)
            transLink = ` (☑️ [${transTitle}](${transPath}))`;
        }
        
        return `- 📂 __[${title}](${url})__${transLink}${(lineBreak ? '\n' : '')}`;
    }
    
    return `- 📂 __${title}__${(lineBreak ? '\n' : '')}`;
};
const filename = (name, path, data) => {
    // console.log(2, resolve(process.cwd(), `.${data}`) )
    
    const url = 'https://github.com/mdn/content/blob/main/' + relative('/home/lex/repos/mdn/content/', `${process.cwd()}/${data}`);
    const title = escapeMarkdown(nthLine.readSync(resolve(process.cwd(), `.${data}`), 1).replace('title: ', '').trimRight()); 
    const transFile = `${process.cwd()}/${data}`.replace('home/lex/repos/mdn/content/files/en-us', 'home/lex/repos/mdn/translated-content/files/ru');
    // const link = (path.replace(/^\/?(.+?)\/?$/, '$1') + '/' + encodeURIComponent(name)).replace(/^\/?(.+?)$/, '$1');
    let transLink = '';
    
    if (existsSync(transFile)) {
        // console.log(3, relative('/home/lex/repos/mdn/translated-content/', transFile));
        
        const transTitle = escapeMarkdown(nthLine.readSync(transFile, 1).replace('title: ', '').trimRight()); 
        const transPath = 'https://github.com/mdn/translated-content/blob/main/' + relative('/home/lex/repos/mdn/translated-content/', transFile)
        transLink = ` (☑️ [${transTitle}](${transPath}))`;
    }
    
    return `- 📄 [${title}](${url})${transLink}\n`;
};
const addIndentation = i => {
    return ' '.repeat(i * 2 + 1);
};

const main = () => {
    const dirPath = process.cwd();
    const dir = dirPath.split('/').pop();
    
    let indentation = 0;
    let output = directoryName(dir, true, dirPath).replace('- ', '## ');

    const parseResult = (result, isSubDir = false) => {
        indentation++;
        Object.keys(result).sort().forEach(key => {
            const data = result[key];
            if (typeof data === 'string' && key[0] !== '.') {
                const path = data.split('/');
                const fileName = path.slice(-1)[0];
                
                // console.log(4, data)
                
                if (fileName === 'index.html' && isSubDir) {
                    // console.log(11, output, addIndentation(indentation), inside)
                    
                    output = output.replace(output.substr(output.indexOf('-', output.lastIndexOf('\n'))), '');
                    output += filename(path.pop(), path.join('/'), data);
                } else {
                    if (extname(fileName) === '.html') {
                        output += addIndentation(indentation) + filename(path.pop(), path.join('/'), data);
                    }
                }
            } else if (typeof data === 'object') {
                // console.log(5, data)
                
                const isIndex = Object.keys(data)[0] === 'index.html';
                // const addLb = true;
                const subDirName = data['index.html'] && data['index.html'].replace(/^\/+/, '').replace('/index.html', '');
                
                output += addIndentation(indentation) + directoryName(key, !isIndex, data['index.html'] ? `${process.cwd()}/${subDirName}` : null);
                
                if (!isIndex) {
                    delete data['index.html'];
                }
                
                parseResult(data, !isIndex);
                
                indentation--;
            }
        });
    };

    tree(dirPath, (err, result) => {
        console.log(1, result)
        
        delete result['index.html']
        
        parseResult(result);
        console.log(output);
    });

};


main();


