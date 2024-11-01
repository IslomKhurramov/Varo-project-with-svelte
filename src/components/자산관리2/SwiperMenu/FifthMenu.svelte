<script>
  import { assetDeatilInfo } from "../../../services/page2/asset.store";
  let currentData = [];
  let activeData = null;

  // Filter values for different tabs
  let selectedNetworkDate = "";
  let selectedProcessAppName = "";
  let selectedInstalledProgDate = "";
  let selectedPatchDate = "";
  let selectedDllDate = "";
  // Compute unique dates for dropdowns
  const getUniqueDates = (dateField) => {
    if (!currentData || currentData.length === 0) return []; // Return empty if no data
    // Extract date only (YYYY-MM-DD) and make unique
    const dates = [
      ...new Set(
        currentData.map((item) => {
          return item[dateField].split("T")[0]; // Split to get date part
        }),
      ),
    ].filter((date) => date);

    return dates.sort((a, b) => new Date(b) - new Date(a)); // Sort dates in descending order
  };

  $: filteredData = (() => {
    if (activeData === "운영체제정보") {
      return currentData;
    } else if (activeData === "네트워크 정보" && selectedNetworkDate) {
      return currentData.filter(
        (item) =>
          new Date(item.apn_cdate).toISOString().slice(0, 10) ===
          selectedNetworkDate,
      );
    } else if (activeData === "프로세스목록" && selectedProcessAppName) {
      return currentData.filter(
        (item) =>
          new Date(item.app_cdate).toISOString().slice(0, 10) ===
          selectedProcessAppName,
      );
    } else if (
      activeData === "설치된 프로그램 목록" &&
      selectedInstalledProgDate
    ) {
      return currentData.filter(
        (item) =>
          new Date(item.aip_cdate).toISOString().slice(0, 10) ===
          selectedInstalledProgDate,
      );
    } else if (activeData === "패치내역" && selectedPatchDate) {
      return currentData.filter(
        (item) =>
          new Date(item.aps_cdate).toISOString().slice(0, 10) ===
          selectedPatchDate,
      );
    } else if (activeData === "DLL 정보" && selectedDllDate) {
      return currentData.filter(
        (item) =>
          new Date(item.ads_cdate).toISOString().slice(0, 10) ===
          selectedDllDate,
      );
    } else {
      return [];
    }
  })();

  // Function to handle tab selection
  const selectData = (page, menu) => {
    currentData = page.map((item) => ({
      ...item,
      modelType: determineModelType(menu), // Function to infer modelType based on menu
    }));
    activeData = menu;
    resetFilters();
  };

  function determineModelType(menu) {
    switch (menu) {
      case "운영체제정보":
        return "AssetStatusData";
      case "네트워크 정보":
        return "AssetProcessNetwork";
      case "프로세스목록":
        return "AssetProcess";
      case "설치된 프로그램 목록":
        return "AssetInstalledProgram";
      case "패치내역":
        return "AssetPatchStatus";
      case "DLL 정보":
        return "AssetsDlls";
      default:
        return null;
    }
  }

  // Function to reset all filters on tab change
  const resetFilters = () => {
    selectedNetworkDate = "";
    selectedProcessAppName = "";
    selectedInstalledProgDate = "";
    selectedPatchDate = "";
    selectedDllDate = "";
  };
  const allowedFields = {
    AssetStatusData: [
      "ast_hostname",
      "ast_ipaddr",
      "ast_ipaddrs",
      "ast_platform",
      "ast_release",
      "ast_version",
      "ast_cpuarch",
      "ast_ostype",
      "ast_cpuinfo",
      "ast_cpu_used",
      "ast_mem_size",
      "ast_mem_used",
      "ast_hdd_size",
      "ast_hdd_used",
    ],
    AssetProcessNetwork: [
      "apn_nlocal_ip",
      "apn_nlocal_port",
      "apn_nremote_ip",
      "apn_nremote_port",
      "apn_nstatus",
      "apn_pid",
      "apn_pname",
      "apn_pexe",
      "apn_pcmdline",
      "apn_pusername",
      "apn_ppid",
      "apn_penv",
    ],
    AssetProcess: [
      "app_pid",
      "app_pname",
      "app_status",
      "app_start_time",
      "app_cmdline",
    ],
    AssetInstalledProgram: [
      "aip_pname",
      "aip_pversion",
      "aip_pvendor",
      "aip_pdescription",
      "aip_pidentifyingNumber",
      "aip_date",
      "aip_plocation",
      "aip_installstate",
      "aip_pcache",
    ],
    AssetPatchStatus: ["aps_patch_name", "aps_cdate", "aps_hash"],
    AssetsDlls: ["ads_dll", "ads_hash", "ads_cdate"],
  };
  // Subscribe to the asset detail info store
  $: assetDetails =
    $assetDeatilInfo.length > 0 ? $assetDeatilInfo[0].asset[0] : {};
  $: assetHistory = $assetDeatilInfo.length > 0 ? $assetDeatilInfo : [];
  $: fieldOptions =
    currentData && currentData.length > 0 ? Object.keys(currentData[0]) : [];
</script>

<main>
  <div>
    <div class="section" style="margin-top:20px">
      <!-- svelte-ignore a11y-missing-attribute -->
      <section class="subTabWrap">
        <a
          on:click={() =>
            selectData(
              assetHistory[0]?.system_info?.osinfo || [],
              "운영체제정보",
            )}
          class={activeData === "운영체제정보" ? "active" : ""}>운영체제정보</a
        >
        <a
          on:click={() =>
            selectData(
              assetHistory[0]?.system_info?.installedprog || [],
              "설치된 프로그램 목록",
            )}
          class={activeData === "설치된 프로그램 목록" ? "active" : ""}
          >설치된 프로그램 목록</a
        >
        <a
          on:click={() =>
            selectData(
              assetHistory[0]?.system_info?.process || [],
              "프로세스목록",
            )}
          class={activeData === "프로세스목록" ? "active" : ""}>프로세스목록</a
        >
        <a
          on:click={() =>
            selectData(
              assetHistory[0]?.system_info?.process_network || [],
              "네트워크 정보",
            )}
          class={activeData === "네트워크 정보" ? "active" : ""}
          >네트워크 정보</a
        >
        <a
          on:click={() =>
            selectData(assetHistory[0]?.system_info?.dlls || [], "DLL 정보")}
          class={activeData === "DLL 정보" ? "active" : ""}>DLL 정보</a
        >
        <a
          on:click={() =>
            selectData(
              assetHistory[0]?.system_info?.patchstatus || [],
              "패치내역",
            )}
          class={activeData === "패치내역" ? "active" : ""}>패치내역/대상</a
        >
      </section>
    </div>

    <div class="flex col detail">
      {#if activeData === "네트워크 정보"}
        <select
          class="date_input"
          id="networkDateSelect"
          bind:value={selectedNetworkDate}
        >
          <option value="">Select a Date</option>
          {#each getUniqueDates("apn_cdate") as date}
            <option value={date}>{date}</option>
          {/each}
        </select>
      {/if}

      {#if activeData === "프로세스목록"}
        <select
          class="select_input"
          id="processAppNameSelect"
          bind:value={selectedProcessAppName}
        >
          <option value="">Filter by Date</option>
          {#each getUniqueDates("app_cdate") as date}
            <option value={date}>{date}</option>
          {/each}
        </select>
      {/if}

      {#if activeData === "설치된 프로그램 목록"}
        <select
          class="date_input"
          id="installedProgDateSelect"
          bind:value={selectedInstalledProgDate}
        >
          <option value="">Select a Date</option>
          {#each getUniqueDates("aip_cdate") as date}
            <option value={date}>{date}</option>
          {/each}
        </select>
      {/if}

      {#if activeData === "패치내역"}
        <select
          class="date_input"
          id="patchDateSelect"
          bind:value={selectedPatchDate}
        >
          <option value="">Select a Date</option>
          {#each getUniqueDates("aps_cdate") as date}
            <option value={date}>{date}</option>
          {/each}
        </select>
      {/if}

      {#if activeData === "DLL 정보"}
        <select
          class="date_input"
          id="dllDateSelect"
          bind:value={selectedDllDate}
        >
          <option value="">Select a Date</option>
          {#each getUniqueDates("ads_cdate") as date}
            <option value={date}>{date}</option>
          {/each}
        </select>
      {/if}
      <!-- Display filtered data -->
      <div class="flex col detail">
        {#if filteredData && filteredData.length > 0}
          <div
            class="itemListWrap"
            style="height: 70vh; overflow-y: auto; margin-top:10px;"
          >
            <!-- Consolidated Table for AssetStatusData Items -->
            {#if currentData.some((item) => item.modelType === "AssetStatusData")}
              <div class="tableListWrap table2">
                <table class="tableList hdBorder">
                  <colgroup>
                    <col style="width: 150px;" />
                    <col />
                  </colgroup>
                  <thead>
                    <tr
                      style="color: black; background-color: rgba(0, 103, 255, 0.05);"
                    >
                      <th class="text-center">구분</th>
                      <th>설명</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each currentData.filter((item) => item.modelType === "AssetStatusData") as item}
                      {#each Object.entries(item).filter( ([key]) => allowedFields["AssetStatusData"].includes(key), ) as [key, value]}
                        <tr>
                          <td class="fieldName text-center">
                            {#if key === "ast_hostname"}호스트명
                            {:else if key === "ast_ipaddr"}아이피주소
                            {:else if key === "ast_ipaddrs"}아이피주소전체
                            {:else if key === "ast_platform"}운영플랫폼
                            {:else if key === "ast_release"}릴리즈
                            {:else if key === "ast_version"}버전
                            {:else if key === "ast_cpuarch"}CPU타입
                            {:else if key === "ast_ostype"}운영체제
                            {:else if key === "ast_cpuinfo"}CPU정보
                            {:else if key === "ast_cpu_used"}CPU사용량
                            {:else if key === "ast_mem_size"}메모리크기
                            {:else if key === "ast_mem_used"}메모리사용량
                            {:else if key === "ast_hdd_size"}HDD크기
                            {:else if key === "ast_hdd_used"}HDD사용량
                            {/if}
                          </td>
                          <td class="fieldValue">{value}</td>
                        </tr>
                      {/each}
                    {/each}
                  </tbody>
                </table>
              </div>
            {/if}

            <!-- Separate Tables for Other modelTypes -->
            {#each currentData.filter((item) => item.modelType !== "AssetStatusData") as item}
              {#if allowedFields[item.modelType]}
                <div
                  class="tableListWrap table2"
                  style="display: flex; justify-content:center"
                >
                  <table class="tableList hdBorder" style="width: 100%;">
                    <colgroup>
                      <colgroup>
                        {#if item.modelType === "AssetPatchStatus" || item.modelType === "AssetsDlls"}
                          <!-- For these model types, make the columns auto-sized based on content -->
                          <col style="width: 250px;" />
                          <col style="width: 250px;" />
                        {:else if item.modelType === "AssetProcess"}
                          <col style="width: 90px;" />
                          <col style="width: auto;" />
                          <col style="width: auto;" />
                          <col style="width: auto;" />
                        {:else}
                          <col style="width: 180px;" />
                          <col style="width: auto;" />
                        {/if}
                      </colgroup>
                    </colgroup>
                    <thead>
                      <tr
                        style="color: black; background-color: rgba(0, 103, 255, 0.05);"
                      >
                        {#if item.modelType === "AssetProcessNetwork"}
                          <th class="text-center">로컬아이피</th>
                          <th class="text-center">로컬포트</th>
                          <th class="text-center">원격아이피</th>
                          <th class="text-center">원격포트</th>
                          <th class="text-center">연결상태</th>
                        {:else if item.modelType === "AssetProcess"}
                          <th class="text-center">프로세스ID</th>
                          <th class="text-center">프로세스이름</th>
                          <th class="text-center">프로세스상태</th>
                          <th class="text-center">시작시간</th>
                        {:else if item.modelType === "AssetInstalledProgram"}
                          <th class="text-center">프로그램명</th>
                          <th class="text-center">버전</th>
                          <th class="text-center">벤더</th>
                          <th class="text-center">설명</th>
                          <th class="text-center">설치일</th>
                        {:else if item.modelType === "AssetPatchStatus"}
                          <th>패치명</th>
                        {:else if item.modelType === "AssetsDlls"}
                          <th>DLL이름</th>
                        {/if}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {#if item.modelType === "AssetProcessNetwork"}
                          <td class="text-center">{item.apn_nlocal_ip}</td>
                          <td class="text-center">{item.apn_nlocal_port}</td>
                          <td class="text-center">{item.apn_nremote_ip}</td>
                          <td class="text-center">{item.apn_nremote_port}</td>
                          <td class="text-center">{item.apn_nstatus}</td>
                        {:else if item.modelType === "AssetProcess"}
                          <td class="text-center">{item.app_pid}</td>
                          <td class="text-center">{item.app_pname}</td>
                          <td class="text-center">{item.app_status}</td>
                          <td class="text-center">{item.app_start_time}</td>
                        {:else if item.modelType === "AssetInstalledProgram"}
                          <td class="text-center">{item.aip_pname}</td>
                          <td class="text-center">{item.aip_pversion}</td>
                          <td class="text-center">{item.aip_pvendor}</td>
                          <td class="text-center">{item.aip_pdescription}</td>
                          <td class="text-center">{item.aip_date}</td>
                        {:else if item.modelType === "AssetPatchStatus"}
                          <td>{item.aps_patch_name}</td>
                        {:else if item.modelType === "AssetsDlls"}
                          <td>{item.ads_dll}</td>
                        {/if}
                      </tr>
                    </tbody>
                  </table>
                </div>
              {/if}
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
  .subTabWrap a.active {
    font-weight: bold;
    border-bottom: 2px solid #007aff;
  }
  td {
    font-size: 16px;
  }
  .table2 {
    margin-bottom: 20px;
  }
  .date_input {
    width: 150px;
    height: 30px;
  }
  .select_input {
    width: 300px;
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
