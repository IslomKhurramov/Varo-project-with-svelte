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
    checklistStore.set({
      loading: false,
      data: Object.values(allCheckList),
      error: null,
    });
  } catch (error) {
    checklistStore.set({
      loading: false,
      data: [],
      error: error.message,
    });
  }
}

export const filteredChecklistData = writable([]);
