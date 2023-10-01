const editorEl = document.getElementById('editor');
var json;

function editorLoaded() {
  loadAardvark();
  var editor = monaco.editor.create(editorEl, {
    fontFamily: 'JetBrains Mono',
    fontSize: '12px',
    value: 'from library include item as name\n\nfunction hello() {\n\stdout.write("Hello World!")\n}\n#AThis is a comment\nstdout.write(10 * 5 + 6 / 4)\n set x = 5',
    language: 'Aardvark'
  });
  if (onLoad) onLoad();
  if (json) json.onblur();
}