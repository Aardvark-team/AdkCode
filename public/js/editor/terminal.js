//https://stackoverflow.com/questions/45924485/how-to-create-web-based-terminal-using-xterm-js-to-ssh-into-a-system-on-local-ne
//Make a bash terminal
//https://xtermjs.org xterm docs
const term = new Terminal({
  fontFamily: "Monospace",
  theme: {
    background: "#1d1d1d"
  },
  fontSize: 14
});
term.setOption('cursorBlink', true)
const termEl = document.getElementById("terminal");
const fitAddon = new FitAddon.FitAddon();
const clearbtn = document.getElementById("clearbtn");
let currentLine = '';
let currentDir = '/';
let commandHistory = [];
let commandCycle = 0;

function clearTerm(newline = true) {
  term.clear();
  fitAddon.fit();
  term.write('[2J[H');
  if (newline) clearLine();
}
clearbtn.onclick = clearTerm;

function loadTerminal() {
  term.loadAddon(fitAddon);
  term.open(termEl);
  fitAddon.fit();
  clearTerm();
}

function termError(text) {
  term.write(`\x1b[0;31m${text}\x1b[0m`)
}
let commands = {
  'help': {
    name: 'help',
    args: '?[command]',
    shortdes: 'List Commands and Provide Help.',
    help: 'If the command is specified, then show advanced help for that command. If not, list commands.'
  },
  'ls': {
    name: 'ls',
    args: '',
    shortdes: 'Lists all files in the currenct directory',
    help: ''
  },
  'mkdir': {
    name: 'mkdir',
    args: '[name]',
    shortdes: 'Make a new directory.',
    help: ''
  },
  'mkf': {
    name: 'mkf', //alias "touch"
    args: '[name]',
    shortdes: 'Make a new file.',
    help: ''
  },
  'code': {
    name: 'code',
    args: '[file]',
    shortdes: 'Open a file.',
    help: ''
  },
  'rm': {
    name: 'rm',
    args: '[file or dir]',
    shortdes: 'Delete a file or directory.',
    help: ''
  },
  'cd': {
    name: 'cd',
    args: '[directory]',
    shortdes: 'Change directory.',
    help: ''
  },
  'pwd': {
    name: 'pwd',
    args: '',
    shortdes: 'Print Working Directory.',
    help: ''
  },
  'echo': {
    name: 'echo',
    args: '...[text]',
    shortdes: 'Repeats the given text.',
    help: ''
  },
  'clear': {
    name: 'clear',
    args: '',
    shortdes: 'Clears the terminal.',
    help: ''
  },
  'mv': {
    name: 'mv',
    args: '[source] [destination]',
    shortdes: 'Move [source] to [destination].',
    help: 'Moving folders/directories is not yet supported.'
  },
  'print': {
    name: 'print',
    args: '[filename]',
    shortdes: 'Print file contents.',
    help: ''
  },
  'info': {
    name: 'info',
    args: '[filename]',
    shortdes: 'Give basic file info.',
    help: 'Shows file length, file type, number of lines, and part of its content.'
  },
  'lex': {
    name: 'lex',
    args: '[filename] ?[target]',
    shortdes: 'Lex an Aardvark file and return tokens.',
    help: 'Contacts an API to lex the specified Aardvark file. If the target is not specified then it just prints the tokens, otherwise the tokens will be saved to the target.\r\nWe recomend setting the target to a file of type JSON.'
  },
  'aicomp': {
    name: 'aicomp',
    args: '[filename]',
    shortdes: 'NOTE: in developer ALPHA testing. Use AI to autocomplete code.',
    help: 'NOTE: in developer ALPHA testing. \n\rContacts an API to get AI autocomplete suggestions for the given file. Uses AdkAI ALPHA. \r\nWill be integrated into the editor later on. \r\nTakes ~5 seconds to return.'
  },
  'debug': {
    name: 'debug',
    args: '',
    shortdes: 'Enables ide debug mode.',
    help: 'Prints ide errors to the terminal. '
  }
}

function processCommands(str) {
  //https://gist.github.com/Prakasaka/219fe5695beeb4d6311583e79933a009
  //https://gist.github.com/LordMZTE/4b5fcd40ac9512da2c9ebdc6a676dbb8
  //^^Replace \e with \x1b
  if (commandHistory[commandHistory.length - 1] != str) commandHistory.push(str);
  let dirObject = getByName(currentDir);
  term.write('\r\n');
  let args = [];
  for (let arg of str.split(' ')) {
    if (arg != '') {
      args.push(arg);
    }
  }
  let cmd = args[0];
  args = args.slice(1);
  if (cmd === 'help') {
    if (args[0]) {
      let command = commands[args[0]];
      term.write(`\x1b[1;32m${command.name}\x1b[0m\r\n\x1b[0;31m${command.name} ${command.args}\x1b[0m\r\n\x1b[0;34m${command.shortdes}\x1b[0m\r\n\r\n${command.help}`);
    } else {
      for (let i in commands) {
        i = commands[i];
        term.write(`\x1b[0;32m${i.name}\x1b[0m ${i.args} — ${i.shortdes}\r\n`);
      }
    }
  } else if (cmd === 'mkdir') {
    if (args.length < 1) return termError('No directory name provided!');
    if (args.length > 1) return termError('Too many arguments! mkdir only accepts one argument.');
    newFolder(currentDir + args[0]);
  } else if (cmd === 'touch' || cmd === 'mkf') {
    if (args.length < 1) return termError('No file name provided!');
    if (args.length > 1) return termError(`Too many arguments! ${cmd} only accepts one argument.`);
    newFile(currentDir + args[0]);
  } else if (cmd === 'cd') {
    if (args.length < 1) //
      return termError('No file provided!');
    if (args.length > 1) return termError(`Too many arguments! ${cmd} only accepts one argument.`);
    if (args[0] === '..') {
      currentDir = currentDir.split('/').slice(0, -1).join('/');
    } else if (getByName(currentDir + args[0])) {
      currentDir += args[0] + "/";
    } else { 
      termError(`${currentDir + args[0]} does not exist.`)
    }
  } else if (cmd == 'echo') {
    term.write(args.join(' '));
  } else if (cmd === 'pwd') {
    if (args.length > 1) return termError(`Too many arguments! ${cmd} doesn't accept any argumnets.`);
    term.write(currentDir);
  } else if (cmd === 'rm') {
    if (args.length < 1) return termError('No file provided!');
    if (args.length > 1) return termError(`Too many arguments! ${cmd} only accepts one argument.`);
    let f = getByName(currentDir + args[0]);
    if (f instanceof AdkFile) {
      files = files.filter(el => el !== f);
      f.element.remove();
      if (f.parent) f.parent.removeFile(f);
    } else if (f instanceof Folder) {
      f.element.remove();
      if (f.parent) f.parent.removeFolder(f);
    }
  } else if (cmd === 'code') {
    if (args.length < 1) return termError('No file provided!');
    if (args.length > 1) return termError(`Too many arguments! ${cmd} only accepts one argument.`);
    let f = getByName(currentDir + args[0]);
    if (!f) {
      newFile(currentDir + args[0]);
      f = getByName(currentDir + args[0]);
    }
    openFile(f);
  } else if (cmd === 'ls') {
    if (args.length > 1) return termError(`Too many arguments! ${cmd} doesn't accept any argumnets.`);
    for (let f of dirObject.files) {
      if (f instanceof AdkFile) {
        term.write(f.name + '\r\n');
      } else if (f instanceof Folder) {
        term.write(f.name + '/\r\n');
      }
    }
  } else if (cmd === 'clear') {
    clearTerm(false);
  } else if (cmd === 'mv') {
    //mv source dest
    if (args.length != 2) return termError(`${cmd} accepts exactly 2 arguments.`);
    let f = getByName(currentDir + args[0]);
    let content = f.content;
    if (f instanceof AdkFile) {
      files = files.filter(el => el !== f);
      f.element.remove();
      if (f.parent) f.parent.removeFile(f);
    } else if (f instanceof Folder) {
      term.Error("Moving directories is not yet supported.")
    }
    newFile(agrs[1]).content = content;
  } else if (cmd === 'print') {
    if (args.length != 1) return termError(`${cmd} accepts exactly 1 arguments.`);
    let f = getByName(args[0]);
    if (f) {
      term.write(f.content);
    } else {
      return termError(`Could not find file "${args[0]}"`)
    }
  } else if (cmd === 'info') {
    if (args.length != 1) return termError(`${cmd} accepts exactly 1 arguments.`);
    let f = getByName(args[0]);
    let ext = f.name.split('.');
    ext = ext[ext.length - 1];
    term.write(`\x1b[1;32m${f.name}\x1b[0m\r\n\x1b[1;32mType: \x1b[0m${Extensions[ext]}\r\n\x1b[1;32mLength: \x1b[0m${f.content.length}\r\n\x1b[1;32mLines: \x1b[0m${f.content.split('\n').length}\r\n\r\n\x1b[1;33mPreview:\x1b[0m\r\n\r\n${f.content.replace('\n', '\r\n').slice(0, 500)}`);
  } else if (cmd === 'lex') {
    if (!(args.length === 1 || args.length === 2)) return termError(`${cmd} accepts only 1 or 2 arguments.`);
    let f = getByName(args[0]);
    let json = (async () => {
      const response = await fetch('https://AdkCode-lexer-API.hg0428.repl.co/API/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: JSON.stringify({
          code: f.content
        })
      });
      const content = await response.json();
      if (args[1]) {
        getByName(currentDir + args[1], true).content = JSON.stringify(content['tokens'], null, 2);
      } else {
        term.write(JSON.stringify(content['tokens'], null, 2).replace('\n', '\r\n'));
      }
      return content;
    })();
  } else if (cmd === 'aicomp') {
    if (args.length != 1) return termError(`${cmd} accepts exactly 1 argument.`);
    term.write('NOTE: in developer ALPHA testing.\r\nLoading, this may take up to 15 seconds...')
    let f = getByName(args[0]);
    let json = (async () => {
      const response = await fetch('https://AdkAI.hg0428.repl.co/API/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: JSON.stringify({
          code: f.content
        })
      });
      term.write('Complete! Completion added to the file.')
      const completion = await response.json();
      if (f === currentfile) {
        editor.setValue(completion.fullcode);
      }
      f.content = completion.fullcode;
      openFile(f);
    })();
  } else if (cmd === 'debug') {
    if (args.length != 0) return termError(`${cmd} accepts exactly 0 arguments.`);
    window.onerror = function(message, source, lineno, colno, error) {
      term.write(message);
    }
  } else {
    return termError(`Command "${cmd}" not found.`)
  }
}

function clearLine() {
  currentLine = '';
  term.write(`\r\n${currentDir} $ `);
}
term.onData(data => {
  if (data.length === 1) {
    code = data.charCodeAt();
    if (code === 127 && currentLine != '') { //Backspace
      currentLine = currentLine.slice(0, -1);
      term.write('\b \b');
    } else if (data === '\n' || data === '\r') {
      term.write('\r\n');
      processCommands(currentLine);
      clearLine();
    } else if (code === 9) {
      //Tab Autocomplete
      let c = currentLine.split(' ');
      let len = c.length;
      let before = c.slice(0, -1).join(' ');
      c = c[c.length - 1];
      console.log(c);
      if (c === '') return;
      let autoCompleteList = [];
      if (len == 1) {
        autoCompleteList = Object.keys(commands);
      } else {
        let check = (folder = rootFolder, start = '') => {
          for (i of folder.files) {
            if (i instanceof AdkFile) {
              autoCompleteList.push(start + i.name);
            } else if (i instanceof Folder) {
              autoCompleteList.push(start + i.name);
              start += i.name + '/';
              check(i, start);
            }
          }
        }
        check()
        check(getByName(currentDir));
      }
      //restart line [2K\r
      console.log(autoCompleteList);
      for (let i of autoCompleteList) {
        if (i.startsWith(c)) {
          if (len == 1) {
            currentLine = `${i}`;
            term.write(`[2K\r${currentDir} $ ${i}`);
          } else {
            currentLine = `${before} ${i}`;
            term.write(`[2K\r${currentDir} $ ${before} ${i}`);
          }
        }
      }
    } else if (code < 32 || code === 127) {
      //do nothing
    } else {
      currentLine += data;
      term.write(data);
    }
  } else { //paste / Option delete
    if (data === "[A") {
      if (commandCycle < commandHistory.length) commandCycle += 1;
      if (commandCycle <= 0) {
        commandCycle = 0;
        cmdstr = '';
      } else {
        cmdstr = commandHistory.slice().reverse()[commandCycle - 1];
      }
      term.write(`[2K\r${currentDir.slice(1)}/ $ ${cmdstr}`);
      currentLine = cmdstr;
      return;
    }
    if (data === "[B") {
      if (commandCycle > 0) commandCycle -= 1;
      let cmdstr;
      if (commandCycle <= 0) {
        commandCycle = 0;
        cmdstr = '';
      } else {
        cmdstr = commandHistory.slice().reverse()[commandCycle - 1];
      }
      term.write(`[2K\r${currentDir.slice(1)}/ $ ${cmdstr}`);
      currentLine = cmdstr;
      return;
    }
    if (data === "") {
      currentLine = currentLine.split(' ');
      currentLine = currentLine.slice(0, -1).join(' ');
      term.write(`\x1B[2K\r$ ${currentLine}`);
    }
    data = data.split('\n');
    term.write(data[0]);
    for (let i = 1; i < data.length; i++) {
      processCommands(data[i]);
      clearLine();
      currentLine += data[i];
      term.write(data[i]);
    }
  }
});

function resizeEditor() {
  if (editor && editorEl) {
    editor.layout({
      width: 100,
      height: 100
    });
    const isStacked = userPreferences.layout === "Stacked";
    setLayout(isStacked);
  }
  fitAddon.fit();
  if (editor && editorEl) {
    const width = editorEl.clientWidth;
    const height = editorEl.clientHeight;
    editor.layout({
      width,
      height
    });
  }
  fitAddon.fit();
}
window.addEventListener("resize", resizeEditor);