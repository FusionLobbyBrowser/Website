import { Converter } from "./unityRichText.js";

const regex = new RegExp(
  /(?:https?:\/\/discord\.gg|(?<=^|\s)(?:discord)?\.gg)\/(?<code>[a-zA-Z0-9-]+)(?=\s|$)/im,
);

function getServerIconURL(guildId, id, size = 256) {
  return `https://cdn.discordapp.com/icons/${guildId}/${id}.webp?size=${size}&animated=true`;
}

async function getServerInfo(inviteCode) {
  try {
    const res = await fetch(
      `https://discord.com/api/invite/${inviteCode}?with_counts=true`,
    );
    const json = res.json();
    return json;
  } catch (ex) {
    console.error(
      "An unexpected error has occurred while trying to fetch information about Discord server, response: " +
        ex,
    );
    return null;
  }
}

function createServerElem(obj, code) {
  if (!obj) return null;

  // NSFW Guilds will not appear and there are no plans on adding it, even with it being censored
  if (obj.guild.nsfw == true) return null;

  const toCopy = document.getElementsByClassName("discordToCopy")[0];
  const server = toCopy.cloneNode(true);
  server.classList.remove("discordToCopy");

  const iconElem = server.getElementsByClassName("serverIcon")[0];
  const serverNameElem = server.getElementsByClassName("serverName")[0];
  const memberCountElem = server.getElementsByClassName("memberCount")[0];
  const joinElem = server.getElementsByClassName("discordJoin")[0];

  iconElem.setAttribute("src", getServerIconURL(obj.guild.id, obj.guild.icon));
  iconElem.setAttribute(
    "alt",
    `Icon of the discord server named '${obj.guild.name}'`,
  );
  serverNameElem.textContent = obj.guild.name;
  if (obj.guild.description && obj.guild.description != "") {
    tippy(serverNameElem, {
      content: `${obj.guild.name} • ${obj.guild.description}`,
      placement: "bottom",
      appendTo: "parent",
      animation: "scale",
    });
  } else {
    tippy(serverNameElem, {
      content: `${obj.guild.name}`,
      placement: "bottom",
      appendTo: "parent",
      animation: "scale",
    });
  }
  const num = numeral(obj.profile.member_count ?? -1);
  memberCountElem.innerHTML = DOMPurify.sanitize(
    `<img src="images/people.svg"> ${num.format("0.0a")}`,
  );
  tippy(memberCountElem, {
    content: `${obj.profile.online_count} online`,
    placement: "bottom",
    appendTo: "parent",
    animation: "scale",
  });
  joinElem.setAttribute("href", `https://discord.gg/${code}`);

  return server;
}

export default async function elem(text) {
  const match = regex.exec(Converter.removeRichText(text));
  if (match) {
    const g = match.groups["code"];
    if (g) {
      if (!g) return null;

      const serverInfo = await getServerInfo(g);
      if (!serverInfo) return null;

      const elem = createServerElem(serverInfo, g);
      if (!elem) return null;

      return elem;
    }
  }
  return null;
}
