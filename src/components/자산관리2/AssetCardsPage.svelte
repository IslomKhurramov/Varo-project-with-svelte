<script>
  import ModalCard from "./ModalCard.svelte";
  import {
    allAssetList,
    targetSystemList,
    allAssetGroupList,
  } from "../../services/page2/asset.store";
  import {
    setAssetActivate,
    setAssetUnActivate,
    getAllAssetLists,
    getTargetSystemLists,
    setAssetGroupChange,
  } from "../../services/page2/assetService";
  import { successAlert, errorAlert } from "../../shared/sweetAlert";
  import { onMount } from "svelte";
  import axios from "axios";
  import { serverApi } from "../../lib/config";
  import Swiper from "./Swiper.svelte";

  let showModal = false;
  let showModalChange = false;
  export let showSwiperComponent;
  export let selected = [];
  export let selectedUUID = [];
  let selectedAsset = null;
  let asset_group_index = "";
  export let filteredAssets = [];
  export let filterAssets;
  export let updateFilteredAssets;
  export let assetGroupList;
  let allSelected;
  $: allAssetList.subscribe((data) => {
    allSelected = data.length === selected.length;
  });

  function toggleAll() {
    allAssetList.update((data) => {
      selected = allSelected ? [] : [...data];
      return data;
    });
    selectedUUID = allSelected ? [] : selected.map((asset) => asset.ass_uuid);
  }
  $: selectedUUID = selected.map((asset) => asset.ass_uuid);

  /************************************************************/
  async function assetList() {
    try {
      const response = await getAllAssetLists();

      if (response.RESULT === "OK") {
        allAssetList.set(Object.values(response.CODE));
      }
    } catch (err) {
      alert(`Error getting AllAssetList ${err.message}`);
    }
  }
  /*******************************************************************/
  async function targetList() {
    try {
      const response = await getTargetSystemLists();

      if (response.RESULT === "OK") {
        targetSystemList.set(Object.values(response.CODE));
      }
    } catch (err) {
      alert(`Error getting AllAssetList ${err.message}`);
    }
  }

  onMount(() => {
    targetList();
    assetList();
  });

  $: {
    // Only apply filtering when $allAssetList is available
    if ($allAssetList && $allAssetList.length > 0) {
      // console.log("this function");
      filteredAssets = filterAssets();
    }
    // console.log("this function");
    // assetList();
  }

  /**************UnActivate**************************************/

  function updateAssetStatusInList(uuid, isActive) {
    allAssetList.update((assets) => {
      return assets.map((asset) => {
        if (asset.ass_uuid === uuid) {
          return { ...asset, ast_activate: isActive };
        }
        return asset;
      });
    });

    // Sync the filteredAssets if it's being used
    filteredAssets = filteredAssets.map((asset) => {
      if (asset.ass_uuid === uuid) {
        return { ...asset, ast_activate: isActive };
      }
      return asset;
    });
  }

  // Activate an asset
  async function activateAsset(uuid) {
    const asset = $allAssetList.find((a) => a.ass_uuid === uuid);
    if (asset.ast_activate) {
      errorAlert("자산이 이미 활성화되었습니다.");
      return;
    }
    try {
      const activating = await setAssetActivate(uuid);
      if (activating.success) {
        successAlert("자산이 성공적으로 활성화되었습니다!");
        updateAssetStatusInList(uuid, true); // Update both allAssetList and filteredAssets
      }
    } catch (err) {
      alert(`Error on activating Asset! ${err.message}`);
    }
  }

  // Unactivate an asset
  async function unActivate(uuid) {
    const asset = $allAssetList.find((a) => a.ass_uuid === uuid);
    if (!asset.ast_activate) {
      errorAlert("자산이 이미 활성화되지 않았습니다.");
      return;
    }
    try {
      const unActivating = await setAssetUnActivate(uuid);
      if (unActivating.success) {
        successAlert("자산이 성공적으로 활성화 해제되었습니다!");
        updateAssetStatusInList(uuid, false); // Update both allAssetList and filteredAssets
      }
    } catch (err) {
      alert(`Error on unActivating Asset! ${err.message}`);
    }
  }
  /*****************************************************************/
  // Convert to a more human-readable format
  function formatDate(dateString) {
    const date = new Date(dateString);

    // Extract year, month, day, hour, minute, and second
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so add 1
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Return the date in the format YYYY/MM/DD HH:MM:SS
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }

  /********************************************************************************/

  /***********************************************************************/
  function cancel() {
    showModal = false;
  }

  /**************************************************************/
  let uuid_asset = "";
  // Function to compute stroke color based on the score
  function getStrokeColor(score) {
    if (score > 60)
      return "#0067ff"; // Blue
    else if (score > 30)
      return "#00ff00"; // Green
    else return "#ff0000"; // Red
  }
  function handleAssetClick(asset) {
    selectedAsset = asset;
    showSwiperComponent = true; // This should set the showSwiperComponent to true
    // Check if the asset belongs to any group
  }
  function handleAssetUuid(asset) {
    if (asset.asset_group && asset.asset_group.length > 0) {
      asset_group_index = asset.asset_group[0].asg_index;
    }
    uuid_asset = asset.ass_uuid;
  }

  let selectedGroupIndex = "";
  async function assetGroupChange() {
    if (!asset_group_index) {
      errorAlert("어느 그룹에서 변경할지 선택해주세요");
      return;
    }
    try {
      const response = await setAssetGroupChange(
        uuid_asset,
        asset_group_index,
        selectedGroupIndex,
      );

      if (response.success) {
        showModalChange = false;
        successAlert("그룹이 성공적으로 변경되었습니다!");
        const asset = $allAssetList.find(
          (asset) => asset.ass_uuid === uuid_asset,
        );
        if (asset) {
          asset.asset_group = [selectedGroupIndex]; // Modify the group to the new one

          // Now make sure $allAssetList is updated (if it's a writable store)
          // The assignment will trigger reactivity
          $allAssetList = [...$allAssetList];
        }
        // Update the asset group in the allAssetList store
        allAssetList.update((assets) => {
          return assets.map((asset) => {
            // If the asset UUID matches, update the asset's group
            if (asset.ass_uuid === uuid_asset) {
              // Create a new asset object with updated group information
              return {
                ...asset,
                asset_group: asset.asset_group.map((group) =>
                  group.asg_index === asset_group_index
                    ? { ...group, asg_index: selectedGroupIndex }
                    : group,
                ),
              };
            }
            return asset;
          });
        });

        const updatedAssets = filteredAssets.map((asset) => {
          if (asset.ass_uuid === uuid_asset) {
            // Move the asset to the new group
            return { ...asset, asset_group: selectedGroupIndex };
          }
          return asset;
        });

        // Update the parent with the new list of assets
        updateFilteredAssets(updatedAssets);

        assetList();
        filterAssets();
      } else {
        errorAlert("자산을 선택해주세요!");
      }
    } catch (err) {}
  }
  $: {
    // Only apply filtering when $allAssetList is available
    if ($allAssetList && $allAssetList.length > 0) {
      filteredAssets = filterAssets(); // This will re-run the filter whenever $allAssetList or filters change
    }
  }

  $: {
    assetGroupList();
    if ($allAssetList && $allAssetList.length > 0) {
      filteredAssets = [...$allAssetList]; // Copy all assets initially
    }
  }

  /**********************************************************************/
  function handleGroupChange(event) {
    selectedGroupIndex = event.target.value;
  }
</script>

{#if !showSwiperComponent}
  <div class="car_container" style="height: calc(-236px + 100vh);">
    <div class="allselect">
      <div class="allSelectDiv">
        <input type="checkbox" on:click={toggleAll} checked={allSelected} />
        <strong class="selectButton">전체선택</strong>
      </div>
    </div>
    <div class="graphCardWrap col3">
      {#each filteredAssets as asset, index}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <article
          class="graphCard hoverCard"
          style="height: 250px;"
          on:click={() => handleAssetClick(asset)}
        >
          <div class="head justify-between">
            <div class="flex align-center" on:click|stopPropagation>
              <div class="checkboxWrap default">
                <input
                  type="checkbox"
                  class="checkbox"
                  bind:group={selected}
                  name={asset}
                  value={asset}
                /><span></span>
              </div>

              <span
                class="badge badgePrimary noneborder"
                style="color: {asset.ast_lastconnect === 'YES'
                  ? 'blue'
                  : 'red'}"
              >
                {asset.ast_lastconnect === "YES" ? "연결중" : "연결 안됨"}
              </span>
            </div>
            <div class="btnWrap">
              <button
                type="button"
                title="활성화하다"
                class="btnImg"
                on:click|stopPropagation={() => activateAsset(asset.ass_uuid)}
              >
                <img src="./assets/images/icon/edit.svg" alt="Edit" />
              </button>
              <button
                type="button"
                title="비활성화하다"
                class="btnImg"
                on:click|stopPropagation={() => unActivate(asset.ass_uuid)}
              >
                <img src="./assets/images/icon/delete_gray.svg" alt="Delete" />
              </button>
              <button
                type="button"
                title="그룹이동"
                class="btnImg"
                on:click|stopPropagation={() => {
                  showModalChange = true;
                  handleAssetUuid(asset);
                }}
              >
                <img src="./assets/images/icon/reset.svg" alt="Reset" />
              </button>
            </div>
          </div>
          <div class="flex contents">
            <div class="graph">
              <div>
                <div
                  class="circle"
                  data-percent={asset.asset_point_history?.[0]
                    ?.ast_security_point || 0}
                  data-offset="440"
                >
                  <svg viewBox="0 0 150 150">
                    <circle
                      cx="75"
                      cy="75"
                      r="70"
                      stroke="#fff"
                      stroke-width="10"
                      fill="none"
                    />
                    <circle
                      class="progress"
                      cx="75"
                      cy="75"
                      r="70"
                      stroke={getStrokeColor(
                        asset.asset_point_history?.[0]?.ast_security_point || 0,
                      )}
                      stroke-width="10"
                      fill="none"
                      stroke-dasharray="440"
                      stroke-dashoffset={440 -
                        (440 *
                          (asset.asset_point_history?.[0]?.ast_security_point ||
                            0)) /
                          100}
                      stroke-linecap="round"
                      transform="rotate(-90 75 75)"
                    />
                  </svg>
                  <div class="percent">
                    <div class="title">보안점수</div>
                    <span
                      class="number pointColor"
                      style="color: {getStrokeColor(
                        asset.asset_point_history?.[0]?.ast_security_point || 0,
                      )};"
                    >
                      {asset.asset_point_history?.[0]?.ast_security_point > 0
                        ? asset.asset_point_history?.[0]?.ast_security_point
                        : 0}%
                    </span>
                  </div>
                </div>
                <h4 class="name">
                  {asset.asset_group?.[0]?.asg_index__asg_title ||
                    "Unknown Group"}
                </h4>
              </div>
              <span class="date">
                {formatDate(asset.ast_lastconnect) || "Unknown Date"}
              </span>
            </div>
            <div class="text flex col justify-between">
              <ul>
                <li>
                  <span>운영체제 : </span>{asset.ast_os || "Unknown OS"}
                </li>
                <li>
                  <span>자산명 : </span>{asset.ast_hostname ||
                    "Unknown Hostname"}
                </li>
                <li>
                  <span>아이피주소 : </span>{asset.ast_ipaddr || "Unknown IP"}
                </li>
                <li>
                  <span>점검대상 : </span>{asset.asset_point_history?.[0]
                    ?.ast_uuid__ast_target__cct_target || "No Target"}
                </li>
                <li>
                  <span>에이전트설치여부 : </span>{asset.ast_agent_installed
                    ? "설치됨"
                    : "설치 안됨"}
                </li>
              </ul>

              {#if asset.asset_target_registered === "YES"}
                <div class="flex flex-end">
                  <button
                    type="button"
                    class="btn w140 btnGray hoverbtn"
                    on:click|stopPropagation={() => {
                      showModal = true;
                      selectedAsset = asset;
                    }}
                  >
                    점검대상지정
                  </button>
                </div>
              {:else}
                <div class="flex flex-end">
                  <button
                    type="button"
                    class="btn w140 btnGray hoverbtn"
                    on:click|stopPropagation={() => {
                      showModal = true;
                      selectedAsset = asset;
                    }}
                  >
                    등록 해제
                  </button>
                </div>
              {/if}
            </div>
          </div>
        </article>
      {/each}
    </div>
  </div>

  {#if showModal}
    <div class="dialog2" open on:close={() => (showModal = false)}>
      <ModalCard
        {cancel}
        {selectedAsset}
        {updateFilteredAssets}
        {filterAssets}
        {filteredAssets}
      />
    </div>
  {/if}
{:else}
  <div
    class="car_container"
    style="height: calc(-236px + 100vh);  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 10px;
  scrollbar-width: none;          
  -ms-overflow-style: none;      
  -webkit-overflow-scrolling: touch;"
  >
    <Swiper
      {selectedAsset}
      {filteredAssets}
      {filterAssets}
      {updateFilteredAssets}
      {assetGroupList}
      {assetList}
      {selectedUUID}
    />
  </div>
{/if}
{#if showModalChange}
  <dialog open on:close={() => (showModalChange = false)}>
    <div class="modal-content">
      <h2>이동할 자산그룹을 선택해 주세요</h2>

      <select id="group-select" on:change={handleGroupChange}>
        {#each $allAssetGroupList as group}
          <option
            value={group.asg_index}
            selected={group.asg_index == selectedGroupIndex}
          >
            {group.asg_title}
          </option>
        {/each}
      </select>

      <div class="modal-buttons">
        <button class="primary-button" on:click={assetGroupChange}>OK</button>
        <button
          class="secondary-button"
          on:click={() => (showModalChange = false)}>Cancel</button
        >
      </div>
    </div>
  </dialog>
{/if}

<style>
  .modal-buttons {
    display: flex;
    justify-content: space-between;
  }
  .modal-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 14px;
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

  /****Modal Container*/
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
    animation: svelte-s7onsa-fadeIn 0.3s ease;
    z-index: 100;
  }

  /* Modal backdrop */
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    animation: fadeInBackdrop 0.3s ease;
  }

  .car_container {
    height: 75vh;
    overflow-y: auto;
    padding-bottom: 20px;
    overflow-x: hidden;
  }

  .dialog2 {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    margin-top: 20px;
    position: fixed;
    top: 50%;
    left: 55%;
    transform: translate(-50%, -50%);
    animation: fadeIn 0.3s ease;
  }
  .hoverCard {
    transition:
      background-color 0.3s ease,
      box-shadow 0.3s ease;
  }
  .hoverCard:hover {
    background-color: rgba(242, 242, 242, 1); /* light blue tint */
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2); /* subtle blue shadow */
    cursor: pointer;
  }
  /* Header section for select and action buttons */
  .allselect {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .allSelectDiv {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .selectButton {
    cursor: pointer;
    color: #333;
    font-weight: 600;
  }

  .checkbox {
    width: 15px;
    height: 15px;
    border-color: #e8e8e8;
    position: relative;
    top: 2px;
  }
  .btnWrap {
    display: flex; /* Align buttons in a row */
    gap: 8px; /* Space between buttons */
    position: relative; /* Ensure parent has no conflicting z-index */
  }

  .btnImg {
    display: flex; /* Use flex to align items */
    align-items: center; /* Center items vertically */
    position: relative; /* Required for the tooltip positioning */
    border: none; /* Remove default button border */
    background-color: transparent; /* Transparent background */
    cursor: pointer; /* Change cursor on hover */
  }

  /* Adjust icon size */
  .btnImg img {
    width: 24px;
    height: 24px;
  }
  /* Tooltip styling */
  .btnImg[title] {
    position: relative;
    cursor: pointer;
  }

  /* Tooltip on hover */
  .btnImg[title]:hover::after {
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
  .btnImg[title]:hover::before {
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
  .btnImg img:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .hoverbtn:hover {
    background-color: #0067ff;
    color: white;
  }
</style>
