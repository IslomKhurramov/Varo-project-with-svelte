<script>
  import { getPlanLists } from "../../../services/page1/newInspection";
  import {
    getAuditNLog,
    getPlanFilter,
  } from "../../../services/logs/logsService";
  import moment from "moment";
  import { onMount } from "svelte";

  let projects;
  let searchFilters;
  let logData = [];
  const search = {
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
    console.log("logData:", logData);
    console.log("search:", search);
  }
</script>

<main>
  <div class="firstLine">
    <div class="dropdown-group">
      <div class="dropdown-container">
        <label for="project">프로젝트:</label>
        <select id="project" bind:value={search.plan_index}>
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
        <select id="target" bind:value={search.order_user}>
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
          <input type="date" bind:value={search.search_start_date} />
          ~
          <input type="date" bind:value={search.search_end_date} />
        </div>
      </div>
    </div>
    <div class="button-group">
      <button class="firstlineButton" on:click={searchDataHandler}>검색</button>
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
      {#if logData.length !== 0}
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
              비고
              <!-- {data?.his_full_data} -->
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</main>

<style>
  main {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-bottom: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #ccc;
    overflow-y: auto;
    height: 600px;
    background-color: #f9f9f9;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-family: "Arial", sans-serif;
    font-size: 12px;
    background-color: #ffffff;
  }

  th,
  td {
    padding: 12px 15px;
    text-align: left;
    vertical-align: middle;
  }

  th {
    background-color: #005fa3;
    color: #ffffff;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 12px;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  tr:nth-child(even) {
    background-color: #f4f4f4;
  }

  tr:hover {
    background-color: #e6f7ff;
    cursor: pointer;
  }

  tr td {
    border-bottom: 1px solid #dddddd;
  }

  thead th {
    border-bottom: 2px solid #dddddd;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  .firstLine {
    width: 100%;
    padding: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 10px;
    box-sizing: border-box;
  }

  .dropdown-group {
    margin-right: 20px;
    display: flex;
    gap: 40px;
    flex-wrap: wrap;
    align-items: center;
  }

  .dropdown-container {
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    white-space: nowrap;
  }

  .dropdown-container label {
    font-weight: bold;
    margin: 0;
    font-size: 16px;
  }

  .firstlineButton {
    background-color: #0056b3;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .firstlineButton:hover {
    background-color: #003366;
    transform: translateY(-2px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
</style>
