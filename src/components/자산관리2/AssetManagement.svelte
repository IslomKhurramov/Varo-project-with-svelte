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

  export let selectedGroup;
  let assetHost = "전체";
  let asset_ostype = "전체";

  let assetRegHow = "add";
  let uploadedFile = null;
  let newRegGroupIndex = "전체";
  /****************************************************/
  async function assetGroupList() {
    try {
      const response = await getAssetGroup();

      if (response.RESULT === "OK") {
        allAssetGroupList.set(Object.values(response.CODE));
      }
    } catch (err) {
      throw err;
    }
  }

  onMount(() => {
    assetGroupList();
  });
  /****************************************************/
  // Function to handle filtering based on selections
  function handleFilter() {
    filteredAssets = $allAssetList.filter((asset) => {
      // Check if the asset belongs to the selected group
      const groupCondition =
        newRegGroupIndex === "전체" ||
        (Array.isArray(asset.asset_group) &&
          asset.asset_group.some(
            (group) => group.asg_index === newRegGroupIndex,
          ));

      // Check if the asset matches the selected hostname
      const hostCondition =
        assetHost === "전체" || asset.ast_hostname === assetHost;

      // Check if the asset matches the selected OSType
      const ostypeCondition =
        asset_ostype === "전체" || asset.ast_ostype === asset_ostype;

      return groupCondition && hostCondition && ostypeCondition;
    });
  }

  // Optional: If you want to reset filters
  function resetFilters() {
    newRegGroupIndex = "전체"; // Reset group selection
    assetHost = "전체"; // Reset hostname selection
    asset_ostype = "전체"; // Reset OSType selection
    handleFilter(); // Apply the reset immediately
  }

  // Call handleFilter on mount or whenever $allAssetList changes
  onMount(() => {
    handleFilter();
  });
  /***************************************************/

  function handleSelectChange(event) {
    const value = event.target.value; // Get the selected value
    assetRegHow = value; // Update assetRegHow based on the selected radio button
    showAssetReg = value === "add"; // Show asset registration form if "add" is selected
    showCopyReg = value === "copy"; // Show copy registration form if "copy" is selected
  }

  function handleFileUpload(event) {
    const file = event.target.files[0]; // Get the uploaded file
    if (file && file.name.endsWith(".xlsx")) {
      uploadedFile = file; // Set the uploadedFile variable
    } else {
      alert("Please upload an .xlsx file.");
      uploadedFile = null; // Reset uploadedFile if invalid file type
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
  }

  /**************************************************************/

  $: addingAssetForm = {
    asset_reg_how: assetRegHow,
    existed_asset_group_index: newRegGroupIndex,
    target_group_index: selectedGroup,
    asset_file: uploadedFile,
    asset_lists: selectedAssets,
  };
  const handleSubmit = async () => {
    // Validate required fields
    if (!newRegGroupIndex) {
      alert("Please select a target asset group.");
      return; // Early return if validation fails
    }

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
        console.log(response);
        throw new Error("Failed to register asset");
      }
    } catch (error) {
      throw error;
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
  }

  let showCards = false;

  // Function to toggle the visibility
  const toggleCardsVisibility = () => {
    showCards = !showCards;
  };
</script>

<form
  on:submit|preventDefault={handleSubmit}
  style="overflow: scroll; height: 100vh;"
>
  <article class="contentArea" style="height: 90vh;">
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
              checked={assetRegHow === "add"}
              on:change={handleSelectChange}
            />
            <span>자산등록</span>
          </label>
          <label class="radio-label">
            <input
              type="radio"
              name="type"
              value="copy"
              checked={assetRegHow === "copy"}
              on:change={handleSelectChange}
            />
            <span>기존그룹복사</span>
          </label>
        </div>
      </div>
    </div>

    {#if showCopyReg}
      <article class="contentArea registCon">
        <div class="formControlWrap center">
          <div style="margin-left: 20px;">
            <select bind:value={newRegGroupIndex}>
              <option value="전체" selected>전체</option>
              {#if $allAssetGroupList.length > 0}
                {#each $allAssetGroupList as group}
                  <option value={group.asg_index}>{group.asg_title}</option>
                {/each}
              {/if}
            </select>
          </div>

          <button
            type="submit"
            class="btn w140 btnBlue"
            style="margin-left: 10px;"
            >저장하기
          </button>
        </div>
      </article>
    {:else if showAssetReg}
      <article class="contentArea flex col gap-20">
        <div class="second_line_container">
          <div class="right_container" style="height:70vh">
            <div class="top registCon">
              <section class="filterWrap">
                <div style="gap: 40px;">
                  <div class="upload-section">
                    <label for="file-upload" class="file-label">파일첨부</label>
                    <input
                      type="file"
                      id="file-upload"
                      accept=".xls,.xlsx"
                      class="file-input"
                      on:change={handleFileUpload}
                    />

                    <p class="btn btnPrimary w190 h50">
                      {#if uploadedFile}
                        {uploadedFile.name}
                      {:else}
                        대용량업로드(엑셀파일)
                      {/if}
                    </p>
                    <a
                      href="https://119.65.247.158:9001/api/getAssetListSampleExcel/"
                      style="color: black;">샘플다운로드</a
                    >
                  </div>

                  <div class="div2">
                    <button type="submit" class="btn w140 btnBlue"
                      >저장하기
                    </button>
                  </div>
                </div>
              </section>
            </div>

            <!-- Button to toggle visibility of cards -->
            <div class="secondLine">
              <button
                class="btn w140 btnBlue"
                on:click|preventDefault={toggleCardsVisibility}
              >
                {showCards ? "자산 숨기기" : "자산 보기"}
              </button>
              <select bind:value={newRegGroupIndex} on:change={handleFilter}>
                <option value="전체" selected>전체</option>
                {#if $allAssetGroupList.length > 0}
                  {#each $allAssetGroupList as group}
                    <option value={group.asg_index}>{group.asg_title}</option>
                  {/each}
                {/if}
              </select>
              <select
                style="margin"
                bind:value={assetHost}
                on:change={handleFilter}
              >
                <option value="전체" selected>전체</option>
                {#each $allAssetList as asset}
                  <option value={asset.ast_hostname}>
                    {asset.ast_hostname}
                  </option>
                {/each}
              </select>

              <!-- Select for ast_ostype -->
              <select bind:value={asset_ostype} on:change={handleFilter}>
                <option value="전체" selected>전체</option>
                {#each $allAssetList as asset}
                  {#if asset.ast_ostype !== ""}
                    <option value={asset.ast_ostype}>
                      {asset.ast_ostype}
                    </option>
                  {/if}
                {/each}
              </select>

              <button
                class="btn btnPrimary"
                on:click|preventDefault={resetFilters}
              >
                <img src="./assets/images/reset.png" alt="search" />초기화
              </button>
            </div>

            {#if showCards}
              <div class="first_check_cont">
                <input
                  type="checkbox"
                  class="first_checkbox"
                  on:click={toggleAll}
                  checked={allSelected}
                />
                <p>전체선택</p>
              </div>
              <section class="maxheight" style="overflow-y: auto;">
                <div class="cardWrap col5">
                  {#each filteredAssets as asset}
                    <article class="card">
                      <div class="checkboxWrap default">
                        <input
                          class="checkboxWrap default"
                          type="checkbox"
                          checked={selectedAssets.includes(asset.ass_uuid)}
                          on:change={(event) =>
                            handleAssetSelection(asset, event)}
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
            {/if}
          </div>
        </div>
      </article>
    {/if}
  </article>
</form>

<style>
  .secondLine {
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 20px;
    margin-top: 20px;
  }
  .cardWrap {
    height: 100%;
  }
  .maxheight {
    padding-bottom: 20px;
    height: 50vh;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .center {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .second_line_container {
    height: 100%;
    display: flex;
    flex-direction: row;
    gap: 35px;
    height: 100%;
    padding-bottom: 20px;
    overflow-x: hidden; /* Prevent horizontal overflow */
    overflow-y: auto;
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

  .first_checkbox {
    width: 13px;
    cursor: pointer;
    transform: scale(1.2);
    margin-top: 10px;
  }
  .btn:hover {
    color: #fff;
    background-color: #0067ff;
  }
  .first_check_cont {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    width: 100%;
    margin-top: 10px;
  }

  .headerSelect select option {
    padding: 8px;
  }
</style>
