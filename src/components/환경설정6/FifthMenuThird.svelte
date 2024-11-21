<script>
  import moment from "moment";
  import { getAuditNLog } from "../../services/logs/logsService";
  import { onMount } from "svelte";
  import { errorAlert } from "../../shared/sweetAlert";

  let logData = [];
  let error = null;
  let loading = true;
  let displayedPages = [];
  export const search = {
    plan_index: "",
    asset_name: "",
    order_user: "",
    search_start_date: "",
    search_end_date: "",
    page_cnt: 1, // Current page
    list_cnt: 15, // Items per page
  };

  let itemsPerPage = search.list_cnt;
  let currentPage = search.page_cnt;
  let totalItems = 0;
  let totalPages = 0;

  const searchDataHandler = async () => {
    try {
      const response = await getAuditNLog(search);
      console.log("API Response:", response);

      logData = (response?.data || []).reverse(); // Teskari tartibda ko'rsatish
      totalItems = response?.total_rec_cnt || 0; // Correct total count
      totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages
      console.log("Total Items:", totalItems, "Total Pages:", totalPages);
    } catch (err) {
      error = err.message;
      await errorAlert(error);
    }
  };

  $: {
    const maxPagesToShow = 3; // Ko'rinadigan sahifalar soni
    displayedPages = [];

    if (totalPages > 0) {
      if (currentPage <= totalPages - maxPagesToShow) {
        // Agar oxirgi sahifaga yaqinlashmagan bo'lsa
        for (let i = currentPage; i < currentPage + maxPagesToShow; i++) {
          displayedPages.push(i);
        }
        displayedPages.push(totalPages); // Oxirgi sahifani qo'shish
      } else {
        // Oxirgi sahifalar yaqinida bo'lsa
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          displayedPages.push(i);
        }
        displayedPages.unshift(1); // Birinchi sahifani ko'rsatish
      }
    }
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      currentPage = page; // Update current page
      search.page_cnt = currentPage; // Update page number in the search object
      searchDataHandler(); // Fetch new data for the current page
    }
  };

  onMount(async () => {
    try {
      loading = true;
      await searchDataHandler();
    } catch (err) {
      await errorAlert(err?.message);
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <div class="loading-overlay">
    <div class="loading-spinner"></div>
  </div>
{/if}

<section class="tableWrap_4">
  <div class="tableListWrap">
    <table class="tableList hdBorder">
      <colgroup>
        <col style="width:4%;" />
        <col style="width:8%;" />
        <col style="width:8%;" />
        <col style="width:10%;" />
        <col style="width:8%;" />
        <col style="width:10%;" />
        <col style="width:5%;" />
        <col style="width:40%;" />
        <col style="width:4%;" />
        <col style="width:4%;" />
        <col style="width:4%;" />
      </colgroup>
      <thead>
        <tr>
          <th class="text-center">순번</th>
          <th class="text-center">명령대상</th>
          <th class="text-center">일시</th>
          <th class="text-center">수행자</th>
          <th class="text-center">스케쥴링</th>
          <th class="text-center">반복주기</th>
          <th class="text-center">수행횟수</th>
          <th class="text-center">수행결과</th>
          <th class="text-center">등등</th>
          <th class="text-center">…</th>
          <th class="text-center">…</th>
        </tr>
      </thead>
      <tbody>
        {#each logData as data, index}
          <tr>
            <td class="text-center" style="font-size: 16px;">
              {totalItems - ((currentPage - 1) * itemsPerPage + index)}
            </td>
            <td style="font-size: 16px;" class="cursor-pointer text-center">
              {data.asset_name || "N/A"}
            </td>
            <td style="font-size: 16px;" class="text-center line-height">
              {moment(data.his_create_time).format("YYYY.MM.DD")}
            </td>
            <td
              class="text-center cursor-pointer line-height"
              style="font-size: 16px;"
            >
              {data.his_order_user || "N/A"}
            </td>
            <td style="font-size: 16px;" class="text-center line-height">
              {data.his_type || "N/A"}
            </td>
            <td class="text-center" style="font-size: 16px;">
              <span>{data.his_orig_data || "N/A"}</span>
            </td>
            <td class="text-center" style="font-size: 16px;">
              <span>{data.his_new_data || "N/A"}</span>
            </td>
            <td class="text-center" style="font-size: 16px;">
              <span>{data.his_full_data || "N/A"}</span>
            </td>
            <td class="text-center" style="font-size: 16px;">
              <span>{data.logging_type_index_id}</span>
            </td>
            <td class="text-center" style="font-size: 16px;">
              <span>{data.ccp_index}</span>
            </td>
            <td class="text-center" style="font-size: 16px;">
              <span>{data.result_index}</span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="total-count">
    <p>총 데이터: <strong>{totalItems}</strong>개</p>
  </div>

  <div class="pagination_box">
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

<style>
  * {
    font-size: 16px;
  }

  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(167, 167, 167, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .loading-spinner {
    border: 8px solid #f3f3f3;
    border-top: 8px solid #3498db;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
  }

  /* Spinner animation */
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .tableWrap_4 {
    background-color: #fff;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    height: 78vh;
    border-radius: 5px;
    margin-top: 10px;
  }

  .tableListWrap {
    overflow-y: auto;
    max-height: 65vh;
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

  .pagination_box {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding: 10px 0;
    background-color: #fff;
    margin-bottom: 40px;
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
