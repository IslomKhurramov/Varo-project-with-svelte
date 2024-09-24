<script>
  import { assetDeatilInfo } from "../../../services/page2/asset.store";
  let currentData = null;
  let activeData = null;

  const selectData = (page, menu) => {
    currentData = page;
    activeData = menu;
  };

  // Reactive subscription to assetDeatilInfo store
  $: assetDetails =
    $assetDeatilInfo.length > 0 ? $assetDeatilInfo[0].asset[0] : {};
  $: cceHistory = $assetDeatilInfo.length > 1 ? $assetDeatilInfo[1] : [];

  let data = [];
  for (let i = 1; i <= 100; i++) {
    data.push({
      number: "길동이",
      projectNO: `프로젝트${i}`,
      assetName: "AAAAAA",
      cassification: "ERROR-099",
      logContent: "실행과정",
      performer: "길동이",
      date: "2024-12-11 ",
      note: "길동이",
      logContent: "실행과정에서 ",
      performer: "길동이",
      date: "2024-12-11 ",
      note: "길동이",
    });
  }

  const pageData = [
    {
      data1: "This is data for Second Menu",
      data2: "This is data for Third Menu",
      data3: "This is data for Fourth Menu",
      data4: "This is data for Second Menu",
      data5: "This is data for Third Menu",
      data6: "This is data for Fourth Menu",
      data7: "This is data for Second Menu",
    },
  ];
</script>

<main>
  {#if Object.keys(assetDetails).length > 0}
    <div class="table_container">
      <table>
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
      </table>
    </div>
  {:else}
    <div class="empty-state-message">
      <h3>Please select an asset to see details</h3>
    </div>
  {/if}
  <div class="input_container">
    <textarea rows="3" cols="100" placeholder="비고란"></textarea>
    <div class="input_buttons">
      <button style="background: #007bff;">수정하기</button>
      <button style="background: #dc3545;">비활성하기</button>
      <button style="background: #28a745;">활성하기</button>
    </div>
  </div>
  <div>
    <div class="header">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click={() =>
          selectData(assetDetails.system_info?.osinfo || [], "운영체제정보")}
        class={activeData === "운영체제정보" ? "active" : ""}
      >
        운영체제정보
      </h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click={() =>
          selectData(
            assetDetails.system_info?.installedprog || [],
            "설치된 프로그램 목록",
          )}
        class={activeData === "설치된 프로그램 목록" ? "active" : ""}
      >
        설치된 프로그램 목록
      </h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click={() =>
          selectData(assetDetails.system_info?.process || [], "프로세스목록")}
        class={activeData === "프로세스목록" ? "active" : ""}
      >
        프로세스목록
      </h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click={() =>
          selectData(
            assetDetails.system_info?.process_network || [],
            "네트워크 정보",
          )}
        class={activeData === "네트워크 정보" ? "active" : ""}
      >
        네트워크 정보
      </h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click={() =>
          selectData(assetDetails.system_info?.dlls || [], "DLL 정보")}
        class={activeData === "DLL 정보" ? "active" : ""}
      >
        DLL 정보
      </h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click={() =>
          selectData(assetDetails.system_info?.patchstatus || [], "패치내역")}
        class={activeData === "패치내역" ? "active" : ""}
      >
        패치내역/대상
      </h3>
    </div>

    {#if currentData && currentData.length > 0}
      <div class="last_container">
        <ul>
          {#each currentData as dataItem}
            <li>{JSON.stringify(dataItem)}</li>
          {/each}
        </ul>
      </div>
    {:else}
      <div class="empty_state">
        <p>No information available for this tab</p>
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    background-color: #f7f9fb;
    padding: 10px;
    margin-bottom: 40px;
    font-family: "Arial", sans-serif;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .table_container {
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 0;
    overflow-y: auto;
    overflow-x: hidden;
    height: 300px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #dddddd;
  }

  table {
    font-family: "Arial", sans-serif;
    border-collapse: collapse;
    width: 100%;
    background: #ffffff;
    font-size: 12px;
  }

  th,
  td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: left;
  }

  textarea {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  th {
    background-color: #f0f0f0;
    font-weight: bold;
    color: #333;
  }

  tr:hover {
    background-color: #e0f7fa; /* Soft hover effect */
  }

  /* Optional styling for better visual appeal */
  td {
    background-color: #fff;
  }

  tr:nth-child(even) td {
    background-color: #f9f9f9; /* Light gray for alternate rows */
  }
  .input_container {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 20px;
    background: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #dddddd;
  }
  .input_container textarea {
    margin: 6px;
    width: 99%;
  }

  .input_buttons {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-top: 10px;
    padding: 20px;
  }

  .input_buttons button {
    background-color: #007bff; /* Primary button color */
    color: #ffffff;
    width: 100px;
    height: 30px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .input_buttons button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  .header {
    display: flex;
    flex-direction: row;
    gap: 50px;
    padding-left: 40px;
    width: 100%;
    color: #000000;
  }

  .header h3 {
    color: black;
    font-weight: bold;
    font-size: 12px;
    cursor: pointer;
  }
  .header h3 {
    background-image: linear-gradient(to right, #5486d6, #54b3d6 50%, #000 50%);
    background-size: 200% 100%;
    background-position: -100%;
    display: inline-block;
    padding: 5px 0;
    position: relative;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 0.3s ease-in-out;
  }

  .header h3:before {
    content: "";
    background: #54b3d6;
    display: block;
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 0;
    height: 3px;
    transition: all 0.3s ease-in-out;
  }

  .header h3:hover {
    background-position: 0;
  }

  .header h3:hover::before {
    width: 100%;
  }
  .header h3.active {
    color: #3183a0; /* Ensures active text color is visible */
    -webkit-text-fill-color: #3183a0; /* Override webkit text fill */
    background-image: none; /* Remove the gradient on active */
    text-decoration: underline;
  }
  .last_container {
    width: 100%;
    height: auto;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #dddddd;
    margin-bottom: 40px;
    width: 100%;
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

  .empty-state-message h3 {
    font-size: 18px;
    color: #007bff;
    font-weight: bold;
    text-align: center;
  }
</style>
