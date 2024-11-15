<script>
  import { onMount } from "svelte";
  import { getProgramList } from "../../services/page6/serviceArticle";
  import { errorAlert } from "../../shared/sweetAlert";

  let dataArray = []; // Table data
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
        dataArray = data.list || [];
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
</script>

<section class="tableWrap">
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
            용도 {sortField === "order_usage"
              ? sortAscending
                ? "▲"
                : "▼"
              : "▲ ▼"}
          </th>
          <th class="text-center" on:click={() => toggleSort("order_version")}>
            버전 {sortField === "order_version"
              ? sortAscending
                ? "▲"
                : "▼"
              : "▲ ▼"}
          </th>
          <th class="text-center">파일명</th>
          <th class="text-center" on:click={() => toggleSort("order_cdate")}>
            날짜 {sortField === "order_cdate"
              ? sortAscending
                ? "▲"
                : "▼"
              : "▲ ▼"}
          </th>
        </tr>
      </thead>
      <tbody>
        {#if dataArray.length > 0}
          {#each dataArray as data, index}
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
        {:else}
          <tr>
            <td colspan="5" class="text-center">No data available</td>
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
  </div>
</section>

<style>
  * {
    font-size: 16px;
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

  .pagination {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-top: 150px;
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

  tr:hover {
    cursor: pointer;
    background-color: #f4f4f4;
    transition-duration: 0.3s;
  }
</style>
