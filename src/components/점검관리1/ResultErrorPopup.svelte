<script>
  export let modalErrorData;

  const tableHead = ["넘버", "target", "hostname", "ip address", "file", "etc"];
</script>

<table class="tableListWrap">
  <colgroup>
    <col style="width:90px;" />
    <col />
    <col />
    <col style="width:120px;" />
    <col style="width:30%;" />
    <col style="width:15%;" />
  </colgroup>
  <thead
    class="tableList hdBorder"
    style="position: sticky;top: -16px;font-size: 16px;"
  >
    <tr>
      <th>넘버</th>
      <th>target</th>
      <th>hostname</th>
      <th>ip address</th>
      <th>file</th>
      <th>etc</th>
    </tr>
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
  tr:hover {
    background-color: rgba(242, 242, 242, 1);
    cursor: pointer;
  }
  td,
  th {
    text-align: center;
    font-size: 16px;
  }

  /* table,
  th,
  td {
    border: 1px solid;
    border-collapse: collapse;
    margin-bottom: 10px;
    color: #6e6f6f;
  } */

  /* thead tr {
    background-color: #f3f7d9;
  }

  td {
    text-align: center;
  }

  th,
  td {
    padding: 5px 3px;
  } */
</style>
