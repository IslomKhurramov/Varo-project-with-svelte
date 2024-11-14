<script>
  import { onMount } from "svelte"; // Import onMount for lifecycle management
  import { assetDeatilInfo } from "../../../services/page2/asset.store";

  let currentData = [];
  let activeData = ""; // Set default active data
  export let activeAsset;
  // Other filter states
  let selectedNetworkDate = "";
  let selectedProcessAppName = "";
  let selectedInstalledProgDate = "";
  let selectedPatchDate = "";
  let selectedDllDate = "";

  // Function to select data based on menu
  const selectData = (page, menu) => {
    currentData = page.map((item) => ({
      ...item,
      modelType: determineModelType(menu),
    }));
    activeData = menu; // Update the active data menu
    console.log("Data set for", menu, ":", currentData); // Debugging log
    resetFilters(); // Assuming resetFilters() is defined elsewhere
  };

  // Use onMount to select default data when component is mounted
  onMount(() => {
    // Check if assetHistory has data and select the default data
    if (assetHistory.length > 0) {
      selectData(assetHistory[0]?.system_info?.osinfo || [], "운영체제정보");
    }
  });

  // Reactive statement to refresh data when activeData changes
  $: if (activeData === "운영체제정보" && $assetDeatilInfo.length > 0) {
    const initialData = $assetDeatilInfo[0].asset || [];
    currentData = initialData.map((item) => ({
      ...item,
      modelType: determineModelType(activeData),
    }));
  }

  // Or, you could trigger a function to load data again if needed
  $: if (activeData === "운영체제정보") {
    selectData($assetDeatilInfo[0]?.system_info?.osinfo || [], "운영체제정보");
  }

  let selectedItem = null; // State for the selected item
  let isModalOpen = false; // State for modal visibility

  const openModal = (item) => {
    selectedItem = item; // Set the selected item
    isModalOpen = true; // Open the modal
  };

  const closeModal = () => {
    selectedItem = null; // Clear the selected item
    isModalOpen = false; // Close the modal
  };
  // Determine model type based on the selected menu
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

  // Reset all filter states
  const resetFilters = () => {
    selectedNetworkDate = "";
    selectedProcessAppName = "";
    selectedInstalledProgDate = "";
    selectedPatchDate = "";
    selectedDllDate = "";
  };

  // Fetch unique dates for filtering if needed
  const getUniqueDates = (dateField) => {
    if (!currentData || currentData.length === 0) return [];
    const dates = [
      ...new Set(
        currentData.map((item) => {
          return item[dateField].split("T")[0];
        }),
      ),
    ].filter((date) => date);
    return dates.sort((a, b) => new Date(b) - new Date(a));
  };

  // Reactive filtered data based on the active tab
  $: filteredData = (() => {
    if (activeData === "운영체제정보") {
      return currentData; // Return current data directly for the default tab
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

  onMount(() => {
    console.log("Asset Detail Info:", $assetDeatilInfo);

    // Fetch the initial data for the active menu
    if ($assetDeatilInfo.length > 0) {
      const initialData = $assetDeatilInfo[0].asset || [];
      selectData(initialData, activeData); // Load data for '운영체제정보' immediately
    }
  });

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

  $: fieldOptions =
    currentData && currentData.length > 0 ? Object.keys(currentData[0]) : [];
  $: assetDetails =
    $assetDeatilInfo.length > 0 ? $assetDeatilInfo[0].asset[0] : {};
  $: assetHistory = $assetDeatilInfo.length > 0 ? $assetDeatilInfo : [];
  function closeShowModal() {
    isModalOpen = false;
  }

  // Close modal when Esc key is pressed
  function handleKeyDown(event) {
    if (event.key === "Escape") {
      closeShowModal();
    }
  }

  onMount(() => {
    // Listen for keydown event when the modal is open
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      // Remove the event listener when the component is destroyed
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
</script>

<main>
  <div style="height: 97%; position: relative;">
    <div
      class="section"
      style="position: sticky;
    top: 146px;
    z-index: 99;
    background-color: white;
   "
    >
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
      <div class="emptycon">
        <div
          style="position: sticky;
        top: 146px;
        background-color: white;
        height: 40px;     width: 100%;
      display: flex;"
        >
          {#if activeData === "네트워크 정보"}
            <select
              class="date_input"
              id="networkDateSelect"
              bind:value={selectedNetworkDate}
            >
              <option value="">점검날짜</option>
              {#each getUniqueDates("apn_cdate") as date}
                <option value={date}>{date}</option>
              {/each}
            </select>
          {/if}

          {#if activeData === "프로세스목록"}
            <select
              class="date_input"
              id="processAppNameSelect"
              bind:value={selectedProcessAppName}
            >
              <option value="">점검날짜</option>
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
              <option value="">점검날짜</option>
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
              <option value="">점검날짜</option>
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
              <option value="">점검날짜</option>
              {#each getUniqueDates("ads_cdate") as date}
                <option value={date}>{date}</option>
              {/each}
            </select>
          {/if}
        </div>
      </div>
      <!-- Display filtered data -->
      <div
        class="flex col detail"
        style="position: sticky;
      top: 146px;
      z-index: 99;
      background-color: white;
      height: 51vh;"
      >
        {#if filteredData && filteredData.length > 0}
          <div
            class="itemListWrap"
            style="height: 72vh; overflow-y: auto; margin-top:10px;"
          >
            <!-- Consolidated Table for AssetStatusData Items -->
            <div class="tableListWrap nohead">
              {#if currentData.some((item) => item.modelType === "AssetStatusData")}
                <table class="tableList">
                  <colgroup>
                    <col style="width: 140px;" />
                    <col />
                    <col style="width: 140px;" />
                    <col />
                    <col style="width: 140px;" />
                    <col />
                    <col style="width: 140px;" />
                    <col />
                  </colgroup>

                  <tbody>
                    {#each currentData.filter((item) => item.modelType === "AssetStatusData") as item}
                      <tr>
                        <th>호스트명</th>
                        <td>{item.ast_hostname}</td>
                        <th>아이피주소</th>
                        <td>{item.ast_ipaddr}</td>
                        <th>아이피주소전체</th>
                        <td>{item.ast_ipaddrs}</td>
                        <th>운영플랫폼</th>
                        <td>{item.ast_platform}</td>
                      </tr>
                      <tr>
                        <th>릴리즈</th>
                        <td>{item.ast_release}</td>
                        <th>버전</th>
                        <td>{item.ast_version}</td>
                        <th>CPU타입</th>
                        <td>{item.ast_cpuarch}</td>
                        <th>운영체제</th>
                        <td>{item.ast_ostype}</td>
                      </tr>
                      <tr>
                        <th>CPU정보</th>
                        <td>{item.ast_cpuinfo}</td>
                        <th>CPU사용량</th>
                        <td>{item.ast_cpu_used}</td>
                        <th>메모리크기</th>
                        <td>{item.ast_mem_size}</td>
                        <th>메모리사용량</th>
                        <td>{item.ast_mem_used}</td>
                      </tr>
                      <tr>
                        <th>HDD크기</th>
                        <td>{item.ast_hdd_size}</td>
                        <th>HDD사용량</th>
                        <td>{item.ast_hdd_used}</td>
                        <td colspan="4"></td>
                        <!-- This cell can be left empty if not needed -->
                      </tr>
                    {/each}
                  </tbody>
                </table>
              {/if}
            </div>

            <!-- Separate Tables for Other modelTypes -->
            {#each Object.keys(allowedFields) as modelType}
              {#if currentData.some((item) => item.modelType === modelType)}
                <div
                  class="tableListWrap table2"
                  style="display: flex; justify-content: center"
                >
                  <table class="tableList hdBorder" style="width: 100%;">
                    <colgroup>
                      {#if modelType === "AssetPatchStatus" || modelType === "AssetsDlls"}
                        <col />
                      {:else if modelType === "AssetInstalledProgram"}
                        <col style="width: 28%;" />
                        <col style="width: 50px;" />
                        <col style="width: 50px;" />
                        <col style="width: 28%;" />
                        <col style="width: 50px;" />
                      {:else if modelType === "AssetProcessNetwork"}
                        <col style="width: 120px;" />
                        <col style="width: 50px;" />
                        <col style="width: 120px;" />
                        <col style="width: 50px;" />
                        <col style="width: 120px;" />
                      {:else}
                        <col style="width: 32px;" />
                        <col style="width: 120px;" />
                        <col style="width: 40px;" />
                        <col style="width: 120px;" />
                      {/if}
                    </colgroup>
                    <thead>
                      <tr
                        style="color: black; background-color: rgba(0, 103, 255, 0.05);"
                      >
                        {#if modelType === "AssetProcessNetwork"}
                          <th class="text-center">로컬아이피</th>
                          <th class="text-center">로컬포트</th>
                          <th class="text-center">원격아이피</th>
                          <th class="text-center">원격포트</th>
                          <th class="text-center">연결상태</th>
                        {:else if modelType === "AssetProcess"}
                          <th class="text-center">프로세스ID</th>
                          <th class="text-center">프로세스이름</th>
                          <th class="text-center">프로세스상태</th>
                          <th class="text-center">시작시간</th>
                        {:else if modelType === "AssetInstalledProgram"}
                          <th class="text-center">프로그램명</th>
                          <th class="text-center">버전</th>
                          <th class="text-center">벤더</th>
                          <th class="text-center">설명</th>
                          <th class="text-center">설치일</th>
                        {:else if modelType === "AssetPatchStatus"}
                          <th>패치명</th>
                        {:else if modelType === "AssetsDlls"}
                          <th>DLL이름</th>
                        {/if}
                      </tr>
                    </thead>
                    <tbody>
                      {#each currentData.filter((item) => item.modelType === modelType) as item}
                        <tr on:click={() => openModal(item)} class="clickLine">
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
                            <td>{item.aip_pname}</td>
                            <td class="text-center">{item.aip_pversion}</td>
                            <td class="text-center">{item.aip_pvendor}</td>
                            <td>{item.aip_pdescription}</td>
                            <td class="text-center">{item.aip_date}</td>
                          {:else if item.modelType === "AssetPatchStatus"}
                            <td>{item.aps_patch_name}</td>
                          {:else if item.modelType === "AssetsDlls"}
                            <td>{item.ads_dll}</td>
                          {/if}
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              {/if}
            {/each}
          </div>
        {:else if activeData}
          <div class="emptycon">
            <div class="empty_state">
              <p>점검날짜를 선택해 주세요</p>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>

  {#if isModalOpen}
    <div
      class="modal-open-wrap"
      on:click={() => (isModalOpen = false)}
      on:keydown={handleKeyDown}
    >
      <dialog
        open
        on:close={() => (isModalOpen = false)}
        on:click|stopPropagation
      >
        <div class="modal-content">
          <!-- Close button -->

          {#if selectedItem}
            <table class="table3 modal-table">
              <colgroup>
                <col style="width: 20%;" />
                <col style="width: 80%;" />
              </colgroup>
              <tr style="height: 50px; position: sticky;top: -1px;">
                <th
                  class="text-center"
                  style="color: white;background: #0072fd;">구분</th
                >
                <td
                  class="text-center"
                  style="color: white;background: #0072fd;">설명</td
                >
              </tr>
              <tbody>
                {#if selectedItem.modelType === "AssetProcessNetwork"}
                  <tr>
                    <th class="text-center">인덱스</th>
                    <td>{selectedItem.apn_index}</td>
                  </tr>
                  <tr>
                    <th class="text-center">UUID ID</th>
                    <td>{selectedItem.ass_uuid_id}</td>
                  </tr>
                  <tr>
                    <th class="text-center">생성일</th>
                    <td>{selectedItem.apn_cdate}</td>
                  </tr>
                  <tr>
                    <th class="text-center">로컬 IP</th>
                    <td>{selectedItem.apn_nlocal_ip}</td>
                  </tr>
                  <tr>
                    <th class="text-center">로컬 포트</th>
                    <td>{selectedItem.apn_nlocal_port}</td>
                  </tr>
                  <tr>
                    <th class="text-center">원격 IP</th>
                    <td>{selectedItem.apn_nremote_ip}</td>
                  </tr>
                  <tr>
                    <th class="text-center">원격 포트</th>
                    <td>{selectedItem.apn_nremote_port}</td>
                  </tr>
                  <tr>
                    <th class="text-center">상태</th>
                    <td>{selectedItem.apn_nstatus}</td>
                  </tr>
                  <tr>
                    <th class="text-center">가족</th>
                    <td>{selectedItem.apn_nfamily}</td>
                  </tr>
                  <tr>
                    <th class="text-center">해시</th>
                    <td>{selectedItem.apn_hash}</td>
                  </tr>
                  <tr>
                    <th class="text-center">PID</th>
                    <td>{selectedItem.apn_pid}</td>
                  </tr>
                  <tr>
                    <th class="text-center">프로세스 이름</th>
                    <td>{selectedItem.apn_pname}</td>
                  </tr>
                  <tr>
                    <th class="text-center">실행 파일</th>
                    <td>{selectedItem.apn_pexe}</td>
                  </tr>
                  <tr>
                    <th class="text-center">명령줄</th>
                    <td>{selectedItem.apn_pcmdline}</td>
                  </tr>
                  <tr>
                    <th class="text-center">사용자 이름</th>
                    <td>{selectedItem.apn_pusername}</td>
                  </tr>
                  <tr>
                    <th class="text-center">부모 PID</th>
                    <td>{selectedItem.apn_ppid}</td>
                  </tr>
                  <tr>
                    <th class="text-center">환경</th>
                    <td>{selectedItem.apn_penv}</td>
                  </tr>
                {:else if selectedItem.modelType === "AssetProcess"}
                  <tr>
                    <th class="text-center">인덱스</th>
                    <td>{selectedItem.app_index}</td>
                  </tr>
                  <tr>
                    <th class="text-center">UUID ID</th>
                    <td>{selectedItem.ass_uuid_id}</td>
                  </tr>
                  <tr>
                    <th class="text-center">프로세스 ID</th>
                    <td>{selectedItem.app_pid}</td>
                  </tr>
                  <tr>
                    <th class="text-center">프로세스 이름</th>
                    <td>{selectedItem.app_pname}</td>
                  </tr>
                  <tr>
                    <th class="text-center">상태</th>
                    <td>{selectedItem.app_status}</td>
                  </tr>
                  <tr>
                    <th class="text-center">시작 시간</th>
                    <td>{selectedItem.app_start_time}</td>
                  </tr>
                  <tr>
                    <th class="text-center">명령줄</th>
                    <td>{selectedItem.app_cmdline}</td>
                  </tr>
                  <tr>
                    <th class="text-center">해시</th>
                    <td>{selectedItem.app_hash}</td>
                  </tr>
                  <tr>
                    <th class="text-center">생성일</th>
                    <td>{selectedItem.app_cdate}</td>
                  </tr>
                {:else if selectedItem.modelType === "AssetInstalledProgram"}
                  <tr>
                    <th class="text-center">인덱스</th>
                    <td>{selectedItem.aip_index}</td>
                  </tr>
                  <tr>
                    <th class="text-center">UUID ID</th>
                    <td>{selectedItem.ass_uuid_id}</td>
                  </tr>
                  <tr>
                    <th class="text-center">프로그램 이름</th>
                    <td>{selectedItem.aip_pname}</td>
                  </tr>
                  <tr>
                    <th class="text-center">버전</th>
                    <td>{selectedItem.aip_pversion}</td>
                  </tr>
                  <tr>
                    <th class="text-center">벤더</th>
                    <td>{selectedItem.aip_pvendor}</td>
                  </tr>
                  <tr>
                    <th class="text-center">설명</th>
                    <td>{selectedItem.aip_pdescription}</td>
                  </tr>
                  <tr>
                    <th class="text-center">식별 번호</th>
                    <td>{selectedItem.aip_pidentifyingNumber}</td>
                  </tr>
                  <tr>
                    <th class="text-center">설치일</th>
                    <td>{selectedItem.aip_date}</td>
                  </tr>
                  <tr>
                    <th class="text-center">위치</th>
                    <td>{selectedItem.aip_plocation}</td>
                  </tr>
                  <tr>
                    <th class="text-center">설치 상태</th>
                    <td>{selectedItem.aip_installstate}</td>
                  </tr>
                  <tr>
                    <th class="text-center">캐시</th>
                    <td>{selectedItem.aip_pcache}</td>
                  </tr>
                  <tr>
                    <th class="text-center">해시</th>
                    <td>{selectedItem.aip_hash}</td>
                  </tr>
                  <tr>
                    <th class="text-center">생성일</th>
                    <td>{selectedItem.aip_cdate}</td>
                  </tr>
                {:else if selectedItem.modelType === "AssetPatchStatus"}
                  <tr>
                    <th class="text-center">인덱스</th>
                    <td>{selectedItem.aps_index}</td>
                  </tr>
                  <tr>
                    <th class="text-center">UUID ID</th>
                    <td>{selectedItem.ass_uuid_id}</td>
                  </tr>
                  <tr>
                    <th class="text-center">패치 이름</th>
                    <td>{selectedItem.aps_patch_name}</td>
                  </tr>
                  <tr>
                    <th class="text-center">생성일</th>
                    <td>{selectedItem.aps_cdate}</td>
                  </tr>
                  <tr>
                    <th class="text-center">해시</th>
                    <td>{selectedItem.aps_hash}</td>
                  </tr>
                {:else if selectedItem.modelType === "AssetsDlls"}
                  <tr>
                    <th class="text-center">인덱스</th>
                    <td>{selectedItem.ads_index}</td>
                  </tr>
                  <tr>
                    <th class="text-center">UUID ID</th>
                    <td>{selectedItem.ass_uuid_id}</td>
                  </tr>
                  <tr>
                    <th class="text-center">DLL 이름</th>
                    <td>{selectedItem.ads_dll}</td>
                  </tr>
                  <tr>
                    <th class="text-center">해시</th>
                    <td>{selectedItem.ads_hash}</td>
                  </tr>
                  <tr>
                    <th class="text-center">생성일</th>
                    <td>{selectedItem.ads_cdate}</td>
                  </tr>
                {/if}
              </tbody>
            </table>
            <button class="btn modify-btn" on:click={closeModal}>Close</button>
          {/if}
        </div>
      </dialog>
    </div>
  {/if}
</main>

<style>
  .emptycon {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
  }
  .clickLine:hover {
    background-color: rgba(242, 242, 242, 1);
    cursor: pointer;
  }
  .section {
    position: sticky;
    top: 0; /* Stick to the top of the viewport */
    z-index: 10;
    background-color: #fff;
    padding: 10px;
  }

  .modal-table th,
  .modal-table td {
    border: 1px solid #ddd;
    padding: 12px 15px;
    text-align: left; /* Change to center if needed */
    vertical-align: middle;
  }
  .modify-btn {
    background-color: #4caf50; /* Green background for modify button */
    color: white; /* White text */
  }

  .modify-btn:hover {
    background-color: #45a049; /* Darker green on hover */
    transform: translateY(-2px); /* Lift effect on hover */
  }
  .modal-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 16px;
    margin-bottom: 20px;
  }

  .modal-table th {
    background-color: #f7fafc;
    font-weight: bold;
    color: #000000;
    width: 15px; /* Adjust width as needed */
  }

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
  dialog {
    position: fixed;
    /* height: 600px; */
    /* overflow-y: auto;
    overflow-x: hidden; */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1103px;
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
  .tableListWrap .hdBorder th:not(:last-child)::after {
    content: "";
    display: block;
    position: absolute;
    right: 0;
    top: 15px;
    width: 1px;
    height: 17px;
  }
  .date_input {
    width: 150px;
    height: 30px;
    font-size: 16px;
  }
  .select_input {
    width: 300px;
  }
  .tableListWrap.nohead th {
    font-weight: 500;
    background-color: #f7fafc;
    border-radius: 0;
    text-align: center;
  }
  .tableListWrap.nohead th,
  .tableListWrap.nohead td {
    color: rgba(18, 2, 19, 1);
    font-size: 16px;
    padding: 18px 10px;
    border-top: 1px solid rgba(228, 228, 228, 1);
    border-bottom: 1px solid rgba(228, 228, 228, 1);
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
    position: sticky; /* Make the header sticky */
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
    font-size: 16px;
    width: 100%;
    color: #555;
  }
  .modal {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    height: 93%;
    overflow: auto;
    /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); */
    /* max-width: 800px;
      margin: 20px auto; */
    font-family: Arial, sans-serif;
  }

  .modal-content {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    height: 93%;
    overflow: auto;
    /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); */
    /* max-width: 800px;
      margin: 20px auto; */
    font-family: Arial, sans-serif;
  }

  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
</style>
