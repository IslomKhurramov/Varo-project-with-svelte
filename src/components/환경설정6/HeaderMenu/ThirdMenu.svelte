<script>
  import { Pagination, PaginationItem } from "flowbite-svelte";

  let dataArray = [
    {
      hostname: "Host1",
      itemNo: "Item001",
      itemTitle: "Title1",
      itemCriteria: "Criteria1",
      itemStatus: "Status1",
      itemResult: "양호",
    },
    {
      hostname: "Host2",
      itemNo: "Item002",
      itemTitle: "Title2",
      itemCriteria: "Criteria2",
      itemStatus: "Status2",
      itemResult: "취약",
    },
    {
      hostname: "Host3",
      itemNo: "Item003",
      itemTitle: "Title3",
      itemCriteria: "Criteria3",
      itemStatus: "Status3",
      itemResult: "예외처리",
    },
    {
      hostname: "Host4",
      itemNo: "Item004",
      itemTitle: "Title4",
      itemCriteria: "Criteria4",
      itemStatus: "Status4",
      itemResult: "해당없음",
    },
    {
      hostname: "Host5",
      itemNo: "Item005",
      itemTitle: "Title5",
      itemCriteria: "Criteria5",
      itemStatus: "Status5",
      itemResult: "양호",
    },
    {
      hostname: "Host3",
      itemNo: "Item003",
      itemTitle: "Title3",
      itemCriteria: "Criteria3",
      itemStatus: "Status3",
      itemResult: "예외처리",
    },
    {
      hostname: "Host4",
      itemNo: "Item004",
      itemTitle: "Title4",
      itemCriteria: "Criteria4",
      itemStatus: "Status4",
      itemResult: "해당없음",
    },
    {
      hostname: "Host5",
      itemNo: "Item005",
      itemTitle: "Title5",
      itemCriteria: "Criteria5",
      itemStatus: "Status5",
      itemResult: "양호",
    },
  ];

  let itemsPerPage = 5;
  let currentPage = 1;
  let totalItems = dataArray.length;
  let totalPages = Math.ceil(totalItems / itemsPerPage);

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

  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }
</script>

<section class="tableWrap" style="height: calc(-94px + 100vh);">
  <div class="tableListWrap">
    <table class="tableList hdBorder">
      <colgroup>
        <col style="width:14%;" />
        <col style="width:14%;" />
        <col style="width:14%;" />
        <col style="width:14%;" />
        <col style="width:14%;" />
        <col style="width:14%;" />
      </colgroup>
      <thead>
        <tr>
          <th class="text-center" style="font-size: 16px;">넘버</th>
          <th class="text-center" style="font-size: 16px;">제목</th>
          <th class="text-center" style="font-size: 16px;">작성자</th>
          <th class="text-center" style="font-size: 16px;">작성일</th>
          <th class="text-center" style="font-size: 16px;">첨부파일</th>
          <th class="text-center" style="font-size: 16px;">조회수</th>
        </tr>
      </thead>
      <tbody>
        {#each dataArray as data, index}
          <tr>
            <td class="text-center" style="font-size: 16px;">{index + 1}</td>
            <td style="font-size: 16px;" class="cursor-pointer text-center">
              {data.hostname}
            </td>
            <td style="font-size: 16px;" class="text-center line-height">
              {data.itemTitle}
            </td>
            <td
              class="text-center cursor-pointer line-height"
              style="font-size: 16px;"
            >
              <div class="line-height">
                {data.itemCriteria}
              </div>
            </td>
            <td
              style="overflow: hidden; font-size: 16px;"
              class="text-center line-height"
            >
              {data.itemStatus}
            </td>
            <td class="text-center" style="font-size: 16px;">
              <span class="">
                {data.itemResult}
              </span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
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

  .tableWrap {
    background-color: #fff;
    height: 90vh;
    border-radius: 5px;
  }

  .modal-open-wrap {
    display: block;
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(167, 167, 167, 0.6);
  }

  thead {
    position: sticky; /* Make the header sticky */
    top: 0; /* Stick the header to the top */
    z-index: 10; /* Ensure the header is above the scrolling content */
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4); /* Shadow effect for separation */
  }
  dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1103px;
    border: none;
    border-radius: 10px;
    background-color: white;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    animation: svelte-s7onsa-fadeIn 0.3s ease;
    z-index: 100;
  }

  /* Modal backdrop */
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    animation: fadeInBackdrop 0.3s ease;
  }

  tr:hover {
    cursor: pointer;
    background-color: #f4f4f4;
    transition-duration: 0.3s;
  }
  .line-height {
    line-height: 23px;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
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
</style>
