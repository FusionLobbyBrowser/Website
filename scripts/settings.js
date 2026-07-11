import { Converter } from "./unityRichText.js";
import { barcodes } from "./const.js";
import { getSelf, getFriends, getProfile } from "./steam.js";
import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js@7.4.1/dist/fuse.min.mjs";

// Is this overkill? probably

// To get value changed event, listen for event "onsettingchanged" on window

export let friends = [];

let friendListElem;
let friendsCancel;

let categories = [
  {
    name: "General",
    icon: "fa-solid fa-house",
    expanded: true,
  },
  {
    name: "Groups",
    icon: "fa-solid fa-book",
    expanded: false,
  },
  {
    name: "Platforms",
    icon: "fa-solid fa-computer",
    expanded: true,
  },
  {
    name: "Players",
    icon: "fa-solid fa-users",
    expanded: false,
  },
  {
    name: "Level",
    icon: "fa-solid fa-map",
    expanded: false,
  },
  {
    name: "Gamemodes",
    icon: "fa-solid fa-puzzle-piece",
    expanded: false,

    sort: true,
    sortMode: "filterTotalCount",
    sortOrder: 1,
  },
  {
    name: "Filtering",
    icon: "fa-solid fa-shield-halved",
    expanded: false,
  },
  {
    name: "Steam Friends",
    icon: "fa-brands fa-steam",
    expanded: false,
    customHandler: async (container) => {
      if (friendsCancel) friendsCancel.abort();
      const controller = new AbortController();
      friendsCancel = controller;

      const list = container.getElementsByTagName("div")[0];
      friendListElem = list;
      list.classList.add("friendsContainer");

      const toCopy = document.getElementById("friendToCopy");
      const order = [6, 1, 4, 2, 3, 0, 5];

      let seconds = 0;
      function counter() {
        seconds++;
        if (seconds >= 30) create();
      }

      async function create(ignore = false) {
        if (!ignore) {
          if (document.hidden || !document.hasFocus()) return;
        }
        if (controller?.aborted == true) {
          clearInterval(counter);
          return;
        }
        seconds = 0;

        const self = await getSelf();
        if (!self) {
          notice(
            list,
            "Not Logged In!",
            "You need to log in with Steam to view friends list!",
            "fas fa-arrow-right-to-bracket",
          );
          return;
        }
        friends = await getFriends(String(self.steamId));
        if (friends == false) {
          friends = [];
          notice(
            list,
            "Friends List Not Public!",
            "You must set your steam friends list to be public!",
            "fas fa-xmark",
            "--flb-error-color",
          );
          return;
        } else if (!friends) {
          notice(
            list,
            "Failed!",
            "Failed to fetch friends list",
            "fas fa-xmark",
            "--flb-error-color",
          );
          return;
        }

        const sorted = structuredClone(friends);
        sorted.forEach((f) => {
          if (f.playingGameName && f.playingGameName != "") f.userStatus = 6;
        });
        sorted.sort(
          (a, b) =>
            order.findIndex((x) => x == a.userStatus) -
            order.findIndex((x) => x == b.userStatus),
        );
        sorted.forEach((f) => {
          let elem = list.querySelector(`div[steamid="${f.steamId}"]`);
          if (!elem) elem = toCopy.cloneNode(true);
          elem.removeAttribute("id");
          elem.setAttribute("steamid", String(f.steamId));
          elem
            .getElementsByClassName("friendAvatar")[0]
            .setAttribute("src", f.avatarUrl);
          elem.getElementsByClassName("friendUsername")[0].textContent =
            f.nickname;
          const additionalInfo = elem.getElementsByClassName(
            "steamAdditionalInfo",
          )[0];
          const inLobby = friendsLobbies.find(
            (x) => String(x.id) == String(f.steamId),
          );
          if (!inLobby) {
            additionalInfo.style.color = window
              .getComputedStyle(toCopy)
              .getPropertyValue(`--flb-status${f.userStatus}-color`);
            elem.style.order = order.findIndex((x) => x == f.userStatus) + 1;
          } else {
            elem.setAttribute("overridenInfo", "true");
            elem.style.order = 0;
            additionalInfo.style.color = window
              .getComputedStyle(toCopy)
              .getPropertyValue(`--flb-status6-color`);
            additionalInfo.innerHTML = `Playing in a lobby - ${inLobby.lobbyName}`;
          }

          let status;
          switch (f.userStatus) {
            case 0:
              status = "Offline";
              break;
            case 1:
              status = "Online";
              break;
            case 2:
              status = "Busy";
              break;
            case 3:
              status = "Away";
              break;
            case 4:
              status = "AFK...";
              break;
            case 6:
              status = `Playing a game${f.playingGameName && f.playingGameName != "" ? ` - ${f.playingGameName}` : ""}`;
              break;
            default:
              status = "Unknown status";
              break;
          }

          if (!inLobby) additionalInfo.textContent = status;

          elem.setAttribute("userStatus", f.userStatus);
          elem.setAttribute("infoText", status);

          list.appendChild(elem);
        });
        list.childNodes.forEach((x) => {
          if (
            !friends.find(
              (f) => String(f.steamId) == String(x.getAttribute("steamid")),
            )
          )
            x.remove();
        });
      }
      create(true);

      setInterval(counter, 1000);
    },
  },
];

const RP_LEVELS = [
  "T0x1c.HoodCorner.Level.GmHoodCornerDay",
  "T0x1c.HoodCorner.Level.GmHoodCornerNight",
  "T0x1c.RPSouthside.Level.RPSouthside",
  "jiggy.gmnightlight.Level.gmdaylight",
  "jiggy.gmnightlight.Level.gmnightlight",
  "Cheezy.HoodCorner.Level.GmHoodCorner",
  "SoldierThree57.rpdowntowntiny.Level.rpdowntowntinynight",
  "SoldierThree57.rpdowntowntiny.Level.rpdowntowntinyday",
];

export let settings = [
  // General
  {
    id: "searchField",
    category: "General",
    type: "search",
    name: "Search",
    icon: "fa-solid fa-magnifying-glass",
    defaultValue: "",
    filterValue: (s, val) => val && val.length > 0,
    lobbyFilter: true,
    lobbyValidator: (lobby, val) => {
      const name =
        lobby.lobbyName != ""
          ? lobby.lobbyName
          : `${lobby.lobbyHostName}'s Lobby`;
      const fuse = new Fuse([Converter.removeRichText(name.toLowerCase())], {
        threshold: 0.35,
      });
      const res = fuse.search(val);
      return !res || res.length < 1;
    },
    setFilterName: false,
    saveToStorage: false,
  },
  {
    id: "sort",
    name: "Sort Mode",
    category: "General",
    type: "select",
    displayLabel: false,
    values: [
      {
        name: "Alphabetical",
        icon: "fas fa-arrow-down-a-z",
      },
      {
        name: "Players",
        icon: "fas fa-people-group",
      },
      {
        name: "Uptime",
        icon: "fas fa-clock",
      },
    ],
    defaultValue: "Players",
  },
  {
    id: "sortOrder",
    name: "Sort Order",
    category: "General",
    type: "select",
    displayLabel: false,
    values: [
      {
        name: "Ascending",
        icon: "fas fa-arrow-up",
      },
      {
        name: "Descending",
        icon: "fas fa-arrow-down",
      },
    ],
    defaultValue: "Descending",
  },
  {
    id: "theme",
    name: "Theme",
    category: "General",
    type: "select",
    icon: "fas fa-fill-drip",
    values: [
      {
        name: "System Preference",
        id: "systemPreference",
        icon: "fas fa-computer",
      },
      {
        name: "Dark",
        id: "dark",
        icon: "fas fa-moon",
      },
      {
        name: "Light",
        id: "light",
        icon: "fas fa-sun",
      },
    ],
    defaultValue: "systemPreference",
  },
  {
    id: "autoRefresh",
    category: "General",
    type: "toggle",
    name: "Auto Refresh",
    icon: "fa-solid fa-arrows-rotate fa-spin",
    defaultValue: false,
  },
  {
    id: "highlightFriends",
    category: "General",
    type: "toggle",
    name: "Highlight Lobbies /w Friends",
    icon: "fa-solid fa-star",
    defaultValue: true,
  },
  // Groups
  {
    id: "roleplayLobbies",
    category: "Groups",
    type: "toggle",
    name: "Roleplay",
    icon: "fa-solid fa-briefcase",

    lobbyFilter: true,
    filterValue: false,
    filterWords: [
      "hood",
      "hoodrp",
      "shooting",
      "shooter",
      "rp",
      "war",
      "roleplay",
    ],
    filterLevels: RP_LEVELS,

    defaultValue: true,
  },
  {
    id: "hoodLobbies",
    category: "Groups",
    type: "toggle",
    name: "Hood RP",
    icon: "fa-solid fa-person-rifle",

    lobbyFilter: true,
    filterValue: false,
    filterWords: ["hood", "hoodrp"],
    filterLevels: RP_LEVELS,

    defaultValue: true,
  },
  {
    id: "russianLobbies",
    category: "Groups",
    type: "toggle",
    name: "Russian",
    icon: "fi fis fi-ru",

    lobbyFilter: true,
    filterValue: false,
    filterWords: ["russian", "russia", "rus", "russ", "russi", "russkie", "ru"],

    defaultValue: true,
  },
  {
    id: "horrorLobbies",
    category: "Groups",
    type: "toggle",
    name: "Horror",
    icon: "fa-solid fa-ghost",

    lobbyFilter: true,
    filterValue: false,
    filterWords: [
      "horror",
      "monster",
      "survive",
      "killer",
      "hide and seek",
      "hide & seek",
      "hideseek",
      "hideandseek",
      "hide n seek",
    ],

    defaultValue: true,
  },
  {
    id: "backroomsLobbies",
    category: "Groups",
    type: "toggle",
    name: "Backrooms",
    icon: "fa-solid fa-biohazard",

    lobbyFilter: true,
    filterValue: false,
    filterWords: ["backrooms", "backroom"],
    filterLevels: [
      "0gravity.BackroomsEntropy.Level.BackroomsEntropy",
      "HombresGuapos.TheBackroomsA24.Level.TheBackroomsA24",
    ],

    defaultValue: true,
  },
  {
    id: "otherLobbies",
    category: "Groups",
    type: "toggle",
    name: "Other",
    icon: "fa-solid fa-plus",

    lobbyFilter: true,
    filterValue: false,
    lobbyValidator: (lobby) => {
      for (const x of settings) {
        if (x.category != "Groups") continue;

        if (!x.filterWords) continue;
        if (isGroup(lobby, x.filterWords)) return false;
      }
      return true;
    },

    defaultValue: true,
  },
  // Platforms
  {
    id: "steamPlatform",
    category: "Platforms",
    type: "toggle",
    name: "Steam",
    icon: "fa-brands fa-steam",

    lobbyFilter: true,
    filterValue: false,
    lobbyValidator: (lobby) => {
      return lobby.lobbyPlatform == "Steam";
    },

    defaultValue: true,
  },
  {
    id: "epicPlatform",
    category: "Platforms",
    type: "toggle",
    name: "Epic Games",
    icon: "fa-custom fa-epicgames",

    lobbyFilter: true,
    filterValue: false,
    lobbyValidator: (lobby) => {
      return lobby.lobbyPlatform == "Epic";
    },

    defaultValue: false,
  },
  // Levels
  {
    id: "vanillaLevels",
    category: "Level",
    type: "toggle",
    name: "Vanilla",
    icon: "fas fa-map-location-dot",

    lobbyFilter: true,
    filterValue: false,
    lobbyValidator: (lobby) => {
      return barcodes.find((x) => x.barcode == lobby.levelBarcode);
    },

    defaultValue: true,
  },
  {
    id: "moddedLevels",
    category: "Level",
    type: "toggle",
    name: "Modded",
    icon: "fas fa-wrench",

    lobbyFilter: true,
    filterValue: false,
    lobbyValidator: (lobby) => {
      return !barcodes.find((x) => x.barcode == lobby.levelBarcode);
    },

    defaultValue: true,
  },
  // Players
  {
    id: "playerCount",
    category: "Players",
    type: "range",
    name: "Player Count",
    icon: "fa-solid fa-people-arrows",

    filterValue: (s, val) =>
      val &&
      val.min &&
      val.max &&
      !(val.min == s.minValue && val.max == s.maxValue),
    lobbyFilter: true,
    setFilterName: false,
    lobbyValidator: (lobby, val) => {
      return lobby.playerCount < val.min || lobby.playerCount > val.max;
    },

    minValue: 1,
    maxValue: 20,
    step: 1,

    defaultValue: { min: 1, max: 20 },
    storeAsJSON: true,
  },
  {
    id: "fullLobbies",
    category: "Players",
    type: "toggle",
    icon: "fa-solid fa-users-viewfinder",
    name: "Full Lobbies",

    lobbyFilter: true,
    filterValue: false,
    lobbyValidator: (lobby) => {
      return lobby.playerCount == lobby.maxPlayers;
    },

    defaultValue: false,
  },
  // Filtering
  {
    id: "censorNSFW",
    category: "Filtering",
    type: "toggle",
    name: "Censor NSFW",
    icon: "fa-solid fa-lock",
    defaultValue: true,
  },
  {
    id: "censorProfanities",
    category: "Filtering",
    type: "toggle",
    name: "Censor Profanities",
    icon: "fa-solid fa-hand-middle-finger",
    defaultValue: true,
  },
];

let types = [
  {
    type: "toggle",
    callback: (setting, value) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("checkbox-wrapper");
      const input = document.createElement("input");
      input.setAttribute("type", "checkbox");
      input.setAttribute("name", setting.name);
      input.setAttribute("id", getElemId(setting.id));
      if (value == "true" || value == true) input.setAttribute("checked", true);
      let old = input.checked;
      input.addEventListener("change", () => {
        wrapper.dispatchEvent(
          new CustomEvent("onsettingchanged", {
            detail: { old: old, new: input.checked },
          }),
        );
        old = input.checked;
      });
      const label = document.createElement("label");
      label.setAttribute("for", getElemId(setting.id));
      fillLabel(setting, label);

      wrapper.appendChild(input);
      if (setting.displayLabel != false) wrapper.appendChild(label);
      return wrapper;
    },
    overrideCached: (value) => {
      if (value == "true" || value == true) return true;
      else return false;
    },
    setTitle: (elem, title) => setContent(elem.querySelector("label"), title),
    setValue: (elem, val) => {
      const input = elem?.getElementsByTagName("input");
      if (input && input.length > 0) {
        let _val;
        if (val == "true" || val == true) _val = true;
        else _val = false;
        input[0].checked = _val;
      }
    },
  },
  {
    type: "select",
    callback: (setting, value) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("selectWrapper");
      const label = document.createElement("label");
      label.setAttribute("for", getElemId(setting.id));
      label.classList.add("selectLabel");
      fillLabel(setting, label);
      if (setting.displayLabel != false) {
        wrapper.appendChild(label);
        const br = document.createElement("br");
        wrapper.appendChild(br);
      }

      const select = document.createElement("select");
      select.setAttribute("name", getElemId(setting.id));
      select.setAttribute("aria-label", setting.name);
      select.setAttribute("id", getElemId(setting.id));

      const btn = document.createElement("button");
      btn.appendChild(document.createElement("selectedcontent"));
      select.appendChild(btn);

      setting.values.forEach((val) => {
        const option = document.createElement("option");
        if (isString(val)) setOption(option, val, val);
        else setOption(option, val.id, val.name, val.icon);

        select.appendChild(option);
      });
      select.value = value;
      let old = select.value;
      select.addEventListener("change", () => {
        wrapper.dispatchEvent(
          new CustomEvent("onsettingchanged", {
            detail: { old: old, new: select.value },
          }),
        );
        old = select.value;
      });

      wrapper.appendChild(select);
      return wrapper;
    },
    setTitle: (elem, title) => setContent(elem.querySelector("label"), title),
    setValue: (elem, val) => {
      const input = elem?.getElementsByTagName("select");
      if (input && input.length > 0) input[0].value = val;
    },
  },
  {
    type: "search",
    callback: (setting, value) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("searchWrapper");

      const icon = document.createElement("i");
      icon.setAttribute("class", setting.icon);

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = setting.name;
      input.id = getElemId(setting.id);
      input.value = value;

      let old = input.value;
      input.addEventListener("change", () => {
        wrapper.dispatchEvent(
          new CustomEvent("onsettingchanged", {
            detail: { old: old, new: input.value },
          }),
        );
        old = input.value;
      });

      wrapper.appendChild(icon);
      wrapper.appendChild(input);
      return wrapper;
    },
    setTitle: (elem, title) => setContent(elem.querySelector("label"), title),
    setValue: (elem, val) => {
      const input = elem?.getElementsByTagName("input");
      if (input && input.length > 0) input[0].value = val;
    },
  },
  {
    type: "range",
    callback: (setting, value) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("rangeWrapper");

      const label = document.createElement("label");
      label.setAttribute("for", getElemId(setting.id));
      fillLabel(setting, label);
      if (setting.displayLabel != false) wrapper.appendChild(label);

      const container = document.createElement("div");
      container.classList.add("rangeInputs");
      wrapper.appendChild(container);

      const sliderBackground = document.createElement("div");
      sliderBackground.classList.add("sliderBackground");
      container.appendChild(sliderBackground);

      const sliderDiv = document.createElement("div");
      sliderDiv.classList.add("rangeSlider");
      sliderBackground.appendChild(sliderDiv);

      let min;
      let max;

      function sliderCallback() {
        if (!setting.baseName) setting.baseName = setting.name;
        const minVal = parseInt(min.value);
        const maxVal = parseInt(max.value);
        const n = `${setting.baseName} [${minVal} - ${maxVal}]`;
        setting.name = n;
        setSettingsTitle(setting.id, n);

        const left =
          ((minVal - setting.minValue) / (min.max - setting.minValue)) * 100;
        const right =
          100 -
          ((maxVal - setting.minValue) / (max.max - setting.minValue)) * 100;
        sliderDiv.style.left = `${left}%`;
        sliderDiv.style.right = `${right}%`;
      }

      function createSlider(_class, val) {
        const slider = document.createElement("input");
        slider.type = "range";
        slider.classList.add(_class);
        slider.min = setting.minValue ?? 0;
        slider.max = setting.maxValue ?? 10;
        slider.step = setting.step ?? 1;
        slider.value = value[val];

        let old = value;

        slider.addEventListener("input", () => {
          sliderCallback();
          wrapper.dispatchEvent(
            new CustomEvent("onsettingchanged", {
              detail: {
                old: old,
                new: { min: parseInt(min.value), max: parseInt(max.value) },
              },
            }),
          );
          old = { min: parseInt(min.value), max: parseInt(max.value) };
        });
        return slider;
      }

      min = createSlider("minRange", "min");
      max = createSlider("maxRange", "max");

      container.appendChild(min);
      container.appendChild(max);

      sliderCallback();

      return wrapper;
    },
    setTitle: (elem, title) => setContent(elem.querySelector("label"), title),
    setValue: (elem, val) => {
      const input = elem?.getElementsByTagName("select");
      if (input && input.length > 0) input[0].value = val;
    },
  },
];

// Sort Order
// 1 - Descending
// 2 - Ascending

const categorySorts = [
  {
    name: "alphabetical",
    callback: (_settings, order) => {
      _settings.sort((a, b) =>
        (settings[a].baseName ?? settings[a].name)
          .toLowerCase()
          .localeCompare(
            (settings[b].baseName ?? settings[b].name).toLowerCase(),
          ),
      );
      if (order == 2) _settings.reverse();
      return _settings;
    },
  },
  {
    name: "filterTotalCount",
    callback: (_settings, order) => {
      _settings.sort(
        (a, b) =>
          parseInt(settings[b].totalCount ?? 0) -
          parseInt(settings[a].totalCount ?? 0),
      );
      if (order == 2) _settings.reverse();
      return _settings;
    },
  },
  {
    name: "filterCurrentCount",
    callback: (_settings, order) => {
      _settings.sort(
        (a, b) =>
          parseInt(settings[b].currCount ?? 0) -
          parseInt(settings[a].currCount ?? 0),
      );
      if (order == 2) _settings.reverse();
      return _settings;
    },
  },
];

let settingsValues = [];
let eventListeners = [];

let friendsLobbies = [];

function notice(
  div,
  title,
  description,
  icon = "fas fa-xmark",
  colorVariable = "--flb-gray-color",
) {
  const notices = div.getElementsByClassName("notice");
  if (notices && notices.length > 0) for (const n of notices) n.remove();

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
  notice.style.color = window
    .getComputedStyle(toCopy)
    .getPropertyValue(colorVariable);
  div.appendChild(notice);
}

export function setFriendsInLobby(friends) {
  friendsLobbies = friends;
  const order = [6, 1, 4, 2, 3, 0, 5];
  friendListElem.childNodes.forEach((x) => {
    const friend = friends.find((y) => y.id == x.getAttribute("steamid"));
    const additionalInfo = elem.getElementsByClassName(
      "steamAdditionalInfo",
    )[0];
    if (friend) {
      x.style.order = 0;
      additionalInfo.style.color = window
        .getComputedStyle(toCopy)
        .getPropertyValue(`--flb-status6-color`);
      additionalInfo.innerHTML = `Playing in a lobby - ${friend.lobbyName}`;
    } else if (x.hasAttribute("overridenInfo")) {
      additionalInfo.style.color = window
        .getComputedStyle(toCopy)
        .getPropertyValue(
          `--flb-status${Number(elem.getAttribute("userStatus"))}-color`,
        );
      elem.style.order = order.findIndex((x) => x == f.userStatus) + 1;
      additionalInfo.textContent = elem.getAttribute("infoText");
    }
  });
}

function setOption(option, id, name, icon) {
  option.setAttribute("value", id ?? name);
  if (icon) {
    option.appendChild(getIconElem(icon));

    const content = document.createElement("span");
    content.classList.add("elemContent");
    content.textContent = name;
    option.appendChild(content);
  } else {
    option.textContent = name;
  }
}

function isString(val) {
  return typeof val === "string" || val instanceof String;
}

export function getIconElem(icon) {
  if (icon.startsWith("img:")) {
    const img = document.createElement("i");
    img.classList.add("gamemodeIcon");
    img.style.backgroundImage = `url(${icon.substring(4, icon.length)})`;
    return img;
  } else {
    const _icon = document.createElement("i");
    _icon.setAttribute("class", `textIcon ${icon}`);
    return _icon;
  }
}

function fillLabel(setting, elem) {
  if (setting.icon) {
    elem.appendChild(getIconElem(setting.icon));

    const content = document.createElement("span");
    content.classList.add("elemContent");
    content.textContent = setting.name;
    elem.appendChild(content);
  } else {
    elem.textContent = setting.name;
  }
}

function isGroup(lobby, array) {
  if (!lobby || !lobby.lobbyName || lobby.lobbyName == "") return false;

  const iName = Converter.removeRichText(lobby.lobbyName);
  const words = removeSymbols(iName).split(" ");
  for (const s of array) {
    if (!s) return;

    if (!s.includes(" ")) {
      for (const w of words) {
        if (w.toLowerCase() == removeSymbols(s).toLowerCase()) return true;
      }
    } else {
      if (removeSymbols(iName).toLowerCase().trim().includes(s.toLowerCase()))
        return true;
    }
  }

  return false;
}

function removeSymbols(text) {
  return text.replace(/[^a-zA-Z0-9]/gm, " ");
}

function createCategory(category) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("collapsable");
  wrapper.classList.add("settingsCategory");
  wrapper.setAttribute("id", getCategoryId(category));
  const button = document.createElement("button");
  button.classList.add("textButton");
  if (category.expanded) button.classList.add("collapsed");
  button.addEventListener("click", () => {
    button.classList.toggle("collapsed");
  });
  const title = document.createElement("h2");
  title.innerHTML = getCategoryText(category);
  const div = document.createElement("div");

  wrapper.appendChild(button);
  button.appendChild(title);
  wrapper.appendChild(div);

  return wrapper;
}

function setContent(elem, content) {
  const contents = elem.getElementsByClassName("elemContent");
  if (contents && contents.length > 0) {
    const span = contents[0];
    if (span) {
      span.textContent = content;
      return;
    }
  }

  elem.textContent = content;
}

export function init() {
  const settingsList = document.getElementById("settingsList");
  settingsList.replaceChildren();

  categories.forEach((val) => {
    const cat = createCategory(val);
    settingsList.appendChild(cat);
    if (!val.customHandler) {
      let index = [];
      settings.forEach((x, i) => {
        if (x.category == val.name) index.push(i);
      });
      if (val.sort && val.sortMode) {
        const order = categorySorts.find(
          (x) => x.name.toLowerCase() == val.sortMode.toLowerCase(),
        );
        if (order) index = order.callback(index, val.sortOrder);
      }

      for (const i of index) {
        const val = settings[i];
        const type = types.find((t) => t.type == val.type);
        if (type == null) {
          console.warn(`Setting '${val.id}' has unknown type: ${val.type}`);
          continue;
        }

        const saved = localStorage.getItem(getElemId(val.id));
        let _val;
        if (saved != null && saved != undefined) {
          try {
            if (!type.overrideCached)
              _val = val.storeAsJSON ? JSON.parse(saved) : saved;
            else _val = type.overrideCached(saved);
          } catch (ex) {
            console.error(
              "Failed to load value from storage, fallback to default (the stored one will be overwritten!)",
            );
            console.error(ex);
            _val = val.defaultValue;
          }
        } else {
          if (typeof val.defaultValue == "function") _val = val.defaultValue();
          else _val = val.defaultValue;
        }
        if (!val.initialValueSet) {
          setSetting(val.id, _val);
          val.initialValueSet = true;
        }

        const category = settingsList
          .querySelector(
            `#${getCategoryId(categories.find((x) => x.name == val.category))}`,
          )
          ?.getElementsByTagName("div")[0];
        if (category == null) {
          console.warn(
            `Setting '${val.id}' has unknown category: ${val.category}`,
          );
          continue;
        }

        const wrapper = type.callback(val, _val);
        if (wrapper == null) {
          console.warn(`Empty wrapper for setting '${val.id}'`);
          continue;
        }

        val.elem = wrapper;

        wrapper.addEventListener("onsettingchanged", (v) =>
          setSetting(val.id, v.detail.new, v.detail.old),
        );

        category.appendChild(wrapper);
      }
    } else {
      val.customHandler(cat);
    }
  });
}

export function setSetting(setting, value, old = null) {
  let index = settingsValues.findIndex((x) => x.id == setting);
  if (index == -1 || settingsValues[index].value != value) {
    const s = getSetting(setting);
    if (!s) return;

    if (s.saveToStorage != false)
      localStorage.setItem(
        getElemId(setting),
        s.storeAsJSON ? JSON.stringify(value) : value,
      );
    if (index != -1) settingsValues[index].value = value;
    else settingsValues.push({ id: setting, value: value });

    eventListeners.forEach((x) => {
      if (x.id == setting) x.callback(value);
    });

    const type = types.find((t) => t.type == s.type);
    if (type && type.setValue) type.setValue(s.elem, value);

    window.dispatchEvent(
      new CustomEvent("onsettingchanged", {
        detail: { id: setting, old: old, new: value },
      }),
    );
  }
}

export function getSettingValue(setting) {
  let index = settingsValues.findIndex((x) => x.id == setting);
  if (index != -1) return settingsValues[index].value;
  else return undefined;
}

export function getSetting(setting) {
  let index = settings.findIndex((x) => x.id == setting);
  if (index != -1) return settings[index];
  else return undefined;
}

export function setSettingsTitle(setting, title) {
  let index = settings.findIndex((x) => x.id == setting);
  if (index != -1) {
    const val = settings[index];
    if (!val.elem) return;
    settings[index].name = title;
    const type = types.find((t) => t.type == val.type);
    if (type && type.setTitle) type.setTitle(val.elem, title);
  }
}

export function addCategory(category) {
  if (!category || categories.find((x) => x.name == category.name)) return;
  categories.push(category);
  init();
}

export function removeCategory(categoryName) {
  if (!categoryName || !categories.find((x) => x.name == categoryName)) return;
  categories = categories.filter((x) => x.name != categoryName);
  init();
}

export function addSetting(setting) {
  if (!setting || settings.find((x) => x.id == setting.id)) return;
  settings.push(setting);
  init();
}

export function removeSetting(settingId) {
  if (!settingId || !settings.find((x) => x.id == settingId)) return;
  settings = settings.filter((x) => x.id != settingId);
  init();
}

export function filterWithSettings(lobbies) {
  const constValue = structuredClone(lobbies);
  for (const setting of settings) {
    if (!setting || !setting.lobbyFilter) continue;

    if (!setting.filterWords && !setting.lobbyValidator) continue;
    let filter = false;

    const val = getSettingValue(setting.id);
    if (typeof setting.filterValue == "function")
      filter = setting.filterValue(setting, val);
    else filter = setting.filterValue == val;

    if (filter) lobbies = lobbies.filter((i) => !isLobbyValid(setting, i));
  }

  for (const setting of settings) {
    if (!setting || !setting.lobbyFilter) continue;

    let total = 0;
    let curr = 0;

    if (!setting.filterWords && !setting.lobbyValidator) continue;

    if (setting.setFilterName != false) {
      constValue.forEach((element) => {
        if (isLobbyValid(setting, element)) total++;
      });

      lobbies.forEach((element) => {
        if (isLobbyValid(setting, element)) curr++;
      });
    }

    setting.totalCount = total;
    setting.currCount = curr;

    if (!setting.baseName) setting.baseName = setting.name;
    if (setting.setFilterName != false)
      setSettingsTitle(
        setting.id,
        `${setting.baseName} [${total == curr ? total : `${curr}/${total}`}]`,
      );
  }

  return lobbies;
}

// This is in reverse
export function isLobbyValid(setting, i) {
  if (isString(setting)) setting = getSetting(setting);
  if (!setting) return true;
  let valid = true;

  if (setting.filterWords && isGroup(i, setting.filterWords)) valid = false;
  if (
    setting.lobbyValidator &&
    setting.lobbyValidator(i, getSettingValue(setting.id))
  )
    valid = false;

  if (setting.filterLevels && setting.filterLevels.includes(i.levelBarcode))
    valid = false;

  return !valid;
}

export function addEventListener(id, callback) {
  eventListeners.push({ id: id, callback: callback });
}

function getElemId(setting) {
  return `setting_${setting}`;
}

function getCategoryText(category) {
  return `<i class="${category.icon} textIcon"></i>${category.name}`;
}

function getCategoryId(category) {
  return `category_${category?.name?.replace(" ", "")}`;
}
