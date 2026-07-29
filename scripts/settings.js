import { Converter } from "./unityRichText.js";
import { barcodes, layers, furryMods } from "./const.js";
import { getSelf, getFriends } from "./steam.js";
import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js@7.4.1/dist/fuse.min.mjs";

// Is this overkill? probably

// To get value changed event, listen for event "onsettingchanged" on window

export let friends = [];

let friendListElem;
let friendsCancel;
export let areFriendsFetched = false;

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
    name: "Visibility",
    icon: "fa-solid fa-eye",
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
    name: "Steam Settings",
    icon: "fa-brands fa-steam",
    expanded: false,
  },
  {
    name: "Friends",
    icon: "fa-solid fa-user-group",
    expanded: true,
    customHandler: async (container) => {
      if (friendsCancel) friendsCancel.abort();
      const controller = new AbortController();
      friendsCancel = controller;

      fillCategory({
        name: "Friends",
      });

      const list = container.getElementsByTagName("div")[0];
      friendListElem = list;
      list.classList.add("friendsContainer");

      if (list.hasChildNodes()) {
        const divider = document.createElement("div");
        divider.classList.add("divider");
        list.appendChild(divider);
      }

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

        function hide() {
          list.childNodes.forEach((x) => {
            if (x.classList.contains("steamAccount")) x.classList.add("hidden");
          });
        }

        const notices = list.getElementsByClassName("notice");
        if (notices && notices.length > 0) for (const n of notices) n.remove();

        const self = await getSelf();
        if (!self) {
          notice(
            list,
            "Not Logged In!",
            "You need to log in with Steam to view friends list!",
            "fas fa-arrow-right-to-bracket",
          );
          areFriendsFetched = true;
          window.dispatchEvent(new CustomEvent("onfriendslistfetched", {}));
          hide();
          return;
        }
        friends = await getFriends(self.steamId);
        if (friends == false) {
          friends = [];
          notice(
            list,
            "Friends List Not Public!",
            "You must set your steam friends list to be public!",
            "fas fa-xmark",
            "--flb-error-color",
          );
          areFriendsFetched = true;
          window.dispatchEvent(new CustomEvent("onfriendslistfetched", {}));
          hide();
          return;
        } else if (!friends) {
          notice(
            list,
            "Failed!",
            "Failed to fetch friends list",
            "fas fa-xmark",
            "--flb-error-color",
          );
          areFriendsFetched = true;
          window.dispatchEvent(new CustomEvent("onfriendslistfetched", {}));
          hide();
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
        let anyDisplayed = false;
        const onlyInLobby = getSettingValue("displayInLobby");
        sorted.forEach((f) => {
          let elem = list.querySelector(`div[steamid="${f.steamId}"]`);
          if (!elem) elem = toCopy.cloneNode(true);
          elem.removeAttribute("id");
          const avatar = elem.getElementsByClassName("friendAvatar")[0];
          const inLobby = friendsLobbies.find((x) => x.id == f.steamId);
          if (f.userStatus == 0 || (onlyInLobby && !inLobby)) {
            elem.classList.add("hidden");
            avatar.loading = "lazy";
            avatar.fetchpriority = "low";
          } else {
            elem.classList.remove("hidden");
            avatar.loading = "eager";
            avatar.fetchpriority = "auto";
            anyDisplayed = true;
          }
          elem.setAttribute("steamid", f.steamId);
          avatar.width = 32;
          avatar.height = 32;
          avatar.setAttribute("alt", `Avatar of ${f.nickname}`);
          avatar.setAttribute(
            "src",
            f.avatarUrl.replace(
              "avatars.steamstatic.com",
              "avatars.fastly.steamstatic.com",
            ),
          );
          const username = elem.getElementsByClassName("friendUsername")[0];
          username.textContent = f.nickname;
          username.href = f.profileUrl;
          const additionalInfo = elem.getElementsByClassName(
            "steamAdditionalInfo",
          )[0];
          const btnContainer =
            elem.getElementsByClassName("buttonContainer")[0];
          if (!inLobby) {
            additionalInfo.style.color = `var(--flb-status${f.userStatus}-color)`;
            elem.style.order = order.findIndex((x) => x == f.userStatus) + 1;
            btnContainer.classList.add("hidden");
          } else {
            elem.setAttribute("overridenInfo", "true");
            elem.style.order = 0;
            additionalInfo.style.color = "var(--flb-status6-color)";
            additionalInfo.innerHTML = `Playing in a lobby - ${inLobby.lobbyName}`;
            btnContainer.classList.remove("hidden");
            const joinBtn = elem.getElementsByClassName("joinButton")[0];
            joinInfo(joinBtn);
            joinBtn.onclick = async () =>
              await requestJoin(inLobby.lobbyCode, inLobby.lobbyPlatform);
            const infoBtn = elem.getElementsByClassName("infoButton")[0];
            infoBtn.onclick = () =>
              window.dispatchEvent(
                new CustomEvent("displayInfo", {
                  detail: { lobbyID: inLobby.lobbyID },
                }),
              );
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
            x.classList.contains("steamAccount") &&
            !friends.find((f) => f.steamId == x.getAttribute("steamid"))
          )
            x.remove();
        });
        if (!anyDisplayed) {
          notice(
            list,
            "Nobody's there",
            onlyInLobby
              ? "Seems like nobody's playing BONELAB right now"
              : "Seems like nobody's playing anything right now",
            "fas fa-face-frown",
          );
        }
        areFriendsFetched = true;
        window.dispatchEvent(new CustomEvent("onfriendslistfetched", {}));
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
    id: "filterCount",
    category: "General",
    type: "toggle",
    name: "Show Lobby Count on Filters",
    icon: "fa-solid fa-list-ol",
    defaultValue: false,
    callback: () => init(),
  },
  // Groups
  {
    id: "roleplayLobbies",
    category: "Groups",
    type: "filter",
    name: "Roleplay",
    icon: "fa-solid fa-briefcase",

    filterValue: (s, val) => val && (val.include || val.exclude),
    lobbyFilter: true,
    filterWords: [
      "shooting",
      "shooter",
      { word: "rp", type: "whole-word" },
      "war",
      "roleplay",
      "cops",
      "robbers",
    ],
    filterLevels: RP_LEVELS,

    defaultValue: { include: false, exclude: false },
    storeAsJSON: true,
  },
  {
    id: "hoodLobbies",
    category: "Groups",
    type: "filter",
    name: "Hood RP",
    icon: "fa-solid fa-person-rifle",

    filterValue: (s, val) => val && (val.include || val.exclude),
    lobbyFilter: true,
    filterWords: ["hood", "hoodrp"],
    filterLevels: RP_LEVELS,

    defaultValue: { include: false, exclude: false },
    storeAsJSON: true,
  },
  {
    id: "russianLobbies",
    category: "Groups",
    type: "filter",
    name: "Russian",
    icon: "fi fis fi-ru",

    filterValue: (s, val) => val && (val.include || val.exclude),
    lobbyFilter: true,
    filterWords: [
      "russian",
      "russia",
      "rus",
      "russ",
      "russi",
      "russkie",
      { word: "ru", type: "whole-word" },
    ],

    defaultValue: { include: false, exclude: false },
    storeAsJSON: true,
  },
  {
    id: "horrorLobbies",
    category: "Groups",
    type: "filter",
    name: "Horror",
    icon: "fa-solid fa-ghost",

    filterValue: (s, val) => val && (val.include || val.exclude),
    lobbyFilter: true,
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

    defaultValue: { include: false, exclude: false },
    storeAsJSON: true,
  },
  {
    id: "backroomsLobbies",
    category: "Groups",
    type: "filter",
    name: "Backrooms",
    icon: "fa-solid fa-biohazard",

    filterValue: (s, val) => val && (val.include || val.exclude),
    lobbyFilter: true,
    filterWords: ["backrooms", "backroom"],
    filterLevels: [
      "0gravity.BackroomsEntropy.Level.BackroomsEntropy",
      "HombresGuapos.TheBackroomsA24.Level.TheBackroomsA24",
    ],

    defaultValue: { include: false, exclude: false },
    storeAsJSON: true,
  },
  {
    id: "furryLobbies",
    category: "Groups",
    type: "filter",
    name: "Furry",
    icon: "fa-solid fa-paw",
    tooltip:
      "This shows lobbies that HAVE players in them with furry avatars, this means that if for example somebody joins a hood rp lobby with a furry avatar, it will be considered in this filter.",

    filterValue: (s, val) => val && (val.include || val.exclude),
    lobbyFilter: true,
    lobbyValidator: (lobby) => {
      for (const y of lobby.playerList.players) {
        if (furryMods.some((x) => Number(y.avatarModID) == x)) return true;
      }
      return false;
    },

    defaultValue: { include: false, exclude: false },
    storeAsJSON: true,
  },
  {
    id: "otherLobbies",
    category: "Groups",
    type: "filter",
    name: "Other",
    icon: "fa-solid fa-plus",

    filterValue: (s, val) => val && (val.include || val.exclude),
    lobbyFilter: true,
    lobbyValidator: (lobby) => {
      for (const x of settings) {
        if (x.category != "Groups" || x.id == "otherLobbies") continue;

        if (!x.filterWords && !x.filterLevels && !x.lobbyValidator) continue;
        if (meetsConditions(x, lobby)) return false;
      }
      return true;
    },

    defaultValue: { include: false, exclude: false },
    storeAsJSON: true,
  },
  // Platforms
  {
    id: "steamPlatform",
    category: "Platforms",
    type: "filter",
    name: "Steam",
    icon: "fa-brands fa-steam",

    filterValue: (s, val) => val && (val.include || val.exclude),
    lobbyFilter: true,
    lobbyValidator: (lobby) => {
      return lobby.lobbyPlatform == "Steam";
    },

    defaultValue: { include: false, exclude: false },
    storeAsJSON: true,
  },
  {
    id: "epicPlatform",
    category: "Platforms",
    type: "filter",
    name: "Epic Games",
    icon: "fa-custom fa-epicgames",

    filterValue: (s, val) => val && (val.include || val.exclude),
    lobbyFilter: true,
    lobbyValidator: (lobby) => {
      return lobby.lobbyPlatform == "Epic";
    },

    defaultValue: { include: false, exclude: false },
    storeAsJSON: true,
  },
  // Visibility
  {
    id: "publicLobbies",
    category: "Visibility",
    type: "filter",
    name: "Public",
    icon: "fas fa-user-group",

    filterValue: (s, val) => val && (val.include || val.exclude),
    lobbyFilter: true,
    lobbyValidator: (lobby) => {
      return lobby.privacy == 0;
    },

    defaultValue: { include: false, exclude: false },
    storeAsJSON: true,
  },
  {
    id: "friendsOnlyLobbies",
    category: "Visibility",
    type: "filter",
    name: "Friends Only",
    icon: "fas fa-user-lock",

    filterValue: (s, val) => val && (val.include || val.exclude),
    lobbyFilter: true,
    lobbyValidator: (lobby) => {
      return lobby.privacy == 2;
    },

    defaultValue: { include: false, exclude: false },
    storeAsJSON: true,
  },
  // Levels
  {
    id: "vanillaLevels",
    category: "Level",
    type: "filter",
    name: "Vanilla",
    icon: "fas fa-map-location-dot",

    filterValue: (s, val) => val && (val.include || val.exclude),
    lobbyFilter: true,
    lobbyValidator: (lobby) => {
      return barcodes.find((x) => x.barcode == lobby.levelBarcode);
    },

    defaultValue: { include: false, exclude: false },
    storeAsJSON: true,
  },
  {
    id: "moddedLevels",
    category: "Level",
    type: "filter",
    name: "Modded",
    icon: "fas fa-wrench",

    filterValue: (s, val) => val && (val.include || val.exclude),
    lobbyFilter: true,
    lobbyValidator: (lobby) => {
      return !barcodes.find((x) => x.barcode == lobby.levelBarcode);
    },

    defaultValue: { include: false, exclude: false },
    storeAsJSON: true,
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
    type: "filter",
    icon: "fa-solid fa-users-viewfinder",
    name: "Full Lobbies",

    filterValue: (s, val) => val && (val.include || val.exclude),
    lobbyFilter: true,
    lobbyValidator: (lobby) => {
      return lobby.playerCount == lobby.maxPlayers;
    },

    defaultValue: { include: false, exclude: false },
    storeAsJSON: true,
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
    id: "hideNSFWLobbies",
    category: "Filtering",
    type: "toggle",
    name: "Hide NSFW Lobbies",
    icon: "fa-solid fa-shield",
    defaultValue: true,
  },
  // Steam Settings
  {
    id: "prioritizeLobbiesWithFriends",
    category: "Steam Settings",
    type: "toggle",
    name: "Prioritize Lobbies /w Friends",
    icon: "fa-solid fa-arrow-up",
    defaultValue: true,
  },
  {
    id: "prioritizeFriendsOnlyLobbies",
    category: "Steam Settings",
    type: "toggle",
    name: "Prioritize Friends Only Lobbies",
    icon: "fa-solid fa-arrow-up",
    defaultValue: true,
  },
  {
    id: "displayInLobby",
    category: "Steam Settings",
    type: "toggle",
    name: "Only Display Friends in Lobby",
    icon: "fa-solid fa-play",
    defaultValue: true,
    callback: () => init(),
  },
  {
    id: "highlightFriends",
    category: "Steam Settings",
    type: "toggle",
    name: "Highlight Lobbies /w Friends",
    icon: "fa-solid fa-star",
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
      input.classList.add("checkbox");
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
    type: "filter",
    callback: (setting, value) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("checkbox-wrapper");
      const include = document.createElement("input");
      include.classList.add("checkbox");
      include.setAttribute("type", "checkbox");
      include.setAttribute("name", `Include ${setting.name}`);
      include.setAttribute("id", getElemId(setting.id));
      if (value.include) include.setAttribute("checked", true);

      const exclude = document.createElement("input");
      exclude.classList.add("exclude");
      exclude.setAttribute("type", "checkbox");
      exclude.setAttribute("name", `Exclude ${setting.name}`);
      exclude.setAttribute("id", `${getElemId(setting.id)}_exclude`);
      if (value.exclude) exclude.setAttribute("checked", true);
      createToolTip(exclude, "Exclude");

      let old = {
        include: include.checked,
        exclude: exclude.checked,
      };
      function onChanged() {
        if (old.include && exclude.checked) include.checked = false;
        else if (old.exclude && include.checked) exclude.checked = false;

        const val = {
          include: include.checked,
          exclude: exclude.checked,
        };
        wrapper.dispatchEvent(
          new CustomEvent("onsettingchanged", {
            detail: { old: old, new: val },
          }),
        );
        old = val;
      }

      include.addEventListener("change", onChanged);
      exclude.addEventListener("change", onChanged);
      const label = document.createElement("label");
      label.setAttribute("for", getElemId(setting.id));
      fillLabel(setting, label);

      wrapper.appendChild(include);
      if (setting.displayLabel != false) wrapper.appendChild(label);
      wrapper.appendChild(exclude);
      return wrapper;
    },
    setTitle: (elem, title) => setContent(elem.querySelector("label"), title),
    setValue: (elem, val) => {
      const include = elem?.querySelector(".checkbox");
      if (include) {
        let _val;
        if (val && val.include) _val = true;
        else _val = false;
        include.checked = _val;
      }

      const exclude = elem?.querySelector(".exclude");
      if (exclude) {
        let _val;
        if (val && val.exclude) _val = true;
        else _val = false;
        exclude.checked = _val;
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
        setContent(label, n);

        const left =
          ((minVal - setting.minValue) / (min.max - setting.minValue)) * 100;
        const right =
          100 -
          ((maxVal - setting.minValue) / (max.max - setting.minValue)) * 100;
        sliderDiv.style.left = `${left}%`;
        sliderDiv.style.right = `${right}%`;
      }

      function createSlider(_class, val, label = null) {
        if (!label) label = val;
        const slider = document.createElement("input");
        slider.setAttribute("aria-label", label);
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

      min = createSlider("minRange", "min", "Minimum Value");
      max = createSlider("maxRange", "max", "Maximum Value");

      container.appendChild(min);
      container.appendChild(max);

      sliderCallback();

      return wrapper;
    },
    setTitle: (elem, title) => setContent(elem.querySelector("label"), title),
    setValue: (elem, val, setting) => {
      if (val.min && val.max) {
        const sliderDiv = elem?.querySelector(".rangeSlider");
        const minInput = elem?.getElementsByClassName("minRange");
        if (minInput && minInput.length > 0) minInput[0].value = val.min;
        else return;

        const maxInput = elem?.getElementsByClassName("maxRange");
        if (maxInput && maxInput.length > 0) maxInput[0].value = val.max;
        else return;

        if (!setting.baseName) setting.baseName = setting.name;
        const n = `${setting.baseName} [${val.min} - ${val.max}]`;
        setting.name = n;
        setSettingsTitle(setting.id, n);

        const left =
          ((val.min - setting.minValue) /
            (minInput[0].max - setting.minValue)) *
          100;
        const right =
          100 -
          ((val.max - setting.minValue) /
            (maxInput[0].max - setting.minValue)) *
            100;
        sliderDiv.style.left = `${left}%`;
        sliderDiv.style.right = `${right}%`;
      }
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

function createToolTip(e, content, placement = "top", maxWidth = 350) {
  if (e._tippy) e._tippy.setProps({ content: content });

  e._tippy = tippy(e, {
    content: content,
    animation: "scale",
    appendTo: "parent",
    placement: placement,
    maxWidth: maxWidth,
    theme: "website",
  });
}

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
  notice.style.color = `var(${colorVariable})`;
  div.appendChild(notice);
}

function joinInfo(btn) {
  createToolTip(
    btn,
    'To join, you must have the <a class="modLink" href="https://github.com/FusionLobbyBrowser/Mod/releases/latest" target="_blank" rel="noopener noreferrer">mod</a> (>= 1.1.0 version) installed and have launched the game at least once since installation',
  );
}

const URI_JOIN = "flb-bridge://join/[data]";
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

export function setFriendsInLobby(friends) {
  friendsLobbies = friends;
  const order = [6, 1, 4, 2, 3, 0, 5];
  const onlyInLobby = getSettingValue("displayInLobby");
  friendListElem.childNodes.forEach((x) => {
    const friend = friends.find((y) => y.id == x.getAttribute("steamid"));
    const additionalInfo = x.getElementsByClassName("steamAdditionalInfo")[0];
    const avatar = x.getElementsByClassName("friendAvatar")[0];
    const btnContainer = x.getElementsByClassName("buttonContainer")[0];
    let userStatus = -1;
    if (friend) {
      x.style.order = 0;
      additionalInfo.style.color = window
        .getComputedStyle(x)
        .getPropertyValue(`--flb-status6-color`);
      userStatus = 6;
      additionalInfo.innerHTML = `Playing in a lobby - ${friend.lobbyName}`;
      btnContainer.classList.remove("hidden");
      const joinBtn = x.getElementsByClassName("joinButton")[0];
      joinInfo(joinBtn);
      joinBtn.onclick = async () =>
        await requestJoin(friend.lobbyCode, friend.lobbyPlatform);
      const infoBtn = x.getElementsByClassName("infoButton")[0];
      infoBtn.onclick = () =>
        window.dispatchEvent(
          new CustomEvent("displayInfo", {
            detail: { lobbyID: friend.lobbyID },
          }),
        );
    } else if (x.hasAttribute("overridenInfo")) {
      userStatus = Number(x.getAttribute("userStatus"));
      additionalInfo.style.color = `var(--flb-status${userStatus}-color)`;
      x.style.order = order.findIndex((y) => y == userStatus) + 1;
      additionalInfo.textContent = x.getAttribute("infoText");
      btnContainer.classList.add("hidden");
    }

    if (userStatus != -1) {
      if (userStatus == 0 || (onlyInLobby && !friend)) {
        x.classList.add("hidden");
        avatar.loading = "lazy";
        avatar.fetchpriority = "low";
      } else {
        x.classList.remove("hidden");
        avatar.loading = "eager";
        avatar.fetchpriority = "auto";
        const notices = friendListElem.getElementsByClassName("notice");
        if (notices && notices.length > 0) for (const n of notices) n.remove();
      }
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
  if (setting.icon) elem.appendChild(getIconElem(setting.icon));

  const content = document.createElement("span");
  content.classList.add("elemContent");
  content.textContent = setting.name;
  elem.appendChild(content);

  if (setting.tooltip) {
    const tooltipIcon = document.createElement("i");
    tooltipIcon.classList.add("fas");
    tooltipIcon.classList.add("fa-circle-info");
    tooltipIcon.classList.add("tooltipIcon");
    createToolTip(tooltipIcon, setting.tooltip);
    elem.appendChild(tooltipIcon);
  }
}

export function containsWord(lobby, array) {
  if (!lobby || !lobby.lobbyName || lobby.lobbyName == "") return false;

  const iName = Converter.removeRichText(lobby.lobbyName);
  for (const s of array) {
    if (s && s != "") {
      let match = s;
      let regex = null;
      if (!isString(s)) {
        match = s.word;
        if (s.type == "whole-word")
          regex = new RegExp(`\\b${RegExp.escape(match)}\\b`, "mi");
      }
      if (regex == null) regex = new RegExp(RegExp.escape(match), "mi");
      if (regex.test(iName)) return true;
    }
  }
  /*
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
    */

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
    category.expanded = !category.expanded;
  });
  const title = document.createElement("h3");
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

  categories.forEach(setupCategory);
}

function setupCategory(val) {
  const settingsList = document.getElementById("settingsList");
  const cat = createCategory(val);
  settingsList.appendChild(cat);
  if (!val.customHandler) {
    fillCategory(val);
  } else {
    val.customHandler(cat);
  }
}

function fillCategory(val) {
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
    createSetting(val);
  }
}

function createSetting(val) {
  const settingsList = document.getElementById("settingsList");
  const type = types.find((t) => t.type == val.type);
  if (type == null) {
    console.warn(`Setting '${val.id}' has unknown type: ${val.type}`);
    return;
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
    console.warn(`Setting '${val.id}' has unknown category: ${val.category}`);
    return;
  }

  const wrapper = type.callback(val, _val);
  if (wrapper == null) {
    console.warn(`Empty wrapper for setting '${val.id}'`);
    return;
  }

  if (
    getSettingValue("filterCount") == false &&
    val.baseName &&
    val.name != val.baseName &&
    val.setFilterName != false
  )
    type.setTitle(wrapper, val.baseName);

  val.elem = wrapper;

  wrapper.addEventListener("onsettingchanged", (v) =>
    setSetting(val.id, v.detail.new, v.detail.old),
  );

  category.appendChild(wrapper);
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
    if (s.callback && s.initialValueSet) s.callback(value, old);

    const type = types.find((t) => t.type == s.type);
    if (type && type.setValue) type.setValue(s.elem, value, s);

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
    if (type && type.setTitle) type.setTitle(val.elem, title, val);
  }
}

export function addCategory(category) {
  if (!category || categories.find((x) => x.name == category.name)) return;
  categories.push(category);
  setupCategory(category);
}

export function removeCategory(categoryName) {
  if (!categoryName || !categories.find((x) => x.name == categoryName)) return;
  categories = categories.filter((x) => x.name != categoryName);
  const settingsList = document.getElementById("settingsList");
  const category = settingsList.querySelector(
    `#${getCategoryId(categories.find((x) => x.name == val.category))}`,
  );

  if (category == null) return;

  category.remove();
}

export function addSetting(setting) {
  if (!setting || settings.find((x) => x.id == setting.id)) return;
  settings.push(setting);
  createSetting(setting);
}

export function removeSetting(settingId) {
  const s = settings.find((x) => x.id == settingId);
  if (!settingId || !s) return;
  if (s.elem) s.elem.remove();
  settings = settings.filter((x) => x.id != settingId);
}

export function filterWithSettings(lobbies) {
  const constValue = structuredClone(lobbies);

  const includes = [];
  for (const setting of settings) {
    if (!setting || !setting.lobbyFilter || setting.type != "filter") continue;

    if (
      !setting.filterWords &&
      !setting.filterLevels &&
      !setting.lobbyValidator
    )
      continue;

    const val = getSettingValue(setting.id);

    if (val.include) includes.push(setting);
    else if (val.exclude)
      lobbies = lobbies.filter((i) => !meetsConditions(setting, i));
  }

  if (includes && includes.length > 0)
    lobbies = lobbies.filter((i) => {
      let _return = false;
      for (const x of includes) {
        if (meetsConditions(x, i)) {
          _return = true;
          break;
        }
      }

      return _return;
    });

  for (const setting of settings) {
    if (!setting || !setting.lobbyFilter) continue;

    if (
      !setting.filterWords &&
      !setting.filterLevels &&
      !setting.lobbyValidator
    )
      continue;
    let filter = false;

    if (setting.type == "filter" && getSettingValue(setting.id).include == true)
      continue;

    const val = getSettingValue(setting.id);
    if (typeof setting.filterValue == "function")
      filter = setting.filterValue(setting, val);
    else filter = setting.filterValue == val;

    if (filter) lobbies = lobbies.filter((i) => !meetsConditions(setting, i));
  }

  for (const setting of settings) {
    if (!setting || !setting.lobbyFilter) continue;

    let total = 0;
    let curr = 0;

    if (!setting.filterWords && !setting.lobbyValidator) continue;

    if (setting.setFilterName != false) {
      constValue.forEach((element) => {
        if (meetsConditions(setting, element)) total++;
      });

      lobbies.forEach((element) => {
        if (meetsConditions(setting, element)) curr++;
      });
    }

    setting.totalCount = total;
    setting.currCount = curr;

    if (!setting.baseName) setting.baseName = setting.name;
    if (setting.setFilterName != false) {
      const name = `${setting.baseName} [${total == curr ? total : `${curr}/${total}`}]`;
      setting.name = name;
      if (getSettingValue("filterCount") == true) {
        setSettingsTitle(
          setting.id,
          `${setting.baseName} [${total == curr ? total : `${curr}/${total}`}]`,
        );
      }
    }
  }

  return lobbies;
}

// This is in reverse
export function meetsConditions(setting, i) {
  if (isString(setting)) setting = getSetting(setting);
  if (!setting) return true;
  let valid = false;

  if (setting.filterWords && containsWord(i, setting.filterWords)) valid = true;
  if (
    setting.lobbyValidator &&
    setting.lobbyValidator(i, getSettingValue(setting.id))
  )
    valid = true;

  if (setting.filterLevels && setting.filterLevels.includes(i.levelBarcode))
    valid = true;

  return valid;
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
