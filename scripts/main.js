import { Converter } from "./unityRichText.js";
import {
  barcodes,
  layers,
  permissions,
  permsList,
  gamemodes,
  statuses,
  blacklist,
} from "./const.js";
import { getProfile } from "./steam.js";
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
  friends,
  setFriendsInLobby,
  containsWord,
} from "./settings.js";

let HOST = "https://fusionapi.hahoos.dev/"; // http://localhost:5000/
const LOBBY_LIST = "[host]lobbylist";
const THUMBNAIL = "[host]thumbnail/[modId]?barcode=[barcode]";

const PROFANITY_LIST =
  "https://raw.githubusercontent.com/Lakatrazz/Fusion-Lists/refs/heads/main/profanityList.json";

const URI_JOIN = "flb-bridge://join/[data]";

const LOBBY_PARAM = "lobby";

const SIMULATE_HOODRP = false;

let allLobbies;
let friendIDs;

let infoView = -1;

let refreshInterval = 10;

let refreshing = false;
let lastRefresh = Date.now();

let fullyLoaded = false;

let lobbiesSignal;
let infoSignal;

let thumbnailCache = new Map();

const cacheExpireTime = 15 * 60;

let showingInfo = false;

let firstFetch = false;

const converter = new Converter();

let uptimeContainer;
let uptimeContent;

// Sort Order
// 1 - Descending
// 2 - Ascending

const sorting = [
  {
    name: "Alphabetical",
    callback: (lobbies, order) => {
      lobbies.sort((a, b) =>
        getLobbyName(a)
          .toLowerCase()
          .localeCompare(getLobbyName(b).toLowerCase()),
      );
      if (order == 2) lobbies.reverse();
    },
  },
  {
    name: "Players",
    callback: (lobbies, order) => {
      lobbies.sort((a, b) => parseInt(b.playerCount) - parseInt(a.playerCount));
      if (order == 2) lobbies.reverse();
    },
  },
  {
    name: "Uptime",
    callback: (lobbies, order) => {
      lobbies.sort((a, b) => parseInt(a.lobbyUptime) - parseInt(b.lobbyUptime));
      if (order == 2) lobbies.reverse();
    },
  },
];

async function fetchAndCreateLobbies() {
  if (refreshing) return;

  refreshing = true;
  firstFetch = true;
  console.log("Fetching lobbies");
  const start = Date.now();
  try {
    if (lobbiesSignal) lobbiesSignal.abort();
    if (infoSignal) infoSignal.abort();
    const controller = new AbortController();
    lobbiesSignal = controller;
    filterBadges();
    const refreshBtn = document.getElementById("refreshButton");
    const refresh = document.getElementById("refresh");
    try {
      refreshBtn.classList.add("blocked");
      refreshBtn.getElementsByClassName("textIcon")[0].classList.add("fa-spin");
      refreshBtn.blocked = true;

      const lobbies = document.getElementById("lobbies");
      const res = await getJSON();
      const json = res.res ?? res;
      if (json.error != null) {
        lobbies.replaceChildren();
        if (!(await isServerOnline()))
          lobbyNotice(
            "Request Error",
            "Failed to fetch lobbies, because the server is currently offline. Try again later!",
            "fas fa-xmark",
            "--flb-error-color",
          );
        else
          lobbyNotice(
            "Request Error",
            "Failed to fetch lobbies, server responded with the following error: " +
              json.error,
            "fas fa-xmark",
            "--flb-error-color",
          );

        setTimeElem(refresh, null);

        setLobbyCount(-1);
        setPlayerCount(0, 0);
        document.getElementById("steamCount").textContent = 0;
        document.getElementById("epicCount").textContent = 0;
        hideShow(true);
      } else {
        if (json.interval) refreshInterval = Number(json.interval);
        let date = refresh.getAttribute("date");
        let numDate = -1;
        if (date) numDate = Number(date) / 1000;
        if (numDate == -1 || numDate != json.date) {
          setURLParams();

          timeFromResponse(refresh, json.date);

          if (json.lobbies != null) {
            let lobbies = json.lobbies;

            allLobbies = structuredClone(lobbies);
            allLobbies = allLobbies.filter((x) => !containsWord(x, blacklist));
            friendIDs = structuredClone(json.friends);

            let _gamemodes = [];
            lobbies.forEach((val) => {
              if (!val) return;

              const gamemode = val.gamemodeBarcode;
              const g = gamemodes.find((x) => x.barcode == val.gamemodeBarcode);
              if (!_gamemodes.includes(gamemode)) {
                addSetting({
                  id: `gamemode_${!gamemode || gamemode == "" ? "Lakatrazz.Sandbox" : gamemode}`,
                  category: "Gamemodes",
                  type: "filter",
                  name: val.gamemodeTitle
                    ? Converter.removeRichText(val.gamemodeTitle)
                    : "Sandbox",
                  icon: g && g.icon ? g.icon : "fas fa-puzzle-piece",

                  lobbyFilter: true,
                  filterValue: false,
                  lobbyValidator: (lobby) => {
                    return lobby.gamemodeBarcode == gamemode;
                  },

                  defaultValue: { include: false, exclude: false },
                });
                _gamemodes.push(gamemode);
              }
            });

            await createLobbies(controller);
          } else {
            hideShow(true);
          }
        }
      }
    } finally {
      refreshing = false;
      setContent(refreshBtn, "Refresh");
      refreshBtn.classList.remove("blocked");
      refreshBtn.blocked = false;
      refreshBtn
        .getElementsByClassName("textIcon")[0]
        .classList.remove("fa-spin");
      if (refresh.hasAttribute("date"))
        await refreshButton(new Date(Number(refresh.getAttribute("date"))));
    }
  } catch (ex) {
    lobbyNotice(
      "Error",
      "An unexpected error has occurred while fetching/creating lobbies, if the error persits, contact the developer (check FAQ page for contact)! Exception: " +
        ex,
      "fas fa-xmark",
      "--flb-error-color",
    );
    console.error("Failed to create lobbies");
    console.error(ex);

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

    let filter = false;
    if (typeof x.filterValue == "function") filter = x.filterValue(x, val);
    else filter = x.filterValue == val;

    if (filter) {
      any = true;
      const badge = document.createElement("p");
      badge.classList.add("infoBadge");
      const content = document.createElement("span");
      content.classList.add("elemContent");
      const text =
        x.type != "search"
          ? x.baseName && x.baseName != ""
            ? x.baseName
            : x.name
          : val;
      if (!x.icon) {
        content.textContent = text;
      } else {
        const settingIcon = getIconElem(x.icon);
        const settingContent = document.createElement("span");
        settingContent.classList.add("elemContent");
        settingContent.textContent = text;
        content.appendChild(settingIcon);
        content.appendChild(settingContent);
        if (x.type == "filter") {
          const settingType = document.createElement("i");
          settingType.classList.add("fas");
          if (val && val.include == true) {
            settingType.classList.add("fa-check");
            content.appendChild(settingType);
          } else if (val && val.exclude == true) {
            settingType.classList.add("fa-xmark");
            content.appendChild(settingType);
          }
        }
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

function adjustPlayer(player, height) {
  const name = player.getElementsByClassName("name")[0];
  const permissions = player.getElementsByClassName("permissions")[0];
  const avatarTitle = player.getElementsByClassName("avatarTitle")[0];
  const lineHeight = 1.25 * 16;

  if (height <= lineHeight) avatarTitle.classList.add("oneLineAvatar");
  else avatarTitle.classList.remove("oneLineAvatar");

  const ellipsisElems = [name, permissions, avatarTitle];
  ellipsisElems.forEach((val) => {
    if (isEllipsisActive(val)) {
      createToolTip(val, val.innerHTML);
    } else if (val._tippy) val._tippy.destroy();
  });
}

const lobbyObserver = new ResizeObserver((entries) => {
  for (const x of entries) {
    if (x.contentRect)
      adjustLobby(x.target.parentElement, x.contentRect.height);
  }
});

const playerObserver = new ResizeObserver((entries) => {
  for (const x of entries) {
    if (x.contentRect)
      adjustPlayer(x.target.parentElement, x.contentRect.height);
  }
});

function getLobbyName(lobby, stripRichText = true) {
  const name =
    lobby.lobbyName != "" ? lobby.lobbyName : `${lobby.lobbyHostName}'s Lobby`;
  if (stripRichText) return Converter.removeRichText(name);
  else return name;
}

async function createLobbies(signal) {
  let infoUpdated = false;
  const refreshBtn = document.getElementById("refreshButton");
  const lobbies = document.getElementById("lobbies");
  lobbies.replaceChildren();
  let lobbyList = structuredClone(allLobbies);
  let lobbyCountMax = lobbyList.length;
  let allowed = hideLobbies(false);

  const sort = getSettingValue("sort");
  let sorted = false;
  if (sort) {
    const s = sorting.find((x) => x.name == sort);
    if (s) {
      s.callback(
        lobbyList,
        getSettingValue("sortOrder") != "Descending" ? 2 : 1,
      );
      sorted = true;
    }
  }
  if (!sorted) sorting.find((x) => x.name == "Players").callback(lobbyList, 2);

  let players = 0;
  let steam = 0;
  let epic = 0;
  let allPlayers = 0;
  lobbyList.forEach((val) => {
    if (val.lobbyPlatform == "Steam") steam++;
    else if (val.lobbyPlatform == "Epic") epic++;
    allPlayers += Number(val.playerCount);
    if (allowed.includes(val.lobbyID)) players += Number(val.playerCount);
  });

  document.getElementById("steamCount").textContent = steam;
  document.getElementById("epicCount").textContent = epic;
  setLobbyCount(allowed.length, lobbyCountMax);
  setPlayerCount(players, allPlayers);

  if (lobbyList.length == 0) {
    lobbyNotice(
      "No Lobbies Found",
      "There are currently no lobbies available!",
      "fas fa-face-frown",
      "--flb-gray-color",
    );
  } else if (allowed.length == 0) {
    lobbyNotice(
      "All Lobbies Filtered Out",
      "Seems like you set the wrong filters!",
      "fas fa-face-frown",
      "--flb-gray-color",
      false,
    );
  }

  let inLobby = [];
  let lobbiesWithFriends = [];
  lobbyList.forEach((x) => {
    const filtered = x.playerList.players.filter((y) =>
      friendIDs.some((x) => x == String(y.platformID)),
    );
    if (filtered && filtered.length > 0) {
      lobbiesWithFriends.push(x);
      filtered.forEach((y) => {
        inLobby.push({
          id: String(y.platformID),
          lobbyName: getLobbyName(x, false),
          lobbyCode: x.lobbyCode,
          lobbyPlatform: x.lobbyPlatform,
          lobbyID: x.lobbyID,
        });
      });
    }
  });
  setFriendsInLobby(inLobby);

  console.log(
    `Creating %c${lobbyList.length}%c %s`,
    "color: #0ff",
    "color: inherit",
    "lobbies",
  );

  let prioritized = [];
  if (isToggleChecked("prioritizeLobbiesWithFriends"))
    prioritized = lobbiesWithFriends;
  else if (isToggleChecked("prioritizeFriendsOnlyLobbies"))
    prioritized = lobbyList.filter((x) => x.privacy == 2);

  if (prioritized && prioritized.length > 0) {
    const sort = getSettingValue("sort");
    let sorted = false;
    if (sort) {
      const s = sorting.find((x) => x.name == sort);
      if (s) {
        s.callback(
          prioritized,
          getSettingValue("sortOrder") != "Descending" ? 2 : 1,
        );
        sorted = true;
      }
    }
    if (!sorted)
      sorting.find((x) => x.name == "Players").callback(prioritized, 2);
  }

  const shouldUpdate = infoView != -1;

  let count = 0;
  for (let i = 0; i < prioritized.length; i++) {
    if (signal?.signal?.aborted == true) return;
    count++;
    const lobby = prioritized[i];
    setContent(refreshBtn, `Loading (${count} of ${lobbyList.length})`);

    if (containsWord(lobby, blacklist)) {
      console.log(
        "%c > Lobby name contains blacklisted word, ignoring: " +
          Converter.removeRichText(lobby.lobbyName),
        "color: #f00",
      );
      continue;
    }

    if (await createLobby(lobby, signal, !allowed.includes(lobby.lobbyID)))
      infoUpdated = true;
  }

  const other = lobbyList.filter(
    (x) => !prioritized.some((y) => y.lobbyID == x.lobbyID),
  );
  for (let i = 0; i < other.length; i++) {
    if (signal?.signal?.aborted == true) return;
    count++;
    const lobby = other[i];
    setContent(refreshBtn, `Loading (${count} of ${lobbyList.length})`);

    if (containsWord(lobby, blacklist)) {
      console.log(
        "%c > Lobby name contains blacklisted word, ignoring: " +
          Converter.removeRichText(lobby.lobbyName),
        "color: #f00",
      );
      continue;
    }

    if (await createLobby(lobby, signal, !allowed.includes(lobby.lobbyID)))
      infoUpdated = true;
  }

  if (infoUpdated == false && shouldUpdate) hideShow(true);
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

  let _friends = [];
  let friendsTooltip = "";

  if (lobby.privacy == 2) friendsTooltip = "[Friends Only]<br />";

  lobby.playerList.players.forEach((y) => {
    if (friendIDs.some((x) => String(y.platformID) == String(x))) {
      _friends.push(String(y.platformID));
      const n = getName(y).name.trim();
      friendsTooltip += `<p class="playerTooltip">${n}</p>"}`;
    }
  });

  if (isToggleChecked("highlightFriends"))
    lobbyElem.setAttribute("hasFriend", _friends.length > 0);

  if (_friends.length > 0) {
    const friendsElem = lobbyElem.getElementsByClassName("lobbyFriends")[0];
    if (friendsElem) {
      friendsElem.classList.remove("hidden");
      if (lobby.privacy == 2) {
        friendsElem.getElementsByClassName("textIcon")[0].className =
          "textIcon fas fa-user-lock";
      }
      setContent(friendsElem, _friends.length);
      createToolTip(friendsElem, friendsTooltip, "bottom", "100vw");
    }
  }
  lobbyElem.setAttribute("platform", lobby.lobbyPlatform);
  const icon = lobbyElem.getElementsByClassName("platformIcon")[0];
  icon.className = "";
  icon.classList.add("platformIcon");
  if (lobby.lobbyPlatform == "Steam") {
    icon.classList.add("fa-brands");
    icon.classList.add("fa-steam");
  } else {
    icon.classList.add("fa-custom");
    icon.classList.add("fa-epicgames");
  }
  createToolTip(icon, `ID: ${lobby.lobbyID}`);

  const levelTitle = lobbyElem.getElementsByClassName("levelTitle")[0];

  function verifyNSFW(x) {
    if (thumb.nsfw == true && isToggleChecked("hideNSFWLobbies")) {
      hidden = true;
      lobbyElem.setAttribute("filteredout", true);
    }
    censorModTitle(levelTitle, lobby.levelModID, lobby.levelTitle, x.nsfw);
  }

  const thumb = setThumbnail(
    lobbyElem.getElementsByClassName("lobbyThumbnail")[0],
    lobby.levelModID,
    lobby.levelTitle,
    lobby.levelBarcode,
    false,
  );
  thumb.then(verifyNSFW);

  if (infoView != -1 && infoView == lobby.lobbyID) {
    infoUpdated = true;
    if (signal?.signal?.aborted != true)
      displayInfo(lobby, new AbortController());
  }
  lobbyElem.setAttribute("lobbyId", lobby.lobbyID);
  const lobbyName = lobbyElem.getElementsByClassName("lobbyName")[0];
  lobbyObserver.observe(lobbyName);
  lobbyName.innerHTML = convert(getLobbyName(lobby, false));

  const player = lobby.playerList.players.find(
    (val) => val.platformID == lobby.lobbyID,
  );
  let name;
  if (player) name = getName(player).name;
  else name = convert(lobby.lobbyHostName);

  const hostName = lobbyElem.getElementsByClassName("lobbyHostName")[0];
  setContent(hostName, name);
  if (!hidden)
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
  setContent(playerCount, `(${lobby.playerCount}/${lobby.maxPlayers})`);
  if (lobby.playerCount >= lobby.maxPlayers) {
    playerCount.classList.add("fullLobby");
    connectBtn.classList.add("blocked");
    connectBtn.disabled = true;
  } else {
    playerCount.classList.add("availableLobby");
    connectBtn.classList.remove("blocked");
    connectBtn.disabled = false;
  }

  let tooltip = "";
  const players = structuredClone(lobby.playerList.players);
  players.sort((first, second) => {
    if (second.platformID == lobby.lobbyID) return 100;

    if (first.platformID == lobby.lobbyID) return -100;

    return parseInt(second.permissionLevel) - parseInt(first.permissionLevel);
  });
  for (const p of players) {
    const n = getName(p).name.trim();
    tooltip += `<p class="playerTooltip">${n}</p>`;
  }

  createToolTip(playerCount, tooltip, "bottom", "100vw");

  joinInfo(connectBtn);

  const infoBtn = lobbyElem.getElementsByClassName("infoButton")[0];

  connectBtn.onclick = async () => await onConnect(connectBtn, lobby);

  infoBtn.onclick = async () => {
    infoView = lobby.lobbyID;

    enableInfoButton(false);
    const iSignal = new AbortController();
    try {
      await displayInfo(lobby, iSignal);
    } finally {
      enableInfoButton(true);
    }
  };
  if (showingInfo) setButton(infoBtn, false);

  lobbyElem.setAttribute("filteredout", hidden);
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
  return e.clientHeight < e.scrollHeight || e.offsetWidth < e.scrollWidth;
}

function createToolTip(e, content, placement = "top", maxWidth = 350) {
  if (e._tippy) e._tippy.setProps({ content: content });

  e._tippy = tippy(e, {
    content: content,
    animation: "scale",
    appendTo: "parent",
    interactive: true,
    placement: placement,
    allowHTML: true,
    maxWidth: maxWidth,
    theme: "website",
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
    const btns = lobby.getElementsByClassName("infoButton");
    if (btns && btns.length > 0) setButton(btns[0], enabled);
  }
}

async function displayInfo(lobby, signal) {
  if (containsWord(lobby, blacklist)) return;
  if (infoSignal) infoSignal.abort();
  showingInfo = true;
  try {
    const start = Date.now();
    console.log(
      ` > Displaying more info for %c${lobby.lobbyID}`,
      "color: #0f0",
    );

    infoSignal = signal;
    infoView = lobby.lobbyID;

    hideShow(false);

    const content = document.getElementById("info-content");
    const right = content.getElementsByClassName("right-content")[0];
    const left = content.getElementsByClassName("left-content")[0];
    const thumb = left.getElementsByClassName("thumbnail")[0];
    const description = right.getElementsByClassName("lobbyDescription")[0];

    let _thumbnail;
    function verifyNSFW(x) {
      _thumbnail = x;
      censorModTitle(
        header.getElementsByClassName("level")[0],
        lobby.levelModID,
        lobby.levelTitle,
        x.nsfw,
      );
    }

    const thumbnail = setThumbnail(
      thumb,
      lobby.levelModID,
      lobby.levelTitle,
      lobby.levelBarcode,
      false,
    );
    thumbnail.then(verifyNSFW);

    const lobbyInfo = document.getElementById("info");
    lobbyInfo.setAttribute("uptime", Number(lobby.lobbyUptime));
    const header = lobbyInfo.getElementsByClassName("header")[0];
    document.getElementById("info-title").innerHTML = convert(
      getLobbyName(lobby, false),
    );

    setContent(
      header.getElementsByClassName("version")[0],
      `v${lobby.lobbyVersion}`,
    );

    censorModTitle(
      header.getElementsByClassName("level")[0],
      lobby.levelModID,
      lobby.levelTitle,
      _thumbnail.nsfw ?? false,
    );

    const gamemode = header.getElementsByClassName("gamemode")[0];

    const icon = gamemode.getElementsByTagName("i");
    if (icon && icon.length > 0) icon.item(0).remove();
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
      let displayName =
        val.name ??
        String(val.entry).charAt(0).toUpperCase() + String(val.entry).slice(1);
      const item = document.createElement("p");
      const level = perms.get(lobby[val.entry]);
      item.classList.add(`permission-${level}`);
      item.classList.add("permissionItem");
      if (val.icon) {
        const icon = getIconElem(val.icon);
        item.appendChild(icon);
        const cont = document.createElement("span");
        cont.classList.add("elemContent");
        cont.textContent = displayName;
        item.appendChild(cont);
      } else {
        item.textContent = displayName;
      }
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
      if (signal?.signal?.aborted == true) break;

      console.log(`  > Creating player %c${player.platformID}`, "color: #0f0");

      const toCopy = document.getElementById("playerToCopy");
      const playerElem = toCopy.cloneNode(true);
      playerElem.removeAttribute("id");

      let avatar =
        player.avatarTitle && player.avatarTitle != ""
          ? convert(player.avatarTitle)
          : "N/A";
      const avatarTitle = playerElem.getElementsByClassName("avatarTitle")[0];

      let thumbRes;
      function verifyNSFW(x) {
        thumbRes = x;
        censorModTitle(avatarTitle, player.avatarModID, avatar, thumb.nsfw);
      }

      const thumb = setThumbnail(
        playerElem.getElementsByClassName("avatarThumbnail")[0],
        player.avatarModID,
        player.avatarTitle,
        player.avatarTitle,
        true,
      );
      thumb.then(verifyNSFW);

      const name = getName(player);
      const nameElem = playerElem.getElementsByClassName("name")[0];
      nameElem.innerHTML = convert(name.name);
      const perms = colorPermission(player.permissionLevel);
      const permsElem = playerElem.getElementsByClassName("permissions")[0];
      permsElem.classList.add(perms.class);
      setContent(permsElem, perms.text);
      if (player.platformID == lobby.lobbyID) {
        const icon = permsElem.getElementsByClassName("textIcon")[0];
        icon.setAttribute("class", "fas fa-crown textIcon");
      }

      playerElem
        .getElementsByClassName("profile")[0]
        .addEventListener("click", async () => {
          const html = await createPlayerView(
            player,
            thumbRes,
            lobby.lobbyPlatform,
          );
          Swal.fire({
            title: "",
            html: html,
            showCloseButton: true,
            showDenyButton: true,
            focusConfirm: false,
            confirmButtonText: '<i class="fas fa-x"></i> Close',
            denyButtonText: '<i class="fas fa-flag"></i> Report',
            theme: adjustTheme(),
            width: "30em",
          }).then((x) => {
            if (x.isDenied)
              window.open(
                `https://docs.google.com/forms/d/e/1FAIpQLScGK73O2jhOQOXtfHFahOrMZeuVfjYlKbdDPupaifjLGG_QMA/viewform?entry.1722663242=${Converter.removeRichText(player.username)}&entry.1219785058=${player.platformID}`,
              );
          });
        });

      playerObserver.observe(avatarTitle);

      avatarTitle.innerHTML = avatar;
      playerElem.setAttribute("playerId", player.platformID);
      if (signal?.signal?.aborted == true) break;

      playersList.appendChild(playerElem);
      const time = (Date.now() - plrStart) / 1000;
      console.log(
        `  > Created player %c${player.platformID}%c (${time.toFixed(4)}s)`,
        "color: #0f0",
        "color: #0ff",
      );
    }
    playersList.childNodes.forEach((x) => {
      if (x.tagName.toLowerCase() == "div" && !x.hasAttribute("playerId"))
        x.remove();
    });
    playersList.childNodes.forEach((x) => {
      if (x.tagName.toLowerCase() == "div") x.classList.remove("hidden");
    });
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

async function createPlayerView(player, thumbnail, platform) {
  const toCopy = document.getElementById("playerViewToCopy");
  const view = toCopy.cloneNode(true);
  view.removeAttribute("id");
  const name = getName(player);
  if (thumbnail && thumbnail.thumbnail && thumbnail.alt) {
    const thumb = view.getElementsByClassName("viewThumbnail")[0];
    thumb.src = thumbnail.thumbnail;
    thumb.alt = thumbnail.alt;
  } else {
    thumb.classList.add("hidden");
  }
  view.getElementsByClassName("playerDisplayName")[0].innerHTML = convert(
    name.name,
  );
  view.getElementsByClassName("playerUsername")[0].innerHTML = convert(
    player.username ?? "N/A",
  );

  let avatar =
    player.avatarTitle && player.avatarTitle != ""
      ? convert(player.avatarTitle)
      : "N/A";
  censorModTitle(
    view.getElementsByClassName("playerAvatar")[0],
    player.avatarModID,
    avatar,
    thumbnail.nsfw,
  );
  view.getElementsByClassName("playerId")[0].textContent =
    `(${player.platformID})`;
  view.getElementsByClassName("playerDescription")[0].innerHTML = convert(
    (player.description != ""
      ? player.description
      : "No description provided"
    ).replace("\n", "<br>"),
  );
  if (platform == "Steam") {
    const req = await getProfile(player.platformID);
    if (req && !req.error) {
      const avatar = view.getElementsByClassName("steamAvatar")[0];
      avatar.setAttribute("src", req.avatarFullUrl);
      const indicator = view.getElementsByClassName("statusIndicator")[0];
      indicator.setAttribute(
        "class",
        `statusIndicator status${req.userStatus}`,
      );
      const numToStatus = new Map(statuses);
      const status = numToStatus.get(req.userStatus);
      if (status) {
        indicator.setAttribute("data-tippy-content", status);
      }
      const username = view.getElementsByClassName("steamUsername")[0];
      username.href = req.profileUrl;
      setContent(username, convert(req.nickname));
      if (req.countryCode)
        username
          .getElementsByClassName("textIcon")[0]
          .setAttribute("class", `fi fi-${req.countryCode.toLowerCase()}`);
      else
        username.getElementsByClassName("textIcon")[0].classList.add("hidden");
      if (req.accountCreatedDate && req.profileVisibility == 3) {
        const date = new Date(req.accountCreatedDate);
        var yyyy = date.getFullYear();
        var mm = date.getMonth() + 1;
        var dd = date.getDate();
        view.getElementsByClassName("steamAdditionalInfo")[0].textContent =
          `Created on: ${dd}-${mm}-${yyyy}`;
      } else {
        view
          .getElementsByClassName("steamAdditionalInfo")[0]
          .classList.add("hidden");
      }
    }
  } else {
    view.getElementsByClassName("steamProfile")[0].classList.add("hidden");
    view.getElementsByClassName("steamDetail")[0].classList.add("hidden");
  }

  const html = view.outerHTML;
  view.remove();
  return html;
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

function lobbyNotice(
  title,
  description,
  icon = "fas fa-xmark",
  colorVariable = "--flb-gray-color",
  removeLobbies = true,
) {
  const lobbies = document.getElementById("lobbies");
  const notices = lobbies.getElementsByClassName("notice");
  if (removeLobbies) lobbies.replaceChildren();
  if (notices && notices.length > 0) {
    for (const n of notices) n.remove();
  }
  const toCopy = document.getElementById("noticeToCopy");
  const notice = toCopy.cloneNode(true);
  notice.removeAttribute("id");
  const _icon = notice.getElementsByClassName("noticeIcon")[0];
  const _title = notice.getElementsByClassName("noticeTitle")[0];
  const _description = notice.getElementsByClassName("noticeDescription")[0];
  const classes = icon.split(" ");
  classes.forEach((x) => _icon.classList.add(x));
  _title.textContent = title;
  _description.textContent = description;
  notice.style.color = `var(${colorVariable})`;
  lobbies.appendChild(notice);
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
  return DOMPurify.sanitize(converter.unity2html(text));
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

let processed = [];

async function getThumbnail(modId, title, barcode, isAvatar) {
  while (processed.some((x) => x.modId == modId || x.barcode == barcode))
    await delay(50);

  const obj = {
    modId: modId,
    barcode: barcode,
  };

  processed.push(obj);

  if (modId == -1 || modId == 0 || modId == null) {
    const value = barcodes.find(
      (x) =>
        x.barcode == barcode ||
        barcode?.startsWith(x.name) == true ||
        x.name == barcode,
    );
    if (value) {
      const index = processed.indexOf(obj);
      if (index > -1) processed.splice(index, 1);

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
      const index = processed.indexOf(obj);
      if (index > -1) processed.splice(index, 1);
      return {
        thumbnail: cacheItem.src,
        alt: `The thumbnail of ${isAvatar ? "an avatar" : "a level"} titled '${title}'`,
        nsfw: cacheItem.isNSFW,
      };
    }
    const response = await fetch(
      THUMBNAIL.replace("[host]", HOST)
        .replace("[modId]", modId)
        .replace("[barcode]", barcode),
    );
    if (!response.ok) {
      const index = processed.indexOf(obj);
      if (index > -1) processed.splice(index, 1);
      return { error: await response.text(), status: response.status };
    }
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
    const index = processed.indexOf(obj);
    if (index > -1) processed.splice(index, 1);
    return res;
  } catch (ex) {
    console.error(ex);
    const index = processed.indexOf(obj);
    if (index > -1) processed.splice(index, 1);
    return {
      error:
        "Failed to get thumbnail due to the request failing, check console for more details",
    };
  }
}

function delay(millisec) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, millisec);
  });
}

async function setThumbnail(elem, modId, title, barcode, isAvatar) {
  const spinners =
    elem.parentElement.getElementsByClassName("thumbnailSpinner");
  let spinner;
  if (spinners && spinners.length > 0) spinner = spinners[0];
  elem.setAttribute("fetchpriority", "high");
  elem.addEventListener("error", function () {
    const alt = Converter.removeRichText(
      `The thumbnail of ${isAvatar ? "an avatar" : "a level"} titled '${title}'. An error occurred while loading, so an error was displayed instead`,
    );
    elem.setAttribute("src", "images/errorThumbnail.webp");
    elem.setAttribute("alt", alt);
  });

  var thumbnail = await getThumbnail(modId, title, barcode, isAvatar);
  if (thumbnail.error != null) {
    if (thumbnail.status == 404) {
      const alt = Converter.removeRichText(
        `The thumbnail of ${isAvatar ? "an avatar" : "a level"} titled '${title}'. The thumbnail was not found, so a placeholder was displayed instead`,
      );
      spinner?.classList?.add("hidden");
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
    spinner?.classList?.add("hidden");
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
    spinner?.classList?.add("hidden");
    elem.setAttribute("src", "images/nsfwCover.webp");
    elem.setAttribute("alt", alt);
    return {
      thumbnail: "images/nsfwCover.webp",
      alt: alt,
      nsfw: true,
    };
  } else {
    spinner?.classList?.add("hidden");
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
  const elem = document.getElementsByClassName("lobbyTitle")[0];
  if (count == -1) {
    elem.textContent = "Lobbies (0)";
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

function setPlayerCount(filteredPlayers, allPlayers) {
  const playerCount = document.getElementById("playerCount");
  if (filteredPlayers == allPlayers) playerCount.textContent = filteredPlayers;
  else playerCount.textContent = `${filteredPlayers}/${allPlayers}`;
}

async function getJSON() {
  try {
    const response = await fetch(LOBBY_LIST.replace("[host]", HOST), {
      credentials: "include",
    });
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
    let encoded = btoa(JSON.stringify({ code: code, layer: layer }));

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

function timePassed(input, returnAfterFirst = true) {
  const date = input instanceof Date ? input : new Date(input);
  let time = Date.now() / 1000 - date;
  let string;
  for (let key in timeRanges) {
    if (timeRanges[key].min < Math.abs(time)) {
      const val = time / timeRanges[key].min;
      time = time % timeRanges[key].min;
      const str = `${returnAfterFirst ? Math.round(val) : Math.floor(val)}${timeRanges[key].symbol}`;
      if (returnAfterFirst) {
        return str;
      } else {
        if (!string) string = str;
        else string += ` ${str}`;
      }
    }
  }
  return string ?? "0s";
}

function isToggleChecked(id) {
  return getSettingValue(id) == true || getSettingValue(id) == "true";
}

function getAllowedIDs(lobbies) {
  let list = [];
  var filtered = filterWithSettings(structuredClone(lobbies));
  filterBadges();
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
  const notice = document
    .getElementById("lobbies")
    .getElementsByClassName("notice");
  if (list.length > 0 && notice.length > 0) notice[0].remove();
  else if (list.length == 0 && notice.length == 0) {
    lobbyNotice(
      "All Lobbies Filtered Out",
      "Seems like you set the wrong filters!",
      "fas fa-face-frown",
      "--flb-gray-color",
      false,
    );
  }
  return list;
}

async function updateFilters() {
  if (!allLobbies) return;

  let lobbyCountMax = allLobbies.length;

  let lobbies = hideLobbies();
  setLobbyCount(lobbies, lobbyCountMax);

  let players = 0;
  let allPlayers = 0;
  allLobbies.forEach((val) => {
    allPlayers += Number(val.playerCount);
    if (lobbies.includes(val.lobbyID)) players += Number(val.playerCount);
  });

  setLobbyCount(lobbies.length, lobbyCountMax);
  setPlayerCount(players, allPlayers);

  filterBadges();
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
adjustTheme();

if (document.readyState !== "loading") init();
else window.addEventListener("DOMContentLoaded", init);

window.addEventListener("displayInfo", async (e) => {
  if (e.detail && e.detail.lobbyID) {
    const lobby = allLobbies.find(
      (x) => String(x.lobbyID) == String(e.detail.lobbyID),
    );
    if (lobby) {
      infoView = lobby.lobbyID;

      const iSignal = new AbortController();
      enableInfoButton(false);
      try {
        await displayInfo(lobby, iSignal);
      } finally {
        enableInfoButton(true);
      }
    }
  }
});

async function init() {
  adjustTheme();
  console.log("Window has been loaded");
  document.getElementById("javascriptRequired").classList.add("hidden");

  settingsInit();
  createGamemodes();
  addEventListener("theme", adjustTheme);
  const params = new URLSearchParams(window.location.search);
  if (params.has(LOBBY_PARAM)) {
    const num = params.get(LOBBY_PARAM);
    if (num) infoView = num;
  }

  if (
    window.location.hostname == "hoodrp.com" ||
    window.location.hostname == "www.hoodrp.com" ||
    SIMULATE_HOODRP
  )
    activateHoodRpMode();

  collapsableMenus();

  // Do not require lobby list to be created again

  settingsEvent();

  // Require the lobby list to be created again
  filterEvent("prioritizeLobbiesWithFriends", true);
  filterEvent("prioritizeFriendsOnlyLobbies", true);
  filterEvent("highlightFriends", true);
  filterEvent("censorNSFW", true);
  filterEvent("sort", true);
  filterEvent("sortOrder", true);
  filterEvent("hideNSFWLobbies", true);

  clickEvent("refreshButton", async () => await fetchAndCreateLobbies());
  clickEvent("info-close", () => hideShow(true));
  clickEvent("settingsButton", openSettings);
  clickEvent("settingsClose", closeSettings);
  clickEvent("hotak0CurseButton", initCurse);
  joinInfo(document.getElementById("info-connect"));

  uptimeContainer = document.querySelector(".uptime-container");
  uptimeContent = document.querySelector(".uptime-content");

  tippy(document.getElementById("info").getElementsByClassName("uptime")[0], {
    content: uptimeContainer,
    animation: "scale",
    appendTo: "parent",
    interactive: true,
    placement: "bottom",
    allowHTML: true,
    theme: "website",
    onShow: () => {
      uptimeContainer.appendChild(uptimeContent);
    },
    onHidden: () => {
      document.getElementById("info-header").appendChild(uptimeContent);
    },
  });

  const lucky = Math.round(73 / 10);
  const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  // fuck you
  const r = Math.round(getRandomNumber(1, 25));
  if (r == lucky)
    document.getElementById("hotak0CurseButton").classList.remove("hidden");

  updateTime();

  console.log("[Init] Creating lobbies");
  fullyLoaded = true;

  fetchAndCreateLobbies();
}

function createGamemodes() {
  for (const g of gamemodes) {
    addSetting({
      id: `gamemode_${!g.barcode || g.barcode == "" ? "Lakatrazz.Sandbox" : g.barcode}`,
      category: "Gamemodes",
      type: "filter",
      name: g.title ? Converter.removeRichText(g.title) : "Sandbox",
      icon: g && g.icon ? g.icon : "fas fa-puzzle-piece",

      lobbyFilter: true,
      filterValue: false,
      lobbyValidator: (lobby) => {
        return lobby.gamemodeBarcode == g.barcode;
      },

      defaultValue: { include: false, exclude: false },
    });
  }
}

function activateHoodRpMode() {
  HOST = "https://api.hoodrp.com/";
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "styles/hoodrp.css";
  document.head.appendChild(link);
}

// i was forced to do this at exactly 00:47:30 AM by an individual that goes by the name Jack Baker
// i do not bear any responsibility for the possible trauma or any other issues
// fuck you jack baker
function initCurse() {
  document.getElementById("yourecursedgoodluck").classList.remove("hidden");
  document.getElementsByClassName("istfg")[0].classList.remove("hidden");

  document.getElementsByTagName("title")[0].textContent =
    "uh oh you angered the thing!";
  var fuckyouevenmorejackbaker = new Audio("hotak0/sounds/hotak0_ambience.mp3");
  fuckyouevenmorejackbaker.play();
  fuckyouevenmorejackbaker.loop = true;
  looped(fuckyouevenmorejackbaker);
}

async function looped(_audio) {
  while (true) {
    var audio = new Audio("hotak0/sounds/youangeredthething.ogg");
    audio.play();
    audio.volume = Math.random();
    _audio.volume = Math.random();

    await new Promise((r) => setTimeout(r, 500));
  }
}

function joinInfo(btn) {
  createToolTip(
    btn,
    'To join, you must have the <a class="modLink" href="https://github.com/FusionLobbyBrowser/Mod/releases/latest" target="_blank" rel="noopener noreferrer">mod</a> (>= 1.1.0 version) installed and have launched the game at least once since installation',
  );
}

function openSettings() {
  document.getElementById("popupBackground").classList.remove("hidden");
  document.getElementById("settings").classList.add("open");
}

function closeSettings() {
  document.getElementById("popupBackground").classList.add("hidden");
  document.getElementById("settings").classList.remove("open");
}

function clickEvent(id, callback) {
  document.getElementById(id).addEventListener("click", callback);
}

function adjustTheme() {
  const darkMode =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
  const isDarkMode = darkMode && darkMode.matches;

  const val = localStorage.getItem(`setting_theme`);
  let v;
  if (!val) v = isDarkMode ? "dark" : "light";
  else v = val == "systemPreference" ? (isDarkMode ? "dark" : "light") : val;
  document.getElementsByTagName("html")[0].setAttribute("theme", v);
  return v;
}

async function updateTime() {
  const refresh = document.getElementById("refresh");
  while (true) {
    timeAgoElem(refresh);

    const info = document.getElementById("info");
    if (info.hasAttribute("uptime") && uptimeContent) {
      const uptime = info.getElementsByClassName("uptime")[0];
      const t = Number(info.getAttribute("uptime"));
      setContent(uptime, timePassed(t));

      uptimeContent.innerHTML = DOMPurify.sanitize(
        `${timePassed(t, false)}<br>Discovered: ${new Date(t * 1000).toLocaleString()}`,
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
  elem.textContent = val;
  if (val == "N/A") elem.removeAttribute("date");
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
