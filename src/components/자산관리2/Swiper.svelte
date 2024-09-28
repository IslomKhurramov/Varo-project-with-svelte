<script>
  import { onMount } from "svelte";
  import Swiper, { Navigation, Pagination } from "swiper";
  import "swiper/swiper-bundle.min.css";
  import FirstMenu from "./SwiperMenu/FirstMenu.svelte";
  import FourthMenu from "./SwiperMenu/FourthMenu.svelte";
  import FifthMenu from "./SwiperMenu/FifthMenu.svelte";
  import { assetDeatilInfo } from "../../services/page2/asset.store";
  import {
    allAssetList,
    allAssetGroupList,
  } from "../../services/page2/asset.store";
  import {
    getDetailInformationOfAsset,
    setAssetGroupChange,
    setAssetActivate,
    setAssetUnActivate,
    setAssetInformationUpdate,
    setAssetRegisterChange,
  } from "../../services/page2/assetService";
  import { errorAlert, successAlert } from "../../shared/sweetAlert";
  import ModalEdit from "./SwiperMenu/ModalEdit.svelte";
  let showModalSecond = false;
  let selectedGroupIndex = "";
  let showModal = false;
  let currentPage = null;
  let activeMenu = null;
  let swiperInstance;
  let swiperContainer;
  let uuid_asset = "";
  let asset_group_index = "";
  let isProcessing = false;
  let approve_status = "";

  const selectPage = (page, menu) => {
    currentPage = page;
    activeMenu = menu;
    console.log("assetdetail", assetDetails);
  };
  /*************************************************************************/
  // Reactive subscription to assetDeatilInfo store
  $: assetDetails =
    $assetDeatilInfo.length > 0 ? $assetDeatilInfo[0].asset[0] : {};

  let formData = {
    ass_uuid: "",
    ast_group: "",
    ast_code: "",
    ast_usage: "",
    ast_model: "",
    ast_brand: "",
    ast_os: "",
    ast_ostype: "",
    ast_application: "",
    ast_version: "",
    ast_url: "",
    ast_hostname: "",
    ast_real_hostname: "",
    ast_macaddress: "",
    ast_ipaddr: "",
    ast_ipaddrs: "",
    ast_real_ipaddr: "",
    ast_location: "",
    ast_manager_team: "",
    ast_manager_person: "",
    ast_operator_team: "",
    ast_operator_person: "",
    ast_operator_phone: "",
    ast_isms_target: "",
    ast_confidentiality: "",
    ast_integrity: "",
    ast_availability: "",
    ast_security_point: "",
    ast_security_level: "",
    ast_etc: "",
    ast_approve_status: "",
    ast_activate: "",
    ast_agent_installed: "",
  };
  function cancel() {
    showModalSecond = false;
  }

  // Only populate formData if it's uninitialized
  $: if (Object.keys(assetDetails).length > 0 && !formData.ass_uuid) {
    formData = { ...assetDetails };
    console.log("Loaded asset details:", assetDetails);
  }
  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      const response = await setAssetInformationUpdate(formData);
      if (response.success) {
        showModalSecond = false;
        successAlert("Data updated successfully");
      } else {
        throw new Error();
      }
    } catch (error) {
      errorMessage = `Failed to update asset information: ${error.message}`;
      successMessage = "";
    }
  };
  /******************************************************/
  async function assetListDetail(uuid) {
    try {
      const response = await getDetailInformationOfAsset(uuid);

      if (response) {
        assetDeatilInfo.set(Object.values(response));
      } else {
        console.error("Failed to get asset details.");
      }
    } catch (err) {
      alert(`Error getting asset details: ${err.message}`);
      console.error(`Error fetching asset details: ${err.message}`);
    }
  }

  /***************************************************************************/
  // Handle the UUID click and fetch the asset details
  function handleAssetClick(uid, asset) {
    uuid_asset = uid;
    approve_status = asset.ast_approve_status;
    if (asset.asset_group && asset.asset_group.length > 0) {
      asset_group_index = asset.asset_group[0].asg_index;
    }
    assetListDetail(uuid_asset);
    console.log("approve status", approve_status);
  }
  /****************************************************/

  onMount(() => {
    swiperInstance = new Swiper(swiperContainer, {
      modules: [Navigation, Pagination],
      loop: false,
      slidesPerView: 8,
      spaceBetween: 15,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });

    return () => {
      if (swiperInstance) {
        swiperInstance.destroy(true, true);
      }
    };
  });

  /**************UnActivate**************************************/

  async function unactivate() {
    if (!uuid_asset) {
      alert("Asset UUID is missing!");
      return;
    }

    try {
      const unActivating = await setAssetUnActivate(uuid_asset);

      if (unActivating.success) {
        successAlert("The asset has been successfully unactivated!");

        assetDetails.ast_activate = false;
        // Update the asset's activation status directly in the store
        allAssetList.update((assets) => {
          return assets.map((a) => {
            if (a.ass_uuid === uuid_asset) {
              return { ...a, ast_activate: false }; // Mark asset as unactivated
            }
            return a;
          });
        });
      } else if (unActivating.alreadyUnactivated) {
        errorAlert("The asset is already unactivated.");
      } else {
        throw new Error(unActivating.CODE);
      }
    } catch (err) {
      alert(`Error on unactivating Asset! ${err.message}`);
    }
  }

  /**************Activate**************************************/
  async function activateAsset() {
    if (!uuid_asset) {
      alert("Asset UUID is missing!");
      return;
    }

    try {
      const activating = await setAssetActivate(uuid_asset);

      if (activating.success) {
        successAlert("The asset has been successfully activated!");

        assetDetails.ast_activate = true;
        // Update the asset's activation status in the store
        allAssetList.update((assets) => {
          return assets.map((a) => {
            if (a.ass_uuid === uuid_asset) {
              return { ...a, ast_activate: true }; // Mark asset as activated
            }
            return a;
          });
        });
      }
    } catch (err) {
      alert(`Error on activating Asset! ${err.message}`);
    }
  }

  /*****************************************************************/
  /******************************************************************/
  async function assetGroupChange() {
    if (uuid_asset === "") {
      errorAlert("Please select asset");
    }
    try {
      const response = await setAssetGroupChange(
        uuid_asset,
        asset_group_index,
        selectedGroupIndex,
      );

      if (response.success) {
        showModal = false;
        sweetAlert("Group changed successfully!");
      } else {
        errorAlert("Please select asset!");
      }
    } catch (err) {
      console.error(`Error fetching asset details: ${err.message}`);
    }
  }
  /**********************************************************************/
  function handleGroupChange(event) {
    selectedGroupIndex = event.target.value;
  }
  /***********************************************************************/

  async function assetRegisterChange() {
    if (uuid_asset === "") {
      errorAlert("Please select an asset");
      return;
    }
    const newApproveStatus = approve_status === 0 ? 1 : 0;
    try {
      const response = await setAssetRegisterChange(
        uuid_asset,
        newApproveStatus,
      );

      if (response.RESULT === "OK") {
        successAlert("Asset register changed successfully!");

        // Update the asset's approval status in the store
        allAssetList.update((assets) => {
          return assets.map((a) => {
            if (a.ass_uuid === uuid_asset) {
              return { ...a, ast_approve_status: newApproveStatus }; // Update to new status
            }
            return a; // Return unchanged asset
          });
        });

        // Update local approval status to reflect the new status
        approve_status = newApproveStatus; // Update local status
        assetDetails.ast_approve_status = newApproveStatus; // Also update assetDetails
      } else {
        throw new Error("Failed to change asset register status");
      }
    } catch (err) {
      alert(`Error: ${err.message || "An unknown error occurred."}`);
    }
  }
</script>

<main>
  <div class="swiper_container1">
    <img src="./images/left.png" alt="left" />
    <div bind:this={swiperContainer} class="swiper-container">
      <div class="swiper-wrapper">
        {#each $allAssetList as asset}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div
            class="swiper-slide"
            on:click={() => handleAssetClick(asset.ass_uuid, asset)}
          >
            {asset.ast_hostname}
          </div>
        {/each}
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
    <img
      src="./images/left.png"
      style="transform: rotate(180deg);"
      alt="right"
    />
  </div>

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="header">
    <div class="header_3menu">
      <h3
        on:click={() => selectPage(FirstMenu, "자산개요")}
        class={activeMenu === "자산개요" ? "active" : ""}
      >
        자산개요
      </h3>

      <h3
        on:click={() => selectPage(FourthMenu, "CCE점검이력")}
        class={activeMenu === "CCE점검이력" ? "active" : ""}
      >
        CCE점검이력
      </h3>
      <h3
        on:click={() => selectPage(FifthMenu, "자산현황보고서")}
        class={activeMenu === "자산현황보고서" ? "active" : ""}
      >
        자산현황보고서
      </h3>
    </div>
    <div class="button_container">
      <button on:click={() => (showModal = true)}>자산그룹이동 </button>
      <button on:click={() => (showModalSecond = true)}>정보수정</button>
      {#if approve_status === 0}
        <button on:click={assetRegisterChange}>등록승인</button>
      {:else}
        <button on:click={assetRegisterChange}>등록해제</button>
      {/if}
      {#if !assetDetails.ast_activate}
        <button on:click={activateAsset}>자산삭제</button>
      {:else}
        <button on:click={unactivate}>자산삭제</button>
      {/if}
    </div>
  </div>

  {#if currentPage}
    <div class="right_menu">
      <svelte:component this={currentPage} />
    </div>
  {/if}

  {#if showModal}
    <dialog open on:close={() => (showModal = false)}>
      <div class="modal-content">
        <h2>Change Group Index</h2>
        <label for="group-select">Select Group:</label>
        <select id="group-select" on:change={handleGroupChange}>
          {#each $allAssetGroupList as group}
            <option
              value={group.asg_index}
              selected={group.asg_index == selectedGroupIndex}
            >
              {group.asg_index} - {group.asg_title}
            </option>
          {/each}
        </select>
        <p>Selected Group Index: {selectedGroupIndex}</p>
        <div class="modal-buttons">
          <button class="primary-button" on:click={assetGroupChange}>OK</button>
          <button class="secondary-button" on:click={() => (showModal = false)}
            >Cancel</button
          >
        </div>
      </div>
    </dialog>
  {/if}

  {#if showModalSecond}
    <div class="dialog2" open on:close={() => (showModalSecond = false)}>
      <ModalEdit
        {showModalSecond}
        {handleSubmit}
        {formData}
        {assetDetails}
        {cancel}
      />
    </div>
  {/if}
</main>

<style>
  main {
    width: 100%;
  }
  .dialog2 {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    margin-top: 20px;
    position: fixed;
    top: 60%;
    left: 55%;
    transform: translate(-50%, -50%);
    animation: fadeIn 0.3s ease;
  }
  /* Swiper Styles */
  .swiper-container {
    width: 100%;
    margin: 20px auto;
    padding: 10px 0;
    background-color: #f0f0f0;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    position: relative;
  }
  .swiper_container1 {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .swiper_container1 img {
    width: 50px;
    height: auto;
  }
  .swiper-wrapper {
    display: flex;
  }

  .swiper-slide {
    height: 50px;
    max-width: 300px;
    color: #333;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    background: #fff;
    border-radius: 10px;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.1),
      0 4px 8px rgba(0, 0, 0, 0.1);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    cursor: pointer;
  }

  .swiper-slide:hover {
    transform: scale(1.1);
    box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.2),
      0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .swiper-pagination {
    color: #007acc;
  }

  /* Move the left and right navigation buttons outside the swiper container */
  .swiper-button-prev,
  .swiper-button-next {
    color: #007acc;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
  }

  .swiper-button-prev {
    left: -50px;
  }

  .swiper-button-next {
    right: -50px;
  }

  /* Header Styles */
  .header {
    display: flex;
    flex-direction: row;
    gap: 20px;
    padding: 20px 0;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background-color: #f7f9fb;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .header h3 {
    color: #202020;
    font-weight: bold;
    font-size: 12px;
    cursor: pointer;
    position: relative;
    padding-bottom: 5px;
    transition: color 0.3s ease;
  }

  .header h3.active {
    color: #54b3d6;
    text-decoration: underline;
  }

  .header h3:hover::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #54b3d6;
  }
  .button_container {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
  }

  .button_container button {
    background-color: #0056b3; /* Darker Blue */
    color: #ffffff;

    width: 130px;
    height: 30px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .button_container button:hover {
    background-color: #002244;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  .header_3menu {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    justify-content: space-evenly;
    width: 50%;
  }

  /* Right Menu Styles */
  .right_menu {
    margin-top: 20px;
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
    animation: fadeIn 0.3s ease;
    z-index: 100;
  }

  /* Modal content container */
  .modal-content {
    text-align: center;
  }

  h2 {
    font-size: 1.5em;
    margin-bottom: 20px;
    color: #333;
  }

  /* Styled select dropdown */
  select {
    width: 100%;
    padding: 10px;
    font-size: 1em;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f5f5f5;
    transition: border 0.2s ease;
  }

  select:focus {
    outline: none;
    border-color: #54b3d6;
  }

  /* Paragraph showing the selected group */
  p {
    font-size: 1em;
    color: #666;
    margin-bottom: 20px;
  }

  /* Modal buttons */
  .modal-buttons {
    display: flex;
    justify-content: space-between;
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

  /* Modal backdrop */
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    animation: fadeInBackdrop 0.3s ease;
  }

  /* Fade-in animation */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -60%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }

  @keyframes fadeInBackdrop {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
