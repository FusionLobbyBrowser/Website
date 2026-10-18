const express = require("express");
const DOMPurify = require("isomorphic-dompurify");
const path = require("node:path");
const fs = require("node:fs");
const fsAsync = require("node:fs").promises;
const helmet = require("helmet");
const app = express();
const port = 3000;

const manifestPath = path.join(__dirname, "dist/parcel-manifest.json");

const allowedHosts = ["fusion.hahoos.dev", "www.hoodrp.com", "hoodrp.com"];

var env = process.env.NODE_ENV || "development";

let imgSrc = ["'self'", "blob:", "'api.hoodrp.com'", "'fusionapi.hahoos.dev'"];
let connectSrc = [
  "'self'",
  "fusionapi.hahoos.dev",
  "api.hoodrp.com",
  "cloudflareinsights.com",
];

if (env == "development") {
  imgSrc.push("localhost:7073");
  connectSrc.push("localhost:7073");
}

app.set("view engine", "ejs");
app.set("views", "views");
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "script-src": [
          "'self'",
          "ajax.cloudflare.com",
          "static.cloudflareinsights.com",
        ],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": imgSrc,
        "connect-src": connectSrc,
        "font-src": ["'self'"],
        "object-src": ["'none'"],
        "media-src": ["'self'"],
        "frame-src": ["'none'"],
        "worker-src": ["'none'"],
        "upgrade-insecure-requests": [],
        "block-all-mixed-content": [],
      },
    },
  }),
);
app.use(express.static("dist"));
app.use(express.static("src/public"));

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

function validate(text) {
  return new RegExp(/^[a-zA-Z0-9]*$/).test(text);
}

app.get("/join/:query", async (req, res) => {
  if (!validate(req.params.query)) {
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
      if (!json.lobbyName || json.lobbyName == "")
        json.levelTitle = strip(`${json.lobbyHostName}'s Lobby`);
      if (!json.lobbyDescription || json.lobbyDescription == "")
        json.lobbyDescription = "No description provided";
      json.lobbyCode = strip(json.lobbyCode);
      if (
        !validate(json.lobbyCode) ||
        !validate(json.lobbyID) ||
        !validate(json.lobbyPlatform)
      ) {
        res.status(500);
        res.send(
          "The requested lobby contains illegal characters in either the ID or the lobby code, which could have possibly lead to a script injection. Will not be attempting to join",
        );
        return;
      }
      json.thumbnailUrl = `https://fusionapi.hahoos.dev/thumbnail/${json.levelModID}?barcode=${json.levelBarcode}`;
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

let cacheReplace = [];

async function dynamicHostReplace(
  req,
  res,
  fileName,
  contentType = "application/xml",
) {
  let content = null;
  let index = -1;
  for (i = 0; i < cacheReplace.length; i++) {
    if (cacheReplace[i].name == fileName) {
      index = i;
      if (Date.now() - cacheReplace[i].time < 120)
        content = cacheReplace[i].content;
    }
  }

  if (!content) {
    const file = await fsAsync.readFile(fileName, "utf8");
    content = file.replaceAll("[[host]]", getHost(req));
  }

  const obj = { name: fileName, time: Date.now(), content: content };
  if (index == -1) cacheReplace.push(obj);
  else cacheReplace[i] = obj;

  res.contentType(contentType);
  res.send(content);
}

app.get("/sitemap.xml", async (req, res) => {
  dynamicHostReplace(req, res, "sitemap.xml");
});

app.get("/robots.txt", async (req, res) => {
  dynamicHostReplace(req, res, "robots.txt", "text/plain");
});

app.listen(port, () => {
  console.log("Web Server listening on port " + port);
});
