const express = require("express");
const DOMPurify = require("isomorphic-dompurify");
const path = require("node:path");
const fs = require("node:fs");
const fsAsync = require("node:fs").promises;
const helmet = require("helmet");
const app = express();
const port = 3000;

const manifestPath = path.join(__dirname, "./dist/parcel-manifest.json");

const allowedHosts = ["fusion.hahoos.dev", "www.hoodrp.com", "hoodrp.com"];

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
  res.render("index", { lobby: null, host: getHost(req) });
});

function removeRichText(input) {
  input = input.replaceAll(/<.*?>/g, "");
  return input;
}

function getHost(req) {
  let host = req.host;
  if (!host || !allowedHosts.some((x) => x == host)) host = "fusion.hahoos.dev";

  return host;
}

function strip(html) {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: ["#text"] });
}

app.get("/join/:query", async (req, res) => {
  if (!new RegExp(/^[a-zA-Z0-9]*$/).test(req.params.query)) {
    res.status(400);
    res.send(
      "You can only include letters and numbers in the query parameter!",
    );
    return;
  }
  try {
    console.log("Fetching lobby info for query: " + req.params.query);
    var info = await fetch(
      `https://fusionapi.hahoos.dev/lobby/query/${req.params.query}?searchType=All`,
    );
    if (info.ok) {
      console.log("Successfully fetched info, rendering with lobby object");
      const json = await info.json();
      json.lobbyName = strip(removeRichText(json.lobbyName));
      json.lobbyDescription = strip(removeRichText(json.lobbyDescription));
      json.lobbyHostName = strip(removeRichText(json.lobbyHostName));
      json.levelTitle = strip(removeRichText(json.levelTitle));
      json.lobbyCode = strip(json.lobbyCode);
      json.thumbnailUrl = `https://fusionapi.hahoos.dev/thumbnail/${json.levelModId}?barcode=${json.levelBarcode}`;
      res.render("index", {
        lobby: json,
        host: getHost(req),
      });
    } else {
      console.log("Failed to fetch info");
      console.log(await info.text());
      res.redirect("/");
    }
  } catch (ex) {
    console.error(
      "An unexpected error has occurred while trying to fetch information about lobby, response:\n" +
        ex,
    );
    res.redirect("/");
  }
});

app.get("/faq", (req, res) => {
  res.render("faq", { host: getHost(req) });
});

async function dynamicHostReplace(
  req,
  res,
  fileName,
  contentType = "application/xml",
) {
  const file = await fsAsync.readFile(fileName, "utf8");
  const val = file.replaceAll("[[host]]", getHost(req));
  res.contentType(contentType);
  res.send(val);
}

app.get("/sitemap.xml", async (req, res) => {
  dynamicHostReplace(req, res, "./sitemap.xml");
});

app.get("/robots.txt", async (req, res) => {
  dynamicHostReplace(req, res, "./robots.txt", "text/plain");
});

app.listen(port, () => {
  console.log("Web Server listening on port " + port);
});
