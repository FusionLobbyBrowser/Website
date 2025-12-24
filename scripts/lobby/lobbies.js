import { Converter } from "../unity-rich-text/unityRichText.js";
import DOMPurify from "../dompurify/purify.es.mjs";

const HOST = "https://fusionapi.hahoos.dev/";
const LOBBY_LIST = `${HOST}lobbylist`;
const THUMBNAIL = `${HOST}thumbnail/`;

const HTTP_JOIN = "http://localhost:25712/join?code=[code]&layer=SteamVR";

let allLobbies;

let moreInfoView = -1;

let refreshInterval = 10;

var mappedBarcodes = [
  // Avatars
  {
    barcode: "fa534c5a83ee4ec6bd641fec424c4142.Avatar.Heavy",
    name: "Heavy",
  },
  {
    barcode: "fa534c5a83ee4ec6bd641fec424c4142.Avatar.Fast",
    name: "Fast",
  },
  {
    barcode: "fa534c5a83ee4ec6bd641fec424c4142.Avatar.CharFurv4GB",
    name: "Short",
  },
  {
    barcode: "fa534c5a83ee4ec6bd641fec424c4142.Avatar.CharTallv4",
    name: "Tall",
  },
  {
    barcode: "fa534c5a83ee4ec6bd641fec424c4142.Avatar.Strong",
    name: "Strong",
  },
  {
    barcode: "SLZ.BONELAB.Content.Avatar.Anime",
    name: "Light",
  },
  {
    barcode: "SLZ.BONELAB.Content.Avatar.CharJimmy",
    name: "Jay",
  },
  {
    barcode: "SLZ.BONELAB.Content.Avatar.FordBW",
    name: "Ford",
  },
  {
    barcode: "SLZ.BONELAB.Content.Avatar.CharFord",
    name: "Ford",
  },
  {
    barcode: "SLZ.BONELAB.Core.Avatar.PeasantFemaleA",
    name: "Peasant",
  },
  {
    barcode: "c3534c5a-10bf-48e9-beca-4ca850656173",
    name: "Peasant",
  },
  {
    barcode: "c3534c5a-2236-4ce5-9385-34a850656173",
    name: "Peasant",
  },
  {
    barcode: "c3534c5a-87a3-48b2-87cd-f0a850656173",
    name: "Peasant",
  },
  {
    barcode: "c3534c5a-f12c-44ef-b953-b8a850656173",
    name: "Peasant",
  },
  {
    barcode: "c3534c5a-3763-4ddf-bd86-6ca850656173",
    name: "Peasant",
  },
  {
    barcode: "SLZ.BONELAB.Content.Avatar.Nullbody",
    name: "Nullbody",
  },
  {
    barcode: "fa534c5a83ee4ec6bd641fec424c4142.Avatar.Charskeleton",
    name: "Skeleton",
  },
  {
    barcode: "c3534c5a-d388-4945-b4ff-9c7a53656375",
    name: "Security Guard",
  },
  {
    barcode: "c3534c5a-94b2-40a4-912a-24a8506f6c79",
    name: "PolyBlank",
  },
  // Maps
  {
    barcode: "c2534c5a-80e1-4a29-93ca-f3254d656e75",
    name: "Main Menu",
  },
  {
    barcode: "c2534c5a-4197-4879-8cd3-4a695363656e",
    name: "Descent",
  },
  {
    barcode: "c2534c5a-6b79-40ec-8e98-e58c5363656e",
    name: "BONELAB Hub",
  },
  {
    barcode: "c2534c5a-56a6-40ab-a8ce-23074c657665",
    name: "LongRun",
  },
  {
    barcode: "c2534c5a-54df-470b-baaf-741f4c657665",
    name: "Mine Dive",
  },
  {
    barcode: "c2534c5a-7601-4443-bdfe-7f235363656e",
    name: "Big Anomaly",
  },
  {
    barcode: "SLZ.BONELAB.Content.Level.LevelStreetPunch",
    name: "Street Puncher",
  },
  {
    barcode: "SLZ.BONELAB.Content.Level.SprintBridge04",
    name: "Sprint Bridge",
  },
  {
    barcode: "SLZ.BONELAB.Content.Level.SceneMagmaGate",
    name: "Magma Gate",
  },
  {
    barcode: "SLZ.BONELAB.Content.Level.MoonBase",
    name: "Moon Base",
  },
  {
    barcode: "SLZ.BONELAB.Content.Level.LevelKartRace",
    name: "Monogon Motorway",
  },
  {
    barcode: "c2534c5a-c056-4883-ac79-e051426f6964",
    name: "Pillar Climb",
  },
  {
    barcode: "SLZ.BONELAB.Content.Level.LevelBigAnomalyB",
    name: "Big Anomaly B",
  },
  {
    barcode: "c2534c5a-db71-49cf-b694-24584c657665",
    name: "Ascent",
  },
  {
    barcode: "fa534c5a868247138f50c62e424c4144.Level.VoidG114",
    name: "VoidG114",
  },
  {
    barcode: "c2534c5a-61b3-4f97-9059-79155363656e",
    name: "Baseline",
  },
  {
    barcode: "c2534c5a-2c4c-4b44-b076-203b5363656e",
    name: "Tuscany",
  },
  {
    barcode: "fa534c5a83ee4ec6bd641fec424c4142.Level.LevelMuseumBasement",
    name: "Museum Basement",
  },
  {
    barcode: "fa534c5a83ee4ec6bd641fec424c4142.Level.LevelHalfwayPark",
    name: "Halfway Park",
  },
  {
    barcode: "fa534c5a83ee4ec6bd641fec424c4142.Level.LevelGunRange",
    name: "Gun Range",
  },
  {
    barcode: "fa534c5a83ee4ec6bd641fec424c4142.Level.LevelHoloChamber",
    name: "HoloChamber",
  },
  {
    barcode: "fa534c5a83ee4ec6bd641fec424c4142.Level.LevelKartBowling",
    name: "Big Bone Bowling",
  },
  {
    barcode: "SLZ.BONELAB.Content.Level.LevelMirror",
    name: "Mirror",
  },
  {
    barcode: "c2534c5a-4f3b-480e-ad2f-69175363656e",
    name: "Neon District Tac Trial",
  },
  {
    barcode: "c2534c5a-de61-4df9-8f6c-416954726547",
    name: "Drop Pit",
  },
  {
    barcode: "c2534c5a-c180-40e0-b2b7-325c5363656e",
    name: "Tunnel Tipper",
  },
  {
    barcode: "fa534c5a868247138f50c62e424c4144.Level.LevelArenaMin",
    name: "Fantasy Arena",
  },
  {
    barcode: "c2534c5a-162f-4661-a04d-975d5363656e",
    name: "Container Yard",
  },
  {
    barcode: "c2534c5a-5c2f-4eef-a851-66214c657665",
    name: "Dungeon Warrior",
  },
  {
    barcode: "c2534c5a-c6ac-48b4-9c5f-b5cd5363656e",
    name: "Rooftops",
  },
  {
    barcode: "fa534c5a83ee4ec6bd641fec424c4142.Level.SceneparkourDistrictLogic",
    name: "Neon District Parkour",
  },
];

async function createLobbies() {
  const refreshBtn = document.getElementById("refreshButton");
  const refresh = document.getElementById("refresh");
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

      setLobbyCount(-1);
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
        lobbies = filterLobbies(lobbies);

        setLobbyCount(lobbies.length, lobbyCountMax);

        if (lobbies.length == 0)
          document.getElementById("notFound").classList.remove("hidden");
        else document.getElementById("notFound").classList.add("hidden");

        for (const lobby of lobbies) {
          if (await createLobby(lobby)) moreInfoUpdated = true;
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
      refreshButton(Date.parse(refresh.getAttribute("date")));
  }
}

function refreshButton(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const button = document.getElementById("refreshButton");
  if (seconds >= refreshInterval) {
    button.disabled = false;
    button.classList.remove("blocked");
    button.textContent = "Refresh";
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

async function createLobby(lobby) {
  let moreInfoUpdated = false;
  const lobbies = document.getElementById("lobbies");
  const hiddenLobby = document.getElementsByClassName("lobbyToCopy")[0];

  const lobbyElem = hiddenLobby.cloneNode(true);
  lobbyElem.classList.remove("lobbyToCopy");
  const thumb = await setThumbnail(
    lobbyElem.getElementsByClassName("lobbyThumbnail")[0],
    lobby.levelModId,
    lobby.levelBarcode,
    false
  );

  if (moreInfoView != -1 && moreInfoView == lobby.lobbyId) {
    moreInfoUpdated = true;
    await moreInfo(lobby, thumb);
  }
  lobbyElem.setAttribute("lobbyId", lobby.lobbyId);
  getChild(lobbyElem, "lobbyName").innerHTML = DOMPurify.sanitize(
    convertToHTML(
      lobby.lobbyName != "" ? lobby.lobbyName : `${lobby.lobbyHostName}'s Lobby`
    )
  );
  getChild(lobbyElem, "lobbyHostName").textContent = DOMPurify.sanitize(
    convertToHTML(lobby.lobbyHostName)
  );
  getChild(lobbyElem, "levelTitle").innerHTML = modRedirect(
    lobby.levelModId,
    lobby.levelTitle
  );

  getChild(lobbyElem, "gamemodeTitle").innerHTML =
    lobby.gamemodeBarcode != "" && lobby.gamemodeBarcode
      ? DOMPurify.sanitize(convertToHTML(lobby.gamemodeTitle))
      : "Sandbox";

  const playerCount = getChild(lobbyElem, "playerCount");
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

  connectBtn.addEventListener("click", async () => {
    setButton(connectBtn, false);
    try {
      await requestJoin(lobby.lobbyCode);
    } finally {
      setButton(connectBtn, true);
    }
  });

  moreInfoBtn.addEventListener("click", async () => {
    moreInfoView = lobby.lobbyId;

    setAllLobbiesMoreInfo(false);
    try {
      await moreInfo(lobby, thumb);
    } finally {
      setAllLobbiesMoreInfo(true);
    }
  });

  lobbies.appendChild(lobbyElem);
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

async function moreInfo(lobby, thumbnail) {
  moreInfoView = lobby.lobbyId;
  const lobbyInfo = document.getElementById("moreDetails");
  getChild(lobbyInfo, "lobbyName").innerHTML = DOMPurify.sanitize(
    convertToHTML(
      lobby.lobbyName != "" ? lobby.lobbyName : `${lobby.lobbyHostName}'s Lobby`
    )
  );
  const content = lobbyInfo.getElementsByClassName("content")[0];
  const right = content.getElementsByClassName("right-content")[0];
  const left = content.getElementsByClassName("left-content")[0];
  left.getElementsByClassName("thumbnail")[0].setAttribute("src", thumbnail);
  getChild(right, "lobbyDescription").innerHTML = DOMPurify.sanitize(
    convertToHTML(
      (lobby.lobbyDescription != "" ? lobby.lobbyDescription : "N/A").replace(
        "\n",
        "<br>"
      )
    )
  );
  getChild(right, "levelTitle").innerHTML = modRedirect(
    lobby.levelModId,
    lobby.levelTitle
  );

  getChild(right, "gamemode").innerHTML =
    lobby.gamemodeBarcode != "" && lobby.gamemodeBarcode
      ? DOMPurify.sanitize(
          `${convertToHTML(lobby.gamemodeTitle)} (${lobby.gamemodeBarcode})`
        )
      : "Sandbox";

  const playersTitle = lobbyInfo.getElementsByClassName("playersTitle")[0];
  playersTitle.innerHTML = DOMPurify.sanitize(
    `Players <span class="playerCount">(${lobby.playerCount}/${lobby.maxPlayers})</span>`
  );

  if (lobby.playerCount >= lobby.maxPlayers)
    playersTitle.getElementsByClassName("playerCount")[0].style.color =
      "#FF0000";
  else
    playersTitle.getElementsByClassName("playerCount")[0].style.color =
      "#00FF00";

  const host = lobbyInfo.getElementsByClassName("lobbyHost")[0];
  host.textContent = `Host: ${lobby.lobbyHostName}`;

  const playersList = lobbyInfo.getElementsByClassName("playersGrid")[0];
  playersList.replaceChildren();
  const players = lobby.playerList.players;
  players.sort(
    (first, second) =>
      parseInt(second.permissionLevel) - parseInt(first.permissionLevel)
  );
  for (const player of players) {
    const toCopy = document.getElementsByClassName("playerToCopy")[0];
    const playerElem = toCopy.cloneNode(true);
    await setThumbnail(
      playerElem.getElementsByClassName("avatarThumbnail")[0],
      player.avatarModId,
      player.avatarTitle,
      true
    );
    const hasNickname = player.nickname != "" && player.nickname;
    let name = hasNickname ? player.nickname : player.username;
    if (!player.nickname && !player.username) name = "N/A";
    if (name.includes("\n")) name = name.split("\n")[0];
    playerElem.getElementsByClassName("name")[0].innerHTML = DOMPurify.sanitize(
      convertToHTML(name)
    );
    const username = playerElem.getElementsByClassName("username")[0];
    if (hasNickname) {
      username.classList.remove("hidden");
      username.textContent = player.username;
    } else {
      username.classList.add("hidden");
    }
    playerElem.getElementsByClassName("permissions")[0].innerHTML =
      colorPermission(player.permissionLevel);
    let avatar =
      player.avatarTitle && player.avatarTitle != ""
        ? convertToHTML(player.avatarTitle)
        : "N/A";
    playerElem.getElementsByClassName("avatarTitle")[0].innerHTML = modRedirect(
      player.avatarModId,
      avatar
    );
    playerElem.classList.remove("playerToCopy");
    playerElem.setAttribute("playerId", player.longId);
    playersList.appendChild(playerElem);
  }
  lobbyInfo.setAttribute("lobbyId", lobby.lobbyId);
  hideShow(false);
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

  const lobbyInfo = document.getElementById("moreDetails");
  if (hide) lobbyInfo.removeAttribute("lobbyId");
}

async function getThumbnail(modId, search, isAvatar) {
  if (modId == -1 || modId == 0 || modId == null) {
    const value = mappedBarcodes.find(
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
    return "images/errorThumbnail.png";
  } else if (
    thumbnail.nsfw == true &&
    !document.getElementById("showNSFWThumbnails").checked
  ) {
    elem.setAttribute("src", "images/nsfwCover.png");
    return "images/nsfwCover.png";
  } else {
    elem.src = thumbnail.thumbnail;
    return thumbnail.thumbnail;
  }
}

function modRedirect(id, name) {
  if (id == -1) return name;

  return `<a class="levelRedirect" href="https://mod.io/search/mods/${id}" target="_blank" rel="noopener noreferrer"">${DOMPurify.sanitize(
    name
  )}</a>`;
}

function setLobbyCount(count, max) {
  const elem = document.getElementsByClassName("lobbyCount")[0];
  if (count == -1) {
    elem.classList.add("hidden");
  } else {
    elem.classList.remove("hidden");
    if (count == max) elem.textContent = `Lobbies (${count})`;
    else elem.textContent = `Lobbies (${count}/${max})`;
  }
}

function getChild(lobbyElem, field) {
  let elem = null;
  for (const child of lobbyElem.children) {
    if (child.hasAttribute("field") && child.getAttribute("field") == field) {
      elem = child;
      break;
    }
  }
  return elem;
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
  const sorting = document.getElementById("sortOrder").value;
  lobbies.sort(
    (first, second) =>
      parseInt(second.playerCount) - parseInt(first.playerCount)
  );
  if (sorting != "descending") lobbies.reverse();

  return lobbies;
}

async function updateFilters() {
  const lobbiesElems = document.getElementById("lobbies");
  lobbiesElems.replaceChildren();
  let lobbyCountMax = allLobbies.length;

  let lobbies = filterLobbies(structuredClone(allLobbies));
  setLobbyCount(lobbies.length, lobbyCountMax);

  for (const lobby of lobbies) await createLobby(lobby);
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
    .getElementById("showNSFWThumbnails")
    .addEventListener("change", async () => await updateFilters());
  document
    .getElementById("sortOrder")
    .addEventListener("change", async () => await updateFilters());
  document
    .getElementById("refreshButton")
    .addEventListener("click", async (e) => await createLobbies());
  updateTime();
  await createLobbies();
});

async function updateTime() {
  const refresh = document.getElementById("refresh");
  while (true) {
    if (refresh.hasAttribute("date")) {
      const date = Date.parse(refresh.getAttribute("date"));
      refresh.textContent = "Last Refresh: " + timeSince(date);
      refresh.classList.remove("hidden");

      refreshButton(date);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
