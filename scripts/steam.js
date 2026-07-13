let HOST = "https://fusionapi.hahoos.dev/"; // http://localhost:5000/
const STEAM = `${HOST}steam/`;
const ME = `${STEAM}me`;
const PROFILE = `${STEAM}profile/[id]`;
const FRIENDS = `${STEAM}friends/[id]`; // ID needs to be the same as logged in user

if (document.readyState !== "loading") init();
else window.addEventListener("DOMContentLoaded", init);

async function init() {
  if (
    window.location.hostname == "hoodrp.com" ||
    window.location.hostname == "www.hoodrp.com"
  ) {
    HOST = "https://api.hoodrp.com/";
  }

  const container = document.getElementById("steamAccount");
  const redirect = document.getElementById("steamRedirect");
  const account = container.getElementsByClassName("steamAccount")[0];
  const self = await getSelf();
  if (!self) {
    account.classList.add("hidden");
    redirect.classList.remove("hidden");
    redirect.href = `${HOST}steam/login?redirectUrl=${window.location.href}`;
  } else {
    account.classList.remove("hidden");
    redirect.classList.add("hidden");

    account
      .getElementsByClassName("steamSmall")[0]
      .setAttribute("src", self.avatarUrl);
    account
      .getElementsByClassName("steamName")[0]
      .getElementsByClassName("elemContent")[0].textContent = self.nickname;
    tippy(account, {
      content: `<a class="logout" href=${HOST}steam/logout?redirectUrl=${window.location.href}" rel="noopener noreferrer">Logout</a>`,
      animation: "scale",
      appendTo: "parent",
      interactive: true,
      allowHTML: true,
      theme: "website-background",
      placement: "bottom",
      trigger: "click",
    });
  }
}

export async function getSelf() {
  try {
    const res = await fetch(ME, { credentials: "include" });
    if (!res.ok) return null;
    return await res.json();
  } catch (ex) {
    console.error(ex);
    return null;
  }
}

export async function getProfile(id) {
  try {
    const res = await fetch(PROFILE.replace("[id]", id), {
      credentials: "include",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (ex) {
    console.error(ex);
    return null;
  }
}

export async function getFriends(id) {
  try {
    const res = await fetch(FRIENDS.replace("[id]", id), {
      credentials: "include",
    });
    if (res.status == 401) return false;
    if (!res.ok) return null;
    return await res.json();
  } catch (ex) {
    console.error(ex);
    return null;
  }
}
