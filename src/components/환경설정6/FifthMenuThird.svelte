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
    category: "",
    his_type: "",
    logging_type: "command",
    page_cnt: 1,
    list_cnt: 15,
  };

  let itemsPerPage = search.list_cnt;
  let currentPage = search.page_cnt;
  let totalItems = 0;
  let totalPages = 0;

  const searchDataHandler = async () => {
    try {
      const response = await getAuditNLog(search);

      logData = response.data.sort((a, b) => b.his_index - a.his_index);
      totalItems = response?.total_rec_cnt || 0;
      totalPages = Math.ceil(totalItems / itemsPerPage);
    } catch (err) {
      error = err.message;
    }
  };
  $: {
    const maxPagesToShow = 10;
    displayedPages = [];

    if (totalPages > 0) {
      let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let end = Math.min(totalPages, start + maxPagesToShow - 1);

      start = Math.max(1, end - maxPagesToShow + 1);

      displayedPages = Array.from(
        { length: end - start + 1 },
        (_, i) => start + i,
      );
    }
  }

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      search.page_cnt = currentPage;
      searchDataHandler();
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
        <col style="width:3%;" />
        <col style="width:5%;" />
        <col style="width:15%;" />
        <col style="width:8%;" />
        <col style="width:6%;" />
        <col style="width:5%;" />
        <col style="width:40%;" />
      </colgroup>
      <thead>
        <tr>
          <th class="text-center">순번</th>
          <th class="text-center">로그타입</th>
          <th class="text-center">수행내용</th>
          <th class="text-center">수행자</th>
          <th class="text-center">수행일</th>
          <th class="text-center">점검프로젝트</th>
          <th class="text-center">상세내용</th>
        </tr>
      </thead>
      <tbody>
        {#if logData.length > 0}
          {#each logData as data, index}
            <tr>
              <td class="text-center" style="font-size: 16px;">
                {totalItems - ((currentPage - 1) * itemsPerPage + index)}
              </td>
              <td style="font-size: 16px;" class="text-center">
                {data.his_type || "N/A"}
              </td>
              <td style="font-size: 16px;" class="line-height">
                {data.his_orig_data || "N/A"}
              </td>
              <td class="text-center line-height" style="font-size: 16px;">
                {data.his_order_user || "N/A"}
              </td>
              <td class="text-center" style="font-size: 16px;">
                {moment(data.his_udate).format("YYYY.MM.DD")}
              </td>
              <td class="text-center" style="font-size: 16px;">
                <span>{data.ccp_index}</span>
              </td>
              <td style="font-size: 16px;">
                <span>{data.his_full_data || "N/A"}</span>
              </td>
            </tr>
          {/each}
        {:else}
          <tr>
            <td colspan="7" class="no-data-message"> 데이터가 없습니다 </td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>

  <div>
    <div class="pagination_box">
      <nav class="pagination">
        <!-- First Page Button -->
        <button
          on:click={goToFirstPage}
          disabled={currentPage === 1}
          title="First Page"
        >
          &laquo;
        </button>

        <!-- Previous Page Button -->
        <button
          on:click={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          title="Previous Page"
        >
          &lsaquo;
        </button>

        <!-- Page Numbers -->
        {#each displayedPages as page}
          <button
            class:selected={currentPage === page}
            on:click={() => goToPage(page)}
          >
            {page}
          </button>
        {/each}

        <!-- Next Page Button -->
        <button
          on:click={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Next Page"
        >
          &rsaquo;
        </button>

        <!-- Last Page Button -->
        <button
          on:click={goToLastPage}
          disabled={currentPage === totalPages}
          title="Last Page"
        >
          &raquo;
        </button>
      </nav>
    </div>
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
    height: 75vh;
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

  .no-data-message {
    text-align: center;
    font-size: 18px;
    color: #555;
    height: 50px;
    line-height: 50px;
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
