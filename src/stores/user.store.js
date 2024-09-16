import { writable } from "svelte/store";
import Cookies from "js-cookie";

export const userData = writable({
  isLoggedIn: false,
  userInfo: null,
});

export function checkAuth() {
  const sessionId = Cookies.get("sessionid") || null;
  if (sessionId) {
    userData.set({
      isLoggedIn: true,
      userInfo: "data",
    });
  } else {
    userData.set({
      isLoggedIn: false,
      userInfo: null,
    });
  }
}
