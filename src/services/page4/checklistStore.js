import { writable } from "svelte/store";
import { getAllCheckList } from "./getAllCheckList";

// Store to hold checklist data
export const checklistStore = writable({
  loading: true,
  data: [],
  error: null,
});

// Function to fetch the checklist data
export async function fetchChecklistData() {
  checklistStore.update((state) => ({ ...state, loading: true }));

  try {
    const allCheckList = await getAllCheckList();
    console.log("all", allCheckList);
    if (allCheckList.RESULT === "ERROR") {
      throw new Error(allCheckList.CODE);
    }
    checklistStore.set({
      loading: false,
      data: Object.values(allCheckList),
      error: null,
    });
  } catch (error) {
    console.log("error2 ", error);
    throw error;
    checklistStore.set({
      loading: false,
      data: [],
      error: error.message,
    });
    console.log("checklistStore", checklistStore);
  }
}

export const filteredChecklistData = writable([]);
