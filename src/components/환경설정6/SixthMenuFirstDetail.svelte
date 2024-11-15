<script>
  import { onMount } from "svelte";
  import { getProgramList } from "../../services/page6/serviceArticle";
  import { errorAlert } from "../../shared/sweetAlert";

  let dataArray = []; // Jadval uchun ma'lumotlar
  let itemsPerPage = 15; // Har bir sahifada elementlar soni
  let currentPage = 1; // Hozirgi sahifa
  let totalItems = 0; // Umumiy elementlar soni
  let totalPages = 0; // Umumiy sahifalar soni
  let loading = true;
  let error = null;

  $: paginatedData = dataArray.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  let maxPageNumbers = 5;
  $: pages = [];
  $: {
    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

    if (endPage - startPage + 1 < maxPageNumbers) {
      startPage = Math.max(1, endPage - maxPageNumbers + 1);
    }

    pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  }

  async function fetchProgramList() {
    const params = {
      order_usage: "asc",
      order_version: "desc",
      order_cdate: "desc",
      page_count: currentPage,
      list_count: itemsPerPage,
    };

    try {
      const response = await getProgramList(params);

      if (response.RESULT === "OK") {
        const data = response.CODE;
        dataArray = data.list || [];
        totalItems = data.total_count || 0;
        totalPages = Math.ceil(totalItems / itemsPerPage);
      }
    } catch (err) {
      error = err.message;
      await errorAlert(error);
    }
  }

  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      fetchProgramList();
    }
  }

  onMount(async () => {
    try {
      loading = true;
      await fetchProgramList();
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
        <col style="width:30%;" />
        <col style="width:10%;" />
        <col style="width:20%;" />
        <col style="width:10%;" />
      </colgroup>
      <thead>
        <tr>
          <th class="text-center" style="font-size: 16px;">순번</th>
          <th class="text-center" style="font-size: 16px;">용도</th>
          <th class="text-center" style="font-size: 16px;">버전</th>
          <th class="text-center" style="font-size: 16px;">파일명</th>
          <th class="text-center" style="font-size: 16px;">날짜</th>
        </tr>
      </thead>
      <tbody>
        {#if dataArray.length > 0}
          {#each dataArray as data, index}
            <tr>
              <td class="text-center" style="font-size: 16px;">
                {index + 1 + (currentPage - 1) * itemsPerPage}
              </td>
              <td class="text-center" style="font-size: 16px;"
                >{data.cs_category || "N/A"}</td
              >
              <td class="text-center" style="font-size: 16px;"
                >{data.cs_version || "N/A"}</td
              >
              <td class="text-center" style="font-size: 16px;"
                >{data.cs_filename || "N/A"}</td
              >
              <td class="text-center" style="font-size: 16px;"
                >{data.cs_provied_date || "N/A"}</td
              >
            </tr>
          {/each}
        {:else}
          <tr>
            <td colspan="5" class="text-center" style="font-size: 16px;"
              >No data available</td
            >
          </tr>
        {/if}
      </tbody>
    </table>

    <!-- Total Count -->
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

      {#each pages as page}
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

  .tableWrap {
    background-color: #fff;
    height: 85vh;
    border-radius: 5px;
  }

  .tableListWrap {
    overflow-y: auto;
    height: 100%;
    padding-bottom: 50px;
  }

  thead {
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
  }

  .total-count {
    text-align: left;
    margin-top: 80px;
    margin-left: 20px;
    font-size: 16px;
    color: #555;
  }
  .total-count p {
    margin: 0;
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
</style>
