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
  let currentPage = FirstMenu;
  let activeMenu = "자산개요";
  let swiperInstance;
  let swiperContainer;
  let uuid_asset = "";
  let asset_group_index = "";
  let approve_status = "";
  let scrollAmount = 0;
  let itemWidth = 146;
  let menuWidth = 1260; // Total width of the menu

  let menuWrapper;
  export let selectedAsset;
  export let filteredAssets = [];
  let activeAsset = null;

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
        successAlert("데이터가 성공적으로 업데이트되었습니다");
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
        console.log("detailasset  info", response);
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

  $: if (selectedAsset) {
    console.log("selectedAaset", selectedAsset);
    focusOnAsset(selectedAsset.ass_uuid);
    handleAssetClick(selectedAsset.ass_uuid, selectedAsset);
  }

  function handleAssetClick(uid, asset) {
    uuid_asset = uid;
    approve_status = asset.ast_approve_status;
    activeAsset = asset;
    // Scroll the selected asset into view
    focusOnAsset(asset.ass_uuid);

    // Check if the asset belongs to any group
    if (asset.asset_group && asset.asset_group.length > 0) {
      asset_group_index = asset.asset_group[0].asg_index;
    }

    // Fetch detailed asset information using the uuid
    assetListDetail(uuid_asset);

    // Log approve status for debugging purposes
    console.log("approve status", approve_status);
  }
  onMount(() => {
    // Initialize Swiper instance only once
    swiperInstance = new Swiper(swiperContainer, {
      modules: [Navigation, Pagination],
      loop: false, // Avoid layout issues caused by looping
      slidesPerView: 4, // Adjust this value to suit your design
      spaceBetween: 10, // Fine-tune spacing to avoid layout shifts
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });

    // Scroll to selected asset if it exists
    if (selectedAsset) {
      setTimeout(() => {
        focusOnAsset(selectedAsset.ass_uuid);
      }, 0);
    }
    menuWrapper = document.getElementById("menuWrapper");
    return () => {
      if (swiperInstance) {
        swiperInstance.destroy(true, true);
      }
    };
  });

  function focusOnAsset(assetId) {
    const menuItem = document.querySelector(`.menu-item[value="${assetId}"]`);
    if (menuItem) {
      const itemCount = document.querySelectorAll(".menu-item").length;
      console.log("Focusing on asset:", assetId); // Debug log

      // Only use scrollIntoView if there are more than 4 items
      if (itemCount > 8) {
        menuItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }

      // Ensure the item can be focused
      setTimeout(() => {
        menuItem.focus(); // Focus on the selected item after scrolling
      }, 300);
    } else {
      console.warn("Menu item not found:", assetId); // Warn if not found
    }
  }

  /****************************************************/

  /**************UnActivate**************************************/

  async function unactivate() {
    if (!uuid_asset) {
      alert("Asset UUID is missing!");
      return;
    }

    try {
      const unActivating = await setAssetUnActivate(uuid_asset);

      if (unActivating.success) {
        successAlert("자산이 성공적으로 활성화 해제되었습니다!");

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
        errorAlert("자산이 이미 활성화되지 않았습니다.");
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
        successAlert("자산이 성공적으로 활성화되었습니다!");

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
      errorAlert("자산을 선택해주세요");
    }
    try {
      const response = await setAssetGroupChange(
        uuid_asset,
        asset_group_index,
        selectedGroupIndex,
      );

      if (response.success) {
        showModal = false;
        sweetAlert("그룹이 성공적으로 변경되었습니다!");
      } else {
        errorAlert("자산을 선택해주세요!");
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
      errorAlert("자산을 선택해주세요");
      return;
    }
    const newApproveStatus = approve_status === 0 ? 1 : 0;
    try {
      const response = await setAssetRegisterChange(
        uuid_asset,
        newApproveStatus,
      );

      if (response.RESULT === "OK") {
        successAlert("자산 등록부가 성공적으로 변경되었습니다!");

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

  // This function will handle the horizontal scroll on next and prev clicks
  // Function to handle horizontal scroll
  const handleScroll = (direction) => {
    if (direction === "prev") {
      scrollAmount -= itemWidth;
      if (scrollAmount < 0) scrollAmount = 0;
    } else if (direction === "next") {
      scrollAmount += itemWidth;
      const maxScroll = menuWrapper.scrollWidth - menuWidth;
      if (scrollAmount > maxScroll) scrollAmount = maxScroll;
    }
    menuWrapper.style.transform = `translateX(-${scrollAmount}px)`;
  };

  function closeModalEdit() {
    currentPage = FirstMenu; // This will unmount ModalEdit when called
  }
</script>

<main style="height: 100%;">
  <article class="contentArea mt-0">
    <section bind:this={swiperContainer} class="topCon">
      <div class="menu-container">
        <button
          class="arrow-btn"
          id="prevBtn"
          on:click={() => handleScroll("prev")}>◀</button
        >
        <div class="menu-wrapper-container">
          <div class="menu-wrapper" id="menuWrapper" bind:this={menuWrapper}>
            {#each filteredAssets.length > 0 ? filteredAssets : $allAssetList as asset}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
              <div
                value={asset.ass_uuid}
                name={asset}
                tabindex="0"
                class="menu-item {activeAsset &&
                activeAsset.ass_uuid === asset.ass_uuid
                  ? 'active'
                  : ''}"
                on:click={() => handleAssetClick(asset.ass_uuid, asset)}
              >
                {asset.ast_hostname}
              </div>
            {/each}
          </div>
        </div>
        <button
          class="arrow-btn"
          id="nextBtn"
          on:click={() => handleScroll("next")}>▶</button
        >
      </div>
    </section>
    <section class="content">
      <div>
        <div class="section" style="margin-top: 20px;">
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div class="flex justify-between submenuWrap">
            <!-- svelte-ignore a11y-missing-attribute -->
            <section class="subTabWrap">
              <!-- svelte-ignore a11y-missing-attribute -->
              <a
                on:click={() => selectPage(FirstMenu, "자산개요")}
                class={activeMenu === "자산개요" ? "active" : ""}
              >
                자산개요
              </a>

              <a
                on:click={() => selectPage(FourthMenu, "CCE점검이력")}
                class={activeMenu === "CCE점검이력" ? "active" : ""}
              >
                CCE점검이력
              </a>
              <a
                on:click={() => selectPage(FifthMenu, "자산현황보고서")}
                class={activeMenu === "자산현황보고서" ? "active" : ""}
              >
                자산현황보고서
              </a>
            </section>
            <section class="flex btnWrap gap-4">
              <button
                class="btn w140 btnBlue"
                on:click={() => (showModal = true)}
                >자산그룹이동
              </button>
              <button
                class="btn w140 btnBlue"
                on:click={() => selectPage(ModalEdit, "ModalEdit")}
                >정보수정</button
              >
              {#if approve_status === 0}
                <button class="btn w140 btnBlue" on:click={assetRegisterChange}
                  >등록승인</button
                >
              {:else}
                <button class="btn w140 btnBlue" on:click={assetRegisterChange}
                  >등록해제</button
                >
              {/if}
              {#if !assetDetails.ast_activate}
                <button class="btn w140 btnBlue" on:click={activateAsset}
                  >자산등록
                </button>
              {:else}
                <button class="btn w140 btnBlue" on:click={unactivate}
                  >자산삭제</button
                >
              {/if}
            </section>
          </div>
          {#if currentPage}
            <div class="right_menu">
              <svelte:component
                this={currentPage}
                {showModalSecond}
                {handleSubmit}
                {formData}
                {assetDetails}
                {closeModalEdit}
              />
            </div>
          {/if}
        </div>
      </div>

      {#if showModal}
        <div class="modal-open-wrap">
          <dialog open on:close={() => (showModal = false)}>
            <div class="modal-content">
              <h2>Change Group Index</h2>
              <label for="group-select" style="margin-top: 15px;"
                >Select Group:</label
              >
              <select
                id="group-select"
                style="margin-top: 15px;"
                on:change={handleGroupChange}
              >
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
                <button class="primary-button" on:click={assetGroupChange}
                  >OK</button
                >
                <button
                  class="secondary-button"
                  on:click={() => (showModal = false)}>Cancel</button
                >
              </div>
            </div>
          </dialog>
        </div>
      {/if}
    </section>
  </article>
</main>

<style>
  .modal-open-wrap {
    display: block;
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(167, 167, 167, 0.6);
  }
  .menu-container .menu-item.active {
    background-color: #0067ff;
    color: #fff;
    border-color: #0067ff;
  }
  .menu-container {
    width: 100%;
  }
  .contentArea {
    min-height: 1200px;
  }
  .subTabWrap a {
    cursor: pointer;
  }
  .subTabWrap {
    margin-bottom: 0px;
  }
  .menu-item {
    overflow-wrap: break-word;
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

  .menu-wrapper-container {
    overflow: hidden; /* Prevents Swiper from breaking out of bounds */
  }
  .menu-wrapper {
    display: flex;
    flex-wrap: nowrap; /* Ensure no wrapping of slides */
  }
  .swiper-wrapper {
    display: flex;
    flex-direction: row;
  }

  .swiper-slide {
    flex-shrink: 0; /* Prevents shrinking of slides */
    width: auto; /* or specific widths depending on how many slides you want to show */
  }
  .modal-content {
    z-index: 100; /* Set higher z-index for modal */
  }
</style>
