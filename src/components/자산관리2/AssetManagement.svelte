<script>
  import { onMount } from "svelte";
  import { allAssetGroupList } from "../../services/page2/asset.store";
  import { getAssetGroup } from "../../services/page2/assetService";
  import { allAssetList } from "../../services/page2/asset.store";

  let showAssetReg = true;
  let showCopyReg = false;
  let filteredAssets = [];
  let selectedGroup = "";
  let assetRegHow = "자산등록";
  /****************************************************/
  async function assetGroupList() {
    try {
      const response = await getAssetGroup();

      if (response.RESULT === "OK") {
        allAssetGroupList.set(Object.values(response.CODE));
        console.log("CALLED GROUP", allAssetGroupList);

        console.log("Filtered Assets", filteredAssets); // Log filtered assets
      }
    } catch (err) {
      throw err;
    }
  }
  // Function to filter assets based on the selected group
  function filterAssets() {
    console.log("Selected Group:", selectedGroup);
    filteredAssets = $allAssetList.filter((asset) => {
      if (Array.isArray(asset.asset_group)) {
        return asset.asset_group.some(
          (group) => group.asg_index === selectedGroup,
        );
      }
      return false;
    });
  }
  onMount(() => {
    assetGroupList();
    console.log("reg How", assetRegHow);
    console.log("pointHISTORY", filteredAssets);
    console.log("assetRegHow", assetRegHow);
  });
  /***************************************************/

  function handleSelectChange(event) {
    const value = event.target.value;
    showAssetReg = value === "자산등록";
    showCopyReg = value === "기존그룹복사";
  }
  /*********************************************************/

  let selectedAssets = [];
  // Handle selection of individual assets and track their UUIDs
  function handleAssetSelection(asset, event) {
    if (event.target.checked) {
      // Add asset UUID to selectedAssets array if checked
      selectedAssets = [...selectedAssets, asset.ass_uuid];
    } else {
      // Remove asset UUID from selectedAssets if unchecked
      selectedAssets = selectedAssets.filter((uuid) => uuid !== asset.ass_uuid);
    }
    console.log("Selected Assets UUIDs:", selectedAssets); // Check selected UUIDs
  }

  let selected = [];
  $: allSelected =
    selected.length === (filteredAssets.length || $allAssetList.length);

  function toggleAll() {
    if (allSelected) {
      selected = [];
      selectedAssets = []; // Clear selected assets UUIDs
    } else {
      const allAssets =
        filteredAssets.length > 0 ? filteredAssets : $allAssetList;
      selected = [...allAssets];
      // Store all selected asset UUIDs
      selectedAssets = allAssets.map((asset) => asset.ass_uuid);
    }
    console.log("Selected Assets UUIDs (after toggle):", selectedAssets); // Check selected UUIDs
  }
  function check() {
    console.log("assetRegHow", assetRegHow);
  }
</script>

<main>
  <div class="select_group">
    <div class="select_container">
      <button class="select_button" on:click={check}>생성방법</button>
      <select
        name="asset_group"
        id="asset_group"
        class="select_input"
        on:change={handleSelectChange}
        bind:value={assetRegHow}
      >
        <option value="자산등록">자산등록 </option>
        <option value="기존그룹복사">기존그룹복사</option>
      </select>
    </div>
  </div>

  {#if showCopyReg}
    <div class="second_container">
      <p>생성방법</p>
      <div class="inside_container">
        <div class="first_line_container">
          <input type="file" />
          <input type="file" />
          <p>대용량업로드(엑셀파일)</p>
          <a
            href="https://119.65.247.158:9001/api/getAssetListSampleExcel/"
            style="color: aliceblue;">샘플다운로드</a
          >
        </div>
      </div>
    </div>
  {/if}
  <div class="second_container">
    <p>생성방법</p>
    <div class="inside_container">
      <div class="second_line_container">
        <div class="right_container">
          <select bind:value={selectedGroup} on:change={filterAssets}>
            <option value="">Select Asset Group</option>
            {#if $allAssetGroupList.length > 0}
              {#each $allAssetGroupList as group}
                <option value={group.asg_index}>{group.asg_title}</option>
              {/each}
            {/if}
          </select>
          <div class="option_container">
            <div class="div1">
              <select name="" id="">
                <option value=""></option>
              </select>
              <select name="" id="">
                <option value=""></option>
              </select>
              <select name="" id="">
                <option value=""></option>
              </select>
            </div>
            <div class="div2">
              <button>저장</button>
            </div>
          </div>
          <div class="first_check_cont">
            <input
              type="checkbox"
              class="first_checkbox"
              on:click={toggleAll}
              checked={allSelected}
            />
            <p>전체선택</p>
          </div>
          <div class="card_container">
            {#each filteredAssets.length > 0 ? filteredAssets : $allAssetList as asset}
              <div class="card">
                <input
                  type="checkbox"
                  class="card_checkbox"
                  checked={selectedAssets.includes(asset.ass_uuid)}
                  on:change={(event) => handleAssetSelection(asset, event)}
                />
                <div class="img_container">
                  <img src="./images/Picture1.png" alt="Image description" />
                  <div class="img_overlay">
                    <p>{asset.assessment_target_system}</p>
                    <p>DBMS</p>
                  </div>
                </div>
                <div class="info_card">
                  <p><strong>이름:</strong> {asset.ast_hostname}</p>
                  <p><strong>아피:</strong> {asset.ast_ipaddr}</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  main {
    background-color: #f7f9fb;
    width: 100%;
    color: #333; /* Darker text color for better readability */
    box-sizing: border-box;
    overflow-x: hidden; /* Prevent horizontal scroll */
    font-family: "Arial", sans-serif;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }

  .select_group {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 60%; /* Ensure it doesn’t exceed the container */
    margin: 0 auto;
  }

  .select_container {
    display: flex;
    align-items: center;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .select_button {
    background-color: #005fa3;
    color: #fff;
    padding: 12px 24px;
    border: none;
    font-size: 12px;
    font-weight: bold;
    transition: background-color 0.3s ease;
    border-right: 1px solid #3e3e3e;
    flex-shrink: 0;
    width: 140px;
  }

  .select_button:hover {
    background-color: #005a99;
  }

  .select_input {
    width: 100%;
    padding: 12px;
    border: none;
    font-size: 12px;
    background-color: #fff;
    color: #000;
    cursor: pointer;
    outline: none;
  }

  .select_input:hover,
  .select_input:focus {
    background-color: #e0e0e0;
  }

  .select_input option {
    background-color: #fff;
    color: #000;
  }

  .second_container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
  }

  .second_container p {
    color: #333;
    margin-bottom: 10px;
  }

  .inside_container {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #ddd;
    background-color: #f9f9f9;
    color: #333;
    padding: 20px;
    box-sizing: border-box;
  }

  .first_line_container {
    display: flex;
    flex-direction: row;
    gap: 10px;
    background-color: #005fa3;
    border-radius: 10px;
    color: #fff;
    padding: 15px;
  }

  .first_line_container p {
    margin: 0;
    font-weight: bold;
    color: #f2f3f4;
  }

  .second_line_container {
    display: flex;
    flex-direction: row;
    gap: 35px;
    max-height: 500px;
    overflow-x: hidden; /* Prevent horizontal overflow */
  }

  .group_container {
    width: 250px;
    font-family: "Roboto", sans-serif;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-height: 100%;
  }

  .group_container p {
    margin: 5px 0;
    font-size: 12px;
    color: #333;
    padding: 8px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  .group_container p:hover {
    cursor: pointer;
    background-color: #37a5f3;
    color: #fff;
  }

  .right_container {
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: #fff;
    gap: 10px;
    padding: 20px;
    border-radius: 10px;
    box-sizing: border-box;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow-x: hidden; /* Prevent horizontal overflow */
  }

  .option_container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    width: 100%;
    justify-content: space-between;
  }

  .option_container select {
    width: 120px;
    background-color: #f2f3f4;
    color: #333;
    border: none;
    padding: 10px;
    border-radius: 5px;
  }

  .option_container select:hover {
    background-color: #cccccc;
  }

  .option_container button {
    background-color: #0056b3;
    color: #f2f3f4;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    transition: background-color 0.3s ease;
  }

  .option_container button:hover {
    background-color: #005a99;
  }

  .card_container {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(
      auto-fill,
      minmax(150px, 1fr)
    ); /* Responsive grid */
    gap: 10px;
    row-gap: 20px;
    overflow-y: auto;
    max-height: 300px; /* Limit height */
    padding: 10px;
    box-shadow:
      inset 0 0 35px 5px rgba(0, 0, 0, 0.25),
      inset 0 2px 1px 1px rgba(255, 255, 255, 0.9),
      inset 0 -2px 1px rgba(0, 0, 0, 0.25);
  }

  .card {
    position: relative;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    color: #333;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    padding: 15px;
    width: 75%;
    height: 85px; /* Adjusted height */
    font-size: 12px;
  }

  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }

  .card_checkbox {
    top: 5px;
    left: 5px;
    position: absolute;
    cursor: pointer;
    transform: scale(1.2);
  }

  .img_container {
    position: relative;
    overflow: hidden;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    justify-content: center;
  }

  .img_container img {
    width: 40px;
    height: 40px;
    display: block;
    transition: transform 0.3s ease;
  }

  .img_container:hover img {
    transform: scale(1.1);
  }

  .img_overlay {
    color: #000;
    padding: 5px;
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  .img_overlay p {
    margin: 0;
    font-size: 10px;
  }

  .info_card {
    padding-top: 5px;
  }

  .info_card p {
    margin: 2px 0;
    font-size: 10px;
    color: #333;
  }

  .first_checkbox {
    width: 13px;
    cursor: pointer;
    transform: scale(1.2);
    margin-top: 10px;
  }

  .first_check_cont {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    width: 100%;
    margin-top: 10px;
  }

  .input_buttons {
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: center;
    width: 100%;
    margin-top: 20px;
  }

  .save_button {
    background-color: #0056b3;
    color: #fff;
    width: 120px;
    height: 40px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .save_button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>
