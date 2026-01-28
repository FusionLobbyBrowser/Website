import { Converter } from "./unityRichText.js";
import Barcodes from "./defaultBarcodes.js";

const HOST = "https://fusionapi.hahoos.dev/";
const LOBBY_LIST = `${HOST}lobbylist`;
const THUMBNAIL = `${HOST}thumbnail/`;

const PROFANITY_LIST =
  "https://raw.githubusercontent.com/Lakatrazz/Fusion-Lists/refs/heads/main/profanityList.json";

const HTTP_JOIN = "http://localhost:25712/join?code=[code]&layer=SteamVR";
const URI_JOIN = "bonelab-flb://SteamVR-[code]/";

let allLobbies;

let moreInfoView = -1;

let refreshInterval = 10;

let refreshing = false;

let fullyLoaded = false;

let lobbiesSignal;
let moreInfoSignal;

let profanities = [];

async function createLobbies() {
  refreshing = true;
  console.log("Fetching lobbies");
  const start = Date.now();
  try {
    if (lobbiesSignal) lobbiesSignal.abort();
    const controller = new AbortController();
    lobbiesSignal = controller;
    const refreshBtn = document.getElementById("refreshButton");
    const refresh = document.getElementById("refresh");
    const uptime = document.getElementById("uptime");
    const highLobby = document.getElementById("lobbyLimit");
    try {
      refreshBtn.classList.remove("blocked");
      refreshBtn.classList.add("inProgress");
      refreshBtn.textContent = "Refresh";
      refreshBtn.blocked = true;

      const lobbies = document.getElementById("lobbies");
      const res = await getJSON();
      const json = res.res ?? res;
      const error = document.getElementsByClassName("error")[0];
      if (json.error != null) {
        lobbies.replaceChildren();
        if (!(await isLobbyOnline()))
          error.textContent = "Server is offline, try again later.";
        else error.textContent = json.error;

        error.classList.remove("hidden");

        setTimeElem(refresh, null);
        setTimeElem(uptime, null);

        highLobby.classList.add("hidden");

        setLobbyCount(-1);
        setPlayerCount(-1, -1);
        hideShow(true);
      } else {
        error.classList.add("hidden");
        lobbies.replaceChildren();
        if (json.interval) refreshInterval = Number(json.interval);

        timeFromResponse(refresh, json.date);
        timeFromResponse(uptime, res.uptime);

        if (json.lobbies != null) {
          let moreInfoUpdated = false;
          let lobbyCountMax = json.lobbies.length;
          let lobbies = json.lobbies;

          allLobbies = structuredClone(lobbies);
          let lobbyCount = hideLobbies();
          let allowed = getAllowedIDs(lobbies);

          const sorting = document.getElementById("sortOrder").value;
          lobbies.sort(
            (first, second) =>
              parseInt(second.playerCount) - parseInt(first.playerCount),
          );
          if (sorting != "descending") lobbies.reverse();

          setLobbyCount(lobbyCount, lobbyCountMax);
          setPlayerCount(json.playerCount.players, json.playerCount.lobbies);

          if (lobbies.length == 0)
            document.getElementById("notFound").classList.remove("hidden");
          else document.getElementById("notFound").classList.add("hidden");

          console.log(
            `Creating %c${lobbies.length}%c %s`,
            "color: #0ff",
            "color: inherit",
            "lobbies",
          );
          for (const lobby of lobbies) {
            if (controller?.signal?.aborted == true) return;
            if (
              await createLobby(
                lobby,
                controller?.signal,
                !allowed.includes(lobby.lobbyID),
              )
            )
              moreInfoUpdated = true;
          }
          if (moreInfoUpdated == false) hideShow(true);
        } else {
          hideShow(true);
        }
      }
    } finally {
      refreshBtn.textContent = "Refresh";
      refreshBtn.classList.remove("inProgress");
      refreshBtn.blocked = false;
      if (refresh.hasAttribute("date"))
        await refreshButton(new Date(Number(refresh.getAttribute("date"))));
    }
  } catch (ex) {
    const error = document.getElementsByClassName("error")[0];
    error.textContent =
      "Failed to create lobbies, check the console for more information";
    error.classList.remove("hidden");
    console.error("Failed to create lobbies: " + ex);

    const lobbies = document.getElementById("lobbies");
    lobbies.replaceChildren();
    hideShow(true);
  } finally {
    refreshing = false;
    const time = (Date.now() - start) / 1000;
    console.log(
      `Creating lobbies took %c${time.toPrecision(4)}s`,
      "color: #FF0",
    );
  }
}

async function refreshButton(date) {
  const seconds = Math.round((Date.now() - date) / 1000);
  const button = document.getElementById("refreshButton");
  if (seconds >= refreshInterval) {
    button.disabled = false;
    button.classList.remove("blocked");
    button.textContent = "Refresh";
    if (!refreshing) autoRefresh();
  } else {
    button.disabled = true;
    if (button.classList.contains("inProgress")) {
      button.classList.remove("blocked");
      button.textContent = "Refresh";
    } else {
      button.classList.add("blocked");
      button.textContent = `Refresh (${refreshInterval - seconds})`;
    }
  }
}

async function autoRefresh() {
  if (
    !document.hidden &&
    document.hasFocus() &&
    document.getElementById("autoRefresh").checked &&
    fullyLoaded &&
    !refreshing
  ) {
    console.log("[Auto Refresh] Creating lobbies");
    await createLobbies();
  }
}

async function createLobby(lobby, signal, hidden) {
  const date = Date.now();
  console.log(` > Creating lobby %c${lobby.lobbyID}`, "color: #0f0");
  let moreInfoUpdated = false;
  const lobbies = document.getElementById("lobbies");
  const hiddenLobby = document.getElementsByClassName("lobbyToCopy")[0];

  const lobbyElem = hiddenLobby.cloneNode(true);
  lobbyElem.classList.remove("lobbyToCopy");
  if (hidden) lobbyElem.classList.add("hidden");
  else lobbyElem.classList.remove("hidden");
  const thumb = await setThumbnail(
    lobbyElem.getElementsByClassName("lobbyThumbnail")[0],
    lobby.levelModID,
    lobby.levelTitle,
    lobby.levelBarcode,
    false,
  );

  if (moreInfoView != -1 && moreInfoView == lobby.lobbyID) {
    moreInfoUpdated = true;
    if (signal?.aborted != true) moreInfo(lobby, thumb, signal);
  }
  lobbyElem.setAttribute("lobbyId", lobby.lobbyID);
  lobbyElem.getElementsByClassName("lobbyName")[0].innerHTML = convert(
    lobby.lobbyName != "" ? lobby.lobbyName : `${lobby.lobbyHostName}'s Lobby`,
  );
  lobbyElem.getElementsByClassName("lobbyHostName")[0].innerHTML = convert(
    lobby.lobbyHostName,
  );
  censorModTitle(
    lobbyElem.getElementsByClassName("levelTitle")[0],
    lobby.levelModID,
    lobby.levelTitle,
    thumb.nsfw,
  );

  lobbyElem.getElementsByClassName("gamemodeTitle")[0].innerHTML =
    lobby.gamemodeBarcode != "" && lobby.gamemodeBarcode
      ? convert(lobby.gamemodeTitle)
      : "Sandbox";

  const playerCount = lobbyElem.getElementsByClassName("lobbyPlayerCount")[0];
  const connectBtn = lobbyElem.getElementsByClassName("connect")[0];
  playerCount.textContent = `(${lobby.playerCount}/${lobby.maxPlayers})`;
  if (lobby.playerCount >= lobby.maxPlayers) {
    playerCount.style.color = "#FF0000";
    connectBtn.classList.add("blocked");
    connectBtn.disabled = true;
  } else {
    playerCount.style.color = "#00FF00";
    connectBtn.classList.remove("blocked");
    connectBtn.disabled = false;
  }

  const moreInfoBtn = lobbyElem.getElementsByClassName("moreInfo")[0];

  connectBtn.onclick = async () => {
    setButton(connectBtn, false);
    try {
      await requestJoin(lobby.lobbyCode);
    } finally {
      setButton(connectBtn, true);
    }
  };

  moreInfoBtn.onclick = async () => {
    moreInfoView = lobby.lobbyID;

    setAllLobbiesMoreInfo(false);
    try {
      await moreInfo(lobby, thumb, signal);
    } finally {
      setAllLobbiesMoreInfo(true);
    }
  };

  if (signal?.aborted != true) lobbies.appendChild(lobbyElem);
  const time = (Date.now() - date) / 1000;
  console.log(
    ` > Created lobby %c${lobby.lobbyID}%c (${time.toPrecision(4)}s)`,
    "color: #0f0",
    "color: #0ff",
  );
  return moreInfoUpdated;
}

function setButton(btn, enabled) {
  btn.blocked = !enabled;
  if (enabled) {
    btn.classList.remove("inProgress");
  } else {
    btn.classList.add("inProgress");
  }
}

function setAllLobbiesMoreInfo(enabled) {
  const lobbies = document.getElementById("lobbies");
  for (const lobby of lobbies.children)
    setButton(lobby.getElementsByClassName("moreInfo")[0], enabled);
}

async function moreInfo(lobby, thumbnail, signal) {
  if (moreInfoSignal) moreInfoSignal.abort();
  const start = Date.now();
  console.log(` > Displaying more info for %c${lobby.lobbyID}`, "color: #0f0");

  var controller = new AbortController();
  moreInfoSignal = controller;
  moreInfoView = lobby.lobbyID;
  const lobbyInfo = document.getElementById("moreDetails");
  const header = lobbyInfo.getElementsByClassName("header")[0];
  header.getElementsByClassName("lobbyTitle")[0].innerHTML = convert(
    lobby.lobbyName != "" ? lobby.lobbyName : `${lobby.lobbyHostName}'s Lobby`,
  );
  const content = lobbyInfo.getElementsByClassName("content")[0];
  const right = content.getElementsByClassName("right-content")[0];
  const left = content.getElementsByClassName("left-content")[0];
  left
    .getElementsByClassName("thumbnail")[0]
    .setAttribute("src", thumbnail.thumbnail);
  right.getElementsByClassName("lobbyDescription")[0].innerHTML = convert(
    (lobby.lobbyDescription != "" ? lobby.lobbyDescription : "N/A").replace(
      "\n",
      "<br>",
    ),
  );

  censorModTitle(
    right.getElementsByClassName("levelTitle")[0],
    lobby.levelModID,
    lobby.levelTitle,
    thumbnail.nsfw,
  );

  right.getElementsByClassName("gamemode")[0].innerHTML =
    lobby.gamemodeBarcode != "" && lobby.gamemodeBarcode
      ? convert(`${lobby.gamemodeTitle} (${lobby.gamemodeBarcode})`)
      : "Sandbox";

  const playersTitle = lobbyInfo.getElementsByClassName("playersTitle")[0];
  const plrCount = playersTitle.getElementsByClassName("plrCount")[0];
  plrCount.textContent = `(${lobby.playerCount}/${lobby.maxPlayers})`;

  if (lobby.playerCount >= lobby.maxPlayers) plrCount.style.color = "#FF0000";
  else plrCount.style.color = "#00FF00";

  const host = lobbyInfo.getElementsByClassName("lobbyHost")[0];
  host.innerHTML = `Host: ${convert(lobby.lobbyHostName)}`;

  const playersList = lobbyInfo.getElementsByClassName("players")[0];
  playersList.replaceChildren();
  const players = lobby.playerList.players;
  players.sort((first, second) => {
    if (second.platformID == lobby.lobbyID) return 100;

    if (first.platformID == lobby.lobbyID) return -100;

    return parseInt(second.permissionLevel) - parseInt(first.permissionLevel);
  });
  for (const player of players) {
    const plrStart = Date.now();
    if (
      (!player.username || player.username == "") &&
      (!player.nickname || player.nickname == "")
    )
      continue;
    if (controller?.signal?.aborted == true) return;

    console.log(`  > Creating player %c${player.platformID}`, "color: #0f0");

    const toCopy = document.getElementsByClassName("playerToCopy")[0];
    const playerElem = toCopy.cloneNode(true);
    const thumb = await setThumbnail(
      playerElem.getElementsByClassName("avatarThumbnail")[0],
      player.avatarModID,
      player.avatarTitle,
      player.avatarTitle,
      true,
    );
    const hasNickname = player.nickname != "" && player.nickname;
    let name = hasNickname ? player.nickname : player.username;
    if (!player.nickname && !player.username) name = "N/A";
    if (name.includes("\n")) name = name.split("\n")[0];
    playerElem.getElementsByClassName("name")[0].innerHTML = convert(name);
    const username = playerElem.getElementsByClassName("username")[0];
    if (hasNickname) {
      username.classList.remove("hidden");
      username.innerHTML = convert(player.username);
    } else {
      username.classList.add("hidden");
    }
    playerElem.getElementsByClassName("permissions")[0].innerHTML =
      colorPermission(player.permissionLevel);
    let avatar =
      player.avatarTitle && player.avatarTitle != ""
        ? convertToHTML(player.avatarTitle)
        : "N/A";

    censorModTitle(
      playerElem.getElementsByClassName("avatarTitle")[0],
      player.avatarModID,
      avatar,
      thumb.nsfw,
    );
    playerElem.classList.remove("playerToCopy");
    playerElem.setAttribute("playerId", player.platformID);
    if (signal?.aborted == true || controller?.signal?.aborted == true) return;
    playersList.appendChild(playerElem);
    const time = (Date.now() - plrStart) / 1000;
    console.log(
      `  > Created player %c${player.platformID}%c (${time.toPrecision(4)}s)`,
      "color: #0f0",
      "color: #0ff",
    );
  }
  lobbyInfo.setAttribute("lobbyId", lobby.lobbyID);
  hideShow(false);
  lobbyInfo.scrollIntoView({ behavior: "smooth", block: "start" });
  const time = (Date.now() - start) / 1000;
  console.log(
    ` > Displayed more info for %c${lobby.lobbyID}%c (${time.toPrecision(4)}s)`,
    "color: #0f0",
    "color: #0ff",
  );
}

function censorModTitle(elem, modId, title, nsfw) {
  if (nsfw && !document.getElementById("showNSFW").checked) {
    elem.innerHTML = '<span style="color: #FF0000">[NSFW]</span>';
  } else {
    elem.innerHTML = modRedirect(modId, title);
  }
}

async function isLobbyOnline() {
  try {
    const res = await fetch(HOST);
    return res.ok;
  } catch (ex) {
    console.error(ex);
    return false;
  }
}

function colorPermission(perm) {
  switch (perm) {
    case -1:
      return '<span class="inheritParent" style="color: #808080">GUEST</span>';
    case 0:
      return '<span class="inheritParent">DEFAULT</span>';
    case 1:
      return '<span class="inheritParent" style="color: #FA8072">OPERATOR</span>';
    case 2:
      return '<span class="inheritParent" style="color: #FFBF00">OWNER</span>';
  }
}

function convert(text) {
  return DOMPurify.sanitize(convertToHTML(censorWords(text)));
}
function censorWords(text) {
  if (!document.getElementById("filterProfanities").checked) return text;

  if (text == null || text == "") return text;

  let mapped = [];
  let plain = text.replace(/<.*?>/g, (match, offset) => {
    mapped.push({ tag: match, offset: offset });
    return "";
  });
  for (const s of profanities) {
    let regex = new RegExp(s, "gmi");
    plain = plain.replaceAll(regex, "*".repeat(s.length));
  }
  for (const m of mapped) {
    plain =
      plain.slice(0, m.offset) + m.tag + plain.slice(m.offset, plain.length);
  }
  return plain;
}

function hideShow(hide, removeView = true) {
  const elements = [
    "#moreDetails",
    "#moreDetails-outer",
    ".content",
    ".playersTitle",
    ".players",
  ];
  elements.forEach((match) => {
    const elem = document.querySelector(match);
    if (elem) {
      if (hide) elem.classList.add("hidden");
      else elem.classList.remove("hidden");
    }
  });

  const header = document.getElementsByTagName("header")[0];
  if (!hide) header.classList.add("header-moreInfoOpened");
  else header.classList.remove("header-moreInfoOpened");

  const lobbyInfo = document.getElementById("moreDetails");
  const url = new URL(window.location.href);
  if (hide) {
    lobbyInfo.removeAttribute("lobbyId");
    if (removeView) {
      url.searchParams.delete("lobbyView");
      moreInfoView = -1;
    }
  } else {
    url.searchParams.set("lobbyView", moreInfoView);
  }
  if (url.searchParams.size <= 0)
    url.searchParams.forEach((_, key) => url.searchParams.delete(key));

  window.history.pushState(null, "", url.toString());
}

async function getThumbnail(modId, title, search, isAvatar) {
  if (modId == -1 || modId == 0 || modId == null) {
    const value = Barcodes.find(
      (x) =>
        x.barcode == search ||
        search?.startsWith(x.name) == true ||
        x.name == search,
    );
    if (value) {
      return {
        thumbnail: `/images/default/${value.name}.png`,
        alt: `The thumbnail of ${isAvatar ? "an avatar" : "a level"} titled '${title}'`,
        nsfw: false,
      };
    } else {
      return {
        thumbnail: `/images/default/${
          isAvatar ? "Mods_Avatar" : "Mods_Level"
        }.png`,
        alt: `The thumbnail of ${isAvatar ? "an avatar" : "a level"} titled '${title}'. No corresponding thumbnail for it was found, so a default one was applied`,
        nsfw: false,
      };
    }
  }

  try {
    const response = await fetch(THUMBNAIL + modId);
    if (!response.ok) return { error: await response.text() };
    return {
      thumbnail: URL.createObjectURL(await response.blob()),
      alt: `The thumbnail of ${isAvatar ? "an avatar" : "a level"} titled '${title}'`,
      nsfw: response.headers.get("modio-maturity") == "nsfw" ? true : false,
    };
  } catch (ex) {
    console.error(ex);
    return {
      error:
        "Failed to get thumbnail due to the request failing, check console for more details",
    };
  }
}

async function setThumbnail(elem, modId, title, search, isAvatar) {
  var thumbnail = await getThumbnail(modId, title, search, isAvatar);
  if (thumbnail.error != null) {
    const alt = Converter.removeRichText(
      `The thumbnail of ${isAvatar ? "an avatar" : "a level"} titled '${title}'. An error occurred while loading, so an error was displayed instead`,
    );
    elem.setAttribute("src", "images/errorThumbnail.png");
    elem.setAttribute("alt", alt);
    return {
      thumbnail: "images/errorThumbnail.png",
      alt: alt,
      nsfw: false,
    };
  } else if (
    thumbnail.nsfw == true &&
    !document.getElementById("showNSFW").checked
  ) {
    const alt = Converter.removeRichText(
      `The thumbnail of ${isAvatar ? "an avatar" : "a level"} titled '${title}'. The thumbnail was censored as it is an NSFW one.`,
    );
    elem.setAttribute("src", "images/nsfwCover.png");
    elem.setAttribute("alt", alt);
    return {
      thumbnail: "images/nsfwCover.png",
      alt: alt,
      nsfw: true,
    };
  } else {
    elem.setAttribute("src", thumbnail.thumbnail);
    elem.setAttribute("alt", Converter.removeRichText(thumbnail.alt));
    return thumbnail;
  }
}

function modRedirect(id, name) {
  if (id == -1) return name;

  return `<a class="levelRedirect" href="https://mod.io/search/mods/${id}" target="_blank" rel="noopener noreferrer"">${convert(
    name,
  )}</a>`;
}

function setLobbyCount(count, max) {
  const elem = document.getElementsByClassName("lobbyHeader")[0];
  if (count == -1) {
    elem.classList.add("hidden");
  } else {
    elem.classList.remove("hidden");
    if (count == max) elem.textContent = `Lobbies (${count})`;
    else elem.textContent = `Lobbies (${count}/${max})`;
  }
}

function setPlayerCount(players, lobbies) {
  if (players == -1 || lobbies == -1) {
    document.getElementsByClassName("lobbyInfo")[0].classList.add("hidden");
    return;
  }
  document.getElementsByClassName("lobbyInfo")[0].classList.remove("hidden");
  document.getElementsByClassName("playerCount")[0].textContent =
    `${players} players`;
  document.getElementsByClassName("lobbyCount")[0].textContent =
    `${lobbies} lobbies`;

  const highLobby = document.getElementById("lobbyLimit");
  if (lobbies >= 49) highLobby.classList.remove("hidden");
  else highLobby.classList.add("hidden");
}

function convertToHTML(text) {
  const converter = new Converter();
  return converter.unity2html(text);
}

async function getJSON() {
  try {
    const response = await fetch(LOBBY_LIST);
    if (!response.ok) return { error: await response.text() };

    return {
      res: await response.json(),
      uptime: response.headers.get("server-uptime"),
    };
  } catch (ex) {
    console.error(ex);
    return {
      error:
        "Failed to get lobbies due to the request failing, check console for more details",
    };
  }
}

async function requestJoin(code) {
  try {
    const response = await fetch(HTTP_JOIN.replace("[code]", code));
    if (!response.ok) window.location.replace(URI_JOIN.replace("[code]", code));
  } catch (ex) {
    console.error(ex);
    window.location.replace(URI_JOIN.replace("[code]", code));
  }
  window.alert(
    "You don't join a lobby when you pressed the button? Install the mod (link on the page, press the red 'mod' text). Have the mod already and cant join? Create an issue on Github!",
  );
}

// https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
// To be fair I could have done it myself, but I'm not really familiar with the language
// EDIT: I was fucking lazy and i just thought there was a method in Date that does it automatically, but well there is none.
function timeAgo(input) {
  const date = input instanceof Date ? input : new Date(input);
  const formatter = new Intl.RelativeTimeFormat("en");
  const ranges = {
    years: 3600 * 24 * 365,
    months: 3600 * 24 * 30,
    weeks: 3600 * 24 * 7,
    days: 3600 * 24,
    hours: 3600,
    minutes: 60,
    seconds: 1,
  };
  const secondsElapsed = (date.getTime() - Date.now()) / 1000;
  for (let key in ranges) {
    if (ranges[key] < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / ranges[key];
      return formatter.format(Math.round(delta), key);
    }
  }
  // Handle times less than 1 second ago
  return formatter.format(-2, "seconds").replace("2", "0");
}

function filterLobbies(lobbies) {
  if (!document.getElementById("showFullLobbies").checked)
    lobbies = lobbies.filter((i) => i.playerCount != i.maxPlayers);

  if (!document.getElementById("showOnePlayerLobbies").checked)
    lobbies = lobbies.filter((i) => i.playerCount > 1);

  if (!document.getElementById("showRPLobbies").checked)
    lobbies = filterByName(lobbies, ["hood", "rp", "war", "roleplay"]);

  if (!document.getElementById("showRussianLobbies").checked)
    lobbies = filterByName(lobbies, ["russian", "rus", "russ"]);

  return lobbies;
}

function filterByName(lobbies, array) {
  lobbies = lobbies.filter((i) => {
    if (!i || !i.lobbyName || i.lobbyName == "") return true;
    const iName = Converter.removeRichText(i.lobbyName);
    const words = iName.split(" ");
    let found = false;
    for (const s of array) {
      for (const w of words) {
        if (w.toLowerCase() == s.toLowerCase()) {
          found = true;
          break;
        }
      }
    }
    return !found;
  });

  return lobbies;
}

function getAllowedIDs(lobbies) {
  let list = [];
  var filtered = filterLobbies(structuredClone(lobbies));
  filtered.forEach((x) => list.push(x.lobbyID));
  return list;
}

function hideLobbies() {
  if (!allLobbies) return;

  let list = getAllowedIDs(allLobbies);

  var lobbies = document.getElementById("lobbies").children;
  for (const i of lobbies) {
    if (list.includes(Number(i.getAttribute("lobbyId"))))
      i.classList.remove("hidden");
    else i.classList.add("hidden");
  }
  return list.length;
}

async function updateFilters() {
  if (!allLobbies) return;

  let lobbyCountMax = allLobbies.length;

  let lobbies = hideLobbies();
  setLobbyCount(lobbies, lobbyCountMax);
}

async function loadProfanities() {
  console.log(`Loading profanities from ${PROFANITY_LIST}`);
  try {
    const res = await fetch(PROFANITY_LIST);
    if (res.ok) {
      const json = await res.json();
      console.log(
        `Successfully loaded %c${json.words.length}%c %s`,
        "color: #f00",
        "color: inherit",
        "profanities",
      );
      for (const word of json.words) profanities.push(word);
    }
  } catch (ex) {
    console.error(ex);
  }
}

function filterEvent(elem, redo = false) {
  if (!elem) return;

  const element = document.getElementById(elem);
  if (!element) return;

  element.addEventListener("change", async () => {
    if (redo) {
      console.log("[Filters] Creating lobbies");
      if (fullyLoaded) await createLobbies();
    } else await updateFilters();
  });
}

function collapsableMenus() {
  const menus = document.querySelectorAll('[data-toggle="collapse"]');
  for (const menu of menus) {
    menu.addEventListener("click", () => {
      menu.classList.toggle("collapsed");
    });
  }
}

document.getElementById("javascriptRequired").classList.add("hidden");

window.addEventListener("load", async () => {
  console.log("Window has been loaded");
  document.getElementById("javascriptRequired").classList.add("hidden");

  const params = new URLSearchParams(window.location.search);
  if (params.has("lobbyView")) {
    const num = Number(params.get("lobbyView"));
    if (num) moreInfoView = num;
  }

  hideShow(true, false);
  collapsableMenus();

  // Do not require lobby list to be created again
  filterEvent("showFullLobbies", false);
  filterEvent("showOnePlayerLobbies", false);
  filterEvent("showRussianLobbies", false);
  filterEvent("showRPLobbies", false);

  // Require the lobby list to be created again
  filterEvent("showNSFW", true);
  filterEvent("sortOrder", true);
  filterEvent("filterProfanities", true);

  clickEvent("refreshButton", async () => await createLobbies());
  clickEvent("closeMoreInfo", () => hideShow(true));

  updateTime();

  await loadProfanities();
  console.log("[Init] Creating lobbies");
  fullyLoaded = true;
  await createLobbies();
});

function clickEvent(id, callback) {
  document.getElementById(id).addEventListener("click", callback);
}

async function updateTime() {
  const refresh = document.getElementById("refresh");
  const uptime = document.getElementById("uptime");
  while (true) {
    timeAgoElem(refresh);
    timeAgoElem(uptime);

    await refreshButton(new Date(Number(refresh.getAttribute("date"))));

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

function timeAgoElem(elem, date = null) {
  if (date != null || elem.hasAttribute("date")) {
    const _date = date ?? new Date(Number(elem.getAttribute("date")));
    setTimeElem(elem, timeAgo(_date));
  }
}

function setTimeElem(elem, val) {
  if (val == null || val == undefined) val = "N/A";
  const text = elem.textContent.split(": ")[0];
  elem.textContent = `${text}: ${val}`;
  if (val == "N/A") {
    elem.removeAttribute("date");
    elem.classList.add("hidden");
  } else {
    elem.classList.remove("hidden");
  }
}

function timeFromResponse(elem, val) {
  let date = null;
  if (val != null && val != undefined) {
    console.log(val);
    const num = Number(val) * 1000;
    date = new Date(num);
    elem.setAttribute("date", num);
  }
  timeAgoElem(elem, date);
}
