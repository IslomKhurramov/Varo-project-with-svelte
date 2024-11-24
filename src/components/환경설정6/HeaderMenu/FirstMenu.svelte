<script>
  import { onMount } from "svelte";
  import {
    getSystemBasicSetup,
    setSystemBasicSetup,
  } from "../../../services/page6/serviceArticle";
  import { errorAlert, successAlert } from "../../../shared/sweetAlert";
  import { navigate } from "svelte-routing";

  let serverIP = "000.000.0.00";
  let port = Number();
  let clientName = "타이거씨엔에스";
  let agentConnectInterval = Number();
  let high_level_point_3 = Number();
  let medium_level_point_2 = Number();
  let low_level_point_1 = Number();
  let remoteMailServer = {
    ip: "",
    port: Number(),
    id: "",
    password: "",
  };

  let error = null;

  async function getSystemBasicSetupData() {
    try {
      const projectData = await getSystemBasicSetup();
      if (projectData?.RESULT === "OK") {
        const data = projectData.CODE[0];
        serverIP = data.server_ipaddr || serverIP;
        high_level_point_3 =
          data.checklist_high_level_point || high_level_point_3;
        medium_level_point_2 =
          data.checklist_medium_level_point || medium_level_point_2;
        low_level_point_1 = data.checklist_low_level_point || low_level_point_1;
        port = parseInt(data.server_port) || port;
        agentConnectInterval =
          parseInt(data.connection_interval) || agentConnectInterval;

        remoteMailServer.ip = data.mailserver_ip || remoteMailServer.ip;
        remoteMailServer.port =
          parseInt(data.mailserver_port) || remoteMailServer.port;
        remoteMailServer.id = data.mailserver_id || remoteMailServer.id;
        remoteMailServer.password =
          data.mailserver_pw || remoteMailServer.password;
      }
    } catch (err) {
      error = err.message;
      await errorAlert(error);
    }
  }

  async function setSystemBasicSetupData() {
    try {
      const response = await setSystemBasicSetup({
        server_ipaddr: serverIP,
        server_port: port,
        connection_interval: agentConnectInterval,
        mailserver_ip: remoteMailServer.ip,
        mailserver_port: remoteMailServer.port,
        mailserver_id: remoteMailServer.id,
        mailserver_pw: remoteMailServer.password,
        high_level_point: high_level_point_3,
        medium_level_point: medium_level_point_2,
        low_level_point: low_level_point_1,
      });
      if (response.RESULT === "OK") {
        await successAlert(response.CODE);
      }
      navigate(window.location?.pathname == "/page6" ? "/page6" : "/page6");
    } catch (err) {
      error = err.message;
      await errorAlert(error);
    }
  }

  onMount(() => {
    getSystemBasicSetupData();
  });
</script>

<main class="table-container">
  <div class="formContainer">
    <div class="inputRow">
      <label>서버 아이피</label>
      <input type="text" bind:value={serverIP} placeholder="000.000.0.00" />
    </div>
    <div class="inputRow">
      <label>서버 포트</label>
      <input type="number" bind:value={port} placeholder="PORT" />
    </div>
    <div class="inputRow">
      <label>에이전트 연결주기</label>
      <input
        type="number"
        bind:value={agentConnectInterval}
        placeholder="에이전트연결주기"
      />
    </div>

    <!-- 위험도 Section -->
    <div class="inputRow">
      <label>위험도</label>
      <div class="riskLevels">
        <div class="riskLevelItem">
          <p>상</p>
          <input
            type="number"
            bind:value={high_level_point_3}
            placeholder="3"
          />
        </div>
        <div class="riskLevelItem">
          <span>중</span>
          <input
            type="number"
            bind:value={medium_level_point_2}
            placeholder="2"
          />
        </div>
        <div class="riskLevelItem">
          <span>하</span>
          <input type="number" bind:value={low_level_point_1} placeholder="1" />
        </div>
      </div>
    </div>

    <div class="inputRow">
      <label>메일서버 주소</label>
      <input
        type="text"
        bind:value={remoteMailServer.ip}
        placeholder="아이피"
      />
    </div>
    <div class="inputRow">
      <label>메일서버 포트</label>
      <input
        type="text"
        bind:value={remoteMailServer.port}
        placeholder="포트"
      />
    </div>
    <div class="inputRow">
      <label>아이디</label>
      <input
        type="text"
        bind:value={remoteMailServer.id}
        placeholder="아이디"
      />
    </div>
    <div class="inputRow">
      <label>패스워드</label>
      <input type="password" placeholder="패스워드" />
    </div>
    <div class="buttonContainer">
      <button
        type="button"
        class="btn btnBlue btnSave"
        on:click={setSystemBasicSetupData}
      >
        저장하기
      </button>
    </div>
  </div>
</main>

<style>
  * {
    font-size: 16px;
  }
  .table-container {
    overflow-y: auto;
    padding: 20px;
    border-radius: 10px;
    background-color: #fff;
    margin-top: 10px;
    height: calc(100vh - 200px);
  }

  .formContainer {
    max-width: 50%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 10px;
  }

  .inputRow {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .inputRow label {
    width: 150px;
    font-weight: 600;
    font-size: 16px;
    margin-left: 20px;
  }

  .inputRow input {
    flex: 1;
    width: 100%;
    padding: 17px;
    border: 1px solid #cccccc;
    border-radius: 5px;
    font-size: 16px;
  }

  /* 위험도 Section Styling */
  .riskLevels {
    display: flex;
    gap: 10;
    flex: 1; /* Take up the remaining space */
  }

  .riskLevelItem {
    display: flex; /* Align label and input horizontally */
    align-items: center; /* Center items vertically */
    flex: 1; /* Ensure equal width for each risk level item */
    min-width: 100px; /* Ensure a minimum width for small screens */
    gap: 10;
  }

  .riskLevelItem span {
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap; /* Prevent text wrapping */
    margin: 0 10px;
  }

  .riskLevelItem p {
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap; /* Prevent text wrapping */
    margin-right: 10px;
  }

  .riskLevelItem input {
    flex: 1;
    padding: 10px;
    border: 1px solid #cccccc;
    border-radius: 5px;
    font-size: 16px;
    text-align: center; /* Center text inside input */
    box-sizing: border-box;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .riskLevels {
      flex-direction: column; /* Stack risk level items vertically */
      gap: 15px;
    }

    .riskLevelItem {
      flex-direction: row; /* Keep label and input side-by-side */
      align-items: center;
      min-width: unset; /* Allow items to shrink naturally */
    }
  }

  .buttonContainer {
    display: flex;
    justify-content: center;
    margin-top: 5px;
  }

  .btnSave {
    padding: 15px 40px;
    background-color: #0067ff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }

  .btnSave:hover {
    background-color: #4989ff;
  }
</style>
