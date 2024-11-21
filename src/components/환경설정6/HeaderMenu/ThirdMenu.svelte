<script>
  import { onMount } from "svelte";
  import moment from "moment";
  import {
    downloadArticleFile,
    getAllArticles,
    getArticleDetail,
  } from "../../../services/page6/serviceArticle";
  import { errorAlert } from "../../../shared/sweetAlert";
  import SecondMenuDetails from "../SecondMenuDetails.svelte";
  // import { userData } from "../../../stores/user.store";
  // import { decryptData } from "../../../services/login/loginService";
  import NewArticle1 from "../NewArticle1.svelte";

  let userRoleTypeIndex = null;

  // ///////////////////////////////////////////////////////////////////////
  // userData.subscribe((data) => {
  //   userRoleTypeIndex = data.userInfo.user_roletype_role_index;
  // });
  // let user_roletype_role_index = decryptData(userRoleTypeIndex);
  // ///////////////////////////////////////////////////////////////////////

  let projectArray = [];
  let error = null;
  let itemsPerPage = 15;
  let currentPage = 1;
  let totalPages = 1;
  let displayedPages = [];
  let selectedData = null;
  let showNewMember = false;
  let totalItems = 0;

  async function getAllArticlesData(
    page = 1,
    limit = itemsPerPage,
    category = "DATAROOM",
  ) {
    try {
      const response = await getAllArticles({ page, limit, category });
      if (response.RESULT === "OK") {
        projectArray = response.CODE.articles
          .slice()
          .sort((a, b) => b.art_index - a.art_index);
        totalPages = response.CODE.pagination.total_pages;
        totalItems = response.CODE.pagination.total_count;
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

  // Pagination logikasi
  $: {
    const maxPagesToShow = 3;
    displayedPages = [];

    if (totalPages > 0) {
      if (currentPage <= totalPages - maxPagesToShow) {
        for (let i = currentPage; i < currentPage + maxPagesToShow; i++) {
          if (i > 0) displayedPages.push(i);
        }
        if (currentPage + maxPagesToShow - 1 < totalPages) {
          displayedPages.push(totalPages);
        }
      } else {
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          if (i > 0) displayedPages.push(i);
        }
        if (totalPages - maxPagesToShow > 0) {
          displayedPages.unshift(1);
        }
      }
    }
  }

  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      getAllArticlesData(currentPage);
    }
  }

  function handleNewMemberClose() {
    showNewMember = false;
    getAllArticlesData(currentPage);
  }

  onMount(async () => {
    getAllArticlesData(currentPage);
    const art_index = new URLSearchParams(window.location.search).get("id");
    if (art_index) {
      await getArticleDetailData(art_index);
    }
  });
</script>

<main class="table-container" style="border-radius: 10px;">
  {#if showNewMember}
    <NewArticle1 on:close={handleNewMemberClose} />
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
      <div class="tableWrap_2">
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
                    {totalItems - ((currentPage - 1) * itemsPerPage + index)}
                  </td>
                  <td>{data.title}</td>
                  <td class="text-center">{data.writer__user_name}</td>
                  <td class="text-center">
                    {moment(data.created_at).format("YYYY.MM.DD")}
                  </td>
                  <td class="text-center">
                    {#if data.file_path}
                      <a
                        href="javascript:void(0)"
                        on:click={(e) => {
                          e.stopPropagation();
                          downloadArticleFile(
                            data.file_path,
                            data.original_filename,
                          );
                        }}
                      >
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
        </div>
        <div>
          <div class="total-count">
            <p>총 데이터: <strong>{totalItems}</strong>개</p>
          </div>

          <!-- {#if parseInt(user_roletype_role_index) >= 1 && parseInt(user_roletype_role_index) <= 3} -->
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
          <!-- {/if} -->
          <!-- Pagination -->
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
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  * {
    font-size: 16px;
  }
  .table-container {
    background-color: #ffffff;
    padding: 20px;
    margin: 10px 0;
    /* width: 100%; */
    height: calc(100vh - 140px);
  }
  .tableWrap_2 {
    background-color: #fff;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    height: 80vh;
    border-radius: 5px;
    margin-top: 10px;
  }
  th,
  td {
    font-size: 16px;
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

  tr:hover {
    cursor: pointer;
    background-color: #f4f4f4;
    transition-duration: 0.3s;
  }

  .buttonContainer {
    display: flex;
    margin-top: 33px;
    align-items: flex-end;
    margin-left: 10px;
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

  .total-count {
    text-align: left;
    margin-top: 15px;
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
    margin-top: 20px;
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
