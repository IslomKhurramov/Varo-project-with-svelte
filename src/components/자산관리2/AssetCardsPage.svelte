<script>
  import Modal from "../../shared/Modal.svelte";
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

  let showModal = false;
  let selected = [];
  let selectedUUID = [];
  let selectedAsset = null;
  export let searchedResult;
  export let showSearchResult;
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
  function check() {
    console.log("SELECTED", selected);
    console.log("TARGETLIST", $targetSystemList);
    console.log("SELECTED UUIDs", selectedUUID);
    console.log("All AssetList array data", $allAssetList);
  }

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

  async function unActivate(uuid) {
    const asset = $allAssetList.find((a) => a.ass_uuid === uuid); // Find the asset in the store

    // If the asset is already unactivated, show an alert and skip API call
    if (!asset.ast_activate) {
      errorAlert("The asset is already unactivated.");
      return; // Stop execution, don't call the API
    }
    try {
      const unActivating = await setAssetUnActivate(uuid);

      if (unActivating.success) {
        successAlert("The asset has been successfully unactivated!");

        // Update the asset's activation status directly in the store
        allAssetList.update((assets) => {
          return assets.map((asset) => {
            if (asset.ass_uuid === uuid) {
              return { ...asset, ast_activate: false }; // Mark asset as unactivated
            }
            return asset;
          });
        });
      } else if (unActivating.alreadyUnactivated) {
        errorAlert("The asset is already unactivated.");
      } else {
        throw new Error(unActivating.CODE);
      }
    } catch (err) {
      alert(`Error on unActivating Asset! ${err.message}`);
    }
  }

  /**************Activate**************************************/

  async function activateAsset(uuid) {
    const asset = $allAssetList.find((a) => a.ass_uuid === uuid);
    if (asset.ast_activate) {
      errorAlert("The asset is already activated.");
      return;
    }
    try {
      const activating = await setAssetActivate(uuid);

      if (activating.success) {
        successAlert("The asset has been successfully activated!");

        // Update the asset's activation status in the store
        allAssetList.update((assets) => {
          return assets.map((asset) => {
            if (asset.ass_uuid === uuid) {
              return { ...asset, ast_activate: true }; // Mark asset as activated
            }
            return asset;
          });
        });
      }
    } catch (err) {
      alert(`Error on activating Asset! ${err.message}`);
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

  /**********************************************************************/
  async function downloadReport() {
    if (selectedUUID.length === 0) {
      alert("No assets selected.");
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
      console.error("Failed to download report:", error);
      alert("An error occurred while downloading the report.");
    }
  }
  function cancel() {
    showModal = false;
  }
</script>

<main>
  <div class="container">
    <div class="header_buttons">
      <button on:click={downloadReport}>요약보고서</button>
      <button on:click={check}>상세보고서 </button>
    </div>
    <div class="allselect">
      <div class="allSelectDiv">
        <input type="checkbox" on:click={toggleAll} checked={allSelected} />
        <strong class="selectButton">전체선택</strong>
      </div>
      <div class="color_group">
        <div class="colors">
          <div class="blue_button"></div>
          <span>편집</span>
        </div>
        <div class="colors">
          <div class="red_button"></div>
          <span>삭제</span>
        </div>
      </div>
    </div>
    <div class="card_container">
      {#if showSearchResult}
        {#if searchedResult}
          {#each searchedResult as asset}
            <!-- Main Searched Asset Display -->
            <div
              class="card{asset.ast_activate ? '' : 'deactivated'}"
              style="height: 165px;"
            >
              <input
                type="checkbox"
                class="checkbox"
                bind:group={selected}
                name={asset}
                value={asset}
              />

              <div class="card_buttons">
                <!-- Activate Button -->
                <button
                  class="blue"
                  on:click={() => activateAsset(asset.ass_uuid)}
                ></button>

                <!-- Un-Activate Button -->
                <button class="red" on:click={() => unActivate(asset.ass_uuid)}
                ></button>
              </div>

              <!-- Conditional Rendering for Registration Status -->
              {#if asset.asset_target_registered === "YES"}
                <button
                  class="modal_button"
                  on:click={() => {
                    showModal = true;
                    selectedAsset = asset;
                  }}
                >
                  등록 미승인
                </button>
              {:else}
                <button
                  class="modal_button"
                  on:click={() => {
                    showModal = true;
                    selectedAsset = asset;
                  }}
                >
                  등록 해제
                </button>
              {/if}

              <div class="first_col">
                <div class="first_col_1">
                  <p>보안점수</p>

                  <!-- Security Point Display -->
                  {#if asset.asset_point_history?.[0]?.ast_security_point > 0}
                    <div
                      class="box_number {asset.asset_point_history?.[0]
                        ?.ast_security_point < 50
                        ? 'low'
                        : asset.asset_point_history?.[0]?.ast_security_point <
                            80
                          ? 'medium'
                          : 'high'}"
                    >
                      {asset.asset_point_history?.[0]?.ast_security_point}%
                    </div>
                  {:else}
                    <div class="box_number low">0%</div>
                  {/if}

                  <!-- Asset Group -->
                  <p>
                    <span style="font-weight: bold; white-space: nowrap;">
                      {asset.asset_group?.[0]?.asg_index__asg_title || ""}
                    </span>
                  </p>
                </div>

                <!-- Connection Status and Last Connect Date -->
                <div class="first_col_2">
                  <div>
                    <span style="font-weight: bold;">
                      {asset.ast_activate ? "연결중" : "연결 안됨"}
                    </span>
                  </div>
                  <div>
                    <span style="font-weight: bold;">
                      {formatDate(asset.ast_lastconnect) || "Unknown Date"}
                    </span>
                  </div>
                </div>
              </div>

              <div class="second_col">
                <!-- Operating System -->
                <p>
                  운영체제: <span style="font-weight: bold;">
                    {asset.ast_os || "Unknown OS"}
                  </span>
                </p>

                <!-- Hostname -->
                <p>
                  자산명: <span style="font-weight: bold;">
                    {asset.ast_hostname || "Unknown Hostname"}
                  </span>
                </p>

                <!-- IP Address -->
                <p>
                  아이피주소: <span style="font-weight: bold;">
                    {asset.ast_ipaddr || "Unknown IP"}
                  </span>
                </p>

                <!-- Target -->
                <p>
                  점검대상: <span style="font-weight: bold;">
                    {asset.asset_point_history?.[0]
                      ?.ast_uuid__ast_target__cct_target || "No Target"}
                  </span>
                </p>

                <!-- Agent Installation Status -->
                <p>
                  에이전트설치여부: <span style="font-weight: bold;">
                    {asset.ast_agent_installed ? "설치됨" : "설치 안됨"}
                  </span>
                </p>
              </div>
            </div>
          {/each}
        {/if}
      {:else if $allAssetList.length > 0}
        <!-- Display List of Assets -->
        {#each $allAssetList as asset}
          <div class="card {asset.ast_activate ? '' : 'deactivated'}">
            <input
              type="checkbox"
              class="checkbox"
              bind:group={selected}
              name={asset}
              value={asset}
            />

            <div class="card_buttons">
              <button
                class="blue"
                on:click={() => activateAsset(asset.ass_uuid)}
              ></button>
              <button class="red" on:click={() => unActivate(asset.ass_uuid)}
              ></button>
            </div>

            <!-- Registration Status -->
            {#if asset.asset_target_registered === "YES"}
              <button
                class="modal_button"
                on:click={() => {
                  showModal = true;
                  selectedAsset = asset;
                }}
              >
                등록 미승인
              </button>
            {:else}
              <button
                class="modal_button"
                on:click={() => {
                  showModal = true;
                  selectedAsset = asset;
                }}
              >
                등록 해제
              </button>
            {/if}

            <!-- Asset Details -->
            <div class="first_col">
              <div class="first_col_1">
                <p>보안점수</p>
                {#if asset.asset_point_history?.[0]?.ast_security_point > 0}
                  <div
                    class="box_number {asset.asset_point_history?.[0]
                      ?.ast_security_point < 50
                      ? 'low'
                      : asset.asset_point_history?.[0]?.ast_security_point < 80
                        ? 'medium'
                        : 'high'}"
                  >
                    {asset.asset_point_history?.[0]?.ast_security_point}%
                  </div>
                {:else}
                  <div class="box_number low">0%</div>
                {/if}
                <p>
                  <span style="font-weight: bold; white-space: nowrap;">
                    {asset.asset_group?.[0]?.asg_index__asg_title ||
                      "Unknown Group"}
                  </span>
                </p>
              </div>

              <div class="first_col_2">
                <div>
                  <span style="font-weight: bold;">
                    {asset.ast_activate ? "연결중" : "연결 안됨"}
                  </span>
                </div>
                <div>
                  <span style="font-weight: bold;">
                    {formatDate(asset.ast_lastconnect) || "Unknown Date"}
                  </span>
                </div>
              </div>
            </div>

            <div class="second_col">
              <p>
                운영체제: <span style="font-weight: bold;">
                  {asset.ast_os || "Unknown OS"}
                </span>
              </p>
              <p>
                자산명: <span style="font-weight: bold;">
                  {asset.ast_hostname || "Unknown Hostname"}
                </span>
              </p>
              <p>
                아이피주소: <span style="font-weight: bold;">
                  {asset.ast_ipaddr || "Unknown IP"}
                </span>
              </p>
              <p>
                점검대상: <span style="font-weight: bold;">
                  {asset.asset_point_history?.[0]
                    ?.ast_uuid__ast_target__cct_target || "No Target"}
                </span>
              </p>
              <p>
                에이전트설치여부: <span style="font-weight: bold;">
                  {asset.ast_agent_installed ? "설치됨" : "설치 안됨"}
                </span>
              </p>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
  {#if showModal}
    <div class="dialog2" open on:close={() => (showModal = false)}>
      <ModalCard {cancel} {selectedAsset} />
    </div>
  {/if}
</main>

<style>
  .dialog {
    transform: translate(-50%, -50%);
    animation: fadeIn 0.3s ease;
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
  /* Main container for the card layout */
  .container {
    max-width: 100%;
    margin: 20px auto;
    padding: 20px;
    background-color: #f7f9fb;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    min-height: 100vh;
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
  .red_button,
  .yellow_button {
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

  .yellow_button {
    background-color: #ffc107;
  }

  /* Card container for the assets */
  .card_container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px;
    max-height: 600px;
    overflow-y: auto;
    padding: 10px;
    background-color: #ffffff;
    border-radius: 8px;
    border: 1px solid #ced4da;
    min-height: 100vh;
  }

  /* Individual card styling */
  .card {
    position: relative;
    background: #f8f9fa;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow:
      rgba(0, 0, 0, 0.4) 0px 2px 4px,
      rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
      rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    padding: 20px;
    color: #222121; /* White text for contrast */
    font-size: 12px; /* Set font size to 12px */
    margin-bottom: 20px;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .card:hover {
    transform: translateY(-5px); /* Slight lift on hover */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1); /* Stronger shadow on hover */
  }

  .first_col_1 p {
    margin: 0px;
  }
  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }

  /* Checkbox in each card */
  .checkbox {
    position: absolute;
    top: 10px;
    left: 10px;
    cursor: pointer;
    transform: scale(1.2);
  }

  /* Security score box styling */
  .box_number {
    font-size: 12px;
    font-weight: bold;
    padding: 10px;
    border-radius: 8px;
    color: #fff; /* White text for contrast */
    text-align: center;
    width: 50px;
  }

  /* Low security score */
  .box_number.low {
    background-color: #dc3545; /* Red for low score */
  }

  /* Medium security score */
  .box_number.medium {
    background-color: #ffc107; /* Yellow for medium score */
  }

  /* High security score */
  .box_number.high {
    background-color: #28a745; /* Green for high score */
  }

  /* Action buttons within each card */
  .card_buttons {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 5px;
  }

  .card_buttons button {
    width: 16px;
    font-size: 12px;
    height: 16px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
  }

  .blue {
    background-color: #6c757d;
  }

  .red {
    background-color: #dc3545;
  }

  .yellow {
    background-color: #ffc107;
  }

  /* Modal button within each card */
  .modal_button {
    bottom: 10px;
    position: absolute;
    right: 10px;
    padding: 5px 10px;
    background-color: #207792;
    color: #fff;
    border: 1px solid #0e4556;
    font-size: 10px;
    border-radius: 4px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .modal_button:hover {
    background-color: #31b0d5;
    transform: translateY(-2px);
  }

  /* Styling for asset details */
  .first_col {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .first_col_1,
  .first_col_2 {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .second_col {
    line-height: 1.5;
  }

  .second_col p {
    margin: 0;
  }
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
  .deactivated {
    opacity: 0.5; /* Faded appearance for deactivated cards */
    background-color: #f0f0f0; /* Light grey background */
    border: 2px dashed #cccccc; /* Dashed border */
  }
</style>
