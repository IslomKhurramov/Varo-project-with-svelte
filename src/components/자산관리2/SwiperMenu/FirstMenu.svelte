<script>
  import { assetDeatilInfo } from "../../../services/page2/asset.store";
  let currentData = null;
  let activeData = null;

  // Separate filter selection variables
  let selectedProcessNetworkPort = "";
  let selectedProcessPname = "";
  let selectedInstalledProgPname = "";
  let selectedPatchStatusPatchName = "";
  let selectedDll = "";

  // Reactive dropdown options based on the active tab
  $: processNetworkPorts =
    activeData === "네트워크 정보" && currentData
      ? [...new Set(currentData.map((item) => item.apn_nlocal_port))]
      : [];

  $: processNames =
    activeData === "프로세스목록" && currentData
      ? [...new Set(currentData.map((item) => item.app_pname))]
      : [];

  $: installedProgNames =
    activeData === "설치된 프로그램 목록" && currentData
      ? [...new Set(currentData.map((item) => item.aip_pname))]
      : [];

  $: patchNames =
    activeData === "패치내역" && currentData
      ? [...new Set(currentData.map((item) => item.aps_patch_name))]
      : [];

  $: dllNames =
    activeData === "DLL 정보" && currentData
      ? [...new Set(currentData.map((item) => item.ads_dll))]
      : [];

  // Filtered data: Shows all data for 운영체제정보 or patchstatus
  $: filteredData =
    activeData === "운영체제정보" || activeData === "patchstatus"
      ? currentData // Show all data for 운영체제정보 and patchstatus tabs
      : activeData === "네트워크 정보" && selectedProcessNetworkPort
        ? currentData.filter(
            (item) => item.apn_nlocal_port === selectedProcessNetworkPort,
          )
        : activeData === "프로세스목록" && selectedProcessPname
          ? currentData.filter(
              (item) => item.app_pname === selectedProcessPname,
            )
          : activeData === "설치된 프로그램 목록" && selectedInstalledProgPname
            ? currentData.filter(
                (item) => item.aip_pname === selectedInstalledProgPname,
              )
            : activeData === "패치내역" && selectedPatchStatusPatchName
              ? currentData.filter(
                  (item) =>
                    item.aps_patch_name === selectedPatchStatusPatchName,
                )
              : activeData === "DLL 정보" && selectedDll
                ? currentData.filter((item) => item.ads_dll === selectedDll)
                : []; // Show no data if no filter is selected or if not one of the filtered tabs

  const selectData = (page, menu) => {
    currentData = page;
    activeData = menu;
    resetFilters();
  };

  // Reset filter selections when switching tabs
  const resetFilters = () => {
    selectedProcessNetworkPort = "";
    selectedProcessPname = "";
    selectedInstalledProgPname = "";
    selectedPatchStatusPatchName = "";
    selectedDll = "";
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
  <div class="flex col detail">
    <h3 class="title">자산상세정보</h3>
    <div class="tableListWrap nohead">
      {#if Object.keys(assetDetails).length > 0}
        <table class="tableList">
          <colgroup>
            <col style="width:140px;" />
            <col />
            <col style="width:140px;" />
            <col />
            <col style="width:140px;" />
            <col />
            <col style="width:140px;" />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>아이피주소</th>
              <td>{assetDetails.ast_ipaddr}</td>
              <th>IP추적처리</th>
              <td>{assetDetails.ast_ipaddrs}</td>
              <th>자산코드</th>
              <td>{assetDetails.ast_code}</td>
              <th>용도</th>
              <td>{assetDetails.ast_usage}</td>
            </tr>
            <tr>
              <th>제조사</th>
              <td>{assetDetails.ast_brand}</td>
              <th>운영체제</th>
              <td>{assetDetails.ast_os}</td>
              <th>모델</th>
              <td>{assetDetails.ast_model}</td>
              <th>점검대상</th>
              <td>NETWORK</td>
            </tr>
            <tr>
              <th>호스트명</th>
              <td>{assetDetails.ast_hostname}</td>
              <th>위치</th>
              <td>{assetDetails.ast_location}</td>
              <th>운영팀</th>
              <td>{assetDetails.ast_operator_team}</td>
              <th>관리자</th>
              <td>{assetDetails.ast_operator_person}</td>
            </tr>
            <tr>
              <th>관리전화</th>
              <td>{assetDetails.ast_operator_phone}</td>
              <th>기밀성</th>
              <td>{assetDetails.ast_confidentiality}</td>
              <th>무결성</th>
              <td>{assetDetails.ast_integrity}</td>
              <th>가용성</th>
              <td>{assetDetails.ast_availability}</td>
            </tr>
            <tr>
              <th>보안점수</th>
              <td>{assetDetails.ast_security_point}</td>
              <th>등급</th>
              <td>{assetDetails.ast_security_level}</td>
              <th>ISMS인증</th>
              <td>{assetDetails.ast_isms_target ? "True" : "False"}</td>
              <th>활성화여부</th>
              <td>{assetDetails.ast_activate ? "활성화상태" : "비활성화"}</td>
            </tr>
          </tbody>
        </table>
      {:else}
        <div class="empty-state-message">
          <h3>Please select an asset to see details</h3>
        </div>
      {/if}
    </div>
    <textarea rows="5" placeholder="비고란" style="margin-top: 20px;"
    ></textarea>
    <div class="flex align-center btnWrap gap-6" style="margin-top: 10px;">
      <button type="button" class="btn w140 btnPrimaryFontGray">수정하기</button
      >
      <button type="button" class="btn w140 btnPrimaryFontGray">비활성</button>
      <button type="button" class="btn w140 btnPrimaryFontGray">활성</button>
    </div>
  </div>

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
      <!-- Dropdowns for filtering (no dropdown for 운영체제정보) -->
      {#if activeData === "네트워크 정보"}
        <label for="networkPortSelect">Filter by Local Port:</label>
        <select id="networkPortSelect" bind:value={selectedProcessNetworkPort}>
          <option value="">Select a Port</option>
          {#each processNetworkPorts as port}
            <option value={port}>{port}</option>
          {/each}
        </select>
      {/if}

      {#if activeData === "프로세스목록"}
        <label for="processNameSelect">Filter by Process Name:</label>
        <select id="processNameSelect" bind:value={selectedProcessPname}>
          <option value="">Select a Process</option>
          {#each processNames as name}
            <option value={name}>{name}</option>
          {/each}
        </select>
      {/if}

      {#if activeData === "설치된 프로그램 목록"}
        <label for="installedProgSelect">Filter by Program Name:</label>
        <select
          id="installedProgSelect"
          bind:value={selectedInstalledProgPname}
        >
          <option value="">Select a Program</option>
          {#each installedProgNames as progName}
            <option value={progName}>{progName}</option>
          {/each}
        </select>
      {/if}

      {#if activeData === "패치내역"}
        <label for="patchNameSelect">Filter by Patch Name:</label>
        <select id="patchNameSelect" bind:value={selectedPatchStatusPatchName}>
          <option value="">Select a Patch</option>
          {#each patchNames as patchName}
            <option value={patchName}>{patchName}</option>
          {/each}
        </select>
      {/if}

      {#if activeData === "DLL 정보"}
        <label for="dllSelect">Filter by DLL:</label>
        <select id="dllSelect" bind:value={selectedDll}>
          <option value="">Select a DLL</option>
          {#each dllNames as dllName}
            <option value={dllName}>{dllName}</option>
          {/each}
        </select>
      {/if}

      <!-- Table to display data, shows all entries for 운영체제정보 and patchstatus -->
      <div class="flex col detail">
        <h3 class="title">Asset Details</h3>

        <!-- Table to display data, with separate sections for each item -->
        {#if filteredData && filteredData.length > 0}
          <div class="itemListWrap">
            {#each filteredData as item}
              <div class="itemCard">
                <table class="itemTable">
                  <colgroup>
                    <col style="width: 150px;" />
                    <col />
                  </colgroup>
                  <tbody>
                    {#each Object.entries(item) as [key, value]}
                      <tr>
                        <td class="fieldName">{key}</td>
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
            <p>
              {activeData === "운영체제정보" || activeData === "patchstatus"
                ? "No data available"
                : "Select a filter option to display data"}
            </p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>

<style>
  .itemListWrap {
    display: flex;
    flex-direction: column;
    gap: 20px; /* Adds space between each item card */
    margin: 20px;
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
  .itemTable tr:nth-child(even) .fieldValue {
    background-color: rgba(0, 103, 255, 0.05);
  }
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
  .scrollTable {
    overflow-y: auto;
    overflow-x: hidden;
    height: 500px;
    padding-left: 20px;
    padding-right: 20px;
  }
  .contenArea {
    min-height: 1200px;
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
  .empty-state-message {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px; /* Adjust the height based on your design */
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
    color: #555; /* Text color */
  }
  td:hover {
    background-color: rgba(242, 242, 242, 1);
    cursor: pointer;
  }
  .empty-state-message h3 {
    font-size: 18px;
    color: #007bff;
    font-weight: bold;
    text-align: center;
  }
  .btn:hover {
    background-color: #007bff;
    color: white;
  }
  .btn {
    font-size: 16px;
  }
</style>
