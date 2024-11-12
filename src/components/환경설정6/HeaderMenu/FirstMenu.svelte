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
  let ReportGenerationCriteria = 1000;
  let NumberPageLists = 20;
  let riskLevel = "중";
  let mailServerOption = "";
  let remoteMailServer = {
    ip: "",
    port: Number(),
    id: "",
    password: "",
  };

  let error = null;

  ////////////// Hendle service API call ////////////////
  async function getSystemBasicSetupData() {
    try {
      const projectData = await getSystemBasicSetup();
      console.log("API Response:", projectData);

      if (projectData?.RESULT === "OK") {
        const data = projectData.CODE[0];
        serverIP = data.server_ipaddr || serverIP;
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

<main class="table-container" style="border-radius: 10px;">
  <div class="table-container_1 contentArea">
    <div class="formControlWrap">
      <div class="formControl">
        <label>서버</label>
        <div class="inputGroup">
          <input
            type="text"
            bind:value={serverIP}
            placeholder={`000.000.0.00`}
          />
          <input type="number" bind:value={port} placeholder="PORT" />
        </div>
      </div>
    </div>
    <div class="formControlWrap">
      <div class="formControl">
        <label>고객사명</label>
        <input type="text" bind:value={clientName} placeholder="고객사명" />
      </div>
    </div>
    <div class="formControlWrap">
      <div class="formControl">
        <label>에이전트연결주기</label>
        <input
          type="number"
          bind:value={agentConnectInterval}
          placeholder="에이전트연결주기"
        />
      </div>
    </div>
    <div class="formControlWrap">
      <div class="formControl">
        <label>위험도</label>
        <div class="riskLevelGroup">
          <div class="riskLevelItem">
            <button class={riskLevel === "상" ? "active" : ""}>상</button>
            <input type="number" placeholder="3" readonly />
          </div>
          <div class="riskLevelItem">
            <button class={riskLevel === "중" ? "active" : ""}>중</button>
            <input type="number" placeholder="2" readonly />
          </div>
          <div class="riskLevelItem">
            <button class={riskLevel === "하" ? "active" : ""}>하</button>
            <input type="number" placeholder="1" readonly />
          </div>
        </div>
      </div>
    </div>

    <div class="formControlWrap">
      <div class="formControl">
        <label>메일서버설정</label>
        <div class="mailServerGroup">
          <!-- Birinchi input tepada -->
          <div class="mailServerTop">
            <input
              type="text"
              bind:value={mailServerOption}
              placeholder="원격메일 서버 사용 (구글, 네이버, 고객사)"
            />
          </div>
          <!-- Ikkita input yonma-yon pastda -->
          <div class="mailServerBottom">
            <input
              type="text"
              bind:value={remoteMailServer.ip}
              placeholder="아이피"
            />
            <input
              type="text"
              bind:value={remoteMailServer.port}
              placeholder="포트"
            />
          </div>
          <div class="mailServerBottom">
            <input
              type="text"
              bind:value={remoteMailServer.id}
              placeholder="아이디"
            />
            <input
              type="password"
              bind:value={remoteMailServer.password}
              placeholder="패스워드"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="formControlWrap">
      <div class="formControl">
        <label>보고서생성기준</label>
        <input
          type="number"
          bind:value={ReportGenerationCriteria}
          placeholder="otherField"
        />
      </div>
    </div>
    <div class="formControlWrap">
      <div class="formControl">
        <label>페이지목록개수</label>
        <input
          type="number"
          bind:value={NumberPageLists}
          placeholder="otherField"
        />
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
  </div>
</main>

<style>
  .table-container {
    background-color: #ffffff;
    padding: 20px;
    margin: 10px 0;
    width: 100%;
    height: calc(100vh - 134px);
  }

  .table-container_1 {
    margin: 20px 0;
    border-radius: 10px;
    width: 70%;
  }

  .formControlWrap {
    margin-bottom: 20px;
  }

  .formControl {
    display: flex;
    align-items: flex-start;
  }

  .formControl label {
    width: 150px;
    margin-right: 20px;
    font-weight: bold;
    margin-top: 10px;
  }

  .formControl input {
    width: 70%;
    flex: 1;
    padding: 8px;
    border: 1px solid #cccccc;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  .formControl input:focus {
    border-color: #0067ff;
    outline: none;
  }

  .inputGroup {
    display: flex;
    flex: 1;
    gap: 10px;
  }

  .inputGroup input {
    flex: 1;
  }

  .riskLevelGroup {
    display: flex;
    flex: 1;
    gap: 10px;
  }

  .riskLevelItem {
    display: flex;
    flex: 1;
  }

  .riskLevelItem button,
  .riskLevelItem input {
    flex: 1;
    padding: 8px;
    border: 1px solid #cccccc;
    border-radius: 5px;
    text-align: center;
  }

  .riskLevelItem button {
    background-color: #ecf0f1;
    color: #34495e;
    cursor: pointer;
    font-weight: 600;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
  }

  .riskLevelItem button.active {
    background-color: #0067ff;
    color: #fff;
  }

  .riskLevelItem input {
    margin-left: 10px;
  }

  .riskLevelItem button,
  .riskLevelItem input {
    height: 40px;
  }

  .mailServerGroup {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .mailServerTop {
    margin-bottom: 10px;
  }

  .mailServerTop input {
    width: 100%;
    padding: 8px;
    border: 1px solid #cccccc;
    border-radius: 5px;
  }

  .mailServerBottom {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }

  .mailServerBottom input {
    flex: 1;
    padding: 8px;
    border: 1px solid #cccccc;
    border-radius: 5px;
  }

  .buttonContainer {
    text-align: center;
    margin-top: 40px;
    margin-left: 30px;
  }

  .btnSave {
    width: 200px;
    background-color: #0067ff;
    color: #fff;
    padding: 12px 30px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }

  .btnSave:hover {
    color: #fff;
    background-color: #4989ff;
  }
</style>
