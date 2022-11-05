const pressedKeys = {};
const editorEl = document.getElementById('editor');
editorEl.addEventListener("contextmenu", e => e.preventDefault());
var editor;
CTRL = false;
window.addEventListener("keydown", function(e) {
  if (e.ctrlKey || e.metaKey ) {
    CTRL = true;
  }  if ((CTRL && e.key == 'f') || (e.keyCode == 114)) {
    e.preventDefault();
    return false;
    //DOESN'T WORK. The browser doesn't even tell us when the key is pressed if it triggers a browser feature.
  }
}); //Prevent the browser's default find + replace
window.addEventListener("keyup", function(e) {
  if (e.ctrlKey || e.metaKey || e.key == 'Meta') {
    CTRL = false;
  }
});
getUserPreferences();

function editorLoaded() {
  loadAardvark();
  loadTerminal();
  loadSettings();
  editor = monaco.editor.create(editorEl, {
    fontFamily: 'JetBrains Mono',
    fontSize: '12px',
    theme: 'monokaiAardvark',
    value: getAdkExampleCode1(),
    language: 'Aardvark'
  });

  initRoot(editor);// THIS IS REFERNCING THE OTHER SCRIPT

  window.monacoEditor = editor

  editor.onKeyDown(onKeyDown);
  editor.onKeyUp(onKeyUp);

  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
    () => {
      runCode(editor.getValue()).catch(err => console.error(err));
    }
  )

  /*editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyT,
    () => {
     clearTerm();
    }
  )*/
}

var ext;
var running = false;
async function runCode(code) {
  /*
ext = currentfile.name.split(".").reverse()[0]
  if (!(['adk', 'adkb', 'adkc'].includes(ext))) {
    return term.write("\r\n\u001b[31m"+ext+" file type is not supported!\x1b[0m\r\n");
  }
*/
  const form = new FormData();
  form.set("file", code);
  const resp = await fetch("https://AdkCode-API.programit.repl.co/api/", {
    method: "POST",
    header: {
      "content-type": "multipart/form-data",
    },
    body: form
  });

  let data;
  if (resp.status != 200) {
    data = "Failed to run code!";
    console.error("Failed to run code!");
    return false;
  } else {
    data = await resp.json();
    console.log(data)
  }
  let output = data.output.replace(/\\n/g, "\r\n");
  if (data.result === "fail") {
    if (output === '') return term.write("\r\n\u001b[31mERROR!!\x1b[0m\r\n");
    else return term.write("\r\n\u001b[31m" + output + "\x1b[0m\r\n")
  }
  //console.log("Got data:", data);
  output = output.substring(2, output.length - 1) + "\r\n";
  if (output.startsWith("Error")) {
    return term.write("\r\n\u001b[31m" + output.split('\n')[0] + "\x1b[0m\r\n");
  }
  term.write("\r\n\u001b[42mSuccess!\x1b[0m\r\n");
  term.write(output);
  adkb = data.adkb;
  for (let i of files) {
    if (i.name === currentfile.name + "b" && i.level === currentfile.level) {
      return i.content = adkb;
    }
  }
  newfile = new AdkFile(currentfile.name + "b", level = currentfile.level);
  newfile.content = adkb;
  if (currentfile.parent) {
    currentfile.parent.appendFile(newfile);
  } else {
    rootFolder.appendFile(newfile);
  }
}


function onKeyDown(event) {
  const e = event.browserEvent;
  pressedKeys[e.key] = true;
}

function onKeyUp(event) {
  const e = event.browserEvent;
  pressedKeys[e.key] = false;
}