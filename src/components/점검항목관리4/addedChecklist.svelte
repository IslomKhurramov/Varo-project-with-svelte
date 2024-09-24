<script>
  export let createNewChecklistGroup;
  export let allChecklistArray;
  export let newChecklistName = "";
  export let selectedChecklistForCopyId = null; // The selected checklist's ID

  function checkSelection() {
    console.log("DATACREATE:", selectedChecklistForCopyId, newChecklistName);
  }
</script>

<div class="modal-overlay">
  <div class="modal">
    <h3>새로운 진단 그룹 생성</h3>
    <div>
      <label for="source-group">복사 대상:</label>
      <select bind:value={selectedChecklistForCopyId} id="source-group">
        {#each allChecklistArray as checklist}
          <option value={checklist.ccg_index}>{checklist.ccg_group}</option>
        {/each}
      </select>
    </div>
    <div>
      <label for="new-group">신규 그룹명:</label>
      <input
        type="text"
        bind:value={newChecklistName}
        id="new-group"
        placeholder="새로운 진단 그룹명을 입력하세요"
      />
    </div>
    <div class="modal-actions">
      <button class="pretty-button" on:click={createNewChecklistGroup}
        >저장하기</button
      >
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    border-radius: 10px;
    background-color: #f9f9f9;
    padding: 20px;
    max-width: 700px;
    margin: 0 auto;
  }

  .modal-actions {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  .pretty-button {
    background: linear-gradient(135deg, #007acc, #005fa3);
    color: white;
    padding: 8px 20px;
    font-size: 12px;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .pretty-button:hover {
    background: linear-gradient(135deg, #005fa3, #004f8c);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
</style>
