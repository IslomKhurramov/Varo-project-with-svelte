<script>
  import { onMount } from "svelte";
  import moment from "moment";
  import {
    getAllArticles,
    getArticleDetail,
  } from "../../../services/page6/serviceArticle";
  import { errorAlert } from "../../../shared/sweetAlert";
  import SecondMenuDetails from "../SecondMenuDetails.svelte";
  import NewArticle from "../NewArticle.svelte";

  let projectArray = [];
  let error = null;
  let itemsPerPage = 15;
  let currentPage = 1;
  let totalPages = 1;
  let displayedPages = [];
  let selectedData = null;
  let showNewMember = false;

  async function getAllArticlesData(
    page = 1,
    limit = itemsPerPage,
    category = "NOTICE",
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

  async function getArticleDetailData(art_index) {
    try {
      const response = await getArticleDetail(art_index);
      if (response.RESULT === "OK") {
        selectedData = response.CODE;
      }
    } catch (err) {
      error = err.message;
      await errorAlert(error);
    }
  }

  // Pagination logic
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

  function handleNewMemberClose() {
    showNewMember = false;
    getAllArticlesData();
  }

  onMount(() => {
    getAllArticlesData(currentPage);
  });
</script>

{#if showNewMember}
  <NewArticle on:close={handleNewMemberClose} />
{:else if selectedData}
  <SecondMenuDetails
    {selectedData}
    on:close={() => {
      selectedData = null;
      getAllArticlesData(currentPage);
    }}
  />
{:else}
  <div>
    <section class="tableWrap">
      <div class="tableListWrap">
        <table class="tableList hdBorder">
          <colgroup>
            <col style="width:3%;" />
            <col style="width:30%;" />
            <col style="width:10%;" />
            <col style="width:6%;" />
            <col style="width:10%;" />
            <col style="width:5%;" />
          </colgroup>
          <thead>
            <tr>
              <th class="text-center">번호</th>
              <th class="text-center">제목</th>
              <th class="text-center">작성자</th>
              <th class="text-center">작성일</th>
              <th class="text-center">첨부파일</th>
              <th class="text-center">조회수</th>
            </tr>
          </thead>
          <tbody>
            {#each projectArray as data, index}
              <tr
                on:click={() => {
                  getArticleDetailData(data.art_index);
                }}
              >
                <td class="text-center">
                  {index + 1 + (currentPage - 1) * itemsPerPage}
                </td>
                <td>{data.title}</td>
                <td class="text-center">{data.writer__user_name}</td>
                <td class="text-center">
                  {moment(data.created_at).format("YYYY.MM.DD")}
                </td>
                <td class="text-center">
                  {#if data.file_path}
                    <a href={`/${data.file_path}`} target="_blank">
                      {data.original_filename}
                    </a>
                  {:else}
                    없음
                  {/if}
                </td>
                <td class="text-center">{data.view_count}</td>
              </tr>
            {/each}
          </tbody>
        </table>
        <div class="buttonContainer">
          <button
            type="button"
            class="btn btnBlue btnSave"
            on:click={() => {
              showNewMember = true;
            }}
          >
            게시물추가
          </button>
        </div>
      </div>
      <!-- Pagination -->
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
    </section>
  </div>
{/if}

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

  .buttonContainer {
    text-align: center;
    margin-top: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btnSave {
    width: 150px;
    background-color: #0067ff;
    color: #fff;
    padding: 12px 30px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }

  .btnSave:hover {
    color: #fff;
    background-color: #4989ff;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-top: 20px;
    padding: 10px 0;
    background-color: #fff;
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
