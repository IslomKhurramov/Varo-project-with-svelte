<script>
  import ModalCard from "./ModalCard.svelte";
  import {
    allAssetList,
    targetSystemList,
  } from "../../services/page2/asset.store";
  import {
    setAssetActivate,
    setAssetUnActivate,
    getAllAssetLists,
    getTargetSystemLists,
  } from "../../services/page2/assetService";
  import { successAlert, errorAlert } from "../../shared/sweetAlert";
  import { onMount } from "svelte";
  import axios from "axios";
  import { serverApi } from "../../lib/config";
  import Swiper from "./Swiper.svelte";

  let showModal = false;
  export let showSwiperComponent;
  export let selected = [];
  export let selectedUUID = [];
  let selectedAsset = null;
  export let filteredAssets = [];
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
        console.log("All AssetList array data", allAssetList);
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

  // Function to compute stroke color based on the score
  function getStrokeColor(score) {
    if (score > 60)
      return "#0067ff"; // Blue
    else if (score > 30)
      return "#00ff00"; // Green
    else return "#ff0000"; // Red
  }
  function handleAssetClick(asset) {
    console.log("Asset clicked:", asset);
    selectedAsset = asset;
    showSwiperComponent = true; // This should set the showSwiperComponent to true
  }
  $: console.log("showSwiperComponent in child:", showSwiperComponent);
</script>

{#if !showSwiperComponent}
  <div class="allselect">
    <div class="allSelectDiv">
      <input type="checkbox" on:click={toggleAll} checked={allSelected} />
      <strong class="selectButton">전체선택</strong>
    </div>
  </div>

  <div class="graphCardWrap col3 car_container">
    {#each filteredAssets as asset}
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
              style="color: {asset.ast_activate ? 'blue' : 'red'}"
            >
              {asset.ast_activate ? "연결중" : "연결 안됨"}
            </span>
          </div>
          <div class="btnWrap">
            <button
              type="button"
              class="btnImg"
              on:click|stopPropagation={() => activateAsset(asset.ass_uuid)}
            >
              <img src="./assets/images/icon/edit.svg" alt="Edit" />
              <span class="tooltip">활성화하다</span>
            </button>
            <button
              type="button"
              class="btnImg"
              on:click|stopPropagation={() => unActivate(asset.ass_uuid)}
            >
              <img src="./assets/images/icon/delete_gray.svg" alt="Delete" />
              <span class="tooltip">비활성화하다</span>
            </button>
            <button type="button" class="btnImg">
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
                <svg width="" height="" viewBox="0 0 150 150">
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
                <span>자산명 : </span>{asset.ast_hostname || "Unknown Hostname"}
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
                  class="btn w140 btnGray"
                  on:click|stopPropagation={() => {
                    showModal = true;
                    selectedAsset = asset;
                  }}
                >
                  등록 미승인
                </button>
              </div>
            {:else}
              <div class="flex flex-end">
                <button
                  type="button"
                  class="btn w140 btnGray"
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

  {#if showModal}
    <div class="dialog2" open on:close={() => (showModal = false)}>
      <ModalCard {cancel} {selectedAsset} />
    </div>
  {/if}
{:else}
  <Swiper {selectedAsset} {filteredAssets} />
{/if}

<style>
  .car_container {
    max-height: 1200px;
    overflow-y: auto;
    padding-top: 20px;
    padding-bottom: 20px;
    overflow-x: hidden;
  }
  .contentArea {
    background-color: #ccc;
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
    margin-bottom: 10px;
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

  /* Action buttons section */
  .color_group {
    display: flex;
    align-items: center;
    gap: 20px;
    font-size: 12px;
  }

  .colors {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .blue_button,
  .red_button {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid #ccc;
  }

  .blue_button {
    background-color: #6c757d;
  }

  .red_button {
    background-color: #dc3545;
  }

  /* Checkbox in each card */

  .header_buttons {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: flex-end;
    gap: 10px;
  }

  .header_buttons button {
    background-color: #0056b3;
    color: #ffffff;
    border-radius: 5px;
    padding: 8px 12px;
    cursor: pointer;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .header_buttons button:hover {
    background-color: #005fa3;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
  }

  .btnImg {
    display: flex; /* Use flex to align items */
    align-items: center; /* Center items vertically */
    position: relative; /* Required for the tooltip positioning */
    border: none; /* Remove default button border */
    background-color: transparent; /* Transparent background */
    cursor: pointer; /* Change cursor on hover */
  }

  /* Tooltip styling */
  .tooltip {
    visibility: hidden; /* Hidden by default */
    width: 120px; /* Width of the tooltip */
    background-color: rgba(0, 0, 0, 0.7); /* Background color of the tooltip */
    color: #fff; /* Text color */
    text-align: center; /* Center text */
    border-radius: 4px; /* Rounded corners */
    padding: 5px; /* Padding inside tooltip */
    position: absolute; /* Absolute positioning */
    z-index: 1; /* On top of other elements */
    bottom: 125%; /* Position above the button */
    left: 50%; /* Center the tooltip */
    margin-left: -60px; /* Adjust left position to center */
    opacity: 0; /* Initial opacity */
    transition: opacity 0.2s ease; /* Transition effect */
    z-index: 9999 !important;
  }

  /* Show the tooltip on hover */
  .btnImg:hover .tooltip {
    visibility: visible; /* Show tooltip */
    opacity: 1; /* Fade in the tooltip */
  }

  /* Adjust icon size */
  .btnImg img {
    width: 24px; /* Set a consistent width for icons */
    height: 24px; /* Set a consistent height for icons */
  }
</style>
