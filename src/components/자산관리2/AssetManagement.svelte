<script>
  import { onMount } from "svelte";
  import { allAssetGroupList } from "../../services/page2/asset.store";
  import {
    getAssetGroup,
    setAssetForNewGroup,
  } from "../../services/page2/assetService";
  import { allAssetList } from "../../services/page2/asset.store";
  import { successAlert } from "../../shared/sweetAlert";
  import { filter } from "d3";

  let showAssetReg = true;
  let showCopyReg = false;
  export let filteredAssets = [];
  export let filterAssets;
  export let selectedGroup = "";
  export let assetHost = "";
  export let assetOs = "";
  let assetRegHow = "add";
  let uploadedFile = null;
  let newRegGroupIndex = "";
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

  onMount(() => {
    assetGroupList();
    handleFilter();
  });
  /***************************************************/

  function handleFilter() {
    filterAssets();
  }

  function handleSelectChange(event) {
    const value = event.target.value;
    showAssetReg = value === "add";
    showCopyReg = value === "copy";
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".xlsx")) {
      uploadedFile = file;
      console.log("Small file uploaded:", uploadedFile);
    } else {
      alert("Please upload an .xlsx file.");
    }
  }

  /*********************************************************/

  let selectedAssets = [];
  // Handle selection of individual assets and track their UUIDs
  function handleAssetSelection(asset, event) {
    if (event.target.checked) {
      selectedAssets = [...selectedAssets, asset.ass_uuid];
    } else {
      selectedAssets = selectedAssets.filter((uuid) => uuid !== asset.ass_uuid);
    }
    console.log("Selected Assets UUIDs:", selectedAssets);
  }

  /**************************************************************/

  $: addingAssetForm = {
    asset_reg_how: assetRegHow,
    existed_asset_group_index: selectedGroup || "",
    target_group_index: newRegGroupIndex,
    asset_file: uploadedFile,
    asset_lists: selectedAssets,
  };
  const handleSubmit = async () => {
    // Validate required fields
    if (!newRegGroupIndex) {
      alert("Please select a target asset group.");
      return; // Early return if validation fails
    }

    console.log("Submitting asset data:", addingAssetForm); // Debugging log
    try {
      const response = await setAssetForNewGroup(addingAssetForm);
      if (response.success) {
        successAlert("자산이 새 그룹에 성공적으로 등록되었습니다.");
        // Reset form values
        selectedAssets = [];
        selectedGroup = "";
        newRegGroupIndex = "";

        if (uploadedFile) {
          document.querySelector('input[type="file"]').value = "";
          uploadedFile = null;
        }
      } else {
        throw new Error("Failed to register asset");
      }
    } catch (error) {
      console.error("Submission error:", error); // Log the error
      alert("Error occurred: " + error.message);
    }
  };

  /**************************************************************/
  let selected = [];
  $: allSelected =
    selected.length === (filteredAssets.length || $allAssetList.length);

  function toggleAll() {
    const allAssets =
      filteredAssets.length > 0 ? filteredAssets : $allAssetList;
    if (allSelected) {
      selected = [];
      selectedAssets = [];
    } else {
      selected = [...allAssets];
      selectedAssets = allAssets.map((asset) => asset.ass_uuid);
    }
    console.log("Selected Assets UUIDs (after toggle):", selectedAssets);
  }
  function check() {
    console.log("assetHost", assetHost);
    console.log("assetOst", assetOs);
    console.log("assetRegHow", assetRegHow);
    console.log("newRegGroupIndex", newRegGroupIndex);
  }
  // Handle changes in asset hostname selection
  function handleHostnameChange(event) {
    assetHost = event.target.value;
    // No need to call filterAssets manually, Svelte will reactively update filteredAssets
  }

  // Handle changes in asset OS type selection
  function handleOSTypeChange(event) {
    assetOs = event.target.value;
    // No need to call filterAssets manually
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <article class="contentArea">
    <div class="formControlWrap">
      <div class="formControl">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>생성방법</label>
        <div class="radioWrap">
          <label class="radio-label">
            <input
              type="radio"
              name="type"
              value="add"
              checked
              on:change={handleSelectChange}
            />
            <span>자산등록</span>
          </label>
          <label class="radio-label">
            <input
              type="radio"
              name="type"
              value="copy"
              on:change={handleSelectChange}
            />
            <span>기존그룹복사</span>
          </label>
        </div>
      </div>
    </div>
  </article>
  {#if showAssetReg}
    <article class="contentArea registCon">
      <div class="formControlWrap">
        <div class="formControl">
          <div class="upload-section">
            <label for="file-upload" class="file-label">파일첨부</label>
            <input
              type="file"
              id="file-upload"
              accept=".xls,.xlsx"
              class="file-input"
              on:change={handleFileUpload}
            />

            <p class="btn btnPrimary w160 h50">대용량업로드(엑셀파일)</p>
            <a
              href="https://119.65.247.158:9001/api/getAssetListSampleExcel/"
              style="color: black;">샘플다운로드</a
            >
          </div>
        </div>
      </div>
    </article>
  {/if}

  <article class="contentArea flex col gap-20">
    <div class="second_line_container">
      <div class="right_container">
        <div class="top registCon">
          <section class="filterWrap">
            <div>
              <p>선택된 자산 그룹:</p>
              <select bind:value={selectedGroup} on:change={handleFilter}>
                <option value="">자산 그룹</option>
                {#if $allAssetGroupList.length > 0}
                  {#each $allAssetGroupList as group}
                    <option value={group.asg_index}>{group.asg_title}</option>
                  {/each}
                {/if}
              </select>
            </div>
            <div>
              <p>자산에 대한 새 그룹을 선택하세요:</p>
              <select bind:value={newRegGroupIndex}>
                <option value="">자산 그룹</option>
                {#if $allAssetGroupList.length > 0}
                  {#each $allAssetGroupList as group}
                    <option value={group.asg_index}>{group.asg_title}</option>
                  {/each}
                {/if}
              </select>
            </div>
          </section>
        </div>

        <div class="top registCon">
          <section class="filterWrap">
            <div>
              <select bind:value={assetHost} on:change={handleHostnameChange}>
                <option value="">Select Hostname</option>
                {#each $allAssetList as asset (asset.ass_uuid)}
                  <option value={asset.ast_hostname}>
                    {asset.ast_hostname}
                  </option>
                {/each}
              </select>

              <!-- Select for ast_ostype -->
              <select bind:value={assetOs} on:change={handleOSTypeChange}>
                <option value="">Select OS Type</option>
                {#each $allAssetList as asset (asset.ass_uuid)}
                  {#if asset.ast_ostype !== ""}
                    <option value={asset.ast_ostype}>
                      {asset.ast_ostype}
                    </option>
                  {/if}
                {/each}
              </select>

              <button
                class="btn btnBlue w140"
                on:click|preventDefault={filterAssets}>저장</button
              >
            </div>
          </section>
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
        <section class="maxheight registCon">
          <div class="cardWrap col5">
            {#each filteredAssets.length > 0 ? filteredAssets : $allAssetList as asset}
              <article class="card">
                <div class="checkboxWrap default">
                  <input
                    class="checkboxWrap default"
                    type="checkbox"
                    checked={selectedAssets.includes(asset.ass_uuid)}
                    on:change={(event) => handleAssetSelection(asset, event)}
                  /> <span></span>
                </div>
                <div class="imageWrap flex align-center gap-20">
                  <!-- svelte-ignore a11y-img-redundant-alt -->
                  <img src="./assets/images/asset_window.png" alt="img" />
                  <div class="head">
                    {#if asset.assessment_target_system && Array.isArray(asset.assessment_target_system)}
                      {#each asset.assessment_target_system as target}
                        {#if target && typeof target === "object"}
                          {#each Object.entries(target) as [key, value]}
                            {#if value}
                              <p>{key}</p>
                            {/if}
                          {/each}
                        {/if}
                      {/each}
                    {/if}
                  </div>
                </div>
                <div class="content">
                  <ul>
                    <li><span>이름:</span> {asset.ast_hostname}</li>
                    <li><span>아피:</span> {asset.ast_ipaddr}</li>
                  </ul>
                </div>
              </article>
            {/each}
          </div>
        </section>
        <div class="div2">
          <button type="submit">저장하기 </button>
        </div>
      </div>
    </div>
  </article>
</form>

<style>
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

  .second_line_container {
    display: flex;
    flex-direction: row;
    gap: 35px;
    max-height: 500px;
    overflow-x: hidden; /* Prevent horizontal overflow */
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
  .headerSelect {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }

  .headerSelect div {
    flex: 1;
    display: flex;
    flex-direction: row;
  }

  .headerSelect p {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 10px;
    color: #333;
  }

  .headerSelect select {
    font-size: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    color: #333;
    transition: border 0.3s ease;
    width: 61%;
    margin-top: 12px;
  }

  .headerSelect select:hover {
    border-color: #888;
  }

  .headerSelect select:focus {
    border-color: #007bff;
    outline: none;
  }

  .headerSelect select option {
    padding: 8px;
  }

  /* Add subtle shadow to the container */
  .headerSelect {
    padding: 5;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }

  /* For better spacing between elements */
  .headerSelect div {
    margin-right: 20px;
  }
</style>
