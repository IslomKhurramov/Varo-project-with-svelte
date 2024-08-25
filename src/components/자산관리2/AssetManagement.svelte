<script>
  let assetGroup = [];
  for (let i = 1; i <= 15; i++) {
    assetGroup.push({
      assetName: `자산그룹${i}`,
    });
  }
</script>

<main>
  <div class="select_group">
    <div class="select_container">
      <button class="select_button">자산그룹명</button>
      <select name="asset_group" id="asset_group" class="select_input">
        {#each assetGroup as asset}
          <option value="network_security">{asset.assetName}</option>
        {/each}
      </select>
    </div>

    <div class="select_container">
      <button class="select_button">생성방법</button>
      <select name="creation_method" id="creation_method" class="select_input">
        <option value="automated">기존 그룹에 엑셀 추가 등록 </option>
        <option value="manual">개별자산 선택 등록 </option>
        <option value="hybrid">엑셀과 개별자산 선택 등록 </option>
      </select>
    </div>
  </div>
</main>

<style>
  main {
    width: 100%;
    padding: 20px;
    font-family: "Arial", sans-serif;
    color: #e0e0e0; /* Light text color for readability */
  }

  .select_group {
    display: flex;
    flex-direction: column;
    gap: 20px; /* Space between select elements */
    max-width: 600px;
    margin: 0 auto;
  }

  .select_container {
    display: flex;
    align-items: center;
    background-color: #2e2e2e; /* Slightly lighter than the main background */
    border: 1px solid #3e3e3e;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.6); /* Stronger shadow for a more solid feel */
  }

  .select_button {
    background-color: #4682b4; /* A strong, trustworthy blue */
    color: #ffffff;
    padding: 12px 24px;
    border: none;
    font-size: 14px;
    margin-bottom: 0px;
    font-weight: bold;
    transition: background-color 0.3s ease;
    border-right: 1px solid #3e3e3e;
    flex-shrink: 0;
    width: 140px;
  }

  .select_button:hover {
    background-color: #005a99; /* Darker blue on hover */
  }

  .select_input {
    width: 100%;
    padding: 12px;
    border: none;
    font-size: 14px;
    background-color: #2e2e2e;
    color: #e0e0e0; /* Light text for readability */
    cursor: pointer;
    outline: none;
  }

  .select_input:hover,
  .select_input:focus {
    background-color: #3a3a3a;
  }

  .select_input option {
    background-color: #2e2e2e;
    color: #e0e0e0;
  }
</style>
