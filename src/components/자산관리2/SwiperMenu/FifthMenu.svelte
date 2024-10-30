<script>
  import { assetDeatilInfo } from "../../../services/page2/asset.store";
  let currentData = null;
  let activeData = null;

  // Filters for specific tabs
  let selectedNetworkDate = ""; // Date filter for 네트워크 정보
  let selectedProcessAppName = ""; // App name filter for 프로세스목록
  let selectedInstalledProgDate = ""; // Date filter for 설치된 프로그램 목록
  let selectedPatchDate = ""; // Filter for 패치내역
  let selectedDllDate = ""; // Filter for DLL 정보

  // Reactive `filteredData` based on `activeData` and selected filters
  $: filteredData = (() => {
    if (activeData === "운영체제정보") {
      // Display all data for 운영체제정보 by default
      return currentData;
    } else if (activeData === "네트워크 정보" && selectedNetworkDate) {
      // Filter 네트워크 정보 by date only when selectedNetworkDate is set
      return currentData.filter(
        (item) =>
          new Date(item.apn_cdate).toISOString().slice(0, 10) ===
          selectedNetworkDate,
      );
    } else if (activeData === "프로세스목록" && selectedProcessAppName) {
      // Filter 프로세스목록 by app_name only when selectedProcessAppName is set
      return currentData.filter(
        (item) => item.app_pname === selectedProcessAppName,
      );
    } else if (
      activeData === "설치된 프로그램 목록" &&
      selectedInstalledProgDate
    ) {
      // Filter 설치된 프로그램 목록 by date only when selectedInstalledProgDate is set
      return currentData.filter(
        (item) =>
          new Date(item.aip_cdate).toISOString().slice(0, 10) ===
          selectedInstalledProgDate, // Change to aip_date
      );
    } else if (["패치내역", "DLL 정보"].includes(activeData)) {
      // Display all data by default for these tabs
      return currentData;
    } else {
      return []; // Show no data if no filter is selected for filtered tabs
    }
  })();

  // Function to set activeData and load data into currentData
  const selectData = (page, menu) => {
    currentData = page;
    activeData = menu;
    resetFilters();
  };

  // Reset filters when changing tabs
  const resetFilters = () => {
    selectedNetworkDate = "";
    selectedProcessAppName = "";
    selectedInstalledProgDate = "";
    selectedPatchDate = "";
    selectedDllDate = "";
  };
  // Reactive subscription to assetDeatilInfo store
  $: assetDetails =
    $assetDeatilInfo.length > 0 ? $assetDeatilInfo[0].asset[0] : {};
  $: cceHistory = $assetDeatilInfo.length > 1 ? $assetDeatilInfo[1] : [];
  $: assetHistory = $assetDeatilInfo.length > 0 ? $assetDeatilInfo : [];
  $: console.log("cce ", assetHistory);
  $: fieldOptions =
    currentData && currentData.length > 0 ? Object.keys(currentData[0]) : [];
</script>

<main>
  <div>
    <div class="section" style="margin-top:20px">
      <!-- svelte-ignore a11y-missing-attribute -->
      <section class="subTabWrap">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
          on:click={() =>
            selectData(
              assetHistory[0]?.system_info?.osinfo || [],
              "운영체제정보",
            )}
          class={activeData === "운영체제정보" ? "active" : ""}
        >
          운영체제정보
        </a>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <a
          on:click={() =>
            selectData(
              assetHistory[0].system_info?.installedprog || [],
              "설치된 프로그램 목록",
            )}
          class={activeData === "설치된 프로그램 목록" ? "active" : ""}
        >
          설치된 프로그램 목록
        </a>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <a
          on:click={() =>
            selectData(
              assetHistory[0].system_info?.process || [],
              "프로세스목록",
            )}
          class={activeData === "프로세스목록" ? "active" : ""}
        >
          프로세스목록
        </a>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <a
          on:click={() =>
            selectData(
              assetHistory[0].system_info?.process_network || [],
              "네트워크 정보",
            )}
          class={activeData === "네트워크 정보" ? "active" : ""}
        >
          네트워크 정보
        </a>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <a
          on:click={() =>
            selectData(assetHistory[0].system_info?.dlls || [], "DLL 정보")}
          class={activeData === "DLL 정보" ? "active" : ""}
        >
          DLL 정보
        </a>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <a
          on:click={() =>
            selectData(
              assetHistory[0].system_info?.patchstatus || [],
              "패치내역",
            )}
          class={activeData === "패치내역" ? "active" : ""}
        >
          패치내역/대상
        </a>
      </section>
    </div>

    <div class="flex col detail">
      <!-- Dropdowns based on activeData -->
      {#if activeData === "네트워크 정보"}
        <label for="networkDateInput">Filter by Date:</label>
        <input
          class="date_input"
          type="date"
          id="networkDateInput"
          bind:value={selectedNetworkDate}
        />
      {/if}

      {#if activeData === "프로세스목록"}
        <label for="processAppNameSelect">Filter by App Name:</label>
        <select
          class="select_input"
          id="processAppNameSelect"
          bind:value={selectedProcessAppName}
        >
          <option value="">Select an App Name</option>
          {#each [...new Set(currentData.map((item) => item.app_pname))] as appName}
            <option value={appName}>{appName}</option>
          {/each}
        </select>
      {/if}

      {#if activeData === "설치된 프로그램 목록"}
        <label for="installedProgDateInput">Filter by Installation Date:</label>
        <input
          class="date_input"
          type="date"
          id="installedProgDateInput"
          bind:value={selectedInstalledProgDate}
        />
      {/if}

      <!-- Display filtered data -->
      <div class="flex col detail">
        {#if filteredData && filteredData.length > 0}
          <div class="itemListWrap" style="height: 55vh; overflow-y:auto;">
            {#each filteredData as item}
              <div class="itemCard">
                <table class="itemTable">
                  <colgroup>
                    <col style="width: 150px;" />
                    <col />
                  </colgroup>
                  <thead>
                    <tr
                      style="color: black; background-color: rgba(0, 103, 255, 0.05);"
                    >
                      <td class="text-center">구분</td>
                      <td>설명</td>
                    </tr>
                  </thead>
                  <tbody>
                    {#each Object.entries(item) as [key, value]}
                      <tr>
                        <td class="fieldName text-center">{key}</td>
                        <td class="fieldValue">{value}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {/each}
          </div>
        {:else if activeData}
          <div class="empty_state">
            <p>Select a filter option to display data.</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>

<style>
  td {
    font-size: 16px;
  }
  .itemListWrap {
    display: flex;
    flex-direction: column;
    gap: 20px; /* Adds space between each item card */
    margin: 20px;
  }
  .date_input {
    width: 150px;
    height: 30px;
  }
  .select_input {
    width: 300px;
  }
  .itemCard {
    background-color: #fff;
    border: 1px solid #ddd; /* Border for clear separation */
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1); /* Soft shadow for card effect */
  }

  .itemTable {
    width: 100%;
    border-collapse: collapse;
  }

  .itemTable td {
    padding: 8px 10px;
    vertical-align: top;
  }

  .fieldName {
    font-weight: bold;
    color: #333;
    width: 150px;
  }

  .fieldValue {
    color: #555;
  }

  /* Optional alternating row color within each card */

  .tableListWrap th,
  td {
    font-size: 16px;
  }
  .subTabWrap a {
    cursor: pointer;
  }
  thead {
    top: 0; /* Stick the header to the top */
    z-index: 10; /* Ensure the header is above the scrolling content */
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4); /* Shadow effect for separation */
  }

  .empty_state {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-top: 20px;
    font-size: 14px;
    color: #555;
  }
</style>
