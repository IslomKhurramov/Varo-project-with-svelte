<script>
  import AssetCardsPage from "./AssetCardsPage.svelte";
  import Modal from "../../shared/Modal.svelte";
  import ModalChasanGroup from "./ModalChasanGroup.svelte";
  import AssetManagement from "./AssetManagement.svelte";
  import {
    allAssetGroupList,
    allAssetList,
  } from "../../services/page2/asset.store";
  import {
    getAssetGroup,
    setNewAssetGroup,
  } from "../../services/page2/assetService";
  import { onMount } from "svelte";
  import { successAlert } from "../../shared/sweetAlert";
  import { checkAuth } from "../../stores/user.store";
  import GetLog from "./getLog.svelte";
  import GetLogHeader from "./getLogHeader.svelte";
  import { getAuditNLog, getPlanFilter } from "../../services/logs/logsService";
  import axios from "axios";
  import { serverApi } from "../../lib/config";

  let currentView = "default";
  let currentPage = null;
  let activeMenu = null;
  let showModal = false;
  let newGroupName = "전체";
  let isAddingNewGroup = false;
  let inputRef;
  let selectedGroup = "전체";
  let filteredAssets = [];
  let asset_ostype = "전체";
  let assetTargetReg = "전체";
  let assetAcitve = "전체";
  let searchedResult = [];
  let showSearchResult = false;
  let showGetPlanHeader = false;
  let assetOs = "";
  let assetHost = "전체";
  let showSwiperComponent = false;
  let selectedUUID = [];
  let selected = [];
  /*************************GetAllAssetList*****************************************/
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

  function toggleSwiper() {
    console.log("Toggling Swiper. Closing...");
    showSwiperComponent = false;
  }
  /*************************************************************/
  function isNotFiltered(value, filter) {
    return !filter || filter === "전체" || value === filter;
  }

  function filterAssets() {
    console.log("Selected Group:", selectedGroup);

    filteredAssets = $allAssetList.filter((asset) => {
      const conditions = [
        () =>
          selectedGroup === "전체" ||
          (Array.isArray(asset.asset_group) &&
            asset.asset_group.some(
              (group) => group.asg_index === selectedGroup,
            )),
        () => isNotFiltered(asset.ast_ostype, asset_ostype),
        () =>
          assetTargetReg !== "전체"
            ? asset.asset_target_registered === assetTargetReg
            : true,
        () =>
          assetAcitve !== "전체"
            ? asset.ast_activate === !!Number(assetAcitve)
            : true,
        () => isNotFiltered(asset.ast_hostname, assetHost),
      ];

      return conditions.every((condition) => condition());
    });
  }

  function handleFilter() {
    filterAssets();
    console.table(filteredAssets); // Use table for better visibility in console
  }

  function resetFilters() {
    assetHost = "전체";
    selectedGroup = "전체";
    asset_ostype = "전체";
    assetTargetReg = "";
    assetAcitve = "";
    filterAssets(); // Apply the reset immediately
  }

  /***********************************************************/
  const addNewGroup = async () => {
    if (!newGroupName.trim()) {
      alert("Group name cannot be empty.");
      return;
    }

    try {
      const response = await setNewAssetGroup(newGroupName); // Send new group to backend
      if (response.success) {
        successAlert("그룹이 성공적으로 생성되었습니다!");

        allAssetGroupList.update((groups) => [
          ...groups,
          { asg_index: response.new_asg_index, asg_title: newGroupName },
        ]);

        newGroupName = "";
        isAddingNewGroup = false;
      } else {
        throw new Error("Failed to save group.");
      }
    } catch (error) {
      console.error("Error saving group:", error);
      alert("Failed to save the group. Please try again.");
    }
  };
  /************************************************/
  // Show input field for new group
  const showNewGroupInput = () => {
    isAddingNewGroup = true;
    setTimeout(() => {
      inputRef?.focus(); // Set focus once the input is available
    }, 0);
  };

  // Cancel adding new group
  const cancelNewGroup = () => {
    newGroupName = "";
    isAddingNewGroup = false;
  };
  /*****************************************/

  /************************************************************************/

  function selectPage(page, group) {
    currentPage = page;
    if (group === "전체") {
      activeMenu = "전체";
      selectedGroup = "전체"; // Explicitly set "전체" for filtering and dropdown
    } else {
      activeMenu = group; // Use group title for active menu
      selectedGroup = group.asg_index; // Use group index for filtering
    }
    filterAssets(); // Apply filtering
    toggleSwiper();
  }
  /**********************************************************************/
  function toggleGetLogHeader() {
    if (!showGetPlanHeader) {
      currentPage = GetLog;
    } else {
      currentPage = null;
    }
    showGetPlanHeader = !showGetPlanHeader;
  }
  /************************************************************************/
  export function toggleView() {
    currentView = currentView === "default" ? "newView" : "default";
    currentPage = null;
    console.log("Current View:", currentView);
  }
  $: if (showGetPlanHeader) {
    console.log("GetLogHeader should show");
  }
  /**********************************************************************/
  export let searchFilters;
  let logData = [];
  export const search = {
    plan_index: "",
    asset_name: "",
    order_user: "",
    search_start_date: "",
    search_end_date: "",
  };

  onMount(async () => {
    searchFilters = await getPlanFilter();
  });

  const searchDataHandler = async () => {
    logData = await getAuditNLog(search);
  };

  /**********************************************************************/
  async function saveAssetToExcel() {
    if (selectedUUID.length === 0) {
      alert("No assets selected.");
      return;
    }

    try {
      const response = await axios.post(
        `${serverApi}/api/setSaveAssetInformationToExcel/`,
        { ass_uuid: selectedUUID },
        { responseType: "blob" },
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const assetNames = selected.map((asset) => asset.ast_hostname).join("_"); // Avoid special characters like commas
      const fileName = assetNames ? `${assetNames}.xlsx` : "report.xlsx"; // Customize filename if needed
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
      selectedUUID = [];
    } catch (error) {
      console.error("Failed to download report:", error);
      alert("An error occurred while downloading the report.");
    }
  }
  const handleClickOutside = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };
  const closeModal = () => {
    showModal = false;
  };
</script>

<div class="container">
  <section>
    <!--SUB MENU-->
    <article class="sideMenu">
      <div class="btnWrap">
        <!-- svelte-ignore a11y-missing-attribute -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <a on:click={showNewGroupInput} class="btn btnPrimary"
          ><img src="./assets/images/icon/add.svg" />그룹추가</a
        >
        <button type="button" class="btn btnRed"
          ><img
            src="./assets/images/icon/delete.svg"
            alt="createGroup"
          />그룹삭제</button
        >
      </div>
      <ul class="prMenuList">
        {#if $allAssetGroupList.length > 0}
          <div class="project_button">
            <li>
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-missing-attribute -->
              <a
                on:click={() => {
                  activeMenu = "전체"; // Highlight the active menu
                  selectedGroup = "전체"; // Set the selected group explicitly
                  selectPage(AssetCardsPage, "전체"); // Load all assets
                }}
                class={activeMenu === "전체" ? "active" : ""}
                title="전체"
              >
                <span class="truncate-text">전체</span>
              </a>
            </li>
          </div>
          {#each $allAssetGroupList as group, index}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-missing-attribute -->
            <div class="project_button">
              <li>
                <a
                  on:click={() => {
                    selectPage(AssetCardsPage, group);
                  }}
                  class={activeMenu === group ? "active" : ""}
                  title={group.asg_title}
                  ><span class="truncate-text">
                    {group.asg_title}
                  </span>
                  <button
                    class="asset_button"
                    on:click|stopPropagation={() =>
                      selectPage(AssetManagement, group)}>자산관리</button
                  ></a
                >
              </li>
            </div>
          {/each}
        {/if}
        {#if isAddingNewGroup}
          <dialog open on:close={() => (isAddingNewGroup = false)}>
            <div class="modal-content">
              <div class="modal">
                <input
                  type="text"
                  placeholder="Enter Group Name"
                  bind:value={newGroupName}
                  bind:this={inputRef}
                  class="editable_input"
                />
                <div class="modal-buttons">
                  <button class="primary-button" on:click={addNewGroup}
                    >Save</button
                  >
                  <button class="secondary-button" on:click={cancelNewGroup}
                    >Cancel</button
                  >
                </div>
              </div>
            </div>
          </dialog>
        {/if}
      </ul>
    </article>
    <!--ASSET CARDS MENU-->
    <div class="contentsWrap asset flex col gap-8">
      <article class="contentArea">
        <section class="filterWrap">
          <div>
            {#if !showGetPlanHeader}
              <!-- Group Filter -->
              <select
                name="approval_status"
                id="approval_status"
                bind:value={selectedGroup}
                on:change={handleFilter}
              >
                <option value="전체">전체</option>
                {#each $allAssetGroupList as group}
                  <option value={group.asg_index}>{group.asg_title}</option>
                {/each}
              </select>

              <!-- OS Type Filter -->
              <select
                name="asset_group"
                id="asset_group"
                bind:value={asset_ostype}
                on:change={handleFilter}
              >
                <option value="전체" selected>전체 </option>
                {#each $allAssetList as asset}
                  {#if asset.ast_ostype !== ""}
                    <option value={asset.ast_ostype}>
                      {asset.ast_ostype}
                    </option>
                  {/if}
                {/each}
              </select>

              <!-- Agent Installation Status Filter -->
              <select
                name="operating_system"
                id="operating_system"
                bind:value={assetTargetReg}
                on:change={handleFilter}
              >
                <option value="전체" selected>전체</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>

              <!-- Activation Status Filter -->
              <select
                name="agent_status"
                id="agent_status"
                bind:value={assetAcitve}
                on:change={handleFilter}
              >
                <option value="전체" selected>전체</option>
                <option value="1">Active</option>
                <option value="0">Unactive</option>
              </select>
            {:else}
              <GetLogHeader {searchFilters} {toggleView} {search} />
            {/if}

            <!-- svelte-ignore a11y-click-events-have-key-events -->
            {#if !showGetPlanHeader}
              <button
                on:click={resetFilters}
                class="btn btnPrimary padding_button"
                ><img src="./assets/images/reset.png" alt="search" />초기화
              </button>
            {:else}
              <button on:click={searchDataHandler} class="btn btnPrimary"
                >검색</button
              >
            {/if}
            <button
              on:click={saveAssetToExcel}
              class="btn btnPrimary padding_button"
              ><img
                src="./assets/images/icon/download.svg"
                alt="download"
              />엑셀저장</button
            >
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <button
              on:click={() => (showModal = true)}
              class="btn btnPrimary padding_button">등록현황</button
            >
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <button
              on:click={toggleGetLogHeader}
              class="btn btnPrimary padding_button">이력관리</button
            >
          </div>
        </section>
      </article>

      <div class="swiper_container">
        {#if currentPage}
          <svelte:component
            this={currentPage}
            bind:selectedGroup
            {filterAssets}
            {filteredAssets}
            {logData}
            bind:assetHost
            bind:asset_ostype
            {handleFilter}
            {resetFilters}
          />
        {:else}
          <AssetCardsPage
            {searchedResult}
            {showSearchResult}
            {filteredAssets}
            {showSwiperComponent}
            bind:selectedUUID
            bind:selected
          />
        {/if}
      </div>
    </div>
  </section>
  {#if showModal}
    <!-- Modal background, closes when clicked outside modal content -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="showModal" on:click={handleClickOutside}>
      <!-- Modal content goes here -->
      <div class="modal-content">
        <ModalChasanGroup {closeModal} />
      </div>
    </div>
  {/if}
</div>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Arial", sans-serif;
  }
  .modal-content {
    text-align: center;
  }
  .active {
    background-color: rgba(0, 103, 255, 0.06);
    color: #0067ff;
  }
  .active .truncate-text {
    color: #0067ff;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    animation: fadeInBackdrop 0.3s ease;
  }
  .editable_input {
    height: 40px;
    width: 360px;
  }
  .modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }

  .primary-button {
    background-color: #54b3d6;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .primary-button:hover {
    background-color: #48a2bf;
  }

  .secondary-button {
    background-color: #f0f0f0;
    color: #666;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .secondary-button:hover {
    background-color: #e0e0e0;
  }
  dialog {
    position: fixed;
    top: 50%;
    left: 40%;
    transform: translate(-50%, -50%);
    width: 400px;
    border: none;
    border-radius: 10px;
    background-color: white;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    animation: fadeIn 0.3s ease;
    z-index: 100;
  }
  .showModal {
    position: fixed;
    width: 70%;
    top: 30%;
    left: 20%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    animation: fadeIn 0.3s ease;
    z-index: 100;
  }

  .asset_button {
    background-color: rgba(0, 103, 255, 0.05);
    color: #0067ff;
    border-color: rgba(0, 103, 255, 0.1);

    width: 60px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 10px;
    padding: 2px;
    transition: all 0.3s ease;
    text-align: center;
  }

  .asset_button:hover {
    background-color: #fff;
    color: #0067ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  /* Truncate text with ellipsis */
  .truncate-text {
    display: inline-block;
    max-width: 100px; /* Adjust as per your layout */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
  }

  /* Tooltip styling */
  .project_button a[title] {
    position: relative;
    cursor: pointer;
    display: flex;
    flex-direction: row;
  }
  select {
    padding: 0 32px 0 15px;
    height: 40px;
    background-size: 8px;
    color: #626677;
    border: 1px solid rgba(98, 102, 119, 0.2);
    border-radius: 6px;
    box-sizing: border-box;
    background-size: 10px;
    background-color: #fff;
    font-weight: 400;
    font-size: 16px;
  }
  .padding_button {
    padding: 0 32px 0 15px;
    background-size: 8px;
  }
  option {
    padding: 0 32px 0 15px;
    background-size: 8px;
  }
</style>
