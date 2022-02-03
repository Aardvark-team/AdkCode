var Options;
const savesettings = document.getElementById('settings-save');
const fontsize = document.getElementById('settings-fontsize');
//const version = document.getElementById('settings-version');
const fontfamily = document.getElementById('settings-fontfamily');
const fontweight = document.getElementById('settings-fontweight');
const letterspace = document.getElementById('settings-letterspace');
console.log(letterspace);
const showlinenum = document.getElementById('settings-showlinenum');
const fontligs = document.getElementById('settings-fontligs');
const minimap = document.getElementById('settings-minimap');



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
    letterSpacing:(letterspace.value/10)-2
  };
}
function loadOptions() {
  Options = localStorage.getItem("editor-settings");
  //getOptions();
  console.log("Options:", Options, typeof Options);
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
  letterspace.value = (Options.letterSpacing+2)*10;
  setOptions();
}
function setOptions() {
  getOptions();
  editor.updateOptions(Options);
  console.log("Options2:", JSON.stringify(Options));
  localStorage.setItem('editor-settings', JSON.stringify(Options))
};
window.onload = function() {
  loadOptions();
}
savesettings.onclick = setOptions;