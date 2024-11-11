<script>
  import { onMount } from "svelte";
  import moment from "moment";
  import { getAllArticles } from "../../../services/page6/serviceArticle";
  import { errorAlert } from "../../../shared/sweetAlert";

  let projectArray = [];
  let error = null;
  let itemsPerPage = 7;
  let currentPage = 1;
  let totalPages = 1;
  let displayedPages = [];

  async function getAllArticlesData(
    page = 1,
    limit = itemsPerPage,
    category = "DATAROOM",
  ) {
    try {
      const response = await getAllArticles({ page, limit, category });
      if (response.RESULT === "OK") {
        projectArray = response.CODE.articles;
        totalPages = response.CODE.pagination.total_pages;
      }
    } catch (err) {
      error = err.message;
      await errorAlert(error);
    }
  }

  onMount(() => {
    getAllArticlesData(currentPage);
  });

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
</script>

<div>
  <section class="tableWrap">
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
          {#each projectArray as data, index}
            <tr>
              <td class="text-center" style="font-size: 16px;">
                {index + 1 + (currentPage - 1) * itemsPerPage}
              </td>
              <td class="text-center" style="font-size: 16px;">{data.title}</td>
              <td class="text-center" style="font-size: 16px;">
                {data.writer__user_name}</td
              >
              <td class="text-center" style="font-size: 16px;">
                {moment(data.created_at).format("YYYY.MM.DD")}
              </td>
              <td class="text-center" style="font-size: 16px;">
                <a href={`/${data.file_path}`} target="_blank"
                  >{data.original_filename}</a
                >
              </td>
              <td class="text-center" style="font-size: 16px;">
                {data.view_count}</td
              >
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <!-- Always fixed pagination at the bottom -->
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

  tr:hover {
    cursor: pointer;
    background-color: #f4f4f4;
    transition-duration: 0.3s;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    position: sticky;
    bottom: 100px;
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
