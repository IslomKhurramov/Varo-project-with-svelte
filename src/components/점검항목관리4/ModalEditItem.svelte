<script>
  export let selectedItem;
  export let selectedCategory;

  $: selectedItem && console.log("DATAMODAL", selectedItem);
</script>

<div class="modal">
  <table>
    {#if selectedItem}
      <tr>
        <th>점검대상</th>
        <td>{selectedCategory}</td>
      </tr>
      <tr>
        <th>항목그룹</th>
        <td>{selectedItem.ccc_item_group}</td>
      </tr>
      <tr>
        <th>정검목적</th>
        <td>{selectedItem.ccc_check_purpose}</td>
      </tr>
      <tr>
        <th>보안위협</th>
        <td>{selectedItem.ccc_security_threat}</td>
      </tr>
      <tr>
        <th>점검내용</th>
        <td>{selectedItem.ccc_check_content}</td>
      </tr>
      <tr>
        <th>대상시스템</th>
        <td>{selectedItem.ccc_target_system}</td>
      </tr>
      <tr>
        <th>식별코드</th>
        <td>{selectedItem.ccc_item_no}</td>
      </tr>
      <tr>
        <th>점검항목</th>
        <td>{selectedItem.ccc_item_title}</td>
      </tr>
      <tr>
        <th>위험도</th>
        <td>{selectedItem.ccc_item_level}</td>
      </tr>
      <tr>
        <th>평가기준</th>
        <td>{selectedItem.ccc_item_criteria}</td>
      </tr>
      <tr>
        <th>조치방안</th>
        <td>{selectedItem.ccc_mitigation_method}</td>
      </tr>
      <tr>
        <th>조치예시</th>
        <td>{selectedItem.ccc_mitigation_example}</td>
      </tr>
      <tr>
        <th>조치시영향도</th>
        <td>{selectedItem.ccc_impact || "N/A"}</td>
      </tr>
    {:else}
      <tr>
        <td colspan="2">No data available</td>
      </tr>
    {/if}
  </table>
</div>

<style>
  .modal {
    border-radius: 10px;
    background-color: #f9f9f9;
    padding: 20px;
    max-width: 700px;
    margin: 0 auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    margin-bottom: 20px;
  }

  th,
  td {
    border: 1px solid #dddddd;
    padding: 12px 15px;
    text-align: left;
  }

  th {
    background-color: #f1f1f1;
    color: #333;
    font-weight: bold;
    width: 120px;
  }

  .lineCol {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .line5,
  .line7 {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: flex-start;
  }

  .line5 select {
    height: 30px;
    padding: 5px;
    border-radius: 4px;
    border: 1px solid #ddd;
  }

  .status {
    font-size: 12px;
    color: #555;
    margin-top: 5px;
  }

  .file-input {
    border: 1px solid #ccc;
    padding: 5px;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
