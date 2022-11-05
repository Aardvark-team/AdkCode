//localStorage.removeItem('editor-themes');
var CurrenThemes = localStorage.getItem('editor-themes');
if (CurrenThemes) {
  CurrenThemes = JSON.parse(CurrenThemes);
} else {
  CurrenThemes = {
    names: [],
    themes: {

    },
    advancedThemes: {

    }
  }
}
var fontStyles = { 'bold': 'Bold', 'italic': 'Italics', '': 'Default' };
const name = document.getElementById('themeName');
const submit = document.getElementById('themeSubmit');


Options = {
  "Comments": {
    name: "comment",
    foreground: "797979",
    fontStyle: "italic",
  },
  "Function Call": {
    name: "callFunction",
    foreground: "efe18a",
    fontStyle: "bold"
  },
  "Numbers": {
    name: "number.float",
    foreground: "b5cea8",
    fontStyle: ""
  },
  "Strings": {
    name: "string",
    foreground: "efaa92",
    fontStyle: ""
  },
  "Keywords": {
    name: "keyword",
    foreground: "006aff",
    fontStyle: ""
  },
  "Directives": {
    name: "keyword.directive",
    foreground: "fa6aff",
    fontStyle: ""
  },
  "Operators": {
    name: "operator",
    foreground: "F92672",
    fontStyle: ""
  },
}
function createColor(name, display, color, div, extra = '') {
  let Labeltag = document.createElement('label');
  Labeltag.for = name;
  Labeltag.innerHTML = extra + `${display}:  &nbsp;&nbsp;`;
  let tag = document.createElement('input');
  tag.type = 'color';
  tag.name = 'foreground';
  tag.value = '#' + (color || '000000');
  div.appendChild(Labeltag);
  div.appendChild(tag);
  return tag
}
function createOptions() {
  centertag = document.getElementById("mainthing");
  for (let setting in Options) {
    let data = Options[setting];
    let Name = document.createElement("h2");
    Name.classList.add("header")
    Name.innerText = setting;
    //Make div
    let div = document.createElement("div");
    div.id = setting;
    div.classList.add('section');
    //Add inputs
    let t1 = createColor('foreground', 'Color', data.foreground, div);
    let t2 = createColor('background', 'Background', data.background, div, '<br/>');
    data.foregroundInput = t1;
    data.backgroundInput = t2;
    div.appendChild(document.createElement('br'));
    let style = document.createElement("select");
    data.fontStyleInput = style;
    let o = document.createElement("option");
    o.name = data.fontStyle;
    o.innerText = fontStyles[data.fontStyle];
    style.appendChild(o);
    for (let i in fontStyles) {
      if (i != data.fontStyle) {
        let o = document.createElement("option");
        o.name = i;
        o.innerText = fontStyles[i];
        style.appendChild(o);
      }
    }
    //Append tags to the document
    centertag.appendChild(Name);
    centertag.appendChild(div);
    div.appendChild(style);
  }
}
var advanced = document.getElementById('advancedThemeSubmit');
if (advanced) {
  if (!CurrenThemes.advancedThemes) CurrenThemes.advancedThemes = {};
  const json = document.getElementById('json');
  const errorEl = document.getElementById('error');
  var rulesbtn = document.getElementById('rulesbtn');
  var rulesmenu = document.getElementById('rules');
  rulesmenu.enabled = false;
  rulesbtn.onclick = function() {
    if (rulesmenu.enabled) {
      rulesmenu.enabled=false;
      rulesmenu.style.display = 'none';
      rulesbtn.innerHTML = 'Rules ▼';
    } else {
      rulesmenu.enabled = true;
      rulesmenu.style.display = 'block';
      rulesbtn.innerHTML = 'Rules ▲';
    }
  }
  json.onblur = json.onchange = function() {   
    try {
      data = jsonic(json.value);
      monaco.editor.defineTheme('Live-View', data);
    } catch (error){
      //console.log(error, json.value);
      errorEl.innerText = error.message;
      return json.style['border-left'] = '2px solid red';
    }
    errorEl.innerText = "";
    json.style['border-left'] = '2px solid green';
    //CurrenThemes.advancedThemes[name.value] = data;
    monaco.editor.setTheme('Live-View');
  }
  advanced.onclick = function() {
    if (name.value.length < 2) {
      return alert("Theme names must be at least 2 characters long!");
    } if (CurrenThemes.names.includes(name.value)) {
      return alert("A theme with that name already exists!");
    }
    try {
      data = jsonic(json.value);
    } catch {
      return alert('Make sure the code in the textbox is valid JSON.');
    }
    CurrenThemes.advancedThemes[name.value] = data;
    CurrenThemes.names.push(name.value);
    localStorage.setItem('editor-themes', JSON.stringify(CurrenThemes));
  }
} else {
  createOptions();
  submit.onclick = function() {
    if (name.value.length < 2) {
      return alert("Theme names must be at least 2 characters long!");
    }
    if (CurrenThemes.names.includes(name.value)) {
      return alert("A theme with that name already exists!");
    }
    CurrenThemes.names.push(name.value);
    newTheme = {};
    for (let setting in Options) {
      let data = Options[setting];
      foreground = data.foregroundInput.value;
      background = data.backgroundInput.value;
      fontStyle = fontStyles[data.fontStyleInput.value];
      newTheme[data.name] = {
        token: data.name
      };
      if (foreground != '#000000') newTheme[data.name].foreground = foreground;
      if (background != '#000000') newTheme[data.name].background = background;
      if (fontStyle != "") newTheme[data.name].fontStyle = fontStyle;
    }
    CurrenThemes.themes[name.value] = newTheme;
    localStorage.setItem('editor-themes', JSON.stringify(CurrenThemes));
  }
}