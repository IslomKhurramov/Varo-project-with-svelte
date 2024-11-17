<script>
  import { onMount } from "svelte";
  import { getProgramList } from "../../services/page6/serviceArticle";
  import { errorAlert } from "../../shared/sweetAlert";
  import { dataArray } from "../../services/page7/trace.store";
  let itemsPerPage = 15; // Items per page
  let currentPage = 1; // Current page
  let totalItems = 0; // Total items
  let totalPages = 0; // Total pages
  let error = null;

  let sortField = ""; // Current sorting field
  let sortAscending = true; // Sorting direction

  async function fetchProgramList() {
    try {
      const params = {
        order_usage:
          sortField === "order_usage" ? (sortAscending ? "asc" : "desc") : "",
        order_version:
          sortField === "order_version" ? (sortAscending ? "asc" : "desc") : "",
        order_cdate:
          sortField === "order_cdate" ? (sortAscending ? "asc" : "desc") : "",
        page_count: currentPage,
        list_count: itemsPerPage,
      };

      const response = await getProgramList(params);

      if (response.RESULT === "OK") {
        const data = response.CODE;
        dataArray.set(data.list || []);
        totalItems = data.total_count || 0;
        totalPages = Math.ceil(totalItems / itemsPerPage);
      } else {
        throw new Error(response.MESSAGE || "Error fetching data");
      }
    } catch (err) {
      error = err.message;
      await errorAlert(error);
    }
  }
  $: console.log("545454", $dataArray);
  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      fetchProgramList();
    }
  }

  function toggleSort(field) {
    if (sortField === field) {
      sortAscending = !sortAscending; // Toggle sorting direction
    } else {
      sortField = field; // Update sorting field
      sortAscending = true; // Default to ascending for new field
    }
    fetchProgramList();
  }

  onMount(fetchProgramList);
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
</script>

<section style="background-color: #fff; height: calc(-254px + 100vh);">
  <div class="tableWrap">
    <div class="tableListWrap">
      <table class="tableList hdBorder">
        <colgroup>
          <col style="width:4%;" />
          <col style="width:30%;" />
          <col style="width:10%;" />
          <col style="width:20%;" />
          <col style="width:10%;" />
        </colgroup>
        <thead>
          <tr>
            <th class="text-center">순번</th>
            <th class="text-center" on:click={() => toggleSort("order_usage")}>
              용도
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
                  fill="#0067ff"
                />
              </svg>
            </th>
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
                  fill="#0067ff"
                />
              </svg>
            </th>
            <th class="text-center">파일명</th>
            <th class="text-center" on:click={() => toggleSort("order_cdate")}>
              날짜
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
                  fill="#0067ff"
                />
              </svg>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- {#if $dataArray.length > 0} -->
          {#each $dataArray as data, index}
            <tr>
              <td class="text-center"
                >{index + 1 + (currentPage - 1) * itemsPerPage}</td
              >
              <td class="text-center">{data.cs_category || "N/A"}</td>
              <td class="text-center">{data.cs_version || "N/A"}</td>
              <td class="text-center">{data.cs_filename || "N/A"}</td>
              <td class="text-center">{data.cs_provied_date || "N/A"}</td>
            </tr>
          {/each}
          <!-- {:else}
            <tr>
              <td colspan="5" class="text-center">No data available</td>
            </tr>
          {/if} -->
        </tbody>
      </table>
      <!-- Total Count -->
    </div>
  </div>
  <div class="total-count">
    <p>총 데이터: <strong>{totalItems}</strong>개</p>
  </div>

  <!-- Pagination -->
  <nav class="pagination">
    <button
      on:click={() => goToPage(currentPage - 1)}
      disabled={currentPage === 1}
    >
      &lsaquo;
    </button>

    {#each Array(totalPages) as _, index}
      <button
        class:selected={currentPage === index + 1}
        on:click={() => goToPage(index + 1)}
      >
        {index + 1}
      </button>
    {/each}

    <button
      on:click={() => goToPage(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      &rsaquo;
    </button>
  </nav>
</section>

<style>
  * {
    font-size: 16px;
  }
  .parent_table {
    padding: 20px;
    height: 100%;
  }

  .tableWrap {
    background-color: #fff;
    max-height: 70vh;
    border-radius: 5px;
    overflow-y: auto;
  }

  thead {
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
  }

  .total-count {
    text-align: left;
    margin-top: 10px;
    margin-left: 20px;
    font-size: 16px;
    color: #555;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-bottom: 60px;
  }

  .pagination button {
    border: none;
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
  .tableListWrap .hdBorder td {
    font-size: 16px;
  }
  th {
    font-size: 16px;
  }
  tr:hover {
    cursor: pointer;
    background-color: #f4f4f4;
    transition-duration: 0.3s;
  }
</style>
