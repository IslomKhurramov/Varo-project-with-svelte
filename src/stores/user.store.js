import { writable } from "svelte/store";
import Cookies from "js-cookie";

export const userData = writable({
  isLoggedIn: false,
  userInfo: null,
});

export function checkAuth() {
  const sessionId = Cookies.get("sessionid") || null;
  const userInfo = localStorage.getItem("userInfo") || null;
  if (sessionId) {
    userData.set({
      isLoggedIn: true,
      userInfo: JSON.parse(userInfo),
    });
  } else {
    localStorage.removeItem("userInfo");
    userData.set({
      isLoggedIn: false,
      userInfo: null,
    });
  }
}
