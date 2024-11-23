<script>
  import moment from "moment";
  import Tooltip from "../../shared/Tooltip.svelte";

  export let logData;

  export let totalPages;
  export let currentPageNum;
  export let pageNumbers;
  export let goToFirstPage;
  export let goToLastPage;
  export let goToPage;
  export let baseIndex;
</script>

<main class="contentArea mt-0">
  <div class="tableListWrap maxh">
    <table class="tableList hdBorder tableScroll">
      <colgroup>
        <col style="width:90px;" />
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th class="text-center">순번</th>
          <th class="text-center">명령</th>
          <th class="text-center">명령내역</th>

          <th class="text-center">관련자산그룹</th>
          <th class="text-center">관련자산명</th>

          <th class="text-center">변경내역</th>
          <th class="text-center">등록일시</th>

          <th class="text-center">수행자</th>
        </tr>
      </thead>
      <tbody>
        {#if logData?.data && logData?.data?.length !== 0}
          {#each logData?.data as data, index}
            <tr>
              <!-- Row Number -->
              <td class="text-center">{baseIndex - index}</td>

              <!-- Command: Split `his_orig_data` and handle gracefully -->
              <td class="text-center">
                {data.his_orig_data.includes(":")
                  ? data.his_orig_data.split(":")[0].trim()
                  : data.his_orig_data}
              </td>
              <td class="text-center">
                {data.his_orig_data.includes(":")
                  ? data.his_orig_data.split(":")[1].trim()
                  : ""}
              </td>

              <!-- Related Asset Group -->
              <td class="text-center">{data.asset_group || "N/A"}</td>

              <!-- Related Asset Name -->
              <td class="text-center">{data.ast_uuid || "N/A"}</td>

              <!-- Changes -->
              <td class="text-center">{data.his_new_data || "N/A"}</td>

              <!-- Registration Time -->
              <td class="text-center">
                {new Date(data.his_udate).toLocaleString()}
              </td>

              <!-- Performer -->
              <td class="text-center">{data?.his_order_user || "Unknown"}</td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
  <div class="pagination_box">
    <nav class="pagination">
      <button
        on:click={goToFirstPage}
        disabled={currentPageNum === 1}
        title="First Page"
      >
        &laquo;
      </button>
      <button
        on:click={() => goToPage(currentPageNum - 1)}
        disabled={currentPageNum === 1}
        title="Previous Page"
      >
        &lsaquo;
      </button>

      {#each pageNumbers as pageNum}
        <button
          class={pageNum === currentPageNum ? "selected" : ""}
          on:click={() => goToPage(pageNum)}
        >
          {pageNum}
        </button>
      {/each}

      <button
        on:click={() => goToPage(currentPageNum + 1)}
        disabled={currentPageNum === totalPages}
        title="Next Page"
      >
        &rsaquo;
      </button>
      <button
        on:click={goToLastPage}
        disabled={currentPageNum === totalPages}
        title="Last Page"
      >
        &raquo;
      </button>
    </nav>
  </div>
</main>

<style>
  .tableListWrap {
    height: 73vh;
    overflow-y: scroll;
  }
  thead {
    position: sticky; /* Make the header sticky */
    top: 0; /* Stick the header to the top */
    z-index: 10; /* Ensure the header is above the scrolling content */
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4); /* Shadow effect for separation */
  }
  th,
  td {
    font-size: 16px;
  }
  .tableListWrap .hdBorder td {
    font-size: 16px;
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
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination button:hover:not([disabled]) {
    background-color: #d4d4d4;
  }
</style>
