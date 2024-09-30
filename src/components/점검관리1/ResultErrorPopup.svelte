<script>
  export let modalErrorData;

  const tableHead = ["넘버", "target", "hostname", "ip address", "file", "etc"];

  $: {
    console.log("modalData:", modalErrorData);
  }
</script>

<table class="">
  <thead>
    <tr>
      {#each tableHead as columnHeading}
        <th>{columnHeading}</th>
      {/each}
    </tr><tr />
  </thead>
  <tbody>
    {#each modalErrorData as data, index}
      <tr>
        <td>{index + 1}</td>
        <td>{data?.clf_target}</td>
        <td>{data?.clf_hostname ?? "-"}</td>
        <td>{data?.clf_ipaddr ?? "-"}</td>
        <td>{data?.clf_orig_file}</td>
        <td>{data?.clf_etc}</td>
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
</style>
