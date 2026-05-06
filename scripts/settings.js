// Is this overkill? probably

// To get value changed event, listen for event "onsettingchanged" on window

const categories = [
  {
    name: "General",
    icon: "fa-solid fa-house",
  },
  {
    name: "Groups",
    icon: "fa-solid fa-book",
  },
  {
    name: "Platforms",
    icon: "fa-solid fa-computer",
  },
  {
    name: "Players",
    icon: "fa-solid fa-users",
  },
  {
    name: "Filtering",
    icon: "fa-solid fa-shield-halved",
  },
];
const settings = [
  // General
  {
    id: "autoRefresh",
    category: "General",
    type: "toggle",
    name: "Auto Refresh",
    defaultValue: false,
  },
  {
    id: "sortOrder",
    category: "General",
    type: "select",
    values: ["Ascending", "Descending"],
    name: "Sort Order",
    defaultValue: "Descending",
  },
  // Groups
  {
    id: "roleplayLobbies",
    category: "Groups",
    type: "toggle",
    name: "Roleplay",
    defaultValue: true,
  },
  {
    id: "russianLobbies",
    category: "Groups",
    type: "toggle",
    name: "Russian",
    defaultValue: true,
  },
  {
    id: "otherLobbies",
    category: "Groups",
    type: "toggle",
    name: "Other",
    defaultValue: true,
  },
  // Platforms
  {
    id: "steamPlatform",
    category: "Platforms",
    type: "toggle",
    name: "Steam",
    defaultValue: true,
  },
  {
    id: "epicPlatform",
    category: "Platforms",
    type: "toggle",
    name: "Epic Games",
    defaultValue: true,
  },
  // Player Count
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
    id: "hideFullLobbies",
    category: "Players",
    type: "toggle",
    name: "Hide Full Lobbies",
    defaultValue: true,
  },
  {
    id: "hideEmptyLobbies",
    category: "Players",
    type: "toggle",
    name: "Hide Empty Lobbies",
    defaultValue: true,
  },
  // Filtering
  {
    id: "censorNSFW",
    category: "Filtering",
    type: "toggle",
    name: "Censor NSFW",
    defaultValue: true,
  },
  {
    id: "censorProfanities",
    category: "Filtering",
    type: "toggle",
    name: "Censor Profanities",
    defaultValue: true,
  },
];
const types = [
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
      });
      const label = document.createElement("label");
      label.setAttribute("for", getElemId(setting.id));
      label.textContent = setting.name;

      wrapper.appendChild(input);
      wrapper.appendChild(label);
      return wrapper;
    },
  },
  {
    type: "select",
    callback: (setting, value) => {
      const wrapper = document.createElement("div");
      const label = document.createElement("label");
      label.setAttribute("for", getElemId(setting.id));
      label.textContent = setting.name;
      const select = document.createElement("select");
      select.setAttribute("name", getElemId(setting.id));
      select.setAttribute("id", getElemId(setting.id));
      setting.values.forEach((val) => {
        const option = document.createElement("option");
        if (isString(val)) setOption(option, val, val);
        else setOption(option, val.id, val.name);

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
      });

      wrapper.appendChild(label);
      wrapper.appendChild(select);
      return wrapper;
    },
  },
];

let settingsValues = [];
let eventListeners = [];

function setOption(option, id, name) {
  option.setAttribute("value", id);
  option.textContent = name;
}

function isString(val) {
  return typeof val === "string" || val instanceof String;
}

function createCategory(category) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("collapsable");
  wrapper.setAttribute("id", getCategoryId(category));
  const button = document.createElement("button");
  button.classList.add("textButton");
  button.setAttribute("data-toggle", "collapse");
  const title = document.createElement("h2");
  title.innerHTML = getCategoryText(category);
  const div = document.createElement("div");

  wrapper.appendChild(button);
  button.appendChild(title);
  wrapper.appendChild(div);

  return wrapper;
}

export function init() {
  const settingsList = document.getElementById("settings");

  categories.forEach((val) => {
    const cat = createCategory(val);
    settingsList.appendChild(cat);
  });

  settings.forEach((val) => {
    const saved = localStorage.getItem(getElemId(val.id));
    let _val;
    if (saved != null && saved != undefined) _val = saved;
    else _val = val.defaultValue;
    setSetting(val.id, _val);

    const category = settingsList
      .querySelector(
        `#${getCategoryId(categories.find((x) => x.name == val.category))}`,
      )
      ?.getElementsByTagName("div")[0];
    if (category == null) {
      console.warn(`Setting '${val.id}' has unknown category: ${val.category}`);
      return;
    }

    const type = types.find((t) => t.type == val.type);
    if (type == null) {
      console.warn(`Setting '${val.id}' has unknown type: ${val.type}`);
      return;
    }

    const wrapper = type.callback(val, _val);
    if (wrapper == null) {
      console.warn(`Empty wrapper for setting '${val.id}'`);
      return;
    }

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
  });
}

export function setSetting(setting, value) {
  localStorage.setItem(getElemId(setting), value);
  let index = settingsValues.findIndex((x) => x.id == setting);
  if (index != -1) settingsValues[index].value = value;
  else settingsValues.push({ id: setting, value: value });
}

export function getSetting(setting) {
  let index = settingsValues.findIndex((x) => x.id == setting);
  if (index != -1) return settingsValues[index].value;
  else return undefined;
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
