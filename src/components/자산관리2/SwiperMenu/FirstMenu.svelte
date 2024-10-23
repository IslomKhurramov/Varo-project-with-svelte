<script>
  import { assetDeatilInfo } from "../../../services/page2/asset.store";
  let currentData = null;
  let activeData = null;

  const selectData = (page, menu) => {
    currentData = page;
    activeData = menu;
    console.log("data selected", page);
  };

  // Reactive subscription to assetDeatilInfo store
  $: assetDetails =
    $assetDeatilInfo.length > 0 ? $assetDeatilInfo[0].asset[0] : {};
  $: cceHistory = $assetDeatilInfo.length > 1 ? $assetDeatilInfo[1] : [];
  $: assetHistory = $assetDeatilInfo.length > 0 ? $assetDeatilInfo : [];
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
      <button class="btn w140 btnBlue">수정하기</button>
      <button class="btn w140" style="background-color: red; color:white"
        >비활성하기</button
      >
      <button class="btn w140" style="background-color: green; color:white"
        >활성하기</button
      >
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

    {#if currentData && currentData.length > 0}
      <div class="tableListWrap scrollTable">
        <table class="tableList hdBorder" style="margin-bottom: 40px;">
          <colgroup>
            <col style="width:60px;" />
            <col style="width: 300px;" />
          </colgroup>
          <thead>
            <tr>
              <th class="text-center">Field</th>
              <th class="text-center">Value</th>
            </tr>
          </thead>
          <tbody>
            {#each Object.entries(currentData[0]) as [key, value]}
              <tr>
                <td>{key}</td>
                <td>{value}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <div class="empty_state">
        <p>No information available for this tab</p>
      </div>
    {/if}
  </div>
</main>

<style>
  .subTabWrap a {
    cursor: pointer;
  }
  .scrollTable {
    overflow-y: auto;
    overflow-x: hidden;
    height: 500px;
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
</style>
