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

<table class="">
  <thead>
    <tr>
      <th>넘버</th>
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
      <th>ip address</th>
      <th>target</th>
      <th>checklist</th>
      <th
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
        <td>{index + 1}</td>
        <td>{data?.hostname}</td>
        <td>{data?.ipaddr}</td>
        <td>{data?.target}</td>
        <td>{data?.checklist_count}</td>
        <td>{data?.uploaded_result_count}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    width: 100%;
  }
  table,
  th,
  td {
    border: 1px solid;
    border-collapse: collapse;
    margin-bottom: 10px;
    color: #6e6f6f;
  }

  thead tr {
    background-color: #f3f7d9;
  }

  td {
    text-align: center;
  }

  th,
  td {
    padding: 5px 3px;
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
