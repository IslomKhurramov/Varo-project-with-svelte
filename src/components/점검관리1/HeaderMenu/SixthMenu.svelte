<script>
  import { getPlanLists } from "../../../services/page1/newInspection";
  import {
    getAuditNLog,
    getPlanFilter,
  } from "../../../services/logs/logsService";
  import moment from "moment";
  import { onMount } from "svelte";
  import Tooltip from "../../../shared/Tooltip.svelte";
  import { errorAlert } from "../../../shared/sweetAlert";
  import {
    getProgramList,
    getTargetList,
  } from "../../../services/page1/getProgramListService";
  import { writable } from "svelte/store";
  import { serverApi } from "../../../lib/config";
  import axios from "axios";
  export let projectIndex;
  /*********VARIABLE FOR DATA FROM BACKEND********/
  const programList = writable({ list: [], total_count: 0 });
  const targetList = writable([]);
  /************************************************/
  export let plan_index;
  let displayedPages = [];

  let totalPages = 100;
  let orderCdata = "desc";

  let firstClick = true;
  let target = "점검대상";
  /************SORTINGACENDINGVERSION*************************/
  // Default sorting parameters
  let orderUsage = "asc";
  let orderVersion = "desc";
  let orderCdate = "desc";
  let currentPage = 1;
  let listCount = 15;

  let sortField = "order_version"; // Default sort field
  let sortAscending = false; // `false` aligns with default 'desc'

  // Fetch data on mount
  onMount(() => {
    fetchProgramList();
    fetchTargetList();
    console.log("plan_index", plan_index);
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
      console.log("Fetching data with limit:", limit); // Log to check if limit is changing

      const response = await getProgramList(
        orderUsage,
        orderVersion,
        orderCdate,
        currentPage,
        limit,
      );

      if (response) {
        programList.set(response.CODE);
      }

      console.log("fetched data", $programList);
    } catch (err) {
      console.error(`Error fetching data: ${err.message}`);
    }
  }
  /********************MANUAL DOWNLOAD***********************************/
  async function manualDownload() {
    try {
      console.log("target fetch", target, plan_index);
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
  }

  // Ensure reactivity on listCount change
  $: listCount, fetchProgramList(); // Re-fetch data when listCount changes

  // For debugging purposes
  $: {
    console.log("listCount changed:", listCount); // Debugging the value of listCount
    console.log("refetched");
  }
  /************************************************************************/

  $: {
    fetchProgramList();
    console.log("refetched");
  }
  /**************************FETCHGETTARGETLIST******************/
  async function fetchTargetList() {
    try {
      const response = await getTargetList(plan_index);

      if (response) {
        targetList.set(response.CODE);
      }

      console.log("fetched data", $targetList);
    } catch (err) {
      console.error(`Error fetching data: ${err.message}`);
    }
  }
  /********************************************************************/
  // Handle sorting logic
  function toggleSort(field) {
    if (sortField === field) {
      sortAscending = !sortAscending; // Toggle direction
    } else {
      sortField = field; // Update field
      sortAscending = true; // Default to ascending
    }

    // Update sorting variables
    if (field === "order_usage") {
      orderUsage = sortAscending ? "asc" : "desc";
    } else if (field === "order_version") {
      orderVersion = sortAscending ? "asc" : "desc";
    } else if (field === "order_cdate") {
      orderCdate = sortAscending ? "asc" : "desc";
    }

    // Re-fetch data
    fetchProgramList();
  }
  /**********************************************************/
  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      getAllArticlesData(currentPage);
    }
  }
  $: {
    const maxPagesToShow = 5;
    displayedPages = [];

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) displayedPages.push(i);
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        displayedPages.push(i);
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
    logData = await getAuditNLog(search);
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
</script>

<article class="contentArea">
  <section class="filterWrap">
    <div>
      <select
        id="project"
        bind:value={search.plan_index}
        on:change={searchDataHandler}
      >
        <option value="" selected>전체</option>

        {#if searchFilters?.plans && searchFilters?.plans?.length !== 0}
          {#each searchFilters?.plans as plan}
            <option value={plan.ccp_index}>{plan.ccp_title}</option>
          {/each}
        {/if}
      </select>
      <select
        id="target"
        bind:value={search.order_user}
        on:change={searchDataHandler}
      >
        <option value="" selected>최신버전</option>
        {#if searchFilters?.users && searchFilters?.users?.length !== 0}
          {#each searchFilters?.users as user}
            <option value={user.user_name}>{user.user_name}</option>
          {/each}
        {/if}
      </select>

      <button type="button" class="btn btnPrimary">
        <img src="./assets/images/reset.png" alt="search" />
        초기화
      </button>
    </div>
  </section>
  <section
    class="tableWrap"
    style="height: calc(-294px + 100vh); overflow-y: auto; overflow-x:hidden "
  >
    <div class="tableListWrap">
      <table class="tableList hdBorder">
        <colgroup>
          <col style="width:60px;" />
          <col style="width:160px;" />
          <col style="width:207px;" />
          <col style="width:260px;" />
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
            <tr>
              <td class="text-center">{index + 1}</td>
              <td class="text-center">{data.cs_category}</td>
              <td class="text-center">{data.cs_support_os || "N/A"}</td>
              <td class="text-center">{data.cs_filename}</td>
              <td class="text-center">{data.cs_version}</td>
              <td class="text-center">{data.cs_provied_date}</td>
              <td class="text-center">N/A</td>
              <td class="text-center">{data.cs_description}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <div
      style="display: flex; flex-direction:row; gap:10px; margin-top:10px; align-items:center;"
    >
      <select bind:value={target}>
        <option value="점검대상">점검대상</option>
        {#each $targetList as target}
          <option value={target.cct_index__cct_target}
            >{target.cct_index__cct_target}</option
          >
        {/each}
      </select>
      <button class="btn btnPrimary padding_button" on:click={manualDownload}
        ><img
          src="./assets/images/icon/download.svg"
          class="excel-img"
          alt="download"
        />다운로드</button
      >
    </div>
    <div class="pagination_box">
      <select bind:value={listCount}>
        <option value="15" selected>15</option>
        <option value="30">30</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="전체">전체</option>
      </select>
      <nav class="pagination">
        <button
          on:click={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lsaquo;
        </button>

        {#each displayedPages as page}
          <button
            class:selected={currentPage === page}
            on:click={() => goToPage(page)}
          >
            {page}
          </button>
        {/each}

        <button
          on:click={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &rsaquo;
        </button>
      </nav>
    </div>
  </section>
</article>

<style>
  .pagination_box {
    display: flex;
    flex-direction: row;
    width: 50%;
    justify-content: space-between;
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
</style>
