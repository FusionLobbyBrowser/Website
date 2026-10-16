const express = require("express");
const helmet = require("helmet");
const app = express();
const port = 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.static("dist"));

app.listen(port, () => {
  console.log("Web Server listening on port " + port);
});
