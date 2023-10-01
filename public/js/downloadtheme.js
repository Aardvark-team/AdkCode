let params = (new URL(document.location)).searchParams
var themes, theme;

async function downloadTheme(themeid) {
  themes = localStorage.getItem("editor-themes") ? localStorage.getItem("editor-themes") : `{"names": [], "themes": [], "advancedThemes": []}`
  
  try {
    themes = JSON.parse(themes)
  }
  catch(e) {
    alert("Corrupted thenes save.")
    themes = {names: [], advancedThemes: [], themes: {}}
  }

  let text = await fetch("https://AdkCode.programit.repl.co/db/get_theme", {
    method: "POST",
    body: JSON.stringify({
      themeId: themeid
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.text());
  let jsonTheme = JSON.parse(text);

  if (jsonTheme.error) {
    alert("Invalid theme id."); 
    window.location.href = "/";
    return
  }

  return jsonTheme.theme;
  //window.location.href = "/"
}
var get = document.getElementById('get');
async function onLoad() {
  if (params.get("theme")) {
    theme = await downloadTheme(decodeURIComponent(params.get("theme")));
    monaco.editor.defineTheme('Live-View', theme);
    monaco.editor.setTheme('Live-View');
  } else {
    alert("Expected ?theme parameter to be set, redirecting...");
    window.location.href = "/";
  }
}
get.onclick = function() {
  if (!(themes && theme)) return;
  let name = prompt("What would you like to call this theme?")
  name = name.trim() == "" ? `Downloaded ${themeid}` : name
  if (!themes.names.includes(name)) {
    themes.names.push(name);
    themes.advancedThemes[name] = theme;
    localStorage.setItem('editor-themes', JSON.stringify(themes));
    window.location.href = "/";
  } else {
    alert("You already have a theme with that name.")
  }
}