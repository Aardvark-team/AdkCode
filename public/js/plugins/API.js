class Plugin {
  //When was the last time I made a class in JS?
  constructor() {
    //I forgot what my plan was...
    //I made a plan but now I forgot it...
	}
}
const PluginAPI = {
  editor: window.editor,
  settings: window.settings,
  theme:currenTheme,
  setting: (name, def) => {
		return {name, defaultValue: def}
	}
}
// How should the api look like?
// I made a plan but now I forgot it...
// I don't remember
// Lets decide what it should look like before we make it

// I think we need a way for plugins to be able to register settings
// but that should be in the Plugin class
//Lets write code below for how an example plugin  look

/*

cosnt myExtension = new Plugin({
	id: "justcoding123.myextension",
	settings: [
		PluginAPI.setting("name", "defaultvalue")
	]
})

// Events?
// Yes, but this will probably take a while to make
myExtension.on("editorload", () => {
	// Like not a real alert but something like https://sweetalert2.github.io/
//no, We already have our custom alert function in the topbar file.
//The share theme button. Press it 
	myExtension.alert("myExtension is working")
})


//We also need a public / private setting when sharing plugins, like themes.
//Plugins with public setting can be installed by anyone, other need a link
// ok

// idk Should we?
//We need to have a plugin sidebar where you can install and browse plugins, and the plugins you have installed will have a enable/disable switch to temporaily enable/disable it.
// I had a company that was intrested in making an adkcode plugin, but they wanted us to add other file type support (ie, py, js, etc)
//And plugin support. So...
// so they want us to be able to run every file? Like huh i want to write c now make me a c compiler
//No, they want the editor to support other file types.
//The editor can currently only have adk files
// oh you mean highlighting? (idk how to spell that lmao)
//yes
// yep thats basically what vscode does lol
*/
window.editor //The editor

window.settings //Settings