<script>
  export let uploadStatusModalData;

  let sortPoint = "ASC";
  let sortHost = "ASC";
  let sorted = false;

  function sortData(field, sort, setSort) {
    if (sort === "ASC") {
      uploadStatusModalData.uploaded_status =
        uploadStatusModalData?.uploaded_status.sort((a, b) => {
          if (typeof a[field] === "string") {
            return a[field].localeCompare(b[field]);
          }
          return a[field] - b[field];
        });
      setSort("DESC");
    } else {
      uploadStatusModalData.uploaded_status =
        uploadStatusModalData?.uploaded_status.sort((a, b) => {
          if (typeof a[field] === "string") {
            return b[field].localeCompare(a[field]);
          }
          return b[field] - a[field];
        });
      setSort("ASC");
    }
  }

  $: {
    if (
      !sorted &&
      uploadStatusModalData?.uploaded_status &&
      uploadStatusModalData?.uploaded_status?.length !== 0 &&
      uploadStatusModalData?.uploaded_status
    ) {
      // uploadStatusModalData.uploaded_status =
      //   uploadStatusModalData?.uploaded_status.sort((a, b) => {
      //     return a.ast_security_point - b.ast_security_point;
      //   });
      uploadStatusModalData.uploaded_status =
        uploadStatusModalData?.uploaded_status.sort((a, b) => {
          return b.hostname.localeCompare(a.hostname);
        });
      sorted = true;
    }
  }
</script>

<div class="tableListWrap">
  <table class="tableList hdBorder font-size: 16px;">
    <colgroup>
      <col style="width:90px;" />
      <col style="width:120px" />
      <col style="width:120px;" />
      <col style="width:120px;" />
      <col style="width:20%;" />
      <col style="width:120px;" />
    </colgroup>
    <thead>
      <tr>
        <th class="text-center">넘버</th>
        <th
          on:click={() =>
            sortData("hostname", sortHost, (newSort) => (sortHost = newSort))}
        >
          <p class="sort-img">
            hostname
            <!-- svelte-ignore a11y-missing-attribute -->
            <img
              src="./assets/images/icon/sort.svg"
              class={sortHost !== "ASC" ? "rotate" : ""}
            />
          </p>
        </th>
        <th class="text-center">ip address</th>
        <th class="text-center">target</th>
        <th class="text-center">checklist</th>
        <th
          class="text-center"
          on:click={() =>
            sortData(
              "uploaded_result_count",
              sortPoint,
              (newSort) => (sortPoint = newSort),
            )}
        >
          <p class="sort-img">
            Result
            <!-- svelte-ignore a11y-missing-attribute -->
            <img
              src="./assets/images/icon/sort.svg"
              class={sortPoint !== "ASC" ? "rotate" : ""}
            />
          </p>
        </th>
      </tr>
    </thead>
    <tbody>
      {#each uploadStatusModalData?.uploaded_status && uploadStatusModalData?.uploaded_status?.length !== 0 && uploadStatusModalData?.uploaded_status as data, index}
        <tr>
          <td class="text-center">{index + 1}</td>
          <td class="text-center">{data?.hostname}</td>
          <td class="text-center">{data?.ipaddr}</td>
          <td class="text-center">{data?.target}</td>
          <td class="text-center">{data?.checklist_count}</td>
          <td class="text-center">{data?.uploaded_result_count}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  table {
    width: 100%;
  }

  tr:hover {
    background-color: rgba(242, 242, 242, 1);
    cursor: pointer;
  }
  td,
  th {
    font-size: 16px;
  }
  .sort-img {
    cursor: pointer;
    display: flex;
    text-align: center;
    justify-content: center;
  }

  .sort-img img {
    width: 20px;
    height: 20px;
    margin-left: 5px;
  }

  .rotate {
    transform: rotate(180deg);
  }
</style>
