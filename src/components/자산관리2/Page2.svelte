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
    setAssetGroupDelete,
    setNewAssetGroup,
  } from "../../services/page2/assetService";
  import { onMount } from "svelte";
  import {
    confirmDelete,
    confirmDelete2,
    confirmDeleteLast,
    errorAlert,
    successAlert,
  } from "../../shared/sweetAlert";
  import { checkAuth } from "../../stores/user.store";
  import GetLog from "./getLog.svelte";
  import GetLogHeader from "./getLogHeader.svelte";
  import { getAuditNLog, getPlanFilter } from "../../services/logs/logsService";
  import axios from "axios";
  import { derived } from "svelte/store";
  import { serverApi } from "../../lib/config";

  let currentView = "default";
  let currentPage = null;
  let activeMenu = null;
  let showModal = false;
  let newGroupName = "";
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
  onMount(async () => {
    try {
      assetGroupList();
    } catch (err) {
      await errorAlert(err?.message);
    }
  });
  async function assetGroupList() {
    try {
      console.log("error aler");
      const response = await getAssetGroup();

      if (response.RESULT === "OK") {
        allAssetGroupList.set(Object.values(response.CODE));
      }
    } catch (err) {
      await errorAlert(err?.message);
      loading = false;
    }
  }
  onMount(() => {
    assetGroupList(); // Only fetch asset groups
    // Don’t call filterAssets here, just populate with initial data
    if ($allAssetList && $allAssetList.length > 0) {
      filteredAssets = [...$allAssetList]; // Set initial assets if available
    }
  });

  function closeSwiper() {
    showSwiperComponent = false;
  }
  /*************************************************************/
  function isNotFiltered(value, filter) {
    return !filter || filter === "전체" || value === filter;
  }

  function filterAssets() {
    console.log("worked");
    if (
      selectedGroup === "전체" &&
      asset_ostype === "전체" &&
      assetTargetReg === "전체" &&
      assetAcitve === "전체"
    ) {
      // If all criteria are "전체", return all assets
      filteredAssets = [...$allAssetList];
      return filteredAssets;
    }

    // Otherwise, proceed with the filtering logic
    filteredAssets = $allAssetList.filter((asset) => {
      const groupCondition =
        selectedGroup === "전체" ||
        (Array.isArray(asset.asset_group) &&
          asset.asset_group.some((group) => group.asg_index === selectedGroup));

      const ostypeCondition =
        asset_ostype === "전체" ||
        (Array.isArray(asset.assessment_target_system) &&
          asset.assessment_target_system.some((system) =>
            Object.keys(system).some(
              (key) => key === asset_ostype && system[key] === true,
            ),
          ));

      const targetRegCondition =
        assetTargetReg === "전체" ||
        asset.asset_target_registered === assetTargetReg;

      const activeCondition =
        assetAcitve === "전체" || asset.ast_activate === !!Number(assetAcitve);

      const hostCondition = isNotFiltered(asset.ast_hostname, assetHost);

      return (
        groupCondition &&
        ostypeCondition &&
        targetRegCondition &&
        activeCondition &&
        hostCondition
      );
    });

    return filteredAssets;
  }

  function updateFilteredAssets(updatedAssets) {
    filteredAssets = updatedAssets;
  }
  function handleFilter() {
    const results = filterAssets();

    // Update the UI accordingly (e.g., show a message if no assets match)
    if (results.length === 0) {
      // Here you can also clear or update the UI to show a 'no assets found' message
    }
    activeMenu = selectedGroup;
  }

  function resetFilters() {
    // Reset filters to their default values
    assetHost = "전체";
    selectedGroup = "전체"; // Resetting this value
    asset_ostype = "전체";
    assetTargetReg = "전체";
    assetAcitve = "전체";

    // Update the active menu to reflect the reset
    activeMenu = "전체"; // Set the active menu to '전체'

    // Reapply filters to get the initial asset list
    const results = filterAssets();
  }
  /***********************************************************/
  const addNewGroup = async () => {
    if (!newGroupName.trim()) {
      errorAlert("그룹 이름은 비워둘 수 없습니다.");
      return;
    }

    try {
      const response = await setNewAssetGroup(newGroupName); // Send new group to backend
      if (response.success) {
        successAlert("그룹이 성공적으로 생성되었습니다!");

        // Create the new group object
        const newGroup = {
          asg_index: response.new_asg_index,
          asg_title: newGroupName,
        };

        // Force a reactivity update by using `update` and add the new group
        allAssetGroupList.update((currentGroups) => {
          return [...currentGroups, newGroup]; // Reassign with a new array
        });

        // Set the selectedGroup to the new group immediately
        selectedGroup = newGroup.asg_index;
        activeMenu = newGroup.asg_index;

        // Optionally, call `selectPage` or any method to show the new group in the UI
        selectPage(AssetCardsPage, newGroup);

        // Clear the new group name and hide the input
        newGroupName = "";
        isAddingNewGroup = false;

        // Re-run the `onMount` method or any other update if needed
        assetGroupList(); // Re-fetch and update the list of asset groups
      } else {
        throw new Error("Failed to save group.");
      }
    } catch (error) {
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
  let selectedGroupName = "";
  function selectPage(page, group) {
    currentPage = page;
    if (group === "전체") {
      activeMenu = "전체";
      selectedGroup = "전체"; // Explicitly set "전체" for filtering and dropdown
    } else {
      activeMenu = group; // Correctly set the active menu
      selectedGroup = group.asg_index; // Use group index for filtering
      selectedGroupName = group.asg_title;
    }
    showSwiperComponent = false;
    filterAssets(); // Apply filtering
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
  }
  $: if (showGetPlanHeader) {
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
    try {
      searchFilters = await getPlanFilter();
    } catch (err) {
      errorAlert(err?.message);
    }
  });

  const searchDataHandler = async () => {
    logData = await getAuditNLog(search);
  };

  /**********************************************************************/
  async function saveAssetToExcel() {
    if (selectedUUID.length === 0) {
      errorAlert("선택된 자산이 없습니다.");
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
  /******************************************************************************/
  async function downloadReport() {
    if (selectedUUID.length === 0) {
      errorAlert("선택된 자산이 없습니다.");
      return;
    }

    try {
      // Send a POST request to the API with the response type set to 'blob'
      const response = await axios.post(
        `${serverApi}/api/getSummaryReportOfAsset/`,
        {
          ass_uuid: selectedUUID,
        },
        {
          responseType: "blob", // Important to set the response type
        },
      );

      // Create a blob from the response data
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      // Create a link element for downloading
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const assetNames = selected.map((asset) => asset.ast_hostname).join(","); // Extract ast_hostname and join with underscores
      const fileName = assetNames ? `${assetNames}.xlsx` : "report.xlsx";

      a.download = fileName; // Change this to your desired file name
      document.body.appendChild(a);
      a.click();

      // Clean up
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("An error occurred while downloading the report.");
    }
  }
  /*************************************************************************/
  async function downloadTotalReport() {
    if (selectedUUID.length === 0) {
      errorAlert("선택된 자산이 없습니다.");
      return;
    }

    try {
      // Send a POST request to the API with the response type set to 'blob'
      const response = await axios.post(
        `${serverApi}/api/getToalReportOfAsset/`,
        {
          ass_uuid: selectedUUID,
        },
        {
          responseType: "blob", // Important to set the response type
        },
      );

      // Create a blob from the response data
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      // Create a link element for downloading
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const assetNames = selected.map((asset) => asset.ast_hostname).join(","); // Extract ast_hostname and join with underscores
      const fileName = assetNames ? `${assetNames}.xlsx` : "report.xlsx";

      a.download = fileName; // Change this to your desired file name
      document.body.appendChild(a);
      a.click();

      // Clean up
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("An error occurred while downloading the report.");
    }
  }
  /*******************************************************************/

  async function deleteSelectedAssetGroup() {
    try {
      // Ensure a group is selected
      if (!selectedGroup || selectedGroup === "전체") {
        errorAlert("삭제할 그룹이 선택되지 않았습니다.");
        return;
      }

      // Find the selected group details from the asset group list
      const selectedGroupDetails = $allAssetGroupList.find(
        (group) => group.asg_index === selectedGroup,
      );

      if (!selectedGroupDetails) {
        errorAlert("선택된 그룹 정보를 찾을 수 없습니다.");
        return;
      }

      // Confirm deletion
      const isConfirmed = await confirmDelete2(selectedGroupDetails.asg_title);
      if (!isConfirmed) return;

      // Call the delete API
      const response = await setAssetGroupDelete(
        selectedGroupDetails.asg_index,
      );

      if (response.success) {
        // Remove the group from the store using `update()`
        allAssetGroupList.update((currentGroups) => {
          return currentGroups.filter(
            (group) => group.asg_index !== selectedGroupDetails.asg_index,
          );
        });

        // Check if the selected group was deleted and reset `selectedGroup` if necessary
        if (selectedGroup === selectedGroupDetails.asg_index) {
          selectedGroup = "전체"; // Reset to "전체" if the current group was deleted
          activeMenu = "전체";
        }

        successAlert(
          `그룹 "${selectedGroupDetails.asg_title}"이(가) 성공적으로 삭제되었습니다.`,
        );
      } else {
        throw new Error("그룹 삭제에 실패했습니다.");
      }
    } catch (error) {
      errorAlert(error.message || "그룹 삭제 중 오류가 발생했습니다.");
    }
  }

  $: console.log("selectedGroup", selectedGroup);
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
        <button
          on:click={deleteSelectedAssetGroup}
          type="button"
          class="btn btnRed"
          ><img
            src="./assets/images/icon/delete.svg"
            alt="createGroup"
          />그룹삭제</button
        >
      </div>
      <ul
        class="prMenuList"
        style="overflow-y: scroll;height: 92%; overlow-x:hidden;"
      >
        {#if $allAssetGroupList.length > 0}
          <li class={activeMenu === "전체" ? "active" : ""}>
            <a
              on:click={() => {
                activeMenu = "전체";
                selectedGroup = "전체";
                selectPage(AssetCardsPage, "전체");
              }}
              title="전체"
            >
              <span
                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
              >
                전체
              </span>
              <span class="arrowIcon"></span>
            </a>
          </li>

          {#each [...$allAssetGroupList].sort((a, b) => b.asg_count - a.asg_count) as group}
            <li class={activeMenu === group ? "active" : ""}>
              <a
                on:click={() => {
                  activeMenu = group;
                  selectPage(AssetCardsPage, group);
                }}
                title="{group.asg_title}({group.asg_count})"
              >
                <span
                  style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-block; max-width: 100%;"
                >
                  {group.asg_title} ({group.asg_count})
                </span>
                <div
                  style="display: flex; flex-direction: row; align-items: center;"
                >
                  {#if group.asg_count === 0}
                    <button
                      class="asset_button"
                      on:click|stopPropagation={() =>
                        selectPage(AssetManagement, group)}
                    >
                      자산관리
                    </button>
                  {/if}
                  <span class="arrowIcon"></span>
                </div>
              </a>
            </li>
          {/each}
        {/if}

        {#if isAddingNewGroup}
          <div class="modal-open-wrap">
            <dialog open on:close={() => (isAddingNewGroup = false)}>
              <div class="modal-content">
                <div class="modal">
                  <input
                    type="text"
                    placeholder="그룹 이름을 입력하세요"
                    bind:value={newGroupName}
                    bind:this={inputRef}
                    class="editable_input"
                  />
                  <div class="modal-buttons">
                    <button class="primary-button" on:click={addNewGroup}>
                      저장하기
                    </button>
                    <button class="secondary-button" on:click={cancelNewGroup}
                      >취소</button
                    >
                  </div>
                </div>
              </div>
            </dialog>
          </div>
        {/if}
      </ul>
    </article>
    <!--ASSET CARDS MENU-->
    <div
      class="contentsWrap asset flex col gap-8"
      style="width: calc(100% - 280px); "
    >
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

                <option value="UNIX">UNIX</option>
                <option value="WINDOWS">WINDOWS</option>
                <option value="PC">PC</option>
                <option value="NETWORK">NETWORK</option>
                <option value="DBMS">DBMS</option>
                <option value="WEB">WEB</option>
                <option value="WAS">WAS</option>
                <option value="CLOUD">CLOUD</option>
                <option value="SECURITY">SECURITY</option>
              </select>

              <!-- Agent Installation Status Filter -->
              <select
                name="operating_system"
                id="operating_system"
                bind:value={assetTargetReg}
                on:change={handleFilter}
              >
                <option value="전체" selected>전체</option>
                <option value="YES">등록승인</option>
                <option value="NO">등록 해제</option>
              </select>

              <!-- Activation Status Filter -->
              <select
                name="agent_status"
                id="agent_status"
                bind:value={assetAcitve}
                on:change={handleFilter}
              >
                <option value="전체" selected>전체</option>
                <option value="1">활동적인</option>
                <option value="0">비활성</option>
              </select>
            {:else}
              <GetLogHeader
                {searchFilters}
                {toggleView}
                {search}
                {searchDataHandler}
              />
            {/if}

            <!-- svelte-ignore a11y-click-events-have-key-events -->
            {#if !showGetPlanHeader}
              <button
                on:click={resetFilters}
                class="btn btnPrimary padding_button"
                ><img src="./assets/images/reset.png" alt="search" />초기화
              </button>
            {/if}
            <button
              on:click={saveAssetToExcel}
              class="btn btnPrimary padding_button"
              ><img
                src="./assets/images/icon/download.svg"
                class="excel-img"
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
            <button
              class="btn btnPrimary padding_button"
              on:click={downloadReport}>요약보고서</button
            >
            <button
              class="btn btnPrimary padding_button"
              on:click={downloadTotalReport}
              >상세보고서
            </button>
            {#if showSwiperComponent}
              <button
                class="btn btnPrimary padding_button"
                on:click={closeSwiper}>돌아가기</button
              >
            {/if}
          </div>
        </section>
      </article>
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
          {updateFilteredAssets}
          bind:showSwiperComponent
          {assetGroupList}
        />
      {:else}
        <AssetCardsPage
          {assetGroupList}
          {searchedResult}
          {showSearchResult}
          {filteredAssets}
          {filterAssets}
          bind:showSwiperComponent
          bind:selectedUUID
          bind:selected
          {updateFilteredAssets}
        />
      {/if}
    </div>
  </section>
  {#if showModal}
    <!-- Modal background, closes when clicked outside modal content -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->

    <div class="modal-open-wrap">
      <div class="showModal" on:click={handleClickOutside}>
        <!-- Modal content goes here -->
        <div class="modal-content">
          <ModalChasanGroup {closeModal} />
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .sideMenu .btnWrap .btn:hover img {
    filter: brightness(0) invert(1);
  }
  .modal-open-wrap {
    display: block;
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(167, 167, 167, 0.6);
  }
  .modal-open-wrap {
    display: block;
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(167, 167, 167, 0.6);
  }
  .modal-content {
    text-align: center;
  }
  .active {
    color: #ffffff;
    background-color: #0067ff;
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    animation: fadeInBackdrop 0.3s ease;
  }
  .btn:hover {
    color: #fff;
    background-color: #0067ff;
  }
  .editable_input {
    height: 40px;
    width: 360px;
    margin-bottom: 50px;
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
  /* Tooltip styling */
  .prMenuList a[title] {
    position: relative;
    cursor: pointer;
  }

  /* Tooltip on hover */
  .prMenuList a[title]:hover::after {
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
  .prMenuList a[title]:hover::before {
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

  * {
    font-size: 16px;
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
  .assetandbutton {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .excel-img {
    filter: invert(45%) sepia(100%) saturate(550%) hue-rotate(195deg)
      brightness(100%) contrast(98%);
  }
</style>
