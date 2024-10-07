<script>
  import moment from "moment";
  import Tooltip from "../../shared/Tooltip.svelte";

  export let logData;
</script>

<main>
  <div class="table2">
    <table>
      <thead>
        <tr>
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
                <Tooltip text={data?.his_full_data}>비고</Tooltip>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    background-color: #f7f9fb;
    padding: 10px;
    margin-bottom: 40px;
    font-family: "Arial", sans-serif;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
  }

  .table2 {
    font-family: "Arial", sans-serif;
    border-collapse: collapse;
    width: 100%;
    font-size: 12px;
    color: #333;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #f7f9fb;
  }

  .table2 {
    height: 450px;
    margin-bottom: 20px;
  }

  table {
    font-family: "Arial", sans-serif;
    border-collapse: collapse;
    width: 100%;
    font-size: 12px;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
    vertical-align: middle;
  }

  th {
    background-color: #005fa3;
    color: #ffffff;
    position: sticky;
    top: 0;
    z-index: 1;
    font-size: 14px;
    white-space: nowrap;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #e0f7fa;
  }

  tr {
    cursor: pointer;
  }

  input[type="checkbox"] {
    cursor: pointer;
  }
</style>
