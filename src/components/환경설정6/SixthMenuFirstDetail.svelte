<script>
  import { getPlanLists } from "../../services/page1/newInspection";
  import { getAuditNLog, getPlanFilter } from "../../services/logs/logsService";
  import moment from "moment";
  import { onMount } from "svelte";
  import Tooltip from "../../shared/Tooltip.svelte";
  import { errorAlert } from "../../shared/sweetAlert";
  import {
    getProgramList,
    getTargetList,
  } from "../../services/page1/getProgramListService";
  import { writable } from "svelte/store";
  import { serverApi } from "../../lib/config";
  import axios from "axios";
  import { programList } from "../../services/page7/trace.store";

  export let projectIndex;
  /*********VARIABLE FOR DATA FROM BACKEND********/

  const targetList = writable([]);
  /************************************************/
  export let plan_index = "";
  let displayedPages = [];

  let totalPages = 0;
  let target = "점검대상";
  /************SORTINGACENDINGVERSION*************************/
  // Default sorting parameters
  let orderUsage = "";
  let orderVersion = "";
  let orderCdate = "";
  let currentPage = 1;
  let listCount = "15";

  let sortField = ""; // No default sort field
  let sortAscending = true; // Default to ascending

  // Fetch data on mount
  onMount(() => {
    fetchProgramList();
    fetchTargetList();
  });

  /**************************************************************/
  let searchFilters;
  let logData = null;
  let search = {
    plan_index: "",
    asset_name: "",
    order_user: "",
    search_start_date: "",
    search_end_date: "",
  };

  /******************************GETPROGRAMLIST*************************/

  async function fetchProgramList() {
    try {
      let limit = listCount === "전체" ? undefined : Number(listCount);

      // Dynamically construct parameters
      const params = {
        ...(orderUsage && { orderUsage }),
        ...(orderVersion && { orderVersion }),
        ...(orderCdate && { orderCdate }),
        currentPage,
        limit,
      };

      // console.log("Fetching data with params:", params);

      const response = await getProgramList(
        params.orderUsage || "",
        params.orderVersion || "",
        params.orderCdate || "",
        params.currentPage,
        params.limit,
      );

      if (response) {
        programList.set(response.CODE);
        totalPages = Math.ceil(
          response.CODE.total_count / (limit || response.CODE.total_count),
        );
      }
    } catch (err) {
      console.error(`Error fetching data: ${err.message}`);
    }
  }
  /********************MANUAL DOWNLOAD***********************************/
  async function manualDownload() {
    if ($targetList && $targetList.length > 0) {
      // Validate $targetList
      if (
        !$targetList ||
        !Array.isArray($targetList) ||
        $targetList.length === 0
      ) {
        errorAlert("대상 목록이 비어 있거나 제대로 로드되지 않았습니다..");
        return;
      }

      // Validate target
      if (!target) {
        errorAlert("타겟이 선택되지 않았습니다.");
        return;
      }
      try {
        const response = await axios.post(
          `${serverApi}/api/getDownloadManualProgram/`,
          { target: target },
          { ccp_index: plan_index },
          { responseType: "blob" },
        );

        const contentType = response.headers["content-type"];
        let fileExtension = "bin"; // Default extension for binary files

        // Check content type and determine the appropriate file extension
        if (contentType.includes("pdf")) {
          fileExtension = "pdf";
        } else if (
          contentType.includes("excel") ||
          contentType.includes("spreadsheetml")
        ) {
          fileExtension = "xlsx";
        } else if (
          contentType.includes("word") ||
          contentType.includes("msword")
        ) {
          fileExtension = "docx";
        } else if (contentType.includes("csv")) {
          fileExtension = "csv";
        } else if (contentType.includes("image")) {
          if (contentType.includes("jpeg") || contentType.includes("jpg")) {
            fileExtension = "jpg";
          } else if (contentType.includes("png")) {
            fileExtension = "png";
          } else if (contentType.includes("gif")) {
            fileExtension = "gif";
          }
        } else if (contentType.includes("text")) {
          fileExtension = "txt";
        } else if (contentType.includes("zip")) {
          fileExtension = "zip";
        } else {
          fileExtension = "bin"; // For unknown or unsupported formats, use a generic binary file
        }

        const blob = new Blob([response.data], {
          type: contentType || "application/octet-stream",
        });

        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        // Set the filename with the appropriate extension
        const fileName = `report.${fileExtension}`;
        a.download = fileName;

        // Simulate a click to trigger the download
        document.body.appendChild(a);
        a.click();

        // Cleanup
        a.remove();
        window.URL.revokeObjectURL(url);
        target = "";
      } catch (error) {
        alert("An error occurred while downloading the report.");
        throw error;
      }
    } else {
      errorAlert("Please select a atrget");
    }
  }
  /*********************AUTO DOWNLOAD**************************************/
  async function autoDownload(data) {
    try {
      const response = await axios.post(
        `${serverApi}/api/getDownloadAutoProgram/`,
        { cs_index: data.cs_index },
        { ccp_index: plan_index },
        { responseType: "blob" },
      );

      const contentType = response.headers["content-type"];
      let fileExtension = "bin"; // Default extension for binary files

      // Check content type and determine the appropriate file extension
      if (contentType.includes("pdf")) {
        fileExtension = "pdf";
      } else if (
        contentType.includes("excel") ||
        contentType.includes("spreadsheetml")
      ) {
        fileExtension = "xlsx";
      } else if (
        contentType.includes("word") ||
        contentType.includes("msword")
      ) {
        fileExtension = "docx";
      } else if (contentType.includes("csv")) {
        fileExtension = "csv";
      } else if (contentType.includes("image")) {
        if (contentType.includes("jpeg") || contentType.includes("jpg")) {
          fileExtension = "jpg";
        } else if (contentType.includes("png")) {
          fileExtension = "png";
        } else if (contentType.includes("exe")) {
          fileExtension = "exe";
        }
      } else if (contentType.includes("text")) {
        fileExtension = "txt";
      } else if (contentType.includes("zip")) {
        fileExtension = "zip";
      } else {
        fileExtension = "bin"; // For unknown or unsupported formats, use a generic binary file
      }

      const blob = new Blob([response.data], {
        type: contentType || "application/octet-stream",
      });

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Set the filename with the appropriate extension
      const fileName = data.cs_filename;
      a.download = fileName;

      // Simulate a click to trigger the download
      document.body.appendChild(a);
      a.click();

      // Cleanup
      a.remove();
      window.URL.revokeObjectURL(url);
      target = "";
    } catch (error) {
      alert("An error occurred while downloading the report.");
      throw error;
    }
  }
  // Ensure reactivity on listCount change
  $: listCount, fetchProgramList(); // Re-fetch data when listCount changes

  /************************************************************************/

  $: {
    fetchProgramList();
  }
  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      fetchProgramList();
    }
    if (page < 1 || page > totalPages) return; // Prevent out-of-bound navigation
    currentPage = page;
    console.log(`Navigating to page: ${page}`);
    // Add additional logic to fetch data for the selected page
  }

  /**************************FETCHGETTARGETLIST******************/
  let targetListShow = false;
  async function fetchTargetList() {
    try {
      console.log("Fetching target list for plan_index:", plan_index);
      const response = await getTargetList(plan_index);

      if (response) {
        targetList.set(response.CODE);
      }

      console.log("fetched targetList", $targetList);
    } catch (err) {
      console.error(`Error fetching data: ${err.message}`);
    }
  }
  $: {
    if (plan_index) {
      fetchTargetList();
      targetListShow = true;
    }
  }
  /********************************************************************/
  // Handle sorting logic
  function toggleSort(field) {
    // Reset all sorting variables
    orderUsage = "";
    orderVersion = "";
    orderCdate = "";

    if (sortField === field) {
      sortAscending = !sortAscending; // Toggle direction
    } else {
      // Update sorting field and default to ascending
      sortField = field;
      sortAscending = true;
    }

    // Update the specific sorting variable based on the field
    if (field === "order_usage") {
      orderUsage = sortAscending ? "asc" : "desc";
    } else if (field === "order_version") {
      orderVersion = sortAscending ? "asc" : "desc";
    } else if (field === "order_cdate") {
      orderCdate = sortAscending ? "asc" : "desc";
    }

    // Refetch data with updated sorting
    fetchProgramList();
  }
  /**********************************************************/
  $: {
    const maxPagesToShow = 3;
    displayedPages = [];

    if (totalPages > 0) {
      if (currentPage <= totalPages - maxPagesToShow) {
        for (let i = currentPage; i < currentPage + maxPagesToShow; i++) {
          if (i > 0) displayedPages.push(i);
        }
        if (currentPage + maxPagesToShow - 1 < totalPages) {
          displayedPages.push(totalPages);
        }
      } else {
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          if (i > 0) displayedPages.push(i);
        }
        if (totalPages - maxPagesToShow > 0) {
          displayedPages.unshift(1);
        }
      }
    }
  }
  /****************************************************************/
  onMount(async () => {
    try {
      searchFilters = await getPlanFilter();
      await searchDataHandler();
    } catch (err) {
      await errorAlert(err?.message);
    }
  });

  const searchDataHandler = async () => {
    logData = await fetchTargetList(plan_index);
  };

  const resetFilters = async () => {
    search = {
      plan_index: projectIndex,
      asset_name: "",
      order_user: "",
      search_start_date: "",
      search_end_date: "",
    };
    await searchDataHandler();
  };

  $: {
    if (projectIndex && !logData) {
      search = { ...search, plan_index: projectIndex };
      searchDataHandler();
    }
  }
  let fakeData = [];
  for (let i = 0; i <= 100; i++) {
    fakeData.push({
      cs_index: 6,
      cs_category: "MANUAL",
      cs_support_os: "",
      cs_codetype: "MANUAL",
      cs_filename: "varo_agent_manual_v1.0.docx",
      cs_version: "0.8",
      cs_provied_date: "2024-04-11",
      cs_description: "클라이언트 프로그램 사용자 매뉴얼",
    });
  }
  // $: console.log("plan data", $targetList);
</script>

<article class="contentArea" style="background-color: #fff; height:100%;">
  <section
    class="tableWrap"
    style="max-height:58vh; overflow-y: auto; overflow-x:hidden "
  >
    <div class="tableListWrap">
      <table class="tableList hdBorder">
        <colgroup>
          <col style="width:60px;" />
          <col style="width:160px;" />
          <col style="width:240px;" />
          <col style="width:350px;" />
          <col style="width:90px;" />
          <col style="width:120px;" />
          <col style="width:90px;" />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th class="text-center">순번</th>
            <th class="text-center" on:click={() => toggleSort("order_usage")}>
              프로그램 구분
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                style="transform: rotate({sortField === 'order_usage' &&
                sortAscending
                  ? '0deg'
                  : '180deg'});
                        transition: transform 0.2s;"
                width="16px"
                height="16px"
              >
                <path
                  d="M151.6 42.4C145.5 35.8 137 32 128 32s-17.5 3.8-23.6 10.4l-88 96c-11.9 13-11.1 33.3 2 45.2s33.3 11.1 45.2-2L96 146.3 96 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-301.7 32.4 35.4c11.9 13 32.2 13.9 45.2 2s13.9-32.2 2-45.2l-88-96zM320 480l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l224 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32z"
                  fill={"#0067ff"}
                />
              </svg>
            </th>
            <th class="text-center">운영체제</th>
            <th class="text-center">프로그램명</th>
            <th
              class="text-center"
              on:click={() => toggleSort("order_version")}
            >
              버전
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                style="transform: rotate({sortField === 'order_version' &&
                sortAscending
                  ? '0deg'
                  : '180deg'});
                        transition: transform 0.2s;"
                width="16px"
                height="16px"
              >
                <path
                  d="M151.6 42.4C145.5 35.8 137 32 128 32s-17.5 3.8-23.6 10.4l-88 96c-11.9 13-11.1 33.3 2 45.2s33.3 11.1 45.2-2L96 146.3 96 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-301.7 32.4 35.4c11.9 13 32.2 13.9 45.2 2s13.9-32.2 2-45.2l-88-96zM320 480l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l224 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32z"
                  fill={"#0067ff"}
                />
              </svg>
            </th>
            <th class="text-center" on:click={() => toggleSort("order_cdate")}>
              배포날짜
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                style="transform: rotate({sortField === 'order_cdate' &&
                sortAscending
                  ? '0deg'
                  : '180deg'});
                        transition: transform 0.2s;"
                width="16px"
                height="16px"
              >
                <path
                  d="M151.6 42.4C145.5 35.8 137 32 128 32s-17.5 3.8-23.6 10.4l-88 96c-11.9 13-11.1 33.3 2 45.2s33.3 11.1 45.2-2L96 146.3 96 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-301.7 32.4 35.4c11.9 13 32.2 13.9 45.2 2s13.9-32.2 2-45.2l-88-96zM320 480l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l224 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32z"
                  fill={"#0067ff"}
                />
              </svg>
            </th>
            <th class="text-center">등록날짜</th>
            <th class="text-center">지원범위</th>
          </tr>
        </thead>

        <tbody>
          {#each $programList.list as data, index}
            <tr on:click={() => autoDownload(data)}>
              <td class="text-center">
                {$programList.list.length -
                  index +
                  (currentPage - 1) * listCount.length}
              </td>
              <td class="text-center">{data.cs_category}</td>
              <td class="text-center">{data.cs_support_os || "N/A"}</td>
              <td class="text-center">{data.cs_filename}</td>
              <td class="text-center">{data.cs_version}</td>
              <td class="text-center">{data.cs_provied_date}</td>
              <td class="text-center">N/A</td>
              <td>{data.cs_description}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section class="section-container">
    <!-- First Div -->
    <div class="left-section"></div>

    <!-- Second Div (Centered Pagination) -->
    <div class="pagination_box">
      <nav class="pagination">
        <button
          on:click={() => goToPage(1)}
          disabled={currentPage === 1}
          title="First Page"
        >
          &laquo;
        </button>
        <button
          on:click={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          title="Previous Page"
        >
          &lsaquo;
        </button>
        {#each displayedPages as _, page (page)}
          <button
            class:selected={currentPage === page + 1}
            on:click={() => goToPage(page + 1)}
          >
            {page + 1}
          </button>
        {/each}
        <button
          on:click={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Next Page"
        >
          &rsaquo;
        </button>
        <button
          on:click={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          title="Last Page"
        >
          &raquo;
        </button>
      </nav>
    </div>

    <!-- Third Div -->
    <div class="right-section">
      <select class="list-dropdown" bind:value={listCount}>
        <option value="15">15개 보기</option>
        <option value="30">30개 보기</option>
        <option value="50">50개 보기</option>
        <option value="100">100개 보기</option>
        <option value="전체">전체 보기</option>
      </select>
    </div>
  </section>
</article>

<style>
  .pagination_box {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
  * {
    font-size: 16px;
  }
  thead {
    position: sticky; /* Make the header sticky */
    top: 0; /* Stick the header to the top */
    z-index: 10; /* Ensure the header is above the scrolling content */
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4); /* Shadow effect for separation */
  }
  td,
  th {
    font-size: 16px;
  }
  td {
    font-size: 16px;
  }
  tr:hover {
    cursor: pointer;
    background-color: #f4f4f4;
    transition-duration: 0.3s;
  }
  .pagination {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-top: 20px;
    padding: 10px 0;
    background-color: #fff;
    /* box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1); */
  }

  .pagination button {
    border: none !important;
    padding: 8px 12px;
    margin: 0 4px;
    cursor: pointer;
    border-radius: 5px;
  }

  .pagination button.selected {
    background-color: #007bff;
    color: #fff;
  }

  .pagination button[disabled] {
    cursor: not-allowed;
  }

  .pagination button:hover:not([disabled]) {
    background-color: #d4d4d4;
  }

  /* Section Container */
  .section-container {
    display: flex;
    justify-content: space-between; /* Evenly distribute the three divs */
    align-items: center; /* Center vertically */
    margin-top: 20px;
    width: 100%;
    gap: 20px; /* Spacing between divs */
  }

  /* Left Section */
  .left-section {
    display: flex;
    flex-direction: column;
    gap: 10px; /* Space between the heading and content */
  }

  /* Pagination Section (Centered) */
  .pagination_box {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pagination {
    display: flex;
    gap: 5px;
  }

  .pagination button {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    background-color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .pagination button.selected {
    background-color: #0067ff;
    color: #fff;
  }

  .pagination button[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .pagination button:hover:not([disabled]) {
    background-color: #f0f0f0;
  }

  /* Right Section */
  .right-section {
    display: flex;
    align-items: center;
  }

  .list-dropdown {
    width: 150px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    background-color: #fff;
    color: #495057;
  }
</style>
