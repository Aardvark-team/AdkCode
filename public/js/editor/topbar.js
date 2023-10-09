const icon = document.getElementById("icon");
const filebtn = document.getElementById('Sidebar-Files');
const settingsbtn = document.getElementById('Sidebar-Settings');
const themecolor = document.getElementById("theme-color");
var currentMenu = "";
const topbar = document.getElementById("topbar");
const tbOptions = document.getElementById("topbar-options");
const overView = document.getElementById('overView');
const overViewOk = document.createElement('button');
overViewOk.innerText = 'OK';
overViewOk.id = "OK";
icon.onclick = function() {
  window.location.href = 'https://aardvark-website.programit.repl.co';
}

async function fetchFromExa() {
  let code = prompt(`Enter your EXA cloud repo code: `);
  const resp = await fetch("https://appxchange.exa-team.repl.co/protocserve/" + code, {
    method: "GET",
  });
  let data;
  if (resp.status != 200) {
    console.error("Failed to run code!");
    return;
  } else {
    data = await resp.json();
  }
  filesystem = data.data;

  console.log("GOT DATA FROM EXA CLOUD", data);
  localStorage.setItem('filesystem', filesystem);
  jsf = JSON.parse(filesystem);
  window.saveFilesystem(jsf);
  // localStorage.clear();
  location.reload();
}

async function saveToExa() {
  window.saveFilesystem();
  let fstojson = localStorage.getItem('filesystem')
  const form = new FormData();
  form.set("json", fstojson);
  const resp = await fetch("https://appxchange.exa-team.repl.co/protocread", {
    method: "POST",
    header: {
      "content-type": "multipart/form-data",
    },
    body: form
  });
  let data;
  if (resp.status != 200) {
    return;
  } else {
    data = await resp.json();
  }
  alert("Your new repo code is "+data.code+"!");
}



var currenTheme = 1;
// For topbar selection and options
function setOverView(text, btns, other) {//HERE PRESS THE SHARE THEME
  //press share themesoory, I am multitasking rn
  overView.style.display = 'block';
  overView.innerHTML = text + '<br/>'; //After you type the name, it will call this function
  let BTNs = [];
  let OTHERs = [];
  for (i of other) {
    let elem = document.createElement(i[0]);
    elem.innerHTML = i[1];
    OTHERs.push(elem);
    overView.innerHTML += '<br/>';
    overView.append(elem);
  }
  for (i of btns) {
    let btn = document.createElement('button');
    btn.innerText = i;
    BTNs.push(btn);
    overView.append(btn);
  }
  overView.append(overViewOk);
  overViewOk.onclick = function() {
    overView.style.display = 'none';
  }
  return [BTNs, OTHERs];
}
function themeSwitch(change = true) {
  if (change) {
    if (currenTheme === 1) currenTheme = 2;
    else currenTheme = 1;
  }
  if (!window.monacoEditor)
    return;
  switch (currenTheme) {
    case 2:
      document.documentElement.setAttribute("data-theme-mode", "2");
      defaulthememode.value = 'theme2';
      monaco.editor.setTheme('theme2');
      term.setOption('theme', {
        background: '#242424'
      });
      userPreferences.theme = "2";
      saveUserPreferences();
      break;
    case 1:
      document.documentElement.setAttribute("data-theme-mode", "1");
      defaulthememode.value = 'monokaiAardvark';
      monaco.editor.setTheme('monokaiAardvark');
      term.setOption('theme', {
        background: '#1d1d1d'
      });
      userPreferences.theme = "1";
      saveUserPreferences();
      break;
  }
  setOptions();
}

function saveTheme() {

  let themes = localStorage.getItem("editor-themes") ? localStorage.getItem("editor-themes") : `{"names": [], "themes": [], "advancedThemes": []}`

  try {
    themes = JSON.parse(themes)
  }
  catch (e) {
    alert("Corrupted themes save.")
    themes = { names: [], advancedThemes: [], themes: {} }
  }
  console.log(themes);
  let name = prompt(`Enter the theme's name. Currently installed themes: ${themes.names.join(", ")}`)

  if (!themes.names.includes(name)) {
    alert("Invalid theme name!")
    return
  }
  fetch("/db/save_theme", {
    method: "POST",
    body: JSON.stringify({
      theme: themes.advancedThemes[name]
    }),
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert("An error occoured while saving your theme. Please try again.")
        return
      }
      setOverView(`Your theme has been saved. <br/><a href="https://adkcode.programit.repl.co/gettheme.html?theme=${data.id}">https://adkcode.programit.repl.co/gettheme.html?theme=${data.id}</a>`);
      //alert(`Your theme has been saved. <br/><a href="https://adkcode.programit.repl.co/gettheme.html?theme=${data.id}">Link</a>`)
    })
}
function deleteTheme() {
  let themes = localStorage.getItem("editor-themes") ? localStorage.getItem("editor-themes") : `{"names": [], "themes": [], "advancedThemes": []}`;

  try {
    themes = JSON.parse(themes);
  }
  catch (e) {
    alert("Corrupted themes save.");
    themes = { names: [], advancedThemes: [], themes: {} };
    localStorage.setItem('editor-themes', JSON.stringify(themes));
    return;
  }
  if (!themes.names || !themes.themes || !themes.advancedThemes) {
    alert("Corrupted themes save.");
    themes = { names: [], advancedThemes: [], themes: {} };
    localStorage.setItem('editor-themes', JSON.stringify(themes));
    return;
  }
  console.log(themes);
  OPtions = '';
  for (i of themes.names) {
    OPtions += `<option value="${i}">${i}</option>`
  }
  let data = setOverView('Select which theme to delete, then press Delete.', ['Delete'], [['select', OPtions]]);
  console.log(data);
  data[0][0].onclick = function() {
    let v = data[1][0].value;
    delete themes.advancedThemes[v];
    themes.names = themes.names.filter(el => el !== v);
    localStorage.setItem('editor-themes', JSON.stringify(themes));
    overView.style.display = 'none';
  }
}
const options = [
  {
    name: "File",
    selection: [
      {
        text: "New File", action: (e) => {
          let path = prompt("Enter a name for the file or leave empty to cancel:")
          if (path === '') return;
          newFile(path);
        }
      },
      {
        text: "New Folder", action: (e) => {
          let path = prompt("Enter a name for the folder or leave empty to cancel:")
          if (path === '') return;
          newFolder(path);
        }
      }
    ]
  },
  {
    name: "Edit",
    selection: [
      { text: "Find and Replace", action: e => {
        editor.getAction('find').run();
      }},
      { text: "Copy" },
      { text: "Cut" },
      { text: "Paste", action: EditPaste }
    ]
  },
  {
    name: "View",
    selection: [
      { text: "Stacked", action: viewStacked },
      { text: "Side By Side", action: viewSideBySide },
      { text: "Switch theme", action: themeSwitch }
    ]
  },
  {
    name: "Options",
    selection: [
      { text: "Clear Terminal", action: clearTerm },
      { text: "Reset IDE", action: resetFiles },
      { text: "Save", action: () => { window.saveFilesystem(false, true) } }//THIS
    ]
  },
  {
    name: "Run",
    selection: [],
    action: () => editor ? runCode(editor.getValue()) : null
  },
  {
    name: "Themes",
    selection: [
      { text: "Share Theme", action: saveTheme },
      { text: "Delete Theme", action: deleteTheme }
    ]
  },
  {
    name: "Code Execution",
    selection: [
      { text: "Check status", action: checkCodeExecStatus },
      { text: "Reconnect", action: () => reconnectToExecApi(true) },
      { text: "Is connected?", action: checkCodeExecLocalStatus }
    ]
  },
  {
    name: "Cloud",
    selection: [
      { text: "Fetch from EXA cloud", action: fetchFromExa},
      { text: "Save to EXA cloud", action: saveToExa},
      
      
      
    ]
  }
]
function closeSidebar(btn, elem, name) {
  ide.style["grid-template-columns"] = "49px auto";

  elem.style.display = "none";
  btn.classList.remove("selected");
  btn.children[0].src = `imgs/${name}.svg`;
  resizeEditor();
}
function openSidebar(btn, elem, name) {
  ide.style["grid-template-columns"] = "calc(100px + 10vw) auto";
  btn.classList.add("selected");
  btn.children[0].src = `imgs/${name}-selected.svg`;

  resizeEditor();

  return elem.style.display = "block";
}
filebtn.onclick = function() {
  if (filesElement.style.display === "none") {
    closeSidebar(settingsbtn, settingsElement, 'settings')
    return openSidebar(filebtn, filesElement, 'files')
  }

  closeSidebar(filebtn, filesElement, 'files')
}
const settingsElement = document.getElementById('settings');

settingsbtn.onclick = function() {
  if (settingsElement.style.display === "none") {
    closeSidebar(filebtn, filesElement, 'files')
    return openSidebar(settingsbtn, settingsElement, 'settings')
  }

  closeSidebar(settingsbtn, settingsElement, 'settings')
}

function viewStacked() {
  userPreferences.layout = "Stacked";
  setLayout(true);
  if (fitAddon && editor) {
    resizeEditor();
  }

  saveUserPreferences(userPreferences);
}

function viewSideBySide() {
  userPreferences.layout = "Side By Side";

  setLayout();
  if (fitAddon && editor) {
    resizeEditor();
  }

  saveUserPreferences();
}

function EditPaste() {
  const text = navigator.clipboard.readText();
  editor.trigger('keyboard', 'type', { text: text });
}


// Topbar API
function setLayout(isStacked) {
  console.log(isStacked);
  const ide = document.getElementById("ide");
  const layout = ide.querySelector
    ? ide.querySelector("#layout")
    : null;

  // grid-template-rows: calc(100vh - var(--topbar-height));
  // grid-template-columns: 15% auto 25%;

  if (!layout) {
    layout = document.getElementById("layout"); // if 'querySelector' is not supported
  }

  if (isStacked) {

    userPreferences.layout = "Stacked";
    layout.style.setProperty("grid-template-columns", "100%", "important");
    layout.style.setProperty("grid-template-rows", "50vh calc(50vh - var(--topbar-height)", "important");
  } else {
    layout.style.removeProperty("grid-template-columns");
    layout.style.removeProperty("grid-template-rows");
  }
  currenTheme = getUserPreferences().theme;
  if (currenTheme === "1") currenTheme = 1;
  else currenTheme = 2;
  themeSwitch(false);
}

function loadPreferences() {
  const isStacked = userPreferences.layout === "Stacked";

  setLayout(isStacked);
}

function createSelectionItem(text) {
  const list = document.createElement("li");
  list.classList.add("option");

  // const aTag = document.createElement("a");
  list.innerText = text;

  // list.append(aTag);
  tbOptions.append(list);

  return list;
}

function openSelectionView(items, option) {
  tbOptions.innerHTML = "";
  /*if (currentMenu === option.name) {
    tbOptions.style = "";
    return currentMenu = "";
  }*/
  for (const item of items) {
    if (typeof item === "object") {
      const { text, action } = item;
      const element = createSelectionItem(text);

      element.addEventListener("click", action); // possible memory leak?
    } else {
      createSelectionItem(item);
    }
  }
  currentMenu = option.name;

  tbOptions.style.setProperty("display", "flex");

  const rect = this.getBoundingClientRect();
  const left = rect.left;

  tbOptions.style.setProperty("left", `${left}px`);
  // This probably shouldn't be hardcoded, but I can't be bothered.
  tbOptions.style.setProperty("height", `${16 + 21 * items.length}px`);
}

function createTopBarItem(text) {
  //<li class="tb-item" data-list="true">

  const list = document.createElement("li");
  list.classList.add("tb-item");
  const aTag = document.createElement("a");
  aTag.innerText = text;

  list.append(aTag);
  topbar.append(list);

  return list;
}

function createTopBarItems() {
  for (const option of options) {
    const { name, selection, action } = option;

    const element = createTopBarItem(name);

    if (selection && selection.length > 0) {
      element.addEventListener("mouseenter", openSelectionView.bind(element, selection).bind(element, option));
    }

    if (selection.length === 0) {
      element.addEventListener("mouseenter", () => {
          tbOptions.style.setProperty("display", "");
          tbOptions.style.setProperty("height", "0px");
      });
    }

    if (action instanceof Function) {
      element.addEventListener("click", action);
    }
  }

  loadPreferences();
}

createTopBarItems();



// Close topbar options selection view
document.addEventListener("mouseover", ({ clientX, clientY, target }) => {
  // Much simpler logic
  if (!target.matches("#topbar-options, #topbar-options *, #topbar, #topbar *")) {
    tbOptions.style.setProperty("display", "");
    tbOptions.style.setProperty("height", "0px");
    return;
  }

  /*
  const { left, top, width, height } = tbOptions.getBoundingClientRect();

  if (clientX < left || clientX > (left + width)) {
    tbOptions.style.setProperty("display", "");
    tbOptions.innerHTML = "";
  }

  if (clientY > (height + top)) {
    tbOptions.style.setProperty("display", "");
    tbOptions.innerHTML = "";
  }
  */
});

