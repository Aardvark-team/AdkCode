const express = require("express");
const app = express();
const Path = require("path");
const cors = require("cors");

const port = 65514;

app.use(cors());
app.use(express.static("public"));
app.use("/monaco", express.static("node_modules/monaco-editor"));
app.use("/xterm", express.static("node_modules/xterm"));
app.use("/xterm/addons/fit", express.static("node_modules/xterm-addon-fit/lib"));

app.listen(port, _ => {
  console.clear();
  console.log("Server listening on port %s", port);
})