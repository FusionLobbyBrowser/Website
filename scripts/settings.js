// Is this overkill? probably

// To get value changed event, listen for event "onsettingchanged" on window

const categories = ["General", "Purpose", "Player Count", "Filtering"];
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
    category: "Player Count",
    type: "range",
    minValue: 1,
    maxValue: 100,
    name: "Player Count",
    defaultValue: [1, 100],
  },
  {
    id: "hideFullLobbies",
    category: "Player Count",
    type: "toggle",
    name: "Hide Full Lobbies",
    defaultValue: true,
  },
  {
    id: "hideEmptyLobbies",
    category: "Player Count",
    type: "toggle",
    name: "Hide Empty Lobbies",
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
      if (value == true) input.setAttribute("checked", true);
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
        if (isString(val)) setOption(val, val);
        else setOption(val.id, val.name);

        select.appendChild(option);
      });

      wrapper.appendChild(label);
      wrapper.appendChild(select);
    },
  },
];

function setOption(id, name) {
  option.setAttribute("value", val.id);
  option.textContent = val.name;
}

function isString(val) {
  return typeof val === "string" || val instanceof String;
}

function createCategory(name) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("collapsable");
  const button = document.createElement("button");
  button.classList.add("textButton");
  button.setAttribute("data-toggle", "collapse");
  const title = document.createElement("h2");
  title.textContent = name;
  const div = document.createElement("div");

  wrapper.appendChild(button);
  button.appendChild(title);
  wrapper.appendChild(div);

  return wrapper;
}

function getElemId(setting) {
  return `setting_${setting.id}`;
}
