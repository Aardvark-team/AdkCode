var AI = true;
var CurrenThemes = localStorage.getItem('editor-themes');
const thememode = document.getElementById('settings-theme');
const defaulthememode = document.getElementById('defaulthememode');
var themeFile, Themename;
if (CurrenThemes) {
  CurrenThemes = JSON.parse(CurrenThemes);
} else {
  CurrenThemes = {
    names: [],
    themes: {

    }
  }
}
function loadSettings() {
  if (currenTheme === 1) defaulthememode.value = 'monokaiAardvark';
  else defaulthememode.value = 'theme2'
  for (let i in CurrenThemes.themes) {
    thistheme = CurrenThemes.themes[i]
    newT = {
      base: 'vs-dark',
      inherit: true,
      rules: []
    }
    for (let i in thistheme) {
      if (typeof thistheme[i] != 'object') continue;
      newT.rules.push(thistheme[i]);
    }
    newT.colors = THESE_THEMES[currenTheme];
    monaco.editor.defineTheme('User-' + i, newT);
    option = document.createElement('option');
    option.value = 'User-' + i;
    option.innerText = i;
    thememode.appendChild(option);
  }
  for (let i in CurrenThemes.advancedThemes) {
    thistheme = CurrenThemes.advancedThemes[i]
    monaco.editor.defineTheme('User-' + i, thistheme);
    option = document.createElement('option');
    option.value = 'User-' + i;
    option.innerText = i;
    thememode.appendChild(option);
  }
}

var Options;
const savesettings = document.getElementById('settings-save');
const fontsize = document.getElementById('settings-fontsize');
//const version = document.getElementById('settings-version');
const fontfamily = document.getElementById('settings-fontfamily');
const fontweight = document.getElementById('settings-fontweight');
const letterspace = document.getElementById('settings-letterspace');
const showlinenum = document.getElementById('settings-showlinenum');
const fontligs = document.getElementById('settings-fontligs');
const minimap = document.getElementById('settings-minimap');
const AIelem = document.getElementById('settings-AI');


function getOptions() {
  return Options = {
    fontSize: fontsize.value,
    fontFamily: fontfamily.value,
    fontWeight: fontweight.value,
    lineNumbers: showlinenum.checked,
    fontLigatures: fontligs.checked,
    minimap: {
      enabled: minimap.checked
    },
    letterSpacing: (letterspace.value / 10) - 2,
    themeSetting: thememode.value,
    insertSpaces: false,
    AI: AIelem.checked || false,
  };
}
function loadOptions() {
  Options = localStorage.getItem("editor-settings");
  //getOptions();
  if (Options) {
    Options = JSON.parse(Options);
  } else {
    getOptions();
  }
  fontsize.value = Options.fontSize;
  fontfamily.value = Options.fontFamily;
  fontweight.value = Options.fontWeight;
  showlinenum.checked = Options.lineNumbers;
  fontligs.checked = Options.fontLigatures;
  minimap.checked = Options.minimap.enabled;
  AIelem.checked = Options.AI;
  letterspace.value = (Options.letterSpacing + 2) * 10;
  thememode.value = Options.themeSetting || thememode.value;
  setOptions();
}
function setOptions() {
  //let r = document.querySelector(':root');
  getOptions();
  let { themeSetting, ...RealOptions } = Options;
  editor.updateOptions(RealOptions);
  monaco.editor.setTheme(themeSetting);
  if (themeSetting.startsWith('User-')) {
    Themename = themeSetting.slice(5);
    text = JSON.stringify(CurrenThemes.advancedThemes[Themename], null, '\t');
    if (!themeFile) {
      themeFile = makeStaticFile('.theme');
    }
    themeFile.content = text;
    if (currentfile == themeFile) {
      editor.setValue(themeFile.content);
    }
  }
  localStorage.setItem('editor-settings', JSON.stringify(Options))
};
window.onload = function() {
  loadOptions();
  fileSystemAction(function() {
      if (!themeFile) return;
      state=true;
      try {
        content = themeFile.content;
        data = jsonic(content);
        if (JSON.stringify(data) == JSON.stringify(CurrenThemes.advancedThemes[Themename])) {
          state = false;
          return;
        }
        if (state) {
        CurrenThemes.advancedThemes[Themename] = data;
        monaco.editor.defineTheme('User-' + Themename, data);
        term.write('\u001b[42mTheme saved!\x1b[0m\r\n')
        localStorage.setItem('editor-themes', JSON.stringify(CurrenThemes));
        }
      } catch (error){
        clearTerm(true);
        term.write(`\x1b[38;5;162m.theme is invalid. Save failed.\r\n\u001b[31m${error.message}\x1b[0m\r\n\r\n`)
      } 
    });
}
savesettings.onclick = setOptions;