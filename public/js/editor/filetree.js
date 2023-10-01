const images = [];
function preload() {
    for (let i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
    }
}

preload(
  "imgs/folder.svg",
  "imgs/folder-open.svg"
);

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
const Extensions = {
  "bsl": "bsl", "mdo": "mdo", "asm": "asm", "s": "asm", "c": "c", "h": "c", "m": "c",
  "cs": "c-sharp", "cshtml": "html", "aspx": "html", "ascx": "html", "asax": "html",
  "master": "html", "cc": "cpp", "cpp": "cpp", "cxx": "cpp", "c++": "cpp", "hh": "cpp",
  "hpp": "cpp", "hxx": "cpp", "h++": "cpp", "mm": "cpp", "clj": "clojure", "cljs": "clojure",
  "cljc": "clojure", "edn": "clojure", "cfc": "coldfusion", "cfm": "coldfusion",
  "coffee": "coffee", "litcoffee": "coffee", "config": "config", "cfg": "config",
  "conf": "config", "cr": "crystal", "ecr": "crystal_embedded", "slang": "crystal_embedded",
  "cson": "json", "css": "css", "css.map": "css", "sss": "css", "csv": "csv", "xls": "xls",
  "xlsx": "xls", "cu": "cu", "cuh": "cu", "hu": "cu", "cake": "cake", "ctp": "cake_php", "d": "d",
  "doc": "word", "docx": "word", "ejs": "ejs", "ex": "elixir", "exs": "elixir_script",
  "elm": "elm", "ico": "favicon", "fs": "f-sharp", "fsx": "f-sharp", "gitignore": "git",
  "gitconfig": "git", "gitkeep": "git", "gitattributes": "git", "gitmodules": "git", "go": "go2",
  "slide": "go", "article": "go", "gradle": "gradle", "groovy": "grails", "gsp": "grails",
  "gql": "graphql", "graphql": "graphql", "graphqls": "graphql", "haml": "haml",
  "handlebars": "mustache", "hbs": "mustache", "hjs": "mustache", "hs": "haskell",
  "lhs": "haskell", "hx": "haxe", "hxs": "haxe", "hxp": "haxe", "hxml": "haxe", "html": "html",
  "jade": "jade", "java": "java", "class": "java", "classpath": "java", "properties": "java",
  "js": "javascript", "js.map": "javascript", "spec.js": "javascript", "test.js": "javascript",
  "es": "javascript", "es5": "javascript", "es6": "javascript", "es7": "javascript",
  "jinja": "jinja", "jinja2": "jinja", "json": "json", "jl": "julia", "kt": "kotlin",
  "kts": "kotlin", "dart": "dart", "less": "less", "liquid": "liquid", "ls": "livescript",
  "lua": "lua", "markdown": "markdown", "md": "markdown", "argdown": "argdown", "ad": "argdown",
  "mustache": "mustache", "stache": "mustache", "nim": "nim", "nims": "nim",
  "github-issues": "github", "ipynb": "notebook", "njk": "nunjucks", "nunjucks": "nunjucks",
  "nunjs": "nunjucks", "nunj": "nunjucks", "njs": "nunjucks", "nj": "nunjucks",
  "npm-debug.log": "npm", "npmignore": "npm", "npmrc": "npm", "ml": "ocaml", "mli": "ocaml",
  "cmx": "ocaml", "cmxa": "ocaml", "odata": "odata", "pl": "perl", "php": "php", "php.inc": "php",
  "pddl": "pddl", "plan": "plan", "happenings": "happenings", "ps1": "powershell",
  "psd1": "powershell", "psm1": "powershell", "prisma": "prisma", "pug": "pug", "pp": "puppet",
  "epp": "puppet", "py": "python", "jsx": "react", "spec.jsx": "react", "test.jsx": "react",
  "cjsx": "react", "spec.tsx": "react", "test.tsx": "react", "re": "reasonml", "R": "R",
  "rmd": "R", "rb": "ruby", "erb": "html_erb", "erb.html": "html_erb", "html.erb": "html_erb",
  "rs": "rust", "sass": "sass", "scss": "sass", "springBeans": "spring", "slim": "slim",
  "smarty.tpl": "smarty", "tpl": "smarty", "sbt": "sbt", "scala": "scala", "sol": "ethereum",
  "styl": "stylus", "swift": "swift", "sql": "db", "tf": "terraform", "tf.json": "terraform",
  "tfvars": "terraform", "tex": "tex", "sty": "tex", "dtx": "tex", "ins": "tex", "txt": "default",
  "toml": "config", "twig": "twig", "ts": "typescript", "tsx": "typescript",
  "spec.ts": "typescript_yellow", "test.ts": "typescript_yellow", "vala": "vala", "vapi": "vala",
  "vue": "vue", "wasm": "wasm", "wat": "wat", "xml": "xml", "yml": "yml", "yaml": "yml",
  "pro": "prolog", "jar": "zip", "zip": "zip", "wgt": "wgt", "ai": "illustrator",
  "psd": "photoshop", "pdf": "pdf", "eot": "font", "ttf": "font", "woff": "font", "woff2": "font",
  "gif": "image", "jpg": "image", "jpeg": "image", "png": "image", "pxm": "image", "svg": "svg",
  "svgx": "image", "tiff": "image", "webp": "image", "sublime-project": "sublime",
  "sublime-workspace": "sublime", "code-search": "code-search", "component": "salesforce",
  "cls": "salesforce", "sh": "shell", "zsh": "shell", "fish": "shell", "zshrc": "shell",
  "bashrc": "shell", "mov": "video", "ogv": "video", "webm": "video", "avi": "video",
  "mpg": "video", "mp4": "video", "mp3": "audio", "ogg": "audio", "wav": "audio", "flac": "audio",
  "3ds": "svg", "3dm": "svg", "stl": "svg", "obj": "svg", "dae": "svg", "bat": "windows",
  "cmd": "windows", "babelrc": "babel", "babelrc.js": "babel", "babelrc.cjs": "babel",
  "bowerrc": "bower", "codeclimate.yml": "code-climate", "eslintrc": "eslint",
  "eslintrc.js": "eslint", "eslintrc.yaml": "eslint", "eslintrc.yml": "eslint",
  "eslintrc.json": "eslint", "eslintignore": "eslint", "firebaserc": "firebase",
  "jshintrc": "javascript", "config.cjs": "javascript", "jscsrc": "javascript",
  "stylelintrc": "stylelint", "stylelintrc.json": "stylelint", "stylelintrc.yaml": "stylelint",
  "stylelintrc.yml": "stylelint", "stylelintrc.js": "stylelint", "stylelintignore": "stylelint",
  "direnv": "config", "env": "config", "static": "config", "editorconfig": "config",
  "slugignore": "config", "tmp": "clock", "htaccess": "config", "key": "lock", "cert": "lock",
  "DS_Store": "ignored", "svelte": "svelte", "adk": "Aardvark"
}
var currentfile;
let rootFolder, hoveredFolder;
var files = [];
var saveActions = [];
var fileMenu = document.getElementById('fileEditMenu');
var fileMenuRename = document.getElementById('fileEditMenuRename');
var fileMenuDelete = document.getElementById('fileEditMenuDelete');

window.addEventListener("mouseover", ({ target }) => {
  if (target.matches("#files, #files *, #fileEditMenu, #fileEditMenu *, .file-menu")) {
    fileMenu.isHovered = true;
  } else {
    fileMenu.isHovered = false;
    fileMenu.style.display = 'none';
    openedMenu = null;
  }
});

window.addEventListener("click", ({ target }) => {
  if (target.matches(".file-name *, #fileEditMenu, #fileEditMenu *, .file-menu")) {
    fileMenu.isHovered = true;
  } else {
    fileMenu.isHovered = false;
    fileMenu.style.display = 'none';
    openedMenu = null;
  }
});
/*
document.onmousemove = function(event) {
  x = event.clientX;
  y = event.clientY;
  amt = 25;
  rect = fileMenu.getBoundingClientRect();
  if (y > rect.top - amt && y < rect.bottom + amt && x > rect.left - amt && x < rect.right + amt) {
    fileMenu.isHovered = true;
  } else {
    fileMenu.isHovered = false;
    fileMenu.style.display = 'none';
    openedMenu = null;
  }
}
*/
fileMenuRename.onclick = function() {
  if (openedMenu && openedMenu !== null) {
    if (openedMenu instanceof AdkFile) {
      let newname = prompt(`Enter a new name for ${openedMenu.name}:`);
      openedMenu.name = newname;
      openedMenu.fileNameEl.innerText = newname;
      currentfile = openedMenu;
      openedMenu.fileNameEl.append(openedMenu.menuEl);
    } else if (openedMenu instanceof Folder) {
      let newname = prompt(`Enter a new name for ${openedMenu.name}:`);
      openedMenu.name = newname;
      openedMenu.updateName();
    }
    window.saveFilesystem();
  }
}
fileMenuDelete.onclick = function() {
  if (openedMenu && openedMenu !== null) {
    confirm = prompt(`Enter "yes" to confirm the deletion of ${openedMenu.name}`).toLowerCase();
    if (confirm != 'yes') {
      return alert('It was not deleted.');
    }
    if (openedMenu instanceof AdkFile) {
      files = files.filter(el => el !== openedMenu);
      openedMenu.element.remove();
      if (openedMenu.parent) openedMenu.parent.removeFile(openedMenu);
    } else if (openedMenu instanceof Folder) {
      openedMenu.element.remove();
      if (openedMenu.parent) openedMenu.parent.removeFolder(openedMenu);
    }
    window.saveFilesystem();
  }
}
var openedMenu = null;
const ide = document.getElementById('ide');
const idelayout = document.getElementById('layout');
const FILEINDENTPADDING = 20;

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
    this.menuEl = document.createElement('img');
    this.iconEl = document.createElement("img");
    this.iconEl.src = "imgs/folder-open.svg";
    this.iconEl.classList.add("folder-icon");
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

    this.fileNameEl.classList.add("file-name");
    this.filesEl.classList.add("file-files");
    // this.arrowEl.classList.add("folder-icon");
    this.menuEl.src = '/imgs/dots.svg';
    this.menuEl.style.width = '18px';
    this.menuEl.style.height = '18px';
    this.menuEl.parent = this;
    this.menuEl.addEventListener("click", function() {
      fileMenu.style.display = 'flex';
      const rect = this.getBoundingClientRect();
      fileMenu.style.top = rect.top - (rect.height / 2);
      fileMenu.style.left = rect.left + (rect.width / 2);
      openedMenu = this.parent;
      this.src = '/imgs/dots-selected.svg';
    });
    this.menuEl.addEventListener("mouseleave", function() {
      if (!fileMenu.isHovered) {
        fileMenu.style.display = 'none';
        openedMenu = null;
        this.src = '/imgs/dots.svg';
      }
    });
    this.menuEl.classList.add('file-menu');

    this.element.append(this.fileIconEl);
    this.element.append(this.fileNameEl);
    this.element.append(this.filesEl);
    this.updateName();
  }
  updateName() {
    this.fileNameEl.innerHTML = '';
    this.fileNameEl.append(this.iconEl);
    this.fileNameEl.innerHTML += this.name;
    this.fileNameEl.append(this.menuEl);
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
    const newfile = new AdkFile(file.name, 0);
    newfile.content = file.content;

    file.element.remove();

    return newfile;
  }

  removeFolder(file) {
    const index = this.files.indexOf(file);

    if (index < 0) return;

    this.files.splice(index);
    files.splice(files.indexOf(file), 1);
    const newfile = new Folder(file.name, 0, file.isRoot);
    newfile.files = file.files;

    newfile.setAction(function() {
      this.filesEl.classList.toggle("folder-hidden");
      if (this.filesEl.classList.contains('folder-hidden')) {
        this.iconEl.src = "imgs/folder.svg";
        this.updateName();
      } else {
        this.iconEl.src = "imgs/folder-open.svg";
        this.updateName();
      }
    })

    file.element.remove();

    return newfile;
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
    this.action = (function(ev) {
      if (ev.target && ev.target.classList.contains("file-menu")) return;
      cb.bind(this)(ev);
    }).bind(this);
    
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
  constructor(name, level = 0, isstatic = false) {
    this.isstatic = isstatic;
    this.name = name;
    this.level = level;
    this.path = [name];
    this.parent = null;

    files.push(this);

    this.element = document.createElement("div");
    this.fileIconEl = document.createElement("div");
    this.fileNameEl = document.createElement("div");
    if (!this.isstatic) {
      this.menuEl = document.createElement('img');
      this.element.onmousedown = MoveFilter.bind(this);
      this.element.ontouchstart = MoveFilter.bind(this);
      this.fileNameEl.onmouseover = mouseOver.bind(this);
    }

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
    if (!this.isstatic) {
      this.menuEl.src = '/imgs/dots.svg';
      this.menuEl.style.width = '18px';
      this.menuEl.style.height = '18px';
      this.menuEl.parent = this;
      this.menuEl.addEventListener("click", function() {
        fileMenu.style.display = 'flex';
        const rect = this.getBoundingClientRect();
        fileMenu.style.top = rect.top - (rect.height / 2);
        fileMenu.style.left = rect.left + (rect.width / 2);
        openedMenu = this.parent;
        this.src = '/imgs/dots-selected.svg';
      });
      this.menuEl.addEventListener("mouseleave", function() {
        if (!fileMenu.isHovered) {
          fileMenu.style.display = 'none';
          openedMenu = null;
          this.src = '/imgs/dots.svg';
        }
      });
      this.menuEl.classList.add('file-menu');
      this.fileNameEl.append(this.menuEl);
    }

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
    this.action = (function(ev) {
      if (ev.target && ev.target.classList.contains("file-menu")) return;
      cb.bind(this)(ev);
    }).bind(this);
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

var ideFilesystem;
var folders = {
  "/": new Folder("/", 0, true)
}
var selectedFile;

function resetFiles() {
  ideFilesystem = {
    "main.adk": "stdout.write(\"Hello World!\")",
  }
  window.saveFilesystem(ideFilesystem);
  localStorage.clear();
  console.log('Local Storage cleared.');
  //traverseFilesystem(ideFilesystem);
  location.reload();
}
function traverseFilesystem(tree, origin = "/") {
  for (let key of Object.keys(tree)) {
    if (typeof tree[key] == "object") {
      let foldersNeeded = (origin + key).split("/").map(x => x == "" ? "/" : x);

      let newest = foldersNeeded.pop(foldersNeeded.length);

      let folderPath = (foldersNeeded.join("/") + "/" + newest).replace(/\/\//g, "/");
      if (!folders[folderPath]) {
        folders[folderPath] = new Folder(newest);
        folders[folderPath].setAction(function() {
          this.filesEl.classList.toggle("folder-hidden");
          if (this.filesEl.classList.contains('folder-hidden')) {
            this.iconEl.src = "imgs/folder.svg";
            this.updateName();
          } else {
            this.iconEl.src = "imgs/folder-open.svg";
            this.updateName();
          }
        });
      }

      let parentFolderPath = (foldersNeeded.join("/")).replace(/\/\//g, "/");
      folders[parentFolderPath].appendFile(folders[folderPath]);
      folders[parentFolderPath].setAction(function() {
        this.filesEl.classList.toggle("folder-hidden");
        if (this.filesEl.classList.contains('folder-hidden')) {
          this.iconEl.src = "imgs/folder.svg";
          this.updateName();
        } else {
          this.iconEl.src = "imgs/folder-open.svg";
          this.updateName();
        }
      });

      traverseFilesystem(tree[key], origin + key + "/");
    }
    else {
      let path = (origin + key).split("/");
      let folderName = path.slice(0, path.length - 1).map(x => x == "" ? "/" : x).join("/").replace(/\/\//g, "/");


      let file = new AdkFile(key);
      file.content = tree[key];

      file.setAction(openFile)

      if (folders[folderName] instanceof Folder) {
        folders[folderName].appendFile(file);
        folders[folderName].setAction(function() {
          this.filesEl.classList.toggle("folder-hidden");
          if (this.filesEl.classList.contains('folder-hidden')) {
            this.iconEl.src = "imgs/folder.svg";
            this.updateName();
          } else {
            this.iconEl.src = "imgs/folder-open.svg";
            this.updateName();
          }
        });
      }

      if (selectedFile) {
        try {
          let { path } = selectedFile;
          if (origin + key == "/" + path.join("/")) {
            currentfile = file;
            currentfile.element.classList.add("file-selected");
          }
          //else console.log(path);
        }
        catch (e) {
          if (files[0]) {
            currentfile = files[0];
            files[0].element.classList.add("file-selected");
          }
          console.error(e);
          alert("Corrupted selected file.");
        }
      }
    }
  }
}
function initRoot(editor) {
  /*
  rootFolder = new Folder("/", 0, true);
  const newFolder = new Folder("cool");
  const mainFile = new File("main.adk");
  const newFile = new File("test.adk");
  */

  var ideFilesystem = {
    "main.adk": 'stdout.write("Hello World!")',
  }
  if (localStorage.getItem("filesystem")) {
    try {
      ideFilesystem = JSON.parse(localStorage.getItem("filesystem"));
      if (!ideFilesystem || Object.keys(ideFilesystem).length === 0) {
        ideFilesystem = {
          "main.adk": 'stdout.write("Hello World!")',
        }
      }
    }
    catch (e) {
      alert("Corrupted filesystem.");
    }
  }

  // w
  /*
	var folders = {
    "/": new Folder("/", 0, true)
  }
	*/
  selectedFile = localStorage.getItem("filesystem-selected");
  try {
    selectedFile = JSON.parse(selectedFile);
  } catch {
    selectedFile = { name: Object.keys(ideFilesystem)[0] }
  }
  traverseFilesystem(ideFilesystem);

  if (currentfile) {
    editor.setValue(currentfile.content);

    /*
    console.log("ADDED DECO")
    const deco = editor.deltaDecorations([], [
      {
        range: new monaco.Range(1, 1, 1, 5), // Define the range you want to apply the decorator to
        options: {
          isWholeLine: true, // You can specify whether to decorate the whole line or just a portion of it
          className: 'my-custom-decorator', // CSS class for styling
          glyphMarginClassName: 'my-glyph-margin-decorator', // CSS class for the glyph margin (left side)
          inlineClassName: 'my-inline-decorator', // CSS class for inline styling
          hoverMessage: 'This is a tooltip for the decorator', // Optional tooltip message
        },
      }
    ]);
    */
  } else {
    currentfile = files[0];
    files[0].element.classList.add("file-selected");
  }

  rootFolder = folders["/"];

  fileTree.appendFolder(rootFolder);
}

window.addEventListener("beforeunload", () => {
  window.saveFilesystem();
})

function filesystemToJSON(Data) {
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

  return filesystem;
}

window.saveFilesystem = function(Data, action) {
  // Need to reconstruct the filesystem YAY
  action = action || false
  if (currentfile) currentfile.content = editor.getValue();
  if (action === true) {
    for (i of saveActions) {
      i();
    }
  }
  if (currentfile)
    localStorage.setItem("filesystem-selected", JSON.stringify({
      name: currentfile.name,
      path: currentfile.path
    }))
  
  const filesystem = filesystemToJSON(Data);
  localStorage.setItem("filesystem", JSON.stringify(filesystem)); // this gets set to {}
}
/* 
*********************
***** NEW FILES *****
*********************
*/
function newFile(path, pfolder = rootFolder) {
  path = path.split('/');
  let filename = path[path.length - 1]; // TODO: allow a path to automatically place file in folder
  let file = new AdkFile(filename);
  pfolder = getByName(path.slice(0, -1).join('/'), true);
  pfolder = pfolder = '' ? rootFolder : pfolder;
  if (pfolder)
    pfolder.appendFile(file);

  file.setAction(openFile);
  window.saveFilesystem();
  return file;
}
function newFolder(path, pfolder = rootFolder) {
  path = path.split('/')
  let folder = new Folder(path[path.length - 1]);
  pfolder = getByName(path.slice(0, -1).join('/'), true);
  pfolder = pfolder = '' ? rootFolder : pfolder;
  if (pfolder)
    pfolder.appendFile(folder)

  folder.setAction(function() {
    this.filesEl.classList.toggle("folder-hidden");
    if (this.filesEl.classList.contains('folder-hidden')) {
      this.iconEl.src = "imgs/folder.svg";
      this.updateName();
    } else {
      this.iconEl.src = "imgs/folder-open.svg";
      this.updateName();
    }
  });
  window.saveFilesystem();
  return folder;
}
setInterval(() => {
  window.saveFilesystem(false, true);
}, 3000)


// Event Listeners for Files

function openFile(file) {
  let elem;
  if (file instanceof String) {
    elem = getByName(file);
  } else if (file instanceof AdkFile) {
    elem = file;
  } else {
    elem = this;
  }
  window.saveFilesystem();
  if (currentfile) {
    currentfile.content = editor.getValue();

    if (currentfile.element.classList.contains("file-selected"))
      currentfile.element.classList.remove("file-selected");
  }
  currentfile = elem;
  currentfile.element.classList.add("file-selected");
  let split = currentfile.name.split('.');
  let lang = Extensions[split[split.length - 1]] || 'Aardvark';
  monaco.editor.setModelLanguage(editor.getModel(), lang);
  editor.language = lang;
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
    if (Date.now() - target.downat < 120) return;
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
    if (Date.now() - target.downat < 250) {
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
        let newfile = isFile
          ? this.parent.removeFile(this)
          : this.parent.removeFolder(this);

        hoveredFolder.appendFile(newfile);

        if (isFile) {
          newfile.setAction(openFile)
          newfile.click();
          window.saveFilesystem();
        }
      }
    }
    target.style.position = "";
  }
}
function makeStaticFile(name) {
  file = new AdkFile(name, isstatic = true);
  file.setAction(openFile);
  fileTree.appendFolder(file);
  return file;
}
function fileSystemAction(funct) {
  saveActions.push(funct);
}
function getByName(name, creation = false) {
  if (name === '/' || name === '') return rootFolder;
  path = name.split('/')
  let start = rootFolder;
  let pathstring = '';
  for (let i in path) {
    let f = path[i];
    if (f === '') continue;
    let newstart = start.files.filter(x => x.name === f)[0];
    if (!newstart) {
      if (creation) {
        if (i == path.length - 1) { //last one
          return newFile(pathstring + '/' + f);
        } else {
          console.log(i, path.length-1)
          start = newFolder(pathstring + '/' + f);
        }
      } else return false;
    } else {
      start = newstart;
    }
    pathstring += '/' + f;
  }
  return start
}
// makeStaticFile('.themes');
// makeStaticFile('.run');