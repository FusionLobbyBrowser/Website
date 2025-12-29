import { Converter } from "./unityRichText.js";
import DOMPurify from "./purify.es.mjs";
import Barcodes from "./defaultBarcodes.js";

const HOST = "https://fusionapi.hahoos.dev/";
const LOBBY_LIST = `${HOST}lobbylist`;
const THUMBNAIL = `${HOST}thumbnail/`;

const PROFANITY_LIST =
  "https://raw.githubusercontent.com/Lakatrazz/Fusion-Lists/refs/heads/main/profanityList.json";

const HTTP_JOIN = "http://localhost:25712/join?code=[code]&layer=SteamVR";

let allLobbies;

let moreInfoView = -1;

let refreshInterval = 10;

let lobbiesSignal;
let moreInfoSignal;

let profanities = [];

async function createLobbies() {
  try {
    if (lobbiesSignal) lobbiesSignal.abort();
    const controller = new AbortController();
    lobbiesSignal = controller;
    const refreshBtn = document.getElementById("refreshButton");
    const refresh = document.getElementById("refresh");
    const highLobby = document.getElementById("lobbyLimit");
    try {
      refreshBtn.classList.remove("blocked");
      refreshBtn.classList.add("inProgress");
      refreshBtn.textContent = "Refresh";
      refreshBtn.blocked = true;

      const lobbies = document.getElementById("lobbies");
      lobbies.replaceChildren();
      const json = await getJSON();
      const error = document.getElementsByClassName("error")[0];
      if (json.error != null) {
        if (!(await isLobbyOnline())) {
          error.textContent = "Server is offline, try again later.";
        } else {
          error.textContent = json.error;
        }
        error.classList.remove("hidden");

        refresh.removeAttribute("date");
        refresh.textContent = "Last Refresh: N/A";
        refresh.classList.add("hidden");

        highLobby.classList.add("hidden");

        setLobbyCount(-1);
        setPlayerCount(-1, -1);
        hideShow(true);
      } else {
        error.classList.add("hidden");

        if (json.interval) refreshInterval = parseInt(json.interval);

        if (json.date != null) {
          refresh.setAttribute("date", json.date);
          const date = Date.parse(json.date);
          refresh.textContent = "Last Refresh: " + timeSince(date);
          refresh.classList.remove("hidden");
        } else {
          refresh.removeAttribute("date");
          refresh.textContent = "Last Refresh: N/A";
          refresh.classList.add("hidden");
        }

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
              parseInt(second.playerCount) - parseInt(first.playerCount)
          );
          if (sorting != "descending") lobbies.reverse();

          setLobbyCount(lobbyCount, lobbyCountMax);
          setPlayerCount(json.playerCount.players, json.playerCount.lobbies);

          if (lobbies.length == 0)
            document.getElementById("notFound").classList.remove("hidden");
          else document.getElementById("notFound").classList.add("hidden");

          for (const lobby of lobbies) {
            if (controller?.signal?.aborted == true) return;
            if (
              await createLobby(
                lobby,
                controller?.signal,
                !allowed.includes(lobby.lobbyId)
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
        await refreshButton(Date.parse(refresh.getAttribute("date")));
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
  }
}

async function refreshButton(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const button = document.getElementById("refreshButton");
  if (seconds >= refreshInterval) {
    button.disabled = false;
    button.classList.remove("blocked");
    button.textContent = "Refresh";
    autoRefresh();
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
    document.getElementById("autoRefresh").checked
  )
    await createLobbies();
}

async function createLobby(lobby, signal, hidden) {
  let moreInfoUpdated = false;
  const lobbies = document.getElementById("lobbies");
  const hiddenLobby = document.getElementsByClassName("lobbyToCopy")[0];

  const lobbyElem = hiddenLobby.cloneNode(true);
  lobbyElem.classList.remove("lobbyToCopy");
  if (hidden) lobbyElem.classList.add("hidden");
  else lobbyElem.classList.remove("hidden");
  const thumb = await setThumbnail(
    lobbyElem.getElementsByClassName("lobbyThumbnail")[0],
    lobby.levelModId,
    lobby.levelBarcode,
    false
  );

  if (moreInfoView != -1 && moreInfoView == lobby.lobbyId) {
    moreInfoUpdated = true;
    if (signal?.aborted != true) await moreInfo(lobby, thumb, signal);
  }
  lobbyElem.setAttribute("lobbyId", lobby.lobbyId);
  lobbyElem.getElementsByClassName("lobbyName")[0].innerHTML = convert(
    lobby.lobbyName != "" ? lobby.lobbyName : `${lobby.lobbyHostName}'s Lobby`
  );
  lobbyElem.getElementsByClassName("lobbyHostName")[0].innerHTML = convert(
    lobby.lobbyHostName
  );
  censorModTitle(
    lobbyElem.getElementsByClassName("levelTitle")[0],
    lobby.levelModId,
    lobby.levelTitle,
    thumb.nsfw
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
    moreInfoView = lobby.lobbyId;

    setAllLobbiesMoreInfo(false);
    try {
      await moreInfo(lobby, thumb, signal);
    } finally {
      setAllLobbiesMoreInfo(true);
    }
  };

  if (signal?.aborted != true) lobbies.appendChild(lobbyElem);
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

  var controller = new AbortController();
  moreInfoSignal = controller;
  moreInfoView = lobby.lobbyId;
  const lobbyInfo = document.getElementById("moreDetails");
  const header = lobbyInfo.getElementsByClassName("header")[0];
  header.getElementsByClassName("lobbyTitle")[0].innerHTML = convert(
    lobby.lobbyName != "" ? lobby.lobbyName : `${lobby.lobbyHostName}'s Lobby`
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
      "<br>"
    )
  );

  censorModTitle(
    right.getElementsByClassName("levelTitle")[0],
    lobby.levelModId,
    lobby.levelTitle,
    thumbnail.nsfw
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

  const playersList = lobbyInfo.getElementsByClassName("playersGrid")[0];
  playersList.replaceChildren();
  const players = lobby.playerList.players;
  players.sort((first, second) => {
    if (second.longId == lobby.lobbyId) return 100;

    if (first.longId == lobby.lobbyId) return -100;

    return parseInt(second.permissionLevel) - parseInt(first.permissionLevel);
  });
  for (const player of players) {
    if (
      (!player.username || player.username == "") &&
      (!player.nickname || player.nickname == "")
    )
      continue;
    if (controller?.signal?.aborted == true) return;

    const toCopy = document.getElementsByClassName("playerToCopy")[0];
    const playerElem = toCopy.cloneNode(true);
    const thumb = await setThumbnail(
      playerElem.getElementsByClassName("avatarThumbnail")[0],
      player.avatarModId,
      player.avatarTitle,
      true
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
      player.avatarModId,
      avatar,
      thumb.nsfw
    );
    playerElem.classList.remove("playerToCopy");
    playerElem.setAttribute("playerId", player.longId);
    if (signal?.aborted == true || controller?.signal?.aborted == true) return;
    playersList.appendChild(playerElem);
  }
  lobbyInfo.setAttribute("lobbyId", lobby.lobbyId);
  hideShow(false);
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

function hideShow(hide) {
  const elements = [
    "#moreDetails",
    "#moreDetails-outer",
    ".content",
    ".playersTitle",
    ".playersGrid",
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
  if (hide) {
    lobbyInfo.removeAttribute("lobbyId");
    moreInfoView = -1;
  }
}

async function getThumbnail(modId, search, isAvatar) {
  if (modId == -1 || modId == 0 || modId == null) {
    const value = Barcodes.find(
      (x) =>
        x.barcode == search ||
        search?.startsWith(x.name) == true ||
        x.name == search
    );
    if (value) {
      return {
        thumbnail: `/images/default/${value.name}.png`,
        nsfw: false,
      };
    } else {
      return {
        thumbnail: `/images/default/${
          isAvatar ? "Mods_Avatar" : "Mods_Level"
        }.png`,
        nsfw: false,
      };
    }
  }

  try {
    const response = await fetch(THUMBNAIL + modId);
    if (!response.ok) return { error: await response.text() };
    return {
      thumbnail: URL.createObjectURL(await response.blob()),
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

async function setThumbnail(elem, modId, search, isAvatar) {
  var thumbnail = await getThumbnail(modId, search, isAvatar);
  if (thumbnail.error != null) {
    elem.setAttribute("src", "images/errorThumbnail.png");
    return {
      thumbnail: "images/errorThumbnail.png",
      nsfw: false,
    };
  } else if (
    thumbnail.nsfw == true &&
    !document.getElementById("showNSFW").checked
  ) {
    elem.setAttribute("src", "images/nsfwCover.png");
    return {
      thumbnail: "images/nsfwCover.png",
      nsfw: true,
    };
  } else {
    elem.src = thumbnail.thumbnail;
    return thumbnail;
  }
}

function modRedirect(id, name) {
  if (id == -1) return name;

  return `<a class="levelRedirect" href="https://mod.io/search/mods/${id}" target="_blank" rel="noopener noreferrer"">${convert(
    name
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
  document.getElementsByClassName(
    "playerCount"
  )[0].textContent = `${players} players`;
  document.getElementsByClassName(
    "lobbyCount"
  )[0].textContent = `${lobbies} lobbies`;

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

    return await response.json();
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
    if (!response.ok) window.location.replace(`bonelab-flb://SteamVR-${code}/`);
  } catch (ex) {
    console.error(ex);
    window.location.replace(`bonelab-flb://SteamVR-${code}/`);
  }
  window.alert(
    "You don't join a lobby when you pressed the button? Install the mod (link on the page, press the red 'mod' text). Have the mod already and cant join? Create an issue on github!"
  );
}

// https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
// To be fair I could have done it myself, but I'm not really familiar with the language
function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

function filterLobbies(lobbies) {
  if (!document.getElementById("showFullLobbies").checked)
    lobbies = lobbies.filter((i) => i.playerCount != i.maxPlayers);

  if (!document.getElementById("showOnePlayerLobbies").checked)
    lobbies = lobbies.filter((i) => i.playerCount > 1);

  const rpStrings = ["hood", "rp", "war", "roleplay"];
  if (!document.getElementById("showRPLobbies").checked) {
    lobbies = lobbies.filter((i) => {
      if (!i || i == "") return true;
      let found = false;
      for (const s of rpStrings) {
        const iName = Converter.removeRichText(i.lobbyName);
        if (iName.toLowerCase().includes(s.toLowerCase())) {
          found = true;
          break;
        }
      }
      return !found;
    });
  }

  return lobbies;
}

function getAllowedIDs(lobbies) {
  let list = [];
  var filtered = filterLobbies(structuredClone(lobbies));
  filtered.forEach((x) => {
    list.push(x.lobbyId);
  });
  return list;
}

function hideLobbies() {
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
  let lobbyCountMax = allLobbies.length;

  let lobbies = hideLobbies();
  setLobbyCount(lobbies, lobbyCountMax);
}

async function loadProfanities() {
  try {
    const res = await fetch(PROFANITY_LIST);
    if (res.ok) {
      const json = await res.json();
      for (const word of json.words) profanities.push(word);
    }
  } catch (ex) {
    console.error(ex);
  }
}

window.addEventListener("load", async (e) => {
  hideShow(true);
  document
    .getElementById("showFullLobbies")
    .addEventListener("change", async () => await updateFilters());
  document
    .getElementById("showOnePlayerLobbies")
    .addEventListener("change", async () => await updateFilters());
  document
    .getElementById("showRPLobbies")
    .addEventListener("change", async () => await updateFilters());
  document
    .getElementById("showNSFW")
    .addEventListener("change", async () => await createLobbies());
  document
    .getElementById("sortOrder")
    .addEventListener("change", async () => await createLobbies());
  document
    .getElementById("filterProfanities")
    .addEventListener("change", async () => await createLobbies());
  document
    .getElementById("refreshButton")
    .addEventListener("click", async () => await createLobbies());
  document
    .getElementById("closeMoreInfo")
    .addEventListener("click", () => hideShow(true));
  updateTime();
  await loadProfanities();
  await createLobbies();
});

async function updateTime() {
  const refresh = document.getElementById("refresh");
  while (true) {
    if (refresh.hasAttribute("date")) {
      const date = Date.parse(refresh.getAttribute("date"));
      refresh.textContent = "Last Refresh: " + timeSince(date);
      refresh.classList.remove("hidden");

      await refreshButton(date);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
