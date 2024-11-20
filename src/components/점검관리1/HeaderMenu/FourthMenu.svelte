<script>
  import { getPlanLists } from "../../../services/page1/newInspection";
  import {
    getAuditNLog,
    getPlanFilter,
  } from "../../../services/logs/logsService";
  import moment from "moment";
  import { onMount } from "svelte";
  import Tooltip from "../../../shared/Tooltip.svelte";
  import { errorAlert } from "../../../shared/sweetAlert";

  export let projectIndex;

  let projects;
  let searchFilters;
  let logData = null;
  let currentPageNum = 1;
  // let totalPages;
  let pageNumbers = [];
  const itemsPerPage = 15;

  let search = {
    plan_index: "",
    asset_name: "",
    order_user: "",
    search_start_date: "",
    search_end_date: "",
    his_type: "plan",
    page_cnt: "1",
    list_cnt: itemsPerPage.toString(),
  };

  onMount(async () => {
    try {
      searchFilters = await getPlanFilter();
      await searchDataHandler();
    } catch (err) {
      await errorAlert(err?.message);
    }
  });

  let totalRecords = 0;
  let totalPages = 1;
  let visiblePages = 5; // Number of page buttons to show

  const searchDataHandler = async () => {
    search.page_cnt = currentPageNum.toString();
    const response = await getAuditNLog(search);
    if (response) {
      logData = response;
      totalRecords = response.total_rec_cnt;
      totalPages = Math.ceil(totalRecords / itemsPerPage);
      updatePageNumbers();
    }
  };

  const updatePageNumbers = () => {
    let start = Math.max(1, currentPageNum - Math.floor(visiblePages / 2));
    let end = Math.min(totalPages, start + visiblePages - 1);

    // Adjust start if end is maxed out
    start = Math.max(1, end - visiblePages + 1);

    pageNumbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const goToPage = async (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      currentPageNum = pageNum;
      await searchDataHandler();
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);

  const resetFilters = async () => {
    currentPageNum = 1;
    search = {
      plan_index: projectIndex ?? "",
      asset_name: "",
      order_user: "",
      search_start_date: "",
      search_end_date: "",
      his_type: "plan",
      page_cnt: "1",
      list_cnt: itemsPerPage.toString(),
    };
    await searchDataHandler();
  };

  $: {
    if (projectIndex && !logData) {
      search = { ...search, plan_index: projectIndex };
      searchDataHandler();
    }
  }

  const getRowNumber = (index) => {
    return totalRecords - ((currentPageNum - 1) * itemsPerPage + index);
  };

  console.log("logData:", logData);
</script>

<article class="contentArea">
  <section class="filterWrap">
    <div>
      <select
        id="project"
        bind:value={search.plan_index}
        on:change={searchDataHandler}
      >
        <option value="" selected>전체</option>

        {#if searchFilters?.plans && searchFilters?.plans?.length !== 0}
          {#each searchFilters?.plans as plan}
            <option value={plan.ccp_index}>{plan.ccp_title}</option>
          {/each}
        {/if}
      </select>
      <select
        id="target"
        bind:value={search.order_user}
        on:change={searchDataHandler}
      >
        <option value="" selected>수행자</option>
        {#if searchFilters?.users && searchFilters?.users?.length !== 0}
          {#each searchFilters?.users as user}
            <option value={user.user_name}>{user.user_name}</option>
          {/each}
        {/if}
      </select>
      <div class="dateWrap">
        <div class="date">
          <input
            type="date"
            class="datepicker"
            placeholder="시작일시"
            bind:value={search.search_start_date}
            on:change={searchDataHandler}
          />
        </div>
        <img src="./assets/images/icon/dash.svg" />
        <div class="date">
          <input
            type="date"
            class="datepicker"
            placeholder="종료일시"
            bind:value={search.search_end_date}
            on:change={searchDataHandler}
          />
        </div>
      </div>
      <button type="button" class="btn btnPrimary" on:click={resetFilters}>
        <img src="./assets/images/reset.png" alt="search" />
        초기화
      </button>
    </div>
  </section>
  <section
    class="tableWrap"
    style="height: calc(-374px + 100vh); overflow: auto;"
  >
    <div class="tableListWrap">
      <table class="tableList hdBorder">
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
            <th class="text-center">번호</th>
            <th class="text-center">프로젝트명</th>
            <th class="text-center">자산명</th>
            <th class="text-center">분류코드</th>
            <th class="text-center">로그내용</th>
            <th class="text-center">수행자</th>
            <th class="text-center">날짜</th>
            <th class="text-center">비고</th>
          </tr>
        </thead>
        <tbody>
          {#if logData?.data && logData?.data?.length !== 0}
            {#each logData?.data as data, index}
              <tr>
                <td class="text-center" style="font-size: 16px;">
                  {getRowNumber(index)}
                </td>
                <td class="text-center" style="font-size: 16px;"
                  >{data?.ccp_index}</td
                >
                <td class="text-center" style="font-size: 16px;"
                  >{data?.ast_uuid}</td
                >
                <td class="text-center" style="font-size: 16px;"
                  >{data?.his_type}</td
                >
                <td class="text-center" style="font-size: 16px;"
                  >{data?.his_orig_data}</td
                >
                <td class="text-center" style="font-size: 16px;"
                  >{data?.his_order_user}</td
                >
                <td class="text-center" style="font-size: 16px;"
                  >{moment(data?.his_udate).format("YYYY-MM-DD hh:mm:ss")}</td
                >
                <td class="text-center" style="font-size: 16px;">
                  <Tooltip text={data?.his_full_data}>비고</Tooltip>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </section>
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
</article>

<style>
  * {
    font-size: 16px;
  }
  thead {
    position: sticky; /* Make the header sticky */
    top: 0; /* Stick the header to the top */
    z-index: 10; /* Ensure the header is above the scrolling content */
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4); /* Shadow effect for separation */
  }
  td,
  th {
    font-size: 16px;
  }
  td {
    font-size: 16px;
  }
  tr:hover {
    cursor: pointer;
    background-color: #f4f4f4;
    transition-duration: 0.3s;
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
