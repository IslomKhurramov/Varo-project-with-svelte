<script>
  import moment from "moment";
  import { getAuditNLog } from "../../services/logs/logsService";
  import { onMount } from "svelte";
  import { errorAlert } from "../../shared/sweetAlert";

  let logData = [];
  let error = null;
  let loading = true;
  export const search = {
    plan_index: "",
    asset_name: "",
    order_user: "",
    search_start_date: "",
    search_end_date: "",
    page_cnt: 1,
    list_cnt: 5,
  };

  let itemsPerPage = search.list_cnt;
  let currentPage = search.page_cnt;
  let totalItems = 0;
  let totalPages = 0;

  const searchDataHandler = async () => {
    try {
      const response = await getAuditNLog(search);

      logData = response || response?.CODE || [];
      totalItems =
        response?.total_count || response?.CODE?.total_count || logData.length;
      totalPages = Math.ceil(totalItems / itemsPerPage);
    } catch (err) {
      error = err.message;
      await errorAlert(error);
    }
  };

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

<section class="tableWrap" style="height: calc(-100px + 100vh);">
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
          <th class="text-center" style="font-size: 16px;">순번</th>
          <th class="text-center" style="font-size: 16px;">명령대상</th>
          <th class="text-center" style="font-size: 16px;">일시</th>
          <th class="text-center" style="font-size: 16px;">수행자</th>
          <th class="text-center" style="font-size: 16px;">스케쥴링</th>
          <th class="text-center" style="font-size: 16px;">반복주기</th>
          <th class="text-center" style="font-size: 16px;">수행횟수</th>
          <th class="text-center" style="font-size: 16px;">수행결과</th>
          <th class="text-center" style="font-size: 16px;">등등</th>
          <th class="text-center" style="font-size: 16px;">…</th>
          <th class="text-center" style="font-size: 16px;">…</th>
        </tr>
      </thead>
      <tbody>
        {#each logData as data, index}
          <tr>
            <!-- 순번: Tartib raqami -->
            <td class="text-center" style="font-size: 16px;">{index + 1}</td>

            <!-- 명령대상: Buyruq obyekti -->
            <td style="font-size: 16px;" class="cursor-pointer text-center">
              {data.asset_name || "N/A"}
            </td>

            <!-- 일시: Vaqt -->
            <td style="font-size: 16px;" class="text-center line-height">
              {moment(data.his_create_time).format("YYYY.MM.DD")}
            </td>

            <!-- 수행자: Buyruqni bergan foydalanuvchi -->
            <td
              class="text-center cursor-pointer line-height"
              style="font-size: 16px;"
            >
              {data.his_order_user || "N/A"}
            </td>

            <!-- 스케쥴링: Turi -->
            <td style="font-size: 16px;" class="text-center line-height">
              {data.his_type || "N/A"}
            </td>

            <!-- 반복주기: Asl ma'lumot -->
            <td class="text-center" style="font-size: 16px;">
              <span>{data.his_orig_data || "N/A"}</span>
            </td>

            <!-- 수행횟수: Yangi ma'lumot -->
            <td class="text-center" style="font-size: 16px;">
              <span>{data.his_new_data || "N/A"}</span>
            </td>

            <!-- 수행결과: To'liq ma'lumot -->
            <td class="text-center" style="font-size: 16px;">
              <span>{data.his_full_data || "N/A"}</span>
            </td>

            <!-- 등등: Log turi -->
            <td class="text-center" style="font-size: 16px;">
              <span>{data.logging_type_index_id}</span>
            </td>

            <!-- …: CCP indeksi -->
            <td class="text-center" style="font-size: 16px;">
              <span>{data.ccp_index}</span>
            </td>

            <!-- …: Natija indeksi -->
            <td class="text-center" style="font-size: 16px;">
              <span>{data.result_index}</span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <nav class="pagination">
    <button
      on:click={() => goToPage(currentPage - 1)}
      disabled={currentPage === 1}
    >
      &lsaquo;
    </button>

    {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
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

  .tableWrap {
    background-color: #fff;
    height: 85vh;
    border-radius: 5px;
  }

  .tableListWrap {
    overflow-y: auto;
    height: 100%;
    padding-bottom: 50px;
    cursor: pointer;
  }

  thead {
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-top: 150px;
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

  tr:hover {
    cursor: pointer;
    background-color: #f4f4f4;
    transition-duration: 0.3s;
  }
  .line-height {
    line-height: 23px;
  }
</style>
