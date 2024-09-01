<script>
  import Modal from "../../shared/Modal.svelte";
  import ModalRegisteredAdmin from "./ModalRegisteredAdmin.svelte";

  let showModal = false;
  let actionMethod = "어쩌고...저쩌고...";
  let relatedAssets =
    "자산명, 아이피주소, 자산그룹, 식별코드, 등록일, 보안점수 등등";
  let actionPlan = "";
  let riskLevel = "상/중/하";

  let performanceLog = [
    {
      actionMethod: "조치방법",
      schedule: "일정",
      opinion: "의견",
      personInCharge: "조치담당자",
    },
  ];

  function closeModal() {
    showModal = false; // Close the modal
  }
</script>

<main>
  <div class="main-container">
    <div class="container">
      <div class="header">
        <p>취약점 조치 현황 : 1 / 20</p>
      </div>

      <div class="content">
        <div class="info">
          <div class="row">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>취약점정보</label>
            <textarea bind:value="{actionMethod}" rows="3" readonly></textarea>
          </div>

          <div class="row">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>조치방법</label>
            <textarea bind:value="{actionMethod}" rows="3" readonly></textarea>
          </div>

          <div class="row">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>관련자산</label>
            <textarea
              class="data3"
              bind:value="{relatedAssets}"
              rows="3"
              readonly
            ></textarea>
          </div>

          <!-- svelte-ignore a11y-label-has-associated-control -->
          <div class="row">
            <label>이전조치이력</label>
            <div class="table_container">
              <table>
                <tr class="first_line">
                  <th>조치방법</th>
                  <th>일정</th>
                  <th>의견</th>
                  <th>조치담당자</th>
                </tr>
                {#each performanceLog as asset}
                  <tr>
                    <td>{asset.actionMethod}</td>
                    <td>{asset.schedule}</td>
                    <td>{asset.opinion}</td>
                    <td>{asset.personInCharge}</td>
                  </tr>
                {/each}
              </table>
            </div>
          </div>
        </div>

        <div class="actions">
          <div class="action-header">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>조치계획등록</label>
          </div>

          <div class="action-content">
            <div class="row">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label>조치방법</label>
              <select bind:value="{actionPlan}" class="select_input">
                <option value="조치계획">조치계획</option>
                <option value="대책수립">대책수립</option>
                <option value="예외처리">예외처리</option>
                <option value="위험수용">위험수용</option>
              </select>
            </div>

            <div class="row">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label>위험도</label>
              <select bind:value="{riskLevel}">
                <option value="상">상</option>
                <option value="중">중</option>
                <option value="하">하</option>
              </select>
            </div>

            <div class="row">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label>조치일정</label>
              <input
                class="input1"
                type="text"
                bind:value="{actionPlan}"
                placeholder="조치일정을 입력하세요"
              />
            </div>

            <div class="row">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label>조치담당자</label>
              <input
                type="text"
                bind:value="{actionPlan}"
                placeholder="조치담당자를 입력하세요"
              />
            </div>
          </div>

          <div class="action-footer">
            <button class="list-button" on:click="{() => (showModal = true)}"
              >등록된 운영/관리자 계정</button
            >
          </div>
        </div>
      </div>
      <button class="register_button">조치계획 등록함</button>
    </div>
  </div>

  <Modal bind:showModal>
    <ModalRegisteredAdmin {closeModal} />
  </Modal>
</main>

<style>
  /* Main container centered */
  .main-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    padding: 20px;
    width: 100%;
  }

  .container {
    width: 80%;
    padding: 30px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
    position: relative;
  }

  .header {
    text-align: left;
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 10px;
  }
  .select_input:hover {
    background-color: #b0b0b0;
  }

  .content {
    display: flex;
    justify-content: space-between;
  }

  .info {
    width: 55%;
  }

  .row {
    margin-bottom: 10px;
  }

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  textarea {
    width: 100%;
    height: 120px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    resize: none;
    background-color: #f9f9f9;
  }

  input,
  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    background-color: #f9f9f9;
  }
  .input1 {
    height: 150px;
  }

  .actions {
    width: 40%;
    height: 540px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #e9e9e9;
  }

  .action-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .action-footer {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .register_button {
    background-color: #28a745;
    padding: 10px;
    font-weight: bold;
    color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    border-radius: 5px;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }
  .register_button:hover {
    background-color: #28863e;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  .list-button {
    background-color: #007bff; /* Primary button color */
    color: #ffffff;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .list-button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  .data3 {
    height: 40px;
  }
  .table_container {
    display: flex;
    justify-content: center;
    width: 94%;
    margin: 0;
    overflow-y: auto;
    overflow-x: hidden;
    height: 100px;

    margin: 20px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #000000;
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
    border: 1px solid #000000;
    padding: 12px 15px; /* Increased padding for better spacing */
    text-align: left;
    vertical-align: middle; /* Ensure content is vertically centered */
  }

  th {
    background-color: #0068d7; /* Header background color */
    color: #ffffff; /* Header text color */
    position: sticky;
    top: 0;
    z-index: 1;
    text-transform: uppercase; /* Uppercase text for header */
    font-size: 12px;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9; /* Slightly lighter shade for even rows */
  }

  tr:hover {
    background-color: #e0f7fa; /* Soft hover effect */
  }
</style>
