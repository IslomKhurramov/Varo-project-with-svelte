<script>
  import { getPlanLists } from "../../../services/page1/newInspection";
  import {
    getAuditNLog,
    getPlanFilter,
  } from "../../../services/logs/logsService";
  import moment from "moment";
  import { onMount } from "svelte";
  import Tooltip from "../../../shared/Tooltip.svelte";

  export let projectIndex;

  let projects;
  let searchFilters;
  let logData = null;
  let search = {
    plan_index: "",
    asset_name: "",
    order_user: "",
    search_start_date: "",
    search_end_date: "",
  };

  onMount(async () => {
    searchFilters = await getPlanFilter();
  });

  const searchDataHandler = async () => {
    logData = await getAuditNLog(search);
  };

  $: {
    if (projectIndex && !logData) {
      search = { ...search, plan_index: projectIndex };
      searchDataHandler();
      console.log("triger data", searchFilters);
      console.log("logData", logData);
    }
  }
</script>

<!-- <main>
  <div class="firstLine">
    <div class="dropdown-group">
      <div class="dropdown-container">
        <label for="project">프로젝트:</label>
        <select
          id="project"
          bind:value={search.plan_index}
          on:change={searchDataHandler}
        >
          <option value="" selected disabled>선택</option>
          {#if searchFilters?.plans && searchFilters?.plans?.length !== 0}
            {#each searchFilters?.plans as plan}
              <option value={plan.ccp_index}>{plan.ccp_title}</option>
            {/each}
          {/if}
        </select>
      </div>
      <div class="dropdown-container">
        <label for="target">수행자:</label>
        <select
          id="target"
          bind:value={search.order_user}
          on:change={searchDataHandler}
        >
          <option value="" selected>선택</option>
          {#if searchFilters?.users && searchFilters?.users?.length !== 0}
            {#each searchFilters?.users as user}
              <option value={user.user_name}>{user.user_name}</option>
            {/each}
          {/if}
        </select>
      </div>
      <div class="dropdown-container">
        <label for="target">날짜:</label>
        <div>
          <input
            type="date"
            bind:value={search.search_start_date}
            on:change={searchDataHandler}
          />
          ~
          <input
            type="date"
            bind:value={search.search_end_date}
            on:change={searchDataHandler}
          />
        </div>
      </div>
    </div>
    <div class="button-group">
      <button class="firstlineButton">엑셀저장</button>
    </div>
  </div>
  <table>
    <thead>
      <tr class="first_line">
        <th>순번</th>
        <th>프로젝트NO</th>
        <th>자산명</th>
        <th>분류코드</th>
        <th>로그내용</th>
        <th>수행자</th>
        <th>날짜</th>
        <th>비고</th>
      </tr>
    </thead>
    <tbody>
      {#if logData && logData.length !== 0}
        {#each logData as data, index}
          <tr>
            <td>{index + 1}</td>
            <td>{data?.ccp_index}</td>
            <td>{data?.ast_uuid}</td>
            <td>{data?.his_type}</td>
            <td>{data?.his_orig_data}</td>
            <td>{data?.his_order_user}</td>
            <td>{moment(data?.his_udate).format("YYYY-MM-DD hh:mm:ss")}</td>
            <td>
              <Tooltip text={data?.his_full_data}>비고</Tooltip>
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</main> -->

<article class="contentArea">
  <section class="filterWrap">
    <div>
      <select
        id="project"
        bind:value={search.plan_index}
        on:change={searchDataHandler}
      >
        <option value="" selected disabled>프로젝트명</option>
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
      <!-- <button type="button" class="btn btnPrimary"
        ><img src="./assets/images/icon/search.svg" />조회</button
      > -->
    </div>
  </section>
  <section class="tableWrap">
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
          {#if logData && logData.length !== 0}
            {#each logData as data, index}
              <tr>
                <td class="text-center">{index + 1}</td>
                <td class="text-center">{data?.ccp_index}</td>
                <td class="text-center">{data?.ast_uuid}</td>
                <td class="text-center">{data?.his_type}</td>
                <td class="text-center">{data?.his_orig_data}</td>
                <td class="text-center">{data?.his_order_user}</td>
                <td class="text-center"
                  >{moment(data?.his_udate).format("YYYY-MM-DD hh:mm:ss")}</td
                >
                <td class="text-center">
                  <Tooltip text={data?.his_full_data}>비고</Tooltip>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
    <div class="paginationWrap end">
      <div class="pagination">
        <!-- <a href="">&lt;</a> -->
        <a href="" class="active">1</a>
        <a href="">2</a>
        <a href="">...</a>
        <a href="">4</a>
        <a href="">&gt;</a>
      </div>
    </div>
  </section>
</article>
