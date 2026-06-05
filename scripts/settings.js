import { Converter } from "./unityRichText.js";
import Barcodes from "./defaultBarcodes.js";
import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js@7.4.1/dist/fuse.min.mjs";

// Is this overkill? probably

// To get value changed event, listen for event "onsettingchanged" on window

let categories = [
  {
    name: "General",
    icon: "fa-solid fa-house",
    expanded: true,
  },
  {
    name: "Groups",
    icon: "fa-solid fa-book",
    expanded: true,
  },
  {
    name: "Platforms",
    icon: "fa-solid fa-computer",
    expanded: true,
  },
  {
    name: "Players",
    icon: "fa-solid fa-users",
    expanded: true,
  },
  {
    name: "Level",
    icon: "fa-solid fa-map",
    expanded: true,
  },
  {
    name: "Gamemodes",
    icon: "fa-solid fa-puzzle-piece",
    expanded: true,
  },
  {
    name: "Filtering",
    icon: "fa-solid fa-shield-halved",
    expanded: true,
  },
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
    category: "General",
    type: "select",
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
    category: "General",
    type: "select",
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
    id: "autoRefresh",
    category: "General",
    type: "toggle",
    name: "Auto Refresh",
    icon: "fa-solid fa-arrows-rotate fa-spin",
    defaultValue: false,
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
    filterWords: ["backrooms"],

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
      return Barcodes.find((x) => x.barcode == lobby.levelBarcode);
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
      return !Barcodes.find((x) => x.barcode == lobby.levelBarcode);
    },

    defaultValue: true,
  },
  // Players
  {
    id: "playerCount",
    category: "Players",
    type: "range",
    minValue: 1,
    maxValue: 100,
    name: "Player Count",
    defaultValue: [1, 100],
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
  {
    id: "emptyLobbies",
    category: "Players",
    type: "toggle",
    icon: "fa-solid fa-users-slash",
    name: "Empty Lobbies",

    lobbyFilter: true,
    filterValue: false,
    lobbyValidator: (lobby) => {
      return lobby.playerCount <= 1;
    },

    defaultValue: true,
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
      wrapper.appendChild(label);
      return wrapper;
    },
    overrideCached: (value) => {
      if (value == "true" || value == true) return true;
      else return false;
    },
    setTitle: (elem, title) => setContent(elem.querySelector("label"), title),
  },
  {
    type: "select",
    callback: (setting, value) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("selectWrapper");
      const label = document.createElement("label");
      label.setAttribute("for", getElemId(setting.id));
      fillLabel(setting, label);
      const select = document.createElement("select");
      select.setAttribute("name", getElemId(setting.id));
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
      wrapper.appendChild(label);
      return wrapper;
    },
    setTitle: (elem, title) => setContent(elem.querySelector("label"), title),
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
  },
];

let settingsValues = [];
let eventListeners = [];

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
  });

  for (const val of settings) {
    const type = types.find((t) => t.type == val.type);
    if (type == null) {
      console.warn(`Setting '${val.id}' has unknown type: ${val.type}`);
      continue;
    }

    const saved = localStorage.getItem(getElemId(val.id));
    let _val;
    if (saved != null && saved != undefined) {
      if (!type.overrideCached) _val = saved;
      else _val = type.overrideCached(saved);
    } else _val = val.defaultValue;
    setSetting(val.id, _val);

    const category = settingsList
      .querySelector(
        `#${getCategoryId(categories.find((x) => x.name == val.category))}`,
      )
      ?.getElementsByTagName("div")[0];
    if (category == null) {
      console.warn(`Setting '${val.id}' has unknown category: ${val.category}`);
      continue;
    }

    const wrapper = type.callback(val, _val);
    if (wrapper == null) {
      console.warn(`Empty wrapper for setting '${val.id}'`);
      continue;
    }

    val.elem = wrapper;

    wrapper.addEventListener("onsettingchanged", (v) => {
      setSetting(val.id, v.detail.new);
      eventListeners.forEach((x) => {
        if (x.id == val.id) x.callback(v.detail.new);
      });
      window.dispatchEvent(
        new CustomEvent("onsettingchanged", {
          detail: { id: val.id, old: v.detail.old, new: v.detail.new },
        }),
      );
    });

    category.appendChild(wrapper);
  }
}

export function setSetting(setting, value) {
  if (getSetting(setting)?.saveToStorage != false)
    localStorage.setItem(getElemId(setting), value);
  let index = settingsValues.findIndex((x) => x.id == setting);
  if (index != -1) settingsValues[index].value = value;
  else settingsValues.push({ id: setting, value: value });
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

    let count = 0;

    if (!setting.filterWords && !setting.lobbyValidator) continue;

    if (setting.setFilterName != false) {
      constValue.forEach((element) => {
        if (settingValidator(setting, element)) count++;
      });
    }

    let filter = false;

    const val = getSettingValue(setting.id);
    if (typeof setting.filterValue == "function")
      filter = setting.filterValue(setting, val);
    else filter = setting.filterValue == val;

    if (filter) lobbies = lobbies.filter((i) => !settingValidator(setting, i));

    if (!setting.baseName) setting.baseName = setting.name;
    if (setting.setFilterName != false)
      setSettingsTitle(setting.id, `${setting.baseName} [${count}]`);
  }
  return lobbies;
}

function settingValidator(setting, i) {
  if (setting.filterWords) return isGroup(i, setting.filterWords);
  else if (setting.lobbyValidator)
    return setting.lobbyValidator(i, getSettingValue(setting.id));
  else return null;
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
