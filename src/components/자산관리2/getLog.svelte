<script>
  import moment from "moment";
  import Tooltip from "../../shared/Tooltip.svelte";

  export let logData;
</script>

<main class="contentArea mt-0">
  <div class="tableListWrap maxh">
    <table class="tableList hdBorder tableScroll">
      <colgroup>
        <col style="width:90px;" />
        <col style="width:110px;" />
        <col style="width:200px;" />
        <col style="width:110px" />
        <col />
        <col style="width:160px;" />
      </colgroup>
      <thead>
        <tr>
          <th class="text-center">순번</th>
          <th class="text-center">프로젝트NO</th>
          <th class="text-center">자산명</th>
          <th class="text-center">분류코드</th>
          <th class="text-center">로그내용</th>
          <th class="text-center">수행자</th>
          <th class="text-center">날짜</th>
          <th class="text-center">비고</th>
        </tr>
      </thead>
      <tbody>
        {#if logData.length !== 0}
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
</main>

<style>
</style>
