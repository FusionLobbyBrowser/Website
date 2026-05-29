import { Converter } from "./unityRichText.js";
import Barcodes from "./defaultBarcodes.js";
import Discord from "./discord.js";
import {
  init as settingsInit,
  getSettingValue,
  addEventListener,
  filterWithSettings,
  settings,
  getIconElem,
  addSetting,
  getSetting,
} from "./settings.js";

const HOST = "https://fusionapi.hahoos.dev/";
const LOBBY_LIST = `${HOST}lobbylist`;
const THUMBNAIL = `${HOST}thumbnail/[modId]?barcode="[barcode]"`;

const PROFANITY_LIST =
  "https://raw.githubusercontent.com/Lakatrazz/Fusion-Lists/refs/heads/main/profanityList.json";

const URI_JOIN = "flb-bridge://join/[data]";
const JOIN_DATA = "[layer] || [code]";

const LOBBY_PARAM = "lobby";

const limit = [
  ["Steam", 50],
  ["Epic", 200],
];

const layers = [
  ["Steam", "SteamVR"],
  ["Epic", "Epic Online Services"],
];

let allLobbies;

let infoView = -1;

let refreshInterval = 10;

let refreshing = false;
let lastRefresh = Date.now();

let fullyLoaded = false;

let lobbiesSignal;
let infoSignal;

let profanities = [];
let thumbnailCache = new Map();

const cacheExpireTime = 15 * 60;

let showingInfo = false;

const permissions = [
  [-1, "guest"],
  [0, "default"],
  [1, "operator"],
  [2, "owner"],
];

const gamemodes = [
  {
    barcode: "",
    icon: "img:/images/gamemodes/Sandbox.png",
  },
  {
    barcode: "Lakatrazz.Deathmatch",
    icon: "img:/images/gamemodes/Deathmatch.svg",
  },
  {
    barcode: "Lakatrazz.Team Deathmatch",
    icon: "img:/images/gamemodes/TeamDeathmatch.svg",
  },
  {
    barcode: "Lakatrazz.Smash Bones",
    icon: "img:/images/gamemodes/SmashBones.svg",
  },
  {
    barcode: "Lakatrazz.Juggernaut",
    icon: "img:/images/gamemodes/Juggernaut.png",
  },
  {
    barcode: "Lakatrazz.Hide And Seek",
    icon: "img:/images/gamemodes/HideAndSeek.png",
  },
  {
    barcode: "Lakatrazz.Entangled",
    icon: "img:/images/gamemodes/Entangled.png",
  },
  {
    barcode: "HAHOOS.Avatar Infection",
    icon: "img:/images/gamemodes/AvatarInfection.png",
    link: "https://thunderstore.io/c/bonelab/p/HAHOOS/AvatarInfection/",
  },
];

async function fetchAndCreateLobbies() {
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
      refreshBtn.getElementsByClassName("textIcon")[0].classList.add("fa-spin");
      refreshBtn.blocked = true;

      const lobbies = document.getElementById("lobbies");
      const res = await getJSON();
      const json = res.res ?? res;
      const error = document.getElementsByClassName("error")[0];
      if (json.error != null) {
        lobbies.replaceChildren();
        if (!(await isServerOnline()))
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
        if (json.interval) refreshInterval = Number(json.interval);
        let date = refresh.getAttribute("date");
        let numDate = -1;
        if (date) numDate = Number(date) / 1000;
        if (numDate == -1 || numDate != json.date) {
          setURLParams();
          error.classList.add("hidden");

          timeFromResponse(refresh, json.date);
          timeFromResponse(uptime, res.uptime);

          if (json.lobbies != null) {
            let lobbies = json.lobbies;

            allLobbies = structuredClone(lobbies);

            let _gamemodes = [];
            lobbies.forEach((val) => {
              if (!val) return;

              const gamemode = val.gamemodeBarcode;
              const g = gamemodes.find((x) => x.barcode == val.gamemodeBarcode);
              if (!_gamemodes.includes(gamemode)) {
                addSetting({
                  id: `gamemode_${gamemode}`,
                  category: "Gamemodes",
                  type: "toggle",
                  name: val.gamemodeTitle
                    ? Converter.removeRichText(val.gamemodeTitle)
                    : "Sandbox",
                  icon: g.icon ? g.icon : "fas fa-puzzle-piece",

                  lobbyFilter: true,
                  filterValue: false,
                  lobbyValidator: (lobby) => {
                    return lobby.gamemodeBarcode == gamemode;
                  },

                  defaultValue: true,
                });
                _gamemodes.push(gamemode);
              }
            });

            filterBadges();
            await createLobbies(controller?.signal);
            filterBadges();
          } else {
            hideShow(true);
          }
        }
      }
    } finally {
      refreshing = false;
      setContent(refreshBtn, "Refresh");
      refreshBtn.classList.remove("inProgress");
      refreshBtn.blocked = false;
      refreshBtn
        .getElementsByClassName("textIcon")[0]
        .classList.remove("fa-spin");
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
    console.log(`Creating lobbies took %c${time.toFixed(4)}s`, "color: #FF0");
  }
}

function filterBadges() {
  const list = document.getElementById("appliedFilters");
  list.replaceChildren();
  let any = false;
  for (const x of settings) {
    const val = getSettingValue(x.id);
    if (val == null || val == undefined || !x.lobbyFilter) continue;
    if (x.filterValue == val) {
      any = true;
      const badge = document.createElement("p");
      badge.classList.add("infoBadge");
      const content = document.createElement("span");
      content.classList.add("elemContent");
      if (!x.icon) {
        content.textContent = x.name;
      } else {
        const settingIcon = getIconElem(x.icon);
        const settingContent = document.createElement("span");
        settingContent.classList.add("elemContent");
        settingContent.textContent = x.name;
        content.appendChild(settingIcon);
        content.appendChild(settingContent);
      }
      badge.appendChild(content);
      list.appendChild(badge);
    }
  }
  if (!any) {
    list.classList.add("noFilters");
    const title = document.createElement("h4");
    title.id = "noFiltersText";
    title.textContent = "No filters applied!";
    list.appendChild(title);
  } else {
    list.classList.remove("noFilters");
  }
}

function adjustLobby(lobby, height) {
  const lobbyName = lobby.getElementsByClassName("lobbyName")[0];
  const levelTitle = lobby.getElementsByClassName("levelTitle")[0];
  const hostName = lobby.getElementsByClassName("lobbyHostName")[0];
  const gamemode = lobby.getElementsByClassName("gamemodeTitle")[0];
  const lineHeight = 1.25 * 16;

  if (height <= lineHeight) gamemode.classList.add("oneLine");
  else gamemode.classList.remove("oneLine");

  const ellipsisElems = [lobbyName, gamemode, levelTitle, hostName];
  ellipsisElems.forEach((val) => {
    if (isEllipsisActive(val)) {
      createToolTip(val, val.innerHTML);
    } else if (val._tippy) val._tippy.destroy();
  });
}

const lobbyObserver = new ResizeObserver((entries) => {
  for (const x of entries) {
    if (x.contentRect) {
      adjustLobby(x.target.parentElement, x.contentRect.height);
    }
  }
});

async function createLobbies(signal) {
  let infoUpdated = false;
  const refreshBtn = document.getElementById("refreshButton");
  const lobbies = document.getElementById("lobbies");
  lobbies.replaceChildren();
  const lobbyList = structuredClone(allLobbies);
  let lobbyCountMax = lobbyList.length;
  let lobbyCount = hideLobbies(false);
  let allowed = getAllowedIDs(lobbyList);

  lobbyList.sort(
    (first, second) =>
      parseInt(second.playerCount) - parseInt(first.playerCount),
  );
  if (getSettingValue("sortOrder") != "Descending") lobbyList.reverse();

  let players = 0;
  lobbyList.forEach((val) => {
    players += Number(val.playerCount);
  });

  setLobbyCount(lobbyCount, lobbyCountMax);
  setPlayerCount(players, allLobbies.length);

  if (lobbyList.length == 0)
    document.getElementById("notFound").classList.remove("hidden");
  else document.getElementById("notFound").classList.add("hidden");

  console.log(
    `Creating %c${lobbyList.length}%c %s`,
    "color: #0ff",
    "color: inherit",
    "lobbies",
  );

  for (let i = 0; i < lobbyList.length; i++) {
    if (signal?.aborted == true) return;
    const lobby = lobbyList[i];
    setContent(refreshBtn, `Loading (${i + 1} of ${lobbyList.length})`);
    if (await createLobby(lobby, signal, !allowed.includes(lobby.lobbyID)))
      infoUpdated = true;
  }

  if (infoUpdated == false) hideShow(true);
}

async function refreshButton(date) {
  if (refreshing) return;

  const seconds = Math.round((Date.now() - date) / 1000);
  const button = document.getElementById("refreshButton");
  if (seconds >= refreshInterval) {
    button.disabled = false;
    button.classList.remove("blocked");
    setContent(button, "Refresh");
    if (!refreshing) autoRefresh();
  } else {
    button.disabled = true;
    if (button.classList.contains("inProgress")) {
      button.classList.remove("blocked");
      setContent(button, "Refresh");
    } else {
      button.classList.add("blocked");
      setContent(button, `Refresh (${refreshInterval - seconds})`);
    }
  }
}

async function autoRefresh() {
  if (
    !document.hidden &&
    document.hasFocus() &&
    isToggleChecked("autoRefresh") &&
    fullyLoaded &&
    !refreshing &&
    Date.now() - lastRefresh > 1500
  ) {
    console.log("[Auto Refresh] Creating lobbies");
    lastRefresh = Date.now();
    await fetchAndCreateLobbies();
  }
}

async function createLobby(lobby, signal, hidden) {
  const date = Date.now();
  if (!lobby || !lobby.lobbyID || lobby.lobbyID == 0) {
    console.log("%c > Invalid lobby, cannot create", "color: #f00");
    return false;
  }
  console.log(` > Creating lobby %c${lobby.lobbyID}`, "color: #0f0");
  let infoUpdated = false;
  const lobbies = document.getElementById("lobbies");

  const copy = document.getElementById("lobbyToCopy");
  let lobbyElem = copy.cloneNode(true);
  lobbyElem.removeAttribute("id");

  lobbyElem.setAttribute("filteredout", hidden);
  lobbyElem.setAttribute("platform", lobby.lobbyPlatform);
  const icon = lobbyElem.getElementsByClassName("platformIcon")[0];
  if (lobby.lobbyPlatform == "Steam") {
    icon.classList.add("fa-brands");
    icon.classList.add("fa-steam");
  } else {
    icon.classList.add("fa-custom");
    icon.classList.add("fa-epicgames");
  }
  const thumb = await setThumbnail(
    lobbyElem.getElementsByClassName("lobbyThumbnail")[0],
    lobby.levelModID,
    lobby.levelTitle,
    lobby.levelBarcode,
    false,
  );

  if (infoView != -1 && infoView == lobby.lobbyID) {
    infoUpdated = true;
    if (signal?.aborted != true) displayInfo(lobby, thumb, signal);
  }
  lobbyElem.setAttribute("lobbyId", lobby.lobbyID);
  const lobbyName = lobbyElem.getElementsByClassName("lobbyName")[0];
  lobbyObserver.observe(lobbyName, {
    box: "device-pixel-content-box",
  });
  lobbyName.innerHTML = convert(
    lobby.lobbyName != "" ? lobby.lobbyName : `${lobby.lobbyHostName}'s Lobby`,
  );

  const player = lobby.playerList.players.find(
    (val) => val.platformID == lobby.lobbyID,
  );
  let name;
  if (player) name = getName(player).name;
  else name = convert(lobby.lobbyHostName);

  const hostName = lobbyElem.getElementsByClassName("lobbyHostName")[0];
  setContent(hostName, name);
  const levelTitle = lobbyElem.getElementsByClassName("levelTitle")[0];
  censorModTitle(levelTitle, lobby.levelModID, lobby.levelTitle, thumb.nsfw);

  const gamemode = lobbyElem.getElementsByClassName("gamemodeTitle")[0];
  const g = gamemodes.find((x) => x.barcode == lobby.gamemodeBarcode);
  const gIcon = gamemode.getElementsByClassName("textIcon")[0];
  if (g) {
    const iconElem = getIconElem(g.icon);
    gIcon.remove();
    gamemode.insertBefore(iconElem, gamemode.firstChild);
  } else {
    gIcon.setAttribute("class", "fas fa-puzzle-piece textIcon");
  }
  setContent(
    gamemode,
    lobby.gamemodeBarcode != "" && lobby.gamemodeBarcode
      ? convert(lobby.gamemodeTitle)
      : "Sandbox",
  );

  const playerCount = lobbyElem.getElementsByClassName("lobbyPlayerCount")[0];
  const connectBtn = lobbyElem.getElementsByClassName("connect")[0];
  playerCount.textContent = `(${lobby.playerCount}/${lobby.maxPlayers})`;
  if (lobby.playerCount >= lobby.maxPlayers) {
    playerCount.classList.add("fullLobby");
    connectBtn.classList.add("blocked");
    connectBtn.disabled = true;
  } else {
    playerCount.classList.add("availableLobby");
    connectBtn.classList.remove("blocked");
    connectBtn.disabled = false;
  }
  joinInfo(connectBtn);

  const infoBtn = lobbyElem.getElementsByClassName("infoButton")[0];

  connectBtn.onclick = async () => await onConnect(connectBtn, lobby);

  infoBtn.onclick = async () => {
    infoView = lobby.lobbyID;

    enableInfoButton(false);
    try {
      await displayInfo(lobby, thumb, signal);
    } finally {
      enableInfoButton(true);
    }
  };
  if (showingInfo) setButton(infoBtn, false);

  lobbies.appendChild(lobbyElem);

  const time = (Date.now() - date) / 1000;
  console.log(
    ` > Created lobby %c${lobby.lobbyID}%c (${time.toFixed(4)}s)`,
    "color: #0f0",
    "color: #0ff",
  );
  return infoUpdated;
}

function isEllipsisActive(e) {
  return e.clientHeight < e.scrollHeight;
}

function createToolTip(e, content) {
  tippy(e, {
    content: content,
    animation: "scale",
    appendTo: "parent",
    allowHTML: true,
  });
}

function getName(player) {
  let hasNickname = player.nickname != "" && player.nickname;
  let name = hasNickname ? player.nickname : player.username;
  if (!player.nickname && !player.username) name = "N/A";
  else if (
    hasNickname &&
    Converter.removeRichText(player.username) ==
      Converter.removeRichText(player.nickname)
  )
    hasNickname = false;
  if (name.includes("\n")) name = name.split("\n")[0];
  return {
    name: convert(name),
    hasNickName: hasNickname,
  };
}

function setButton(btn, enabled) {
  btn.blocked = !enabled;
  if (enabled) btn.classList.remove("inProgress");
  else btn.classList.add("inProgress");
}

function enableInfoButton(enabled) {
  const lobbies = document.getElementById("lobbies");
  for (const lobby of lobbies.children) {
    setButton(lobby.getElementsByClassName("infoButton")[0], enabled);
  }
}

const permsList = [
  "teleportation",
  "banning",
  "kicking",
  ["customAvatars", "Custom Avatars"],
  "constrainer",
  ["devTools", "Dev Tools"],
];

async function displayInfo(lobby, thumbnail, signal) {
  if (infoSignal) infoSignal.abort();
  showingInfo = true;
  try {
    const start = Date.now();
    console.log(
      ` > Displaying more info for %c${lobby.lobbyID}`,
      "color: #0f0",
    );

    var controller = new AbortController();
    infoSignal = controller;
    infoView = lobby.lobbyID;

    hideShow(false);

    const lobbyInfo = document.getElementById("info");
    const header = lobbyInfo.getElementsByClassName("header")[0];
    document.getElementById("info-title").innerHTML = convert(
      lobby.lobbyName != ""
        ? lobby.lobbyName
        : `${lobby.lobbyHostName}'s Lobby`,
    );
    lobbyInfo.setAttribute("uptime", Number(lobby.lobbyUptime));

    setContent(
      header.getElementsByClassName("uptime")[0],
      timePassed(Number(lobby.lobbyUptime)),
    );

    setContent(
      header.getElementsByClassName("version")[0],
      `v${lobby.lobbyVersion}`,
    );

    censorModTitle(
      header.getElementsByClassName("level")[0],
      lobby.levelModID,
      lobby.levelTitle,
      thumbnail.nsfw,
    );

    const gamemode = header.getElementsByClassName("gamemode")[0];

    const icon =
      gamemode.getElementsByTagName("i") ??
      gamemode.getElementsByTagName("span");
    if (icon) icon.item(0).remove();
    const g = gamemodes.find((x) => x.barcode == lobby.gamemodeBarcode);
    const iconElem = getIconElem(g && g.icon ? g.icon : "fas fa-puzzle-piece");
    gamemode.insertBefore(iconElem, gamemode.firstChild);

    setContent(
      gamemode,
      lobby.gamemodeBarcode != "" && lobby.gamemodeBarcode
        ? convert(lobby.gamemodeTitle)
        : "Sandbox",
    );

    const connectBtn = document.getElementById("info-connect");
    connectBtn.onclick = async () => await onConnect(connectBtn, lobby);
    if (lobby.playerCount >= lobby.maxPlayers) {
      connectBtn.classList.add("blocked");
      connectBtn.disabled = true;
    } else {
      connectBtn.classList.remove("blocked");
      connectBtn.disabled = false;
    }
    const content = document.getElementById("info-content");
    const right = content.getElementsByClassName("right-content")[0];
    const left = content.getElementsByClassName("left-content")[0];
    const thumb = left.getElementsByClassName("thumbnail")[0];
    const description = right.getElementsByClassName("lobbyDescription")[0];
    thumb.setAttribute("src", thumbnail.thumbnail);
    thumb.setAttribute("alt", thumbnail.alt);
    description.innerHTML = convert(
      (lobby.lobbyDescription != ""
        ? lobby.lobbyDescription
        : "No description provided"
      ).replace("\n", "<br>"),
    );

    const discord = await Discord(lobby.lobbyDescription ?? "N/A");

    const permissionLevels =
      right.getElementsByClassName("permissionsLevels")[0];
    const permissionList = right.getElementsByClassName("permissionsList")[0];
    permissionLevels.replaceChildren();
    permissionList.replaceChildren();
    const perms = new Map(permissions);
    perms.forEach((val) => {
      const item = document.createElement("p");
      item.classList.add(`permission-${val}`);
      item.classList.add("permissionLevel");
      item.textContent = val.toUpperCase();
      permissionLevels.appendChild(item);
    });

    permsList.forEach((val) => {
      let entryName;
      let displayName;
      if (Array.isArray(val)) {
        entryName = val[0];
        displayName = val[1];
      } else {
        entryName = val;
        displayName =
          String(val).charAt(0).toUpperCase() + String(val).slice(1);
      }
      const item = document.createElement("p");
      const level = perms.get(lobby[entryName]);
      item.classList.add(`permission-${level}`);
      item.classList.add("permissionItem");
      item.textContent = displayName;
      permissionList.appendChild(item);
    });

    if (discord) {
      let discordElem = right.getElementsByClassName("discordElem")?.item(0);
      if (!discordElem) {
        const info = document.createElement("p");
        info.classList.add("discordElem");
        right.appendChild(info);
        discordElem = info;
      }
      discordElem.replaceChildren();
      discordElem.appendChild(discord);
    } else {
      let discordElem = right.getElementsByClassName("discordElem")?.item(0);
      let discordTitle = right.getElementsByClassName("discordTitle")?.item(0);
      if (discordElem) right.removeChild(discordElem);
      if (discordTitle) right.removeChild(discordTitle);
    }

    const plrCount = lobbyInfo.getElementsByClassName("plrCount")[0];
    plrCount.textContent = `(${lobby.playerCount}/${lobby.maxPlayers})`;

    if (lobby.playerCount >= lobby.maxPlayers)
      plrCount.classList.add("fullLobby");
    else plrCount.classList.add("availableLobby");

    const playersList = document.getElementById("info-players");
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

      const toCopy = document.getElementById("playerToCopy");
      const playerElem = toCopy.cloneNode(true);
      playerElem.removeAttribute("id");
      const thumb = await setThumbnail(
        playerElem.getElementsByClassName("avatarThumbnail")[0],
        player.avatarModID,
        player.avatarTitle,
        player.avatarTitle,
        true,
      );
      const name = getName(player);
      const nameElem = playerElem.getElementsByClassName("name")[0];
      if (lobby.lobbyPlatform != "Steam") {
        nameElem.innerHTML = convert(name.name);
      } else {
        const link = document.createElement("a");
        link.href = `http://steamcommunity.com/profiles/${player.platformID}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.classList.add("textButton");
        link.innerHTML = convert(name.name);
        nameElem.textContent = "";
        nameElem.appendChild(link);
      }
      if (player.description && player.description != "") {
        tippy(nameElem, {
          content: convert(player.description),
          animation: "scale",
          appendTo: "parent",
          allowHTML: true,
        });
      }
      const username = playerElem.getElementsByClassName("username")[0];
      if (name.hasNickname) {
        username.classList.remove("hidden");
        username.innerHTML = convert(player.username);
      } else {
        username.classList.add("hidden");
      }
      const perms = colorPermission(player.permissionLevel);
      const permsElem = playerElem.getElementsByClassName("permissions")[0];
      permsElem.classList.add(perms.class);
      permsElem.textContent = perms.text;
      if (player.platformID == lobby.lobbyID) {
        const crown = document.createElement("i");
        crown.classList.add("fa-solid");
        crown.classList.add("fa-crown");
        crown.classList.add("textIcon");
        permsElem.insertBefore(crown, permsElem.firstChild);
      }

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
      playerElem.setAttribute("playerId", player.platformID);
      if (signal?.aborted == true || controller?.signal?.aborted == true)
        return;
      playersList.appendChild(playerElem);
      const time = (Date.now() - plrStart) / 1000;
      console.log(
        `  > Created player %c${player.platformID}%c (${time.toFixed(4)}s)`,
        "color: #0f0",
        "color: #0ff",
      );
    }
    playersList
      .querySelectorAll("div:not([playerId])")
      .forEach((x) => x.remove());
    playersList
      .querySelectorAll("div")
      .forEach((x) => x.classList.remove("hidden"));
    lobbyInfo.setAttribute("lobbyId", lobby.lobbyID);
    lobbyInfo.scrollIntoView({ behavior: "smooth", block: "start" });
    const time = (Date.now() - start) / 1000;
    console.log(
      ` > Displayed more info for %c${lobby.lobbyID}%c (${time.toFixed(4)}s)`,
      "color: #0f0",
      "color: #0ff",
    );
  } finally {
    showingInfo = false;
    enableInfoButton(true);
  }
}

function censorModTitle(elem, modId, title, nsfw, usesIcon = true) {
  if (nsfw && isToggleChecked("censorNSFW")) {
    if (usesIcon) setContent(elem, "[NSFW]");
    else elem.textContent = "[NSFW]";
    elem.classList.add("filterNSFW");
  } else if (usesIcon) {
    setContent(elem, modRedirect(modId, title));
  } else elem.innerHTML = modRedirect(modId, title);
}

async function isServerOnline() {
  try {
    const res = await fetch(HOST);
    return res.ok;
  } catch (ex) {
    console.error(ex);
    return false;
  }
}

function colorPermission(perm) {
  let name = "default";
  const mapped = new Map(permissions).get(perm);
  if (mapped) name = mapped;
  return {
    class: `permission-${name.toLowerCase()}`,
    text: name.toUpperCase(),
  };
}

function convert(text) {
  return DOMPurify.sanitize(convertToHTML(censorWords(text)));
}
function censorWords(text) {
  if (!isToggleChecked("censorProfanities")) return text;

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

// DOES NOT sanitize!!!
function setContent(elem, content) {
  const contents = elem.getElementsByClassName("elemContent");
  if (contents && contents.length > 0) {
    const span = contents[0];
    if (span) {
      span.innerHTML = content;
      return;
    }
  }

  elem.innerHTML = content;
}

function hideShow(hide, removeView = true) {
  const elements = [
    "#info",
    "#info-outer",
    "#info-content",
    ".playersTitle",
    "#info-players",
  ];
  elements.forEach((match) => {
    const elem = document.querySelector(match);
    if (elem) {
      if (hide) elem.classList.add("hidden");
      else elem.classList.remove("hidden");
    }
  });

  const header = document.getElementsByTagName("header")[0];
  if (!hide) header.classList.add("header-infoOpened");
  else header.classList.remove("header-infoOpened");

  const lobbyInfo = document.getElementById("info");
  if (hide) {
    lobbyInfo.removeAttribute("lobbyId");
    if (removeView) infoView = -1;
  }
  setURLParams();
}

function setURLParams() {
  const url = new URL(window.location.href);
  if (infoView != -1) {
    url.searchParams.set(LOBBY_PARAM, infoView);
  } else url.searchParams.delete(LOBBY_PARAM);
  if (url.searchParams.size <= 0)
    url.searchParams.forEach((_, key) => url.searchParams.delete(key));

  window.history.pushState(null, "", url.toString());
}

async function getThumbnail(modId, title, barcode, isAvatar) {
  if (modId == -1 || modId == 0 || modId == null) {
    const value = Barcodes.find(
      (x) =>
        x.barcode == barcode ||
        barcode?.startsWith(x.name) == true ||
        x.name == barcode,
    );
    if (value) {
      return {
        thumbnail: `/images/default/${value.name}.webp`,
        alt: `The thumbnail of ${isAvatar ? "an avatar" : "a level"} titled '${title}'`,
        nsfw: false,
      };
    }
  }

  try {
    const cacheItem = thumbnailCache[`${barcode}`];
    if (
      cacheItem &&
      cacheItem.src &&
      cacheItem.createdAt &&
      Date.now() / 1000 - cacheItem.createdAt < cacheExpireTime
    ) {
      console.log("   > Using a thumbnail from cache!");
      return {
        thumbnail: cacheItem.src,
        alt: `The thumbnail of ${isAvatar ? "an avatar" : "a level"} titled '${title}'`,
        nsfw: cacheItem.isNSFW,
      };
    }
    const response = await fetch(
      THUMBNAIL.replace("[modId]", modId).replace("[barcode]", barcode),
    );
    if (!response.ok)
      return { error: await response.text(), status: response.status };
    const res = {
      thumbnail: URL.createObjectURL(await response.blob()),
      alt: `The thumbnail of ${isAvatar ? "an avatar" : "a level"} titled '${title}'`,
      nsfw: response.headers.get("modio-maturity") == "nsfw" ? true : false,
    };
    thumbnailCache[`${barcode}`] = {
      src: res.thumbnail,
      isNSFW: res.nsfw,
      createdAt: Date.now() / 1000,
    };
    return res;
  } catch (ex) {
    console.error(ex);
    return {
      error:
        "Failed to get thumbnail due to the request failing, check console for more details",
    };
  }
}

async function setThumbnail(elem, modId, title, barcode, isAvatar) {
  var thumbnail = await getThumbnail(modId, title, barcode, isAvatar);
  elem.removeAttribute("loading");
  if (thumbnail.error != null) {
    if (thumbnail.status == 404) {
      const alt = Converter.removeRichText(
        `The thumbnail of ${isAvatar ? "an avatar" : "a level"} titled '${title}'. The thumbnail was not found, so a placeholder was displayed instead`,
      );
      elem.setAttribute("src", "images/default/Mods_Level.webp");
      elem.setAttribute("alt", alt);
      return {
        thumbnail: "images/default/Mods_Level.webp",
        alt: alt,
        nsfw: false,
      };
    }
    const alt = Converter.removeRichText(
      `The thumbnail of ${isAvatar ? "an avatar" : "a level"} titled '${title}'. An error occurred while loading, so an error was displayed instead`,
    );
    elem.setAttribute("src", "images/errorThumbnail.webp");
    elem.setAttribute("alt", alt);
    return {
      thumbnail: "images/errorThumbnail.webp",
      alt: alt,
      nsfw: false,
    };
  } else if (thumbnail.nsfw == true && isToggleChecked("censorNSFW")) {
    const alt = Converter.removeRichText(
      `The thumbnail of ${isAvatar ? "an avatar" : "a level"}. The thumbnail and name was censored as it is an NSFW one.`,
    );
    elem.setAttribute("src", "images/nsfwCover.webp");
    elem.setAttribute("alt", alt);
    return {
      thumbnail: "images/nsfwCover.webp",
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
    elem.textContent("Lobbies (None)");
  } else {
    if (count == max) elem.textContent = `Lobbies (${count})`;
    else elem.textContent = `Lobbies (${count}/${max})`;
  }
}

async function onConnect(elem, lobby) {
  setButton(elem, false);
  elem.getElementsByClassName("textIcon")[0].classList.add("fa-bounce");
  try {
    await requestJoin(lobby.lobbyCode, lobby.lobbyPlatform);
  } finally {
    setButton(elem, true);
    elem.getElementsByClassName("textIcon")[0].classList.remove("fa-bounce");
  }
}

function setPlayerCount(players, lobbies) {
  const format =
    "[service] has a limit of [limit] lobbies, due to the high number of lobbies some may not appear. This is a limit implemented by Steam themselves and nothing can be done about it!";

  /*
  const highLobby = document.getElementById("lobbyLimit");
  const limitNum = new Map(limit).get(service);
  if (limitNum && lobbies >= limitNum) {
    highLobby.textContent = format
      .replace("[service]", service)
      .replace("[limit]", limitNum);
    highLobby.classList.remove("hidden");
  } else highLobby.classList.add("hidden");
   */
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

async function requestJoin(code, platform) {
  const mapped = new Map(layers);
  const layer = mapped.get(platform);
  if (!layer) {
    console.error("An unmapped layer found, cannot join");
    return;
  }

  try {
    let encoded = btoa(
      JOIN_DATA.replace("[code]", code).replace("[layer]", layer),
    );

    encoded = encoded
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/\=+$/, "");
    window.location.replace(URI_JOIN.replace("[data]", encoded));
  } catch (ex) {
    console.error(ex);
  }
}

const timeRanges = {
  years: { min: 3600 * 24 * 365, symbol: "y" },
  months: { min: 3600 * 24 * 30, symbol: "m" },
  weeks: { min: 3600 * 24 * 7, symbol: "w" },
  days: { min: 3600 * 24, symbol: "d" },
  hours: { min: 3600, symbol: "h" },
  minutes: { min: 60, symbol: " min" },
  seconds: { min: 1, symbol: "s" },
};

function timeAgo(input) {
  const date = input instanceof Date ? input : new Date(input);
  const formatter = new Intl.RelativeTimeFormat("en");
  const secondsElapsed = (date.getTime() - Date.now()) / 1000;
  for (let key in timeRanges) {
    if (timeRanges[key].min < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / timeRanges[key].min;
      return formatter.format(Math.round(delta), key);
    }
  }
  // Handle times less than 1 second ago
  return formatter.format(-2, "seconds").replace("2", "0");
}

function timePassed(input) {
  const date = input instanceof Date ? input : new Date(input);
  let time = Date.now() / 1000 - date;
  for (let key in timeRanges) {
    if (timeRanges[key].min < Math.abs(time)) {
      const val = time / timeRanges[key].min;
      time = time % timeRanges[key].min;
      return `${Math.round(val)}${timeRanges[key].symbol}`;
    }
  }
  return "0s";
}

function isToggleChecked(id) {
  return getSettingValue(id) == true || getSettingValue(id) == "true";
}

function getAllowedIDs(lobbies) {
  let list = [];
  var filtered = filterWithSettings(structuredClone(lobbies));
  filtered.forEach((x) => list.push(x.lobbyID));
  return list;
}

function hideLobbies(changeElem = true) {
  if (!allLobbies) return;

  let list = getAllowedIDs(allLobbies);

  var lobbies = document.getElementById("lobbies").children;
  if (changeElem) {
    for (const i of lobbies) {
      i.setAttribute("filteredout", !list.includes(i.getAttribute("lobbyId")));
    }
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

function filterEvent(id, redo = false) {
  if (!id) return;

  addEventListener(id, async (val) => {
    filterBadges();
    if (redo) {
      console.log("[Filters] Creating lobbies");
      if (fullyLoaded && !refreshing) {
        if (lobbiesSignal) lobbiesSignal.abort();
        const controller = new AbortController();
        lobbiesSignal = controller;
        await createLobbies(controller?.signal);
      }
    } else {
      await updateFilters();
    }
  });
}

function settingsEvent() {
  window.addEventListener("onsettingchanged", async (ev) => {
    if (ev.detail && ev.detail.id) {
      const setting = getSetting(ev.detail.id);
      if (!setting) return;
      if (setting.lobbyFilter) {
        filterBadges();
        await updateFilters();
      }
    }
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

if (document.readyState !== "loading") init();
else window.addEventListener("DOMContentLoaded", init);

async function init() {
  console.log("Window has been loaded");
  document.getElementById("javascriptRequired").classList.add("hidden");

  settingsInit();
  const params = new URLSearchParams(window.location.search);
  if (params.has(LOBBY_PARAM)) {
    const num = Number(params.get(LOBBY_PARAM));
    if (num) infoView = num;
  }

  collapsableMenus();

  // Do not require lobby list to be created again

  settingsEvent();

  // Require the lobby list to be created again
  filterEvent("censorNSFW", true);
  filterEvent("sortOrder", true);
  filterEvent("censorProfanities", true);

  clickEvent("refreshButton", async () => await fetchAndCreateLobbies());
  clickEvent("info-close", () => hideShow(true));
  joinInfo(document.getElementById("info-connect"));

  updateTime();

  loadProfanities();

  console.log("[Init] Creating lobbies");
  fullyLoaded = true;

  fetchAndCreateLobbies();
}

function joinInfo(btn) {
  tippy(btn, {
    content:
      'To join, you must have the <a class="modLink" href="https://github.com/FusionLobbyBrowser/Mod/releases/latest" target="_blank" rel="noopener noreferrer">mod</a> installed and have launched the game at least once since installation',
    allowHTML: true,
    appendTo: "parent",
    interactive: true,
    animation: "scale",
  });
}

function clickEvent(id, callback) {
  document.getElementById(id).addEventListener("click", callback);
}

async function updateTime() {
  const refresh = document.getElementById("refresh");
  const uptime = document.getElementById("uptime");
  while (true) {
    timeAgoElem(refresh);
    timeAgoElem(uptime);

    const info = document.getElementById("info");
    if (info.hasAttribute("uptime")) {
      setContent(
        info.getElementsByClassName("uptime")[0],
        timePassed(Number(info.getAttribute("uptime"))),
      );
    }

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
    const num = Number(val) * 1000;
    date = new Date(num);
    elem.setAttribute("date", num);
  }
  timeAgoElem(elem, date);
}
