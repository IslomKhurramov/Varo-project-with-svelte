<script>
  export let filteredData = [];
  export let selectedCategory = "UNIX";
  export let selectedChecklist = null;

  let showModal = false;
  let formattedDate = "";
  let selectedItem = null;

  // Filter the data according to the selected checklist index
  let filteredChecklistData = [];

  // Ensure selectedChecklist[selectedCategory] is an array
  $: if (selectedChecklist) {
    filteredChecklistData = selectedChecklist[selectedCategory] || [];
    if (!Array.isArray(filteredChecklistData)) {
      filteredChecklistData = [];
    }
  }
</script>

<main>
  <div class="table2">
    <table class="table">
      <thead>
        <tr>
          <th>남버</th>
          <th>점검대상</th>
          <th>항목그룹</th>
          <th>식별코드</th>
          <th>점검항목</th>
          <th>위험도</th>
          <th>평가기준</th>
        </tr>
      </thead>
      <tbody>
        {#if filteredChecklistData.length > 0}
          {#each filteredChecklistData as item, index}
            <tr
              on:click="{() => {
                selectedItem = item;
                showModal = true;
              }}"
            >
              <td>{index + 1}</td>
              <td>{selectedCategory}</td>
              <td>{item[0]}</td>
              <td>{item[5]}</td>
              <td>{item[4]}</td>
              <td>{item[6]}</td>
              <td>{item[11]}</td>
            </tr>
          {/each}
        {:else}
          <tr>
            <td colspan="7">No data available</td>
          </tr>
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
    margin-top: 40px;
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
</style>
