// Is this overkill? probably

// To get value changed event, listen for event "onsettingchanged" on window

const categories = [
  {
    name: "General",
    icon: "fa-solid fa-house",
  },
  {
    name: "Purpose",
    icon: "fa-solid fa-book",
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
const filterSelections = ["Whitelist", "Blacklist", "None"];
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
  // Purpose
  {
    id: "roleplayLobbies",
    category: "Purpose",
    type: "select",
    values: filterSelections,
    name: "Roleplay Lobbies",
    defaultValue: "None",
  },
  {
    id: "russianLobbies",
    category: "Purpose",
    type: "select",
    values: filterSelections,
    name: "Russian Lobbies",
    defaultValue: "None",
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
      input.setAttribute("id", getElemId(setting));
      if (value == "true") input.setAttribute("checked", true);
      let old = input.checked;
      input.addEventListener("change", () => {
        wrapper.dispatchEvent(
          new CustomEvent("onsettingchanged", {
            detail: { old: old, new: input.checked },
          }),
        );
      });
      const label = document.createElement("label");
      label.setAttribute("for", getElemId(setting));
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
      label.setAttribute("for", getElemId(setting));
      label.textContent = setting.name;
      const select = document.createElement("select");
      select.setAttribute("name", getElemId(setting));
      select.setAttribute("id", getElemId(setting));
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

if (document.readyState !== "loading") init();
else window.addEventListener("DOMContentLoaded", init);

function init() {
  const settingsList = document.getElementById("settings");

  categories.forEach((val) => {
    const cat = createCategory(val);
    settingsList.appendChild(cat);
  });

  settings.forEach((val) => {
    const saved = localStorage.getItem(getElemId(val));
    console.log(`${val.id} : ${saved}`);
    let _val;
    if (saved != null && saved != undefined) _val = saved;
    else _val = val.defaultValue;
    localStorage.setItem(getElemId(val), _val);

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
      console.log(v);
      localStorage.setItem(getElemId(val), v.detail.new);
      window.dispatchEvent(
        new CustomEvent("onsettingchanged", {
          detail: { old: v.detail.old, new: v.detail.new },
        }),
      );
    });

    category.appendChild(wrapper);
  });
}

function getElemId(setting) {
  return `setting_${setting.id}`;
}

function getCategoryText(category) {
  return `<i class="${category.icon} textIcon"></i>${category.name}`;
}

function getCategoryId(category) {
  return `category_${category?.name?.replace(" ", "")}`;
}
