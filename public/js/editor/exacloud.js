function connectToExa() {
  let code = prompt(`Enter your EXA cloud repo code: `)
  const form = new FormData();
  form.set("filesystem", window.window.filesystemToJSON());
  const resp = await fetch("https://AdkCode-API.programit.repl.co/api/", {
    method: "POST",
    header: {
      "content-type": "multipart/form-data",
    },
    body: form
  });
}