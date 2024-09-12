import { writable } from "svelte/store";

export const userData = writable({
  isLoggedIn: false,
  userInfo: null,
});
