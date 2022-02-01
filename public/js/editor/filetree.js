/*
<div class="file-folder file-root">
  <div class="file-icon"></div>
  <div class="file-name">/</div>
  <ul class="file-files">
    <li>
      <div class="file-file">
        <div class="file-icon"></div>
        <div class="file-name">main.adk</div>
      </div>
    </li>
    <li>
      <div class="file-folder">
        <div class="file-icon"></div>
        <div class="file-name">folder</div>
        <ul class="file-files">
          <li>
            <div class="file-file">
              <div class="file-icon"></div>
              <div class="file-name">test.adk</div>
            </div>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</div>
*/
let rootFolder, currentfile, hoveredFolder;
let files = [];
const ide = document.getElementById('ide');
const idelayout = document.getElementById('layout');
const FILEINDENTPADDING = 12;

class FileTree {
  constructor(fileTreeEl) {
    this.tree = fileTreeEl;

    this.files = [];
  }

  appendFolder(folder) {
    this.tree.append(folder.element);

    this.files.push(folder);

    return this;
  }

  getRoot() {
    return this.files[0];
  }
}

class Folder {
  constructor(name, level = 0, isRoot = false) {
    this.name = name;
    this.isRoot = isRoot;
    this.level = isRoot ? 0 : level;
    this.path = isRoot ? [] : [name];
    this.files = [];

    this.parent = null;
    this.action = null;

    this.element = document.createElement("div");
    this.fileIconEl = document.createElement("div");
    this.fileNameEl = document.createElement("div");
    this.filesEl = document.createElement("ul");

    this.element.setAttribute("file-indent", this.level);

    this.fileNameEl.onmouseover = mouseOver.bind(this);

    this.initElement();
    // this.element.onmousedown = MoveFilter.bind(this);
    // this.element.ontouchstart = MoveFilter.bind(this);
    // this.fileNameEl.onmouseover = mouseOver.bind(this);
  }

  initElement() {
    this.element.classList.add("file-folder");

    if (this.isRoot)
      this.element.classList.add("file-root");

    this.fileIconEl.classList.add("file-icon");
    this.fileNameEl.classList.add("file-name");
    this.filesEl.classList.add("file-files");

    this.fileNameEl.innerText = this.name;

    this.element.append(this.fileIconEl);
    this.element.append(this.fileNameEl);
    this.element.append(this.filesEl);
  }

  updateLevel(file) {
    this.level = file.level + 1;
    this.element.setAttribute("file-indent", this.level);
    this.fileNameEl.style.setProperty("padding-left", `${this.level * FILEINDENTPADDING}px`);
    for (const fileChild of this.files) {
      fileChild.updateLevel(this);
    }
  }

  removeFile(file) {
    const index = this.files.indexOf(file);

    if (index < 0) return;

    this.files.splice(index, 1);
    const newFile = new AdkFile(file.name, 0);
    newFile.content = file.content;

    file.element.remove();

    return newFile;
  }

  removeFolder(file) {
    const index = this.files.indexOf(file);

    if (index < 0) return;

    this.files.splice(index);
    files.splice(files.indexOf(file), 1);
    const newFile = new Folder(file.name, 0, file.isRoot);
    newFile.files = file.files;

    newFile.setAction(function () {
      this.filesEl.classList.toggle("folder-hidden");
    })

    file.element.remove();

    return newFile;
  }

  appendFile(file) {
    // file.level = this.level + 1;
    file.updateLevel(this);

    const li = document.createElement("li");
    file.element.setAttribute("file-indent", file.level);
    li.append(file.element);

    file.fileNameEl.style.setProperty("padding-left", `${file.level * FILEINDENTPADDING}px`);
    this.filesEl.append(li);

    file.parent = this;

    file.path = [...this.path, file.path];

    this.files.push(file);

    return this;
  }

  /**
   * When user clicks the file an action / function will be called.
   * 
   * @param {Function} cb
   */
  setAction(cb) {
    if (this.action) {
      this.removeAction();
    }
    this.action = cb.bind(this);
    this.fileNameEl.addEventListener("click", this.action);
  }

  removeAction(cb) {
    if (!this.action) {
      return;
    }
    this.fileNameEl.removeEventListener("click", this.action);
  }

  click() {
    if (this.action)
      this.action();
  }

  getPathAsString() {
    return this.path.join("/");
  }
}
class AdkFile {
  constructor(name, level = 0) {
    this.name = name;
    this.level = level;
    this.path = [name];
    this.parent = null;

    files.push(this);

    this.element = document.createElement("div");
    this.fileIconEl = document.createElement("div");
    this.fileNameEl = document.createElement("div");

    this.element.onmousedown = MoveFilter.bind(this);
    this.element.ontouchstart = MoveFilter.bind(this);
    this.fileNameEl.onmouseover = mouseOver.bind(this);

    this.action = null;
    this.content = "";
    this.initElement();
  }

  initElement() {
    this.element.classList.add("file-file");
    this.fileIconEl.classList.add("file-icon");
    this.fileNameEl.classList.add("file-name");

    this.element.setAttribute("file-indent", this.level);

    this.fileNameEl.innerText = this.name;

    // File icons
    /*
    let fileIcons = {
        "adk": "/imgs/aardvark.svg"
    }

    if (fileIcons[this.name.split(".").pop()]) {
        this.fileIconEl.innerHTML = `<img src="${fileIcons[this.name.split(".").pop()]}" alt="aardvark">`
    }
    */
    // end

    this.element.append(this.fileIconEl);
    this.element.append(this.fileNameEl);
  }

  updateLevel(file) {
    this.level = file.level + 1;
    this.element.setAttribute("file-indent", this.level);
    this.fileNameEl.style.setProperty("padding-left", `${this.level * FILEINDENTPADDING}px`);
  }

  /**
   * When user clicks the file an action / function will be called.
   * 
   * @param {Function} cb
   */
  setAction(cb) {
    this.action = cb.bind(this);
    this.element.addEventListener("click", this.action);
  }

  removeAction(cb) {
    if (!this.action) {
      return;
    }
    this.element.addEventListener("click", this.action);
  }
  
  click() {
    if (this.action)
      this.action();
  }

  getPathAsString() {
    return this.path.join("/");
  }
}

const filesElement = document.getElementById("files");
const fileTree = new FileTree(filesElement);

function showFileTree() {
  filesElement.style.setProperty("display", "block");
}

function hideFileTree() {
  filesElement.style.setProperty("display", "none");
}

let ideFilesystem;
function resetFiles() {
  ideFilesystem = {
    "main.adk": "output(\"Hello World!\")",
  }
  window.saveFilesystem(ideFilesystem);
  location.reload();
}
function initRoot(editor) {
  /*
  rootFolder = new Folder("/", 0, true);
  const newFolder = new Folder("cool");
  const mainFile = new File("main.adk");
  const newFile = new File("test.adk");
  */

  let ideFilesystem = {
    "main.adk": "output(\"Hello World!\")",
  }

  if (localStorage.getItem("filesystem")) {
    try {
      ideFilesystem = JSON.parse(localStorage.getItem("filesystem"));
      if (!ideFilesystem || Object.keys(ideFilesystem).length === 0) {
        ideFilesystem = {
          "main.adk": "output(\"Hello World!\")",
        }
      }
    }
    catch (e) {
      alert("Corrupted filesystem.");
    }
  }

  let folders = {
    "/": new Folder("/", 0, true)
  }

  function traverseFilesystem(tree, origin = "/") {
    for (let key of Object.keys(tree)) {
      if (typeof tree[key] == "object") {
        let foldersNeeded = (origin + key).split("/").map(x => x == "" ? "/" : x);

        let newest = foldersNeeded.pop(foldersNeeded.length);

        let folderPath = (foldersNeeded.join("/") + "/" + newest).replace(/\/\//g, "/");
        if (!folders[folderPath]) {
          folders[folderPath] = new Folder(newest);
          folders[folderPath].setAction(function () {
            this.filesEl.classList.toggle("folder-hidden");
          });
        }

        let parentFolderPath = (foldersNeeded.join("/")).replace(/\/\//g, "/");
        folders[parentFolderPath].appendFile(folders[folderPath]);
        folders[parentFolderPath].setAction(function () {
          this.filesEl.classList.toggle("folder-hidden");
        });

        traverseFilesystem(tree[key], origin + key + "/");
      }
      else {
        let path = (origin + key).split("/");
        let folderName = path.slice(0, path.length - 1).map(x => x == "" ? "/" : x).join("/").replace(/\/\//g, "/");

        let file = new AdkFile(key);
        file.content = tree[key];

        file.setAction(openFile)

        folders[folderName].appendFile(file);
        folders[folderName].setAction(function () {
          this.filesEl.classList.toggle("folder-hidden");
        });

        if (localStorage.getItem("filesystem-selected")) {
          try {
            let { path } = JSON.parse(localStorage.getItem("filesystem-selected"));
            if (origin + key == "/" + path.join("/")) {
              currentfile = file;
            }
          }
          catch (e) {
            console.error(e);
            alert("Corrupted selected file.");
          }
        }
      }
    }
  }

  traverseFilesystem(ideFilesystem);

  if (currentfile) {
    editor.setValue(currentfile.content);
  }

  rootFolder = folders["/"];

  fileTree.appendFolder(rootFolder);
}

window.addEventListener("beforeunload", () => {
  window.saveFilesystem();
})

window.saveFilesystem = function(Data) {
  // Need to reconstruct the filesystem YAY
  if (currentfile) currentfile.content = editor.getValue();

  if (currentfile)
    localStorage.setItem("filesystem-selected", JSON.stringify({
      name: currentfile.name,
      path: currentfile.path
    }))
  let filesystem;
  if (typeof Data === "object") {
    filesystem = Data;
  } else {
    filesystem = {};
    
    function constructPath(folder) {
      if (!folder.parent)
        return "/";
      return (constructPath(folder.parent) + "/" + folder.name).replace(/\/\//g, "/");
    }
  
    function traverseFolder(folder) {
  
      for (let file of folder.files) {
        if (file instanceof AdkFile) {
          let folderEl = filesystem;
          let path = constructPath(folder).split("/").filter(x => x != "");
  
          for (let r of path) {
            folderEl = folderEl[r];
          }
  
          folderEl[file.name] = file.content;
        }
        else {
          let folderEl = filesystem;
          let path = constructPath(file).split("/").filter(x => x != "");
  
          for (let r of path.slice(0, path.length - 1)) {
            folderEl = folderEl[r];
          }
          folderEl[path[path.length - 1]] = {};
  
          traverseFolder(file);
        }
      }
    }
    traverseFolder(rootFolder);
  }
  localStorage.setItem("filesystem", JSON.stringify(filesystem));
}
/* 
*********************
***** NEW FILES *****
*********************
*/
function newFile(e, folder = rootFolder) {
  
  let path = prompt("Enter a name or path for the file:");
  if (!path) return;

  let filename = path; // TODO: allow a path to automatically place file in folder

  file = new AdkFile(filename);

  if (folder)
    folder.appendFile(file);

  file.setAction(openFile)
  window.saveFilesystem();
}
function newFolder(e, pfolder = rootFolder) {
  folder = new Folder(prompt("Enter a name for the folder:"))
  
  if (pfolder)
    pfolder.appendFile(folder)

  /*folder.setAction(() => {
    if (currentfile) currentfile.content = editor.getValue();
    currentfile = file;
    editor.setValue(currentfile.content);
  })*/
  window.saveFilesystem();
}
setInterval(() => {
  window.saveFilesystem();
}, 3000)


// Event Listeners for Files

function openFile() {
  window.saveFilesystem();

  if (currentfile) {
    currentfile.content = editor.getValue();

    if (currentfile.element.classList.contains("file-selected"))
      currentfile.element.classList.remove("file-selected");
  }

  currentfile = this;
  currentfile.element.classList.add("file-selected");

  editor.setValue(currentfile.content);
}

function mouseOver(e) {
  if (this instanceof Folder) {
    hoveredFolder = this;
    
    return;
  }
}

function MoveFilter(e) {
  let target = e.target;
  console.log(target.classList);
  if (!target.classList.contains("file-name")) return;
  if (target.mousedown) return;
  target.mousedown = true;
  target.downat = Date.now();

  if (e.clientX) {
    target.oldX = e.clientX; // If they exist then use Mouse input
    target.oldY = e.clientY;
  } else {
    target.oldX = e.touches[0].clientX; // Otherwise use touch input
    target.oldY = e.touches[0].clientY;
  }

  target.oldLeft = window.getComputedStyle(target).getPropertyValue('left').split('px')[0];
  target.oldTop = window.getComputedStyle(target).getPropertyValue('top').split('px')[0];


  target.onmouseup = endDrag.bind(this);
  target.ontouchend = endDrag.bind(this);
  document.onmousemove = dr.bind(this);
  document.ontouchmove = dr.bind(this);

  function dr(event) {
    event.preventDefault();

    if (!target.mousedown) {
      return;
    }
    if (Date.now()-target.downat < 120) return;
    target.moving = true;

    //console.log("mousemoved")
    if (event.clientX) {
      target.distX = event.clientX// - target.oldX;
      target.distY = event.clientY// - target.oldY;
    } else {
      target.distX = event.touches[0].clientX// - target.oldX;
      target.distY = event.touches[0].clientY// - target.oldY;
    }

    target.style.position = "fixed";
    target.style.left = target.distX + "px"; //target.oldLeft + 
    target.style.top = target.distY + "px"; //target.oldTop + 
    target.style.zIndex = "15";
  }

  function endDrag() {
    target.mousedown = false;
    if (Date.now()-target.downat < 250) {
      target.style.left = target.oldLeft + "px";
      target.style.top = target.oldTop + "px";
      target.style.position = "";
      return
    }
    if (!target.moving) {
      target.style.left = target.oldLeft + "px";
      target.style.top = target.oldTop + "px";
      target.style.position = "";

      return;
    }

    if (!hoveredFolder) {
      target.style.left = target.oldLeft + "px";
      target.style.top = target.oldTop + "px";
    } else {
      target.style.left = target.oldLeft + "px";
      target.style.top = target.oldTop + "px";

      //console.log(hoveredFolder.parent);

      if (this.parent) {
        const isFile = this instanceof AdkFile;
        let newFile = isFile
          ? this.parent.removeFile(this)
          : this.parent.removeFolder(this);

        hoveredFolder.appendFile(newFile);

        if (isFile) {
          newFile.setAction(openFile)
          newFile.click();
          window.saveFilesystem();
        }
      }
    }    
    target.style.position = "";
  }
}
