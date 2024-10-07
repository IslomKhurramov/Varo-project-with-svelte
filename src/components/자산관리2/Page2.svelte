<script>
  import AssetCardsPage from "./AssetCardsPage.svelte";
  import Modal from "../../shared/Modal.svelte";
  import ModalChasanGroup from "./ModalChasanGroup.svelte";
  import Swiper from "./Swiper.svelte";
  import AssetManagement from "./AssetManagement.svelte";
  import {
    allAssetGroupList,
    allAssetList,
  } from "../../services/page2/asset.store";
  import {
    getAssetGroup,
    getSearch,
    setNewAssetGroup,
  } from "../../services/page2/assetService";
  import { onMount } from "svelte";
  import { successAlert } from "../../shared/sweetAlert";
  import { checkAuth } from "../../stores/user.store";
  import GetLog from "./getLog.svelte";
  import GetLogHeader from "./getLogHeader.svelte";
  import { getAuditNLog, getPlanFilter } from "../../services/logs/logsService";
  let currentView = "default";
  let currentPage = null;
  let activeMenu = null;
  let showModal = false;
  let newGroupName = "";
  let isAddingNewGroup = false;
  let inputRef;
  let selectedGroup = "";
  let filteredAssets = [];
  let asset_ostype = "";
  let assetTargetReg = "";
  let assetAcitve = "";
  let groupNames = "";
  let searchedResult = [];
  let showSearchResult = false;
  let showGetPlanHeader = false;

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
  /*************************************************************/
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

  /***********************************************************/
  const addNewGroup = async () => {
    if (!newGroupName.trim()) {
      alert("Group name cannot be empty.");
      return;
    }

    try {
      const response = await setNewAssetGroup(newGroupName); // Send new group to backend
      if (response.success) {
        successAlert("Group created successfully!");

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
  const getSearchAsset = async () => {
    console.log("group", groupNames);
    console.log("target", assetTargetReg);
    console.log("acvtivate", assetAcitve);
    console.log("osType", asset_ostype);
    try {
      const response = await getSearch(
        groupNames,
        asset_ostype,
        assetTargetReg,
        assetAcitve,
      );

      // Check if response is not empty and has keys
      if (response.RESULT === "OK" && Object.keys(response).length > 0) {
        // Convert response object into an array of asset objects
        searchedResult = Object.values(response.CODE); // Store all assets in an array
        showSearchResult = true;
      } else {
        throw new Error("Failed to save group.");
      }
    } catch (error) {
      console.error("Error saving group:", error);
      alert("Failed to save the group. Please try again.");
    }
  };
  /************************************************************************/
  function selectPage(page, group) {
    currentPage = page;
    activeMenu = group;
    selectedGroup = group.asg_index;
    filterAssets(); // Set the selected group index when selecting a group
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
</script>

<div class="container">
  <div class="container_aside">
    <aside>
      <div class="add_delete_container">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p class="menu_button" on:click={showNewGroupInput}>그룹추가</p>
        <p class="menu_button">그룹삭제</p>
      </div>

      <div class="project_container">
        {#if $allAssetGroupList.length > 0}
          {#each $allAssetGroupList as group, index}
            <div class="project_button">
              <div class="button_cont">
                <img src="./images/asset.png" alt="project" />
                <!-- svelte-ignore missing-declaration -->
                <!-- svelte-ignore a11y-invalid-attribute -->
                <a
                  href="#"
                  on:click={() => selectPage(AssetCardsPage, group)}
                  class={activeMenu === group ? "active" : ""}
                  title={group.asg_title}
                >
                  <i class="fa fa-user-o" aria-hidden="true"></i>
                  <span class="truncate-text">{group.asg_title}</span>
                  <!-- Truncated text -->
                </a>
              </div>
              <div>
                <button
                  class="asset_button"
                  on:click={() => selectPage(AssetManagement, group)}
                  >자산관리</button
                >
              </div>
            </div>
          {/each}
        {/if}
        {#if isAddingNewGroup}
          <div class="new_input">
            <input
              type="text"
              placeholder="Enter Group Name"
              bind:value={newGroupName}
              bind:this={inputRef}
              class="editable_input"
            />
            <div>
              <button class="asset_button save" on:click={addNewGroup}
                >Save</button
              >
              <button class="asset_button cancel" on:click={cancelNewGroup}
                >Cancel</button
              >
            </div>
          </div>
        {/if}
      </div>
    </aside>
  </div>
  <div class="right_menu">
    <header class="header">
      {#if !showGetPlanHeader}
        <div class="header_option">
          <button on:click={toggleView} class="toggle_button">
            <span class="arrow">&#9662;</span>
          </button>
          <form action="/action_page.php" class="form_select">
            <div class="select_container">
              <select
                name="approval_status"
                id="approval_status"
                class="select_input"
                bind:value={groupNames}
              >
                {#each $allAssetGroupList as group}
                  <option class="group_option" value={group.asg_title}
                    >{group.asg_title}</option
                  >
                {/each}
                <option value="" disabled selected hidden
                  >그룹을 선택하세요</option
                >
              </select>
            </div>
            <div class="select_container">
              <select
                name="asset_group"
                id="asset_group"
                class="select_input"
                bind:value={asset_ostype}
              >
                <option value="" disabled selected hidden>운영체제</option>
                {#each $allAssetList as asset}
                  <option class="group_option" value={asset.ast_ostype}
                    >{asset.ast_ostype}</option
                  >
                {/each}
              </select>
            </div>
            <div class="select_container">
              <select
                name="operating_system"
                id="operating_system"
                class="select_input"
                bind:value={assetTargetReg}
              >
                <option value="" disabled selected hidden>에이전트여부</option>

                <option class="group_option" value="YES">YES</option>

                <option class="group_option" value="NO">NO</option>
              </select>
            </div>
            <div class="select_container">
              <select
                name="agent_status"
                bind:value={assetAcitve}
                id="agent_status"
                class="select_input"
              >
                <option value="" disabled selected hidden>등록승인여부</option>
                <option value="1">Active</option>
                <option value="0">Unactive</option>
              </select>
            </div>
          </form>
        </div>
      {:else}
        <GetLogHeader {searchFilters} {toggleView} {search} />
      {/if}
      <div class="header_button">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        {#if !showGetPlanHeader}
          <p on:click={getSearchAsset}>자산명</p>
        {:else}
          <p on:click={searchDataHandler}>자산명</p>
        {/if}
        <p>엑셀저장</p>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p on:click={() => (showModal = true)}>등록현황</p>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p on:click={toggleGetLogHeader}>이력관리</p>
      </div>
    </header>

    <div class="swiper_container">
      {#if currentPage}
        <svelte:component
          this={currentPage}
          bind:selectedGroup
          {filterAssets}
          {filteredAssets}
          {logData}
        />
      {:else if currentView === "newView"}
        {#key currentView}
          <Swiper />
        {/key}
      {:else}
        <AssetCardsPage {searchedResult} {showSearchResult} />
      {/if}
    </div>
  </div>

  <Modal bind:showModal>
    <ModalChasanGroup />
  </Modal>
</div>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Arial", sans-serif;
  }
  /* Container and Layout Styles */
  /* Main container for layout */
  /* Main container for layout */
  .container {
    display: flex;
    flex-direction: row;
    width: 100%;
    border-radius: 20px;
    padding: 10px;
    min-height: 100vh;
    box-shadow:
      rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
      rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  }

  /* Sidebar container */
  .container_aside {
    background-color: #f7f9fb; /* Use white background for cleanliness */
    color: #343a40;
    padding: 20px;
    width: 250px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    top: 0;
    bottom: 0;
    box-shadow:
      rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
      rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; /* Soft shadow for depth */
    border-right: 1px solid #e0e0e0; /* Subtle border for separation */
  }
  /* Right content container */
  .right_menu {
    flex-grow: 1;
    margin: 10px 20px;
    width: 80%;
  }

  /* Scrollbar styling */
  .right_menu::-webkit-scrollbar {
    width: 8px;
  }

  .right_menu::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .right_menu::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 8px;
  }

  .right_menu::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* Sidebar Styles */
  /* Sidebar styling */
  aside {
    font-size: 16px;
    width: 100%;
  }

  /* Add/Delete buttons */
  .add_delete_container {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    justify-content: space-between;

    background-color: #f7f9fb; /* Soft background color */
    border-radius: 8px; /* Smooth rounded corners */
    transition:
      box-shadow 0.3s ease,
      transform 0.3s ease;
    cursor: pointer;
    box-shadow:
      rgba(50, 50, 93, 0.2) 0px 2px 5px -1px,
      rgba(0, 0, 0, 0.2) 0px 1px 3px -1px;
  }

  .menu_button {
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    padding: 6px;
    transition: all 0.3s ease;
    font-weight: bold;
    color: #495057;
    text-align: center;
    width: 110px; /* Slightly wider button */
  }

  .menu_button:hover {
    text-decoration: underline;
  }
  .button_cont {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  .project_container {
    display: flex;
    flex-direction: column;
    gap: 5px;
    background-color: #f7f9fb; /* Soft background color */
    border-radius: 8px; /* Smooth rounded corners */
    transition:
      box-shadow 0.3s ease,
      transform 0.3s ease;
    box-shadow:
      rgba(50, 50, 93, 0.2) 0px 2px 5px -1px,
      rgba(0, 0, 0, 0.2) 0px 1px 3px -1px;
    overflow-y: auto; /* Enables vertical scrolling */
    overflow-x: hidden; /* Prevents horizontal overflow */
    height: 100vh; /* Adjust height to fit inside sidebar */
  }

  .project_button:hover {
    transform: translateY(-2px);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Hover effect */
  }

  .project_button img {
    width: 20px; /* Slightly larger project icon */
    height: 20px;
    margin-right: 15px;
  }

  aside a {
    display: block;
    color: #495057;
    font-weight: 600;
    font-size: 14px;
    text-decoration: none;
    transition: all 0.3s ease;
    margin-top: 5px;
    margin-right: 5px;
  }

  aside a:hover,
  aside a.active {
    text-decoration: underline;
    color: #3498db; /* Add underline for active/hover */
  }

  .asset_button {
    background-color: #207792;
    border: none;
    width: 60px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 10px;
    padding: 2px;
    color: #ffffff;
    transition: all 0.3s ease;
    text-align: center;
    border: 1px solid #0e4556;
  }

  .asset_button:hover {
    background-color: #31b0d5;
    transform: translateY(-2px);
    border: 1px solid #0e4556;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  /* Header Styles */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #f7f9fb;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    margin-bottom: 20px;
  }

  .header_option {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .header_button {
    display: flex;
    align-items: center;
    gap: 40px;
    font-weight: bold;
  }
  /* Project buttons */
  .project_button {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition:
      box-shadow 0.3s ease,
      transform 0.3s ease;
    cursor: pointer;
    border-bottom: 1px solid #cbcbcb;
    border-radius: 15px;
  }

  .header_button p {
    color: #333;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  .header_button p:hover {
    color: #007acc;
    text-decoration: underline;
  }

  /* Form and Select Styles */
  .form_select {
    display: flex;
    gap: 15px;
  }

  .select_container {
    display: flex;
    flex-direction: column;
  }

  .select_input {
    color: #333;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    background-color: #ffffff;
    transition:
      border-color 0.3s ease,
      box-shadow 0.3s ease;
  }

  .select_input:hover {
    border-color: #007acc;
  }

  .select_input:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(0, 122, 204, 0.5);
    border-color: #007acc;
  }

  /* Dropdown Arrow */
  .arrow {
    color: #ffffff;
  }

  /* Toggle Button */
  .toggle_button {
    background-color: #0056b3;
    color: #ffffff;
    padding: 10px;
    border: none;
    height: 30px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }

  .toggle_button:hover {
    background-color: #005fa3;
  }
  .editable_input {
    margin: 5px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 1px;
  }
  .new_input {
    display: flex;
    flex-direction: row;
  }
  .save {
    background-color: #2ecc71;
  }
  .cancel {
    background-color: #e74c3c;
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
  }

  /* Tooltip on hover */
  .project_button a[title]:hover::after {
    content: attr(title); /* The full text from the title attribute */
    position: absolute;
    bottom: 100%; /* Position the tooltip above the text */
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 5px;
    font-size: 12px;
    white-space: nowrap;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  /* Tooltip arrow */
  .project_button a[title]:hover::before {
    content: "";
    position: absolute;
    bottom: 100%;
    z-index: 1000;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #333 transparent;
  }
  .group_option {
    height: 120px;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>
