import { writable } from "svelte/store";

export const allTraceByPlan = writable([]);
export const leftTrackData = writable([]);
export const traceByPlan = writable({});
export const comparisonPlan = writable([]);
/******************************************** */
export const allTraceByAsset = writable([]);
export const traceByAsset = writable({});
export const comparisonAsset = writable([]);
export const selectedPlan = writable([]);
export const selectedAssetTableData = writable([]);
