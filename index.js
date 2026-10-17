const express = require("express");
const path = require("node:path");
const fs = require("node:fs");
const helmet = require("helmet");
const app = express();
const port = 3000;

const manifestPath = path.join(__dirname, "./dist/parcel-manifest.json");

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.static("./dist"));
app.use(express.static("./src/public"));

function loadManifest() {
  if (!fs.existsSync(manifestPath)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
}

app.locals.asset = function asset(entryName) {
  const manifest = loadManifest();
  const outputPath = manifest[entryName];

  if (!outputPath) {
    throw new Error(`Asset not found in Parcel manifest: ${entryName}`);
  }

  return `/${outputPath.replace(/^\/+/, "")}`;
};

app.get("/", (req, res) => {
  res.render("index", {});
});

app.get("/faq", (req, res) => {
  res.render("faq", {});
});

app.listen(port, () => {
  console.log("Web Server listening on port " + port);
});
