const term = new Terminal({
  fontFamily: "Monospace",
  theme: {
    background: "#1d1d1d"
  }
});
const termEl = document.getElementById("terminal");
const fitAddon = new FitAddon.FitAddon();
const clearbtn = document.getElementById("clearbtn")
function clearTerm(writetext=false) {
  writetext = writetext || false
  term.clear();
  if (writetext===true) {
    term.write("Welcome to the \x1b[38;5;162mAardvark \x1b[38;5;33mCoding IDE!\x1b[0m\r\n\nPress Control Enter to run!\r\n");
  }
  fitAddon.fit();
}
clearbtn.onclick = clearTerm;
function loadTerminal() {
  term.loadAddon(fitAddon);
  term.open(termEl);

  term.write("Welcome to the \x1b[38;5;162mAardvark \x1b[38;5;33mCoding IDE!\x1b[0m\r\n\nPress Control Enter to run!\r\n");

  fitAddon.fit();
}
term.onKey(e => {
  //console.log(e.key);
  term.write(e.key);
  if (e.key == '\r')
    term.write('\n');
})

function resizeEditor() {
  if (editor && editorEl) {
    editor.layout({ width: 100, height: 100 });

    const isStacked = userPreferences.layout === "Stacked";
    //setLayout(isStacked);
  }

  fitAddon.fit();

  if (editor && editorEl) {
    const width = editorEl.clientWidth;
    const height = editorEl.clientHeight;
    editor.layout({ width, height });
  }

  fitAddon.fit();
}

window.addEventListener("resize", resizeEditor);