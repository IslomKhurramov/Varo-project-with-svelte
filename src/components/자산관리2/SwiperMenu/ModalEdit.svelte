<script>
  import { onDestroy, createEventDispatcher } from "svelte";
  export let handleSubmit;
  export let formData;
  export let assetDetails;
  export let closeModalEdit;
  const dispatch = createEventDispatcher();

  function handleCancel() {
    // Dispatch 'close' event to notify the parent component to close the modal
    dispatch("close");
  }
</script>

<main>
  {#if Object.keys(assetDetails).length > 0}
    <div class="flex col detail">
      <form on:submit|preventDefault={handleSubmit}>
        <h3 class="title">자산상세정보</h3>
        <div class="tableListWrap nohead edit">
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
                <td><input type="text" bind:value={formData.ast_hostname} /></td
                >
                <th>아이피주소(관리대장)</th>
                <td><input type="text" bind:value={formData.ast_ipaddr} /></td>
                <th>IP목록전체</th>
                <td><input type="text" bind:value={formData.ast_ipaddrs} /></td>
              </tr>
              <tr>
                <th>어플리케이션</th>
                <td
                  ><input
                    type="text"
                    bind:value={formData.ast_application}
                  /></td
                >
                <th>어플리케이션버전</th>
                <td><input type="text" bind:value={formData.ast_version} /></td>
                <th>URL</th>
                <td><input type="text" bind:value={formData.ast_url} /></td>
                <th>위치</th>
                <td><input type="text" bind:value={formData.ast_location} /></td
                >
              </tr>
              <tr>
                <th>제조사</th>
                <td><input type="text" bind:value={formData.ast_brand} /></td>
                <th>운영체제</th>
                <td><input type="text" bind:value={formData.ast_os} /></td>
                <th>운영상호스트명</th>
                <td
                  ><input
                    type="text"
                    bind:value={formData.ast_real_hostname}
                  /></td
                >
                <th>운영상 IP</th>
                <td
                  ><input
                    type="text"
                    bind:value={formData.ast_real_ipaddr}
                  /></td
                >
              </tr>
              <tr>
                <th>관리부서</th>
                <td
                  ><input
                    type="text"
                    bind:value={formData.ast_manager_team}
                  /></td
                >
                <th>등급</th>
                <td
                  ><input
                    type="text"
                    bind:value={formData.ast_manager_person}
                  /></td
                >
                <th>운영부서</th>
                <td
                  ><input
                    type="text"
                    bind:value={formData.ast_operator_team}
                  /></td
                >
                <th>운영담당자</th>
                <td
                  ><input
                    type="text"
                    bind:value={formData.ast_operator_person}
                  /></td
                >
              </tr>
              <tr>
                <th>운영자연락처</th>
                <td
                  ><input
                    type="text"
                    bind:value={formData.ast_operator_phone}
                  /></td
                >
                <th>기밀성</th>
                <td
                  ><input
                    type="text"
                    bind:value={formData.ast_confidentiality}
                  /></td
                >
                <th>무결성</th>
                <td
                  ><input
                    type="checkbox"
                    style="width: 20px;"
                    bind:checked={formData.ast_integrity}
                  /></td
                >
                <th>가용성</th>
                <td
                  ><input
                    type="checkbox"
                    style="width: 20px;"
                    bind:checked={formData.ast_availability}
                  /></td
                >
              </tr>
              <tr>
                <th>중요도</th>
                <td
                  ><input
                    type="text"
                    bind:value={formData.ast_security_point}
                  /></td
                >
                <th>등급</th>
                <td
                  ><input
                    type="text"
                    bind:value={formData.ast_security_level}
                  /></td
                >
                <th>ISMS인증범위</th>
                <td
                  ><input
                    type="checkbox"
                    style="width: 20px;"
                    bind:checked={formData.ast_isms_target}
                  /></td
                >
                <th>활성화여부</th>
                <td
                  ><input
                    type="checkbox"
                    style="width: 20px;"
                    bind:checked={formData.ast_activate}
                  /></td
                >
              </tr>
            </tbody>
          </table>
          <textarea
            style="margin-top: 10px; width:100%"
            rows="5"
            placeholder="비고란"
            bind:value={formData.ast_etc}
          ></textarea>
        </div>
        <div class="tableListWrap nohead edit">
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
          <div class="flex align-center btnWrap gap-6">
            <button class="btn w140 btnBlue" type="submit">Submit</button>
            <button
              class="btn w140"
              style="background-color: red; color:white"
              type="reset"
              on:click={() => (formData = { ...assetDetails })}>Reset</button
            >

            <button
              class="btn w140"
              style="background-color: green; color:white"
              on:click={closeModalEdit}>Cancel</button
            >
          </div>
        </div>
      </form>
    </div>
  {/if}
</main>

<style>
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
