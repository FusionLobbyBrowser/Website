import { Converter } from "./unityRichText.js";

const regex = new RegExp(
  /(?:https:\/\/discord[\.\,]com\/invite\/|(?<=^|\s)(?:discord)?[\.\,]com\/invite\/|https?:\/\/discord[\.\,]gg\/|(?<=^|\s)(?:discord)?[\.\,]gg\/|Discord(?: Server| Link| Code|):(?: |))(?<code>[a-zA-Z0-9-]+)(?=\s|$)/im,
);

function getServerIconURL(guildId, id, size = 256, animated = true) {
  return `https://cdn.discordapp.com/icons/${guildId}/${id}.webp?size=${size}&animated=${animated}`;
}

async function getServerInfo(inviteCode) {
  try {
    const res = await fetch(
      `https://discord.com/api/invite/${inviteCode}?with_counts=true`,
    );
    if (res.ok) {
      const json = res.json();
      return json;
    } else {
      return null;
    }
  } catch (ex) {
    console.error(
      "An unexpected error has occurred while trying to fetch information about Discord server, response: " +
        ex,
    );
    return null;
  }
}

// This is probably horrible, but hey it works
function formatNumber(num) {
  if (num < 1000) return `${num}`;
  else if (num >= 1000 && num < 1000 * 1000)
    return `${(num / 1000).toFixed(num % 1000 > 0 ? 1 : 0)}k`;
  else if (num >= 1000 * 1000)
    return `${(num / (1000 * 1000)).toFixed(num % (1000 * 1000) > 0 ? 1 : 0)}m`;
}

function createServerElem(obj, code) {
  if (!obj) return null;

  // NSFW Guilds will not appear and there are no plans on adding it, even with it being censored
  if (obj.guild.nsfw == true) return null;

  const toCopy = document.getElementById("discordToCopy");
  const server = toCopy.cloneNode(true);
  server.removeAttribute("id");

  const iconElem = server.getElementsByClassName("serverIcon")[0];
  const serverNameElem = server.getElementsByClassName("serverName")[0];
  const serverDescriptionElem =
    server.getElementsByClassName("serverDescription")[0];
  const memberCountElem = server.getElementsByClassName("memberCount")[0];
  const joinElem = server.getElementsByClassName("discordJoin")[0];

  iconElem.setAttribute("src", getServerIconURL(obj.guild.id, obj.guild.icon));
  iconElem.setAttribute(
    "alt",
    `Icon of the discord server named '${obj.guild.name}'`,
  );
  serverNameElem.textContent = obj.guild.name;
  if (obj.guild.description && obj.guild.description != "") {
    createTooltip(
      serverNameElem,
      `${obj.guild.name} • ${obj.guild.description}`,
    );
    serverDescriptionElem.innerHTML = DOMPurify.sanitize(
      new Converter().unity2html(obj.guild.description),
    );
  } else {
    createTooltip(serverNameElem, obj.guild.name);
    serverDescriptionElem.textContent = "No description provided";
  }
  const num = obj.profile.member_count ?? -1;
  memberCountElem.innerHTML = DOMPurify.sanitize(
    `<i class="fa-solid fa-users textIcon"></i>${formatNumber(num)}`,
  );
  createTooltip(
    memberCountElem,
    `${obj.profile.member_count} members • ${obj.profile.online_count} online`,
  );
  joinElem.setAttribute("href", `https://discord.gg/${code}`);

  return server;
}

function createTooltip(elem, content) {
  tippy(elem, {
    content: content,
    placement: "bottom",
    appendTo: "parent",
    animation: "scale",
    theme: "website",
  });
}

export default async function elem(text) {
  const match = regex.exec(Converter.removeRichText(text));
  if (match) {
    const g = match.groups["code"];
    if (g) {
      if (!g) return null;

      console.log(`  > Found a discord server: %c${g}`, "color: #0ff");

      const serverInfo = await getServerInfo(g);
      if (!serverInfo) return null;

      let elem;
      try {
        elem = createServerElem(serverInfo, g);
        if (!elem) return null;
      } catch (ex) {
        console.error(
          `Failed to create discord server element. Exception:\n${ex}`,
        );
        return null;
      }

      return elem;
    }
  }
  return null;
}
