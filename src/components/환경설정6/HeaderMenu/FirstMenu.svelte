<script>
  let serverIP = "192.168.0.10";
  let port = 443;
  let clientName = "타이거씨엔에스";
  let clientLogo = "이미지파일첨부";
  let agentConnectInterval = 60;
  let otherField = 60;
  let riskLevel = "중";
  let mailServerOption = "local"; // local or remote
  let remoteMailServer = {
    ip: "",
    port: "",
    id: "",
    password: "",
  };
</script>

<main>
  <div class="table-container">
    <table>
      <tbody>
        <tr>
          <th>서버</th>
          <td style="display: flex; flex-direction:row gap:10px">
            <input type="text" bind:value="{serverIP}" placeholder="IP" />
            <input type="text" bind:value="{port}" placeholder="PORT" />
          </td>
        </tr>
        <tr>
          <th>고객사명</th>
          <td
            ><input
              type="text"
              bind:value="{clientName}"
              placeholder="고객사명"
            /></td
          >
        </tr>
        <tr>
          <th>고객사로고</th>
          <td
            ><input
              type="text"
              bind:value="{clientLogo}"
              placeholder="고객사로고"
            /></td
          >
        </tr>
        <tr>
          <th>에이전트 연결 주기</th>
          <td><input type="number" bind:value="{agentConnectInterval}" /></td>
        </tr>
        <tr>
          <th>기타 설정</th>
          <td><input type="number" bind:value="{otherField}" /></td>
        </tr>
        <tr>
          <th>위험도</th>
          <td>
            <div class="risk-levels">
              <button
                class="{riskLevel === '상' ? 'active' : ''}"
                on:click="{() => (riskLevel = '상')}">상</button
              >
              <input type="number" placeholder="3" />
              <button
                class="{riskLevel === '중' ? 'active' : ''}"
                on:click="{() => (riskLevel = '중')}">중</button
              ><input type="number" placeholder="3" />
              <button
                class="{riskLevel === '하' ? 'active' : ''}"
                on:click="{() => (riskLevel = '하')}">하</button
              ><input type="number" placeholder="3" />
            </div>
          </td>
        </tr>
        <tr>
          <th>메일 서버 설정</th>
          <td>
            <div class="radio-group">
              <label class="radio-label">
                <input
                  type="radio"
                  bind:group="{mailServerOption}"
                  value="local"
                />
                로컬 메일 서버 사용 (스팸메일차단 주의)
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  bind:group="{mailServerOption}"
                  value="remote"
                />
                원격 메일 서버 사용
              </label>
            </div>
          </td>
        </tr>
        {#if mailServerOption === "remote"}
          <tr>
            <th>아이피 / 포트</th>
            <td>
              <input
                type="text"
                bind:value="{remoteMailServer.ip}"
                placeholder="아이피"
              />
              <input
                type="text"
                bind:value="{remoteMailServer.port}"
                placeholder="포트"
              />
            </td>
          </tr>
          <tr>
            <th>아이디 / 패스워드</th>
            <td>
              <input
                type="text"
                bind:value="{remoteMailServer.id}"
                placeholder="아이디"
              />
              <input
                type="password"
                bind:value="{remoteMailServer.password}"
                placeholder="패스워드"
              />
            </td>
          </tr>
        {/if}
      </tbody>
    </table>

    <div class="form-actions">
      <button class="submit-btn">설정 저장</button>
    </div>
  </div>
</main>

<style>
  body {
    font-family: "Noto Sans KR", sans-serif;
    background-color: #f7f9fc;
    color: #2c3e50;
    margin: 0;
    padding: 0;
  }

  .table-container {
    background-color: #ffffff;
    padding: 30px;
    margin: 50px auto;
    border-radius: 10px;
    max-width: 60%;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    background-color: #f7f7f7;
  }

  th,
  td {
    padding: 15px;
    text-align: left;
    vertical-align: middle;
    border: 1px solid #cccccc;
  }

  th {
    background-color: #555555; /* Dark gray for a more muted header */
    color: white;
    text-align: center;
    width: 170px;
  }

  td {
    background-color: #ffffff;
  }

  input[type="text"],
  input[type="number"],
  input[type="password"] {
    width: calc(100% - 10px);
    padding: 8px;
    margin: 5px 0;
    box-sizing: border-box;
    border: 1px solid #cccccc;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  input[type="text"]:focus,
  input[type="number"]:focus,
  input[type="password"]:focus {
    border-color: #2980b9;
    outline: none;
  }

  .risk-levels {
    display: flex;
    gap: 10px;
  }

  .risk-levels button {
    flex: 1;
    padding: 12px;
    background-color: #ecf0f1;
    color: #34495e;
    border: 1px solid #bdc3c7;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
  }

  .risk-levels button.active {
    background-color: #2980b9;
    color: #fff;
  }

  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .radio-label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-weight: 500;
    color: #34495e;
  }

  .radio-group input[type="radio"] {
    margin: 0;
    accent-color: #2980b9;
  }

  .form-actions {
    text-align: center;
    margin-top: 20px;
  }

  .submit-btn {
    padding: 15px 30px;
    background-color: #27ae60;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .submit-btn:hover {
    background-color: #2ecc71;
  }

  .submit-btn:active {
    background-color: #1e8449;
  }
</style>
