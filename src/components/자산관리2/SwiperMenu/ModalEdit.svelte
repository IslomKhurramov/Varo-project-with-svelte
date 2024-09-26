<script>
  import { assetDeatilInfo } from "../../../services/page2/asset.store";
  import { setAssetInformationUpdate } from "../../../services/page2/assetService";
  import { successAlert } from "../../../shared/sweetAlert";

  export let showModalSecond;
  export let handleSubmit;
  export let formData;
  export let assetDetails;
  export let cancel;
</script>

<main>
  {#if Object.keys(assetDetails).length > 0}
    <form on:submit|preventDefault={handleSubmit}>
      <table>
        <tr>
          <th>분류그룹</th>
          <td><input type="text" bind:value={formData.ast_group} /></td>
          <th>자산코드</th>
          <td><input type="text" bind:value={formData.ast_code} /></td>
          <th>용도</th>
          <td><input type="text" bind:value={formData.ast_usage} /></td>
          <th>자산모델</th>
          <td><input type="text" bind:value={formData.ast_model} /></td>
        </tr>
        <tr>
          <th>점검대상</th>
          <td><input type="text" bind:value={formData.ast_brand} /></td>
          <th>호스트명(관리대장)</th>
          <td><input type="text" bind:value={formData.ast_hostname} /></td>
          <th>아이피주소(관리대장)</th>
          <td><input type="text" bind:value={formData.ast_ipaddr} /></td>
          <th>IP목록전체</th>
          <td><input type="text" bind:value={formData.ast_ipaddrs} /></td>
        </tr>
        <tr>
          <th>어플리케이션</th>
          <td><input type="text" bind:value={formData.ast_application} /></td>
          <th>어플리케이션버전</th>
          <td><input type="text" bind:value={formData.ast_version} /></td>
          <th>URL</th>
          <td><input type="text" bind:value={formData.ast_url} /></td>
          <th>위치</th>
          <td><input type="text" bind:value={formData.ast_location} /></td>
        </tr>
        <tr>
          <th>제조사</th>
          <td><input type="text" bind:value={formData.ast_brand} /></td>
          <th>운영체제</th>
          <td><input type="text" bind:value={formData.ast_os} /></td>
          <th>운영상호스트명</th>
          <td><input type="text" bind:value={formData.ast_real_hostname} /></td>
          <th>운영상 IP</th>
          <td><input type="text" bind:value={formData.ast_real_ipaddr} /></td>
        </tr>
        <tr>
          <th>관리부서</th>
          <td><input type="text" bind:value={formData.ast_manager_team} /></td>
          <th>등급</th>
          <td><input type="text" bind:value={formData.ast_manager_person} /></td
          >
          <th>운영부서</th>
          <td><input type="text" bind:value={formData.ast_operator_team} /></td>
          <th>운영담당자</th>
          <td
            ><input type="text" bind:value={formData.ast_operator_person} /></td
          >
        </tr>
        <tr>
          <th>운영자연락처</th>
          <td><input type="text" bind:value={formData.ast_operator_phone} /></td
          >
          <th>기밀성</th>
          <td
            ><input type="text" bind:value={formData.ast_confidentiality} /></td
          >
          <th>무결성</th>
          <td
            ><input type="checkbox" bind:checked={formData.ast_integrity} /></td
          >
          <th>가용성</th>
          <td
            ><input
              type="checkbox"
              bind:checked={formData.ast_availability}
            /></td
          >
        </tr>
        <tr>
          <th>중요도</th>
          <td><input type="text" bind:value={formData.ast_security_point} /></td
          >
          <th>등급</th>
          <td><input type="text" bind:value={formData.ast_security_level} /></td
          >
          <th>ISMS인증범위</th>
          <td
            ><input
              type="checkbox"
              bind:checked={formData.ast_isms_target}
            /></td
          >
          <th>활성화여부</th>
          <td><input type="checkbox" bind:checked={formData.ast_activate} /></td
          >
        </tr>
      </table>
      <div class="input_container">
        <textarea
          rows="3"
          cols="100"
          placeholder="비고란"
          bind:value={formData.ast_etc}
        ></textarea>
        <div class="group_agent_info">
          {#if formData.ast_agent_installed}
            <div class="info-item installed">
              <span class="label">에이전트설치여부:</span>
              <span class="value">Installed</span>
            </div>
          {:else}
            <div class="info-item not-installed">
              <span class="label">에이전트설치여부:</span>
              <span class="value">Not Installed</span>
            </div>
          {/if}
          <div class="info-item">
            <span class="label">등록승인여부:</span>
            <span class="value">{formData.ast_approve_status}</span>
          </div>
          <div class="info-item">
            <span class="label">맥주소:</span>
            <span class="value">{formData.ast_macaddress || "없음"}</span>
          </div>
        </div>
        <div class="button_container">
          <div class="input_buttons">
            <button style="background: #007bff;" type="submit">Submit</button>
            <button
              style="background: #dc3545;"
              type="reset"
              on:click={() => (formData = { ...assetDetails })}>Reset</button
            >
          </div>
          <button
            on:click={(event) => {
              event.preventDefault();
              cancel();
            }}>Cancel</button
          >
        </div>
      </div>
    </form>
  {/if}
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

  form {
    font-family: "Arial", sans-serif;
    border-collapse: collapse;
    width: 100%;
    background: #ffffff;
    font-size: 12px;
  }

  th,
  td {
    padding: 5px; /* Adjusting padding to be smaller */
    border: 1px solid #ddd;
    text-align: left;
    white-space: nowrap; /* Prevent wrapping for header text */
  }

  input,
  textarea {
    width: 100%;
    padding: 3px; /* Smaller padding for inputs */
    border-radius: 3px;
    border: 1px solid #ccc;
    font-size: 12px;
  }

  input[type="text"] {
    padding: 2px; /* Minimized padding for text input */
  }

  th {
    background-color: #f0f0f0;
    font-weight: bold;
    color: #333;
    white-space: nowrap; /* Ensuring text remains in one line */
    text-align: left; /* Aligning text horizontally */
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
    padding: 3px; /* Smaller padding for textarea */
  }

  .input_buttons {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }

  .button_container button {
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

  .button_container button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  .button_container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
    padding: 20px;
  }
  .group_agent_info {
    display: flex;
    flex-direction: row;
    gap: 10px;
    font-size: 12px;
  }
  .group_agent_info {
    display: flex;
    flex-direction: row;
    gap: 20px;
    padding: 16px; /* Padding for spacing */
    max-width: 400px; /* Set a max width for cleaner design */
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0; /* Spacing between items */
    border-bottom: 1px solid #e0e0e0; /* Divider between items */
  }

  .label {
    font-weight: 600; /* Slightly bold labels */
    color: #495057; /* Dark gray label color */
  }

  .value {
    font-weight: 400; /* Normal weight for value text */
    color: #212529; /* Darker color for values */
  }

  /* Style variations for installed/not installed */
  .installed .value {
    color: #28a745; /* Green color for installed */
    font-weight: 600; /* Bold text */
  }

  .not-installed .value {
    color: #dc3545; /* Red color for not installed */
    font-weight: 600; /* Bold text */
  }
</style>
