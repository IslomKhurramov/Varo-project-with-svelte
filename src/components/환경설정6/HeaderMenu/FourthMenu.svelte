<script>
  import FourthMenuDetail from "../FourthMenuDetail.svelte";
  import NewMember from "../NewMember.svelte";
  import {
    getUserLists,
    setUserActivate,
  } from "../../../services/page6/serviceArticle";
  import { onMount } from "svelte";
  import { errorAlert, successAlert } from "../../../shared/sweetAlert";
  // ///////////////////////////////////////////////////////////////////////
  import {
    decryptData,
    setPasswordReset,
  } from "../../../services/login/loginService";
  import { userData } from "../../../stores/user.store";
    export let tabMenu;

  let userRoleTypeIndex = null;

  userData.subscribe((data) => {
    userRoleTypeIndex = data.userInfo.user_roletype_role_index;
  });
  let user_roletype_role_index = decryptData(userRoleTypeIndex);
  // //////////////////////////////////////////////////////////////////////

  let error = null;
  let selectedData = null;
  let projectArray = [];
  let showNewMember = false;

  async function getUserListsData() {
    try {
      const response = await getUserLists();

      if (response?.RESULT === "OK") {
        projectArray = response.CODE.map((user) => ({
          hostname: user.user_name,
          itemTitle: user.user_email,
          itemCriteria: user.user_depart,
          itemStatus: user.user_roletype__role_type,
          itemLevel: user.user_roletype__role_index,
          itemResult: user.user_activate ? "1" : "0",
          user_index: user.user_index,
        })).reverse();
      }
    } catch (err) {
      error = err.message;
      console.error("Error fetching user lists:", error);
    }
  }

  async function handleStatusChange(userIndex, event) {
    const originalValue = event.target.value;
    try {
      const newStatus = parseInt(event.target.value, 10);

      if ([1, 9].includes(userIndex)) {
        await errorAlert("관리자 또는 에이전트 계정은 변경할 수 없습니다.");
        event.target.value = newStatus === 1 ? "0" : "1";
        return;
      }

      const response = await setUserActivate(userIndex, newStatus);

      if (response.RESULT === "OK") {
        await successAlert(
          newStatus === 1
            ? "사용자가 활성화되었습니다."
            : "사용자가 비활성화되었습니다.",
        );

        await getUserListsData();
      }
    } catch (err) {
      console.error("Error in handleStatusChange:", err);
      event.target.value = originalValue;
      await errorAlert(
        err.message || "사용자 상태를 변경하는 중 오류가 발생했습니다.",
      );
    }
  }

  async function resetPassword(userEmail) {
    try {
      if (!userEmail) throw new Error("이메일 정보가 없습니다.");
      const result = await setPasswordReset(userEmail);

      await successAlert(result);
    } catch (err) {
      await errorAlert(err?.message || "비밀번호 초기화 실패");
    }
  }

  function handleRowClick(data) {
    selectedData = data;
  }

  function handleNewMemberClose() {
    showNewMember = false;
    getUserListsData();
  }

  onMount(() => {
    getUserListsData();
  });
</script>

<main class="table-container" style="border-radius: 10px;">
  {#if showNewMember}
    <NewMember on:close={handleNewMemberClose} />
  {:else if selectedData}
    <FourthMenuDetail
      {selectedData}
      {projectArray}
      {getUserListsData}
      on:close={() => {
        selectedData = null;
        getUserListsData();
      }}
    />
  {:else}
    <section class="tableWrap_3">
      <div class="tableListWrap">
        <table class="tableList hdBorder">
          <colgroup>
            <col style="width:3%;" />
            <col style="width:14%;" />
            <col style="width:14%;" />
            <col style="width:14%;" />
            <col style="width:14%;" />
            <col style="width:14%;" />
            <col style="width:14%;" />
          </colgroup>
          <thead>
            <tr>
              <th class="text-center" style="font-size: 16px;">순번</th>
              <th class="text-center" style="font-size: 16px;">이름</th>
              <th class="text-center" style="font-size: 16px;">이메일</th>
              <th class="text-center" style="font-size: 16px;">유저권한</th>
              <th class="text-center" style="font-size: 16px;">상태</th>
              <th class="text-center" style="font-size: 16px;">결과</th>
              <th class="text-center" style="font-size: 16px;">비밀번호관리</th>
            </tr>
          </thead>
          <tbody>
            {#each projectArray as data, index}
              <tr
                on:click={() => {
                  handleRowClick(data);
                }}
                style="cursor: pointer;"
              >
                <td class="text-center" style="font-size: 16px;"
                  >{projectArray.length - index}</td
                >
                <td style="font-size: 16px;" class="cursor-pointer text-center">
                  {data.hostname}
                </td>
                <td style="font-size: 16px;" class="text-center line-height">
                  {data.itemTitle}
                </td>
                <td
                  class="text-center cursor-pointer line-height"
                  style="font-size: 16px;"
                >
                  <div class="line-height">
                    {data.itemCriteria}
                  </div>
                </td>
                <td
                  style="overflow: hidden; font-size: 16px;"
                  class="text-center line-height"
                >
                  {data.itemStatus}
                </td>

                <td class="text-center" style="font-size: 12px;">
                  <!-- {#if parseInt(user_roletype_role_index) === 0} -->
                  {#if parseInt(user_roletype_role_index) >= 1 && parseInt(user_roletype_role_index) <= 9}
                    <select
                      bind:value={data.itemResult}
                      on:change={(e) => handleStatusChange(data.user_index, e)}
                      on:click={(e) => e.stopPropagation()}
                      name="agent_status"
                      id="agent_status"
                    >
                      <option value="1">활성</option>
                      <option value="0">비활성</option>
                    </select>
                  {:else}
                    <span>{data.itemResult === "1" ? "활성" : "비활성"}</span>
                  {/if}
                </td>

                <td
                  style="font-size: 16px; display: flex; justify-content: center; align-items: center;"
                >
                  <div
                    class="passwordreset"
                    on:click={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <span
                      class="badge badgePrimary"
                      on:click={() => {
                        resetPassword(data.itemTitle);
                      }}
                    >
                      비밀번호초기화
                    </span>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <div class="buttonContainer formControl">
        <button
          type="button"
          class="btn btnBlue btnSave"
          on:click={() => {
            showNewMember = true;
          }}
        >
          사용자추가
        </button>
      </div>
    </section>
  {/if}
</main>

<style>
  * {
    font-size: 16px;
  }
  .table-container {
    background-color: #ffffff;
    padding: 20px;
    margin: 10px 0;
    height: calc(100vh - 134px);
  }
  .tableWrap_3 {
    background-color: #fff;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    gap: 20px;
    height: 75vh;
    border-radius: 5px;
    margin-top: 10px;
  }

  .tableListWrap {
    overflow-y: auto;
    max-height: 65vh;
  }

  thead {
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
  }

  tr:hover {
    cursor: pointer;
    background-color: #f4f4f4;
    transition-duration: 0.3s;
  }

  .line-height {
    line-height: 23px;
  }

  .passwordreset {
    padding: 0 25px 0 15px;
    height: 30px;
  }

  select {
    padding: 0 25px 0 15px;
    height: 30px;
    background-size: 8px;
    color: #626677;
    border: 1px solid rgba(98, 102, 119, 0.2);
    border-radius: 6px;
    box-sizing: border-box;
    background-size: 10px;
    background-color: #fff;
    font-weight: 400;
    font-size: 16px;
  }

  option {
    padding: 0 32px 0 15px;
    background-size: 8px;
  }

  .buttonContainer {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  .btnSave {
    width: 150px;
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

  /***************************/
</style>
