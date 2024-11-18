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
export const selectedData2 = writable([]);
export const selectedData1 = writable([]);
export const comparedTableData1 = writable([]);
export const comparedTableData2 = writable([]);
/*************************************************** */
export const allTraceByThird = writable([]);
export const traceByThird = writable({});
export const comparisonThird = writable([]);
export const comparedPlanTarget1 = writable([]);
export const comparedPlanTarget2 = writable([]);
export const comparedVulnsTarget1 = writable([]);
export const comparedVulnsTarget2 = writable([]);
export const selectedDataTarget1 = writable([]);
export const selectedDataTarget2 = writable([]);
/*************************************************** */
export const ModalData = writable([]);
/******************************************** */
export const programList = writable({ list: [], total_count: 0 });
export const dataArray = writable([]);
/********************************************************** */
export const filterData = writable({ plans: [], vulns: [] });
export const filterDataAsset = writable({ plans: [], vulns: [] });
export const selectedPlanAsset = writable([]);
export const filteredTableDataForPlan = writable([]);
export const filteredTableDataForAsset = writable([]);
export const filteredDataTarget = writable([]);
export const filteredTableDataForTarget = writable([]);
