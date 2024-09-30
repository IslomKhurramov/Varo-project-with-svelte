<script>
  export let uploadStatusModalData;

  const tableHead = [
    "넘버",
    " hostname",
    "ip address",
    "target",
    "checklist",
    "Result",
  ];

  $: {
    console.log("modalData:", uploadStatusModalData);
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
</style>
