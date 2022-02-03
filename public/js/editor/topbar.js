const icon = document.getElementById("icon");
const filebtn = document.getElementById('Sidebar-Files');
const settingsbtn = document.getElementById('Sidebar-Settings');
const themecolor = document.getElementById("theme-color");
var currentMenu = "";
const topbar = document.getElementById("topbar");
const tbOptions = document.getElementById("topbar-options");
icon.onclick = function() {
  window.location.href = 'https://aardvark-website.programit.repl.co';
}
var currenTheme = 1
// For topbar selection and options

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
      window.monacoEditor.setTheme('theme2');
      term.setOption('theme', {
        background: '#242424'
      });
      userPreferences.theme = "2";
      saveUserPreferences();
      break;
    case 1:
      document.documentElement.setAttribute("data-theme-mode", "1");
      window.monacoEditor.setTheme('monokaiAardvark');
      term.setOption('theme', {
        background: '#1d1d1d'
      });
      userPreferences.theme = "1";
      saveUserPreferences();
      break;
  }
}
const options = [
  {
    name: "File",
    selection: [
      { text: "New File", action: newFile },
      { text: "New Folder", action: newFolder }
    ]
  },
  {
    name: "Edit",
    selection: [
      { text: "Find and Replace" },
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
      { text: "Save", action: window.saveFilesystem }
    ]
  },
  {
    name: "Run",
    selection: [],
    action: () => editor ? runCode(editor.getValue()) : null
  }
]
function closeSidebar(btn, elem, name) {
  ide.style["grid-template-columns"] = "49px auto";

  clearTerm(true);

  elem.style.display = "none";
  btn.classList.remove("selected");
  btn.children[0].src = `imgs/${name}.svg`;
  resizeEditor();
}
function openSidebar(btn, elem, name) {
  ide.style["grid-template-columns"] = "calc(100px + 10vw) auto";
  clearTerm(true);
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
  if (currentMenu === option.name) {
    tbOptions.style = "";
    return currentMenu = "";
  }
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
      element.addEventListener("click", openSelectionView.bind(element, selection).bind(element, option));
    }

    if (action instanceof Function) {
      element.addEventListener("click", action);
    }
  }

  loadPreferences();
}

createTopBarItems();



// Close topbar options selection view
document.addEventListener("click", ({ clientX, clientY }) => {
  const { left, top, width, height } = tbOptions.getBoundingClientRect();

  if (clientX < left || clientX > (left + width)) {
    tbOptions.style.setProperty("display", "");
    tbOptions.innerHTML = "";
  }

  if (clientY > (height + top)) {
    tbOptions.style.setProperty("display", "");
    tbOptions.innerHTML = "";
  }
});