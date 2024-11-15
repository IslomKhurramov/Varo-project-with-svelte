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

  async function getSystemBasicSetupData() {
    try {
      const projectData = await getSystemBasicSetup();
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
          <div class="inputWithLabel">
            <span>IP</span>
            <input
              type="text"
              bind:value={serverIP}
              placeholder="000.000.0.00"
            />
          </div>
          <div class="inputWithLabel">
            <span>PORT</span>
            <input type="number" bind:value={port} placeholder="PORT" />
          </div>
        </div>
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
          <span>상</span>
          <div class="riskLevelItem">
            <input type="number" placeholder="3" disabled />
          </div>
          <spam>중</spam>
          <div class="riskLevelItem">
            <input type="number" placeholder="2" disabled />
          </div>
          <span>하</span>
          <div class="riskLevelItem">
            <input type="number" placeholder="1" disabled />
          </div>
        </div>
      </div>
    </div>

    <div class="formControlWrap">
      <div class="formControl">
        <label>메일서버설정</label>
        <div class="mailServerGroup">
          <div class="mailServerBottom">
            <span>메일서버주소</span>
            <input
              type="text"
              bind:value={remoteMailServer.ip}
              placeholder="아이피"
            />
            <span>메일서버포트</span>
            <input
              type="text"
              bind:value={remoteMailServer.port}
              placeholder="포트"
            />
          </div>
          <div class="mailServerBottom">
            <span>아이디</span>
            <input
              type="text"
              bind:value={remoteMailServer.id}
              placeholder="아이디"
            />
            <span>패스워드</span>
            <!-- bind:value={remoteMailServer.password} -->
            <input type="password" placeholder="패스워드" />
          </div>
        </div>
      </div>
      <div class="buttonContainer formControl">
        <label></label>
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
    /* width: 100%; */
    height: calc(100vh - 134px);
  }

  .table-container_1 {
    margin: 20px 0;
    border-radius: 10px;
    padding-right: 20px;
    /* width: 100%; */
  }

  .formControlWrap {
    margin-bottom: 20px;
  }

  .formControl {
    display: flex;
    align-items: center;
  }

  .formControl label {
    width: 150px;
    margin-right: 20px;
    font-weight: bold;
  }

  .formControl input {
    width: 30%;
    padding: 8px;
    border: 1px solid #cccccc;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  .riskLevelGroup {
    display: flex;
    gap: 20px;
    width: 100%;
    align-items: center;
    margin-left: 20px;
  }

  .formControl .riskLevelGroup input {
    width: 50%;
    padding: 8px;
    text-align: center;
    border: 1px solid #cccccc;
    border-radius: 5px;
  }

  .inputGroup {
    display: flex;
  }

  .inputWithLabel {
    display: flex;
    flex-direction: row;
    flex: 1;
    gap: 10px;
    align-items: center;
  }
  .inputWithLabel input {
    width: 80%;
  }

  .inputWithLabel span {
    /* font-weight: bold; */
    font-size: 14px;
  }

  .mailServerBottom {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    align-items: center;
  }

  .mailServerBottom input {
    flex: 1;
    padding: 8px;
    border: 1px solid #cccccc;
    border-radius: 5px;
  }

  .mailServerBottom span {
    width: 100px;
    /* font-weight: bold; */
    font-size: 14px;
  }

  .buttonContainer {
    text-align: center;
    margin-top: 30px;
    display: flex;
    align-items: center;
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
