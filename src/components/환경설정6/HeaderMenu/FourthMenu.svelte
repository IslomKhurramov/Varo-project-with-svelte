<script>
  import FourthMenuDetail from "../FourthMenuDetail.svelte";
  import NewMember from "../NewMember.svelte";
  import {
    getUserLists,
    setUserActivate,
  } from "../../../services/page6/serviceArticle";
  import { onMount } from "svelte";
  import { errorAlert, successAlert } from "../../../shared/sweetAlert";
  import { userData } from "../../../stores/user.store";

  let error = null;
  let selectedData = null;
  let projectArray = [];
  let showNewMember = false;
  let userInfo = null;

  // Subscribe to userData store
  // userData.subscribe((value) => {
  //   userInfo = value.userInfo;
  //   console.log("Fetched userInfo from store:", userInfo);
  // });

  async function getUserListsData() {
    try {
      const response = await getUserLists();

      if (response?.RESULT === "OK") {
        projectArray = response.CODE.map((user) => ({
          hostname: user.user_name,
          itemTitle: user.user_email,
          itemCriteria: user.user_depart,
          itemStatus: user.user_roletype__role_type,
          itemResult: user.user_activate ? "1" : "0",
          user_index: user.user_index,
        }));
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
        await getUserListsData(),
      );
    }
  }

  onMount(() => {
    getUserListsData();
  });

  function handleRowClick(data) {
    selectedData = data;
  }

  function handleNewMemberClose() {
    showNewMember = false;
    getUserListsData();
  }
</script>

{#if showNewMember}
  <NewMember on:close={handleNewMemberClose} />
{:else if selectedData}
  <FourthMenuDetail
    {selectedData}
    on:close={() => {
      selectedData = null;
      getUserListsData();
    }}
  />
{:else}
  <section class="tableWrap">
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
              <td class="text-center" style="font-size: 16px;">{index + 1}</td>
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
                  <span class="badge badgePrimary">비밀번호초기화</span>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      <div class="buttonContainer formControl">
        <label></label>
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
    </div>
  </section>
{/if}

<style>
  * {
    font-size: 16px;
  }

  .tableWrap {
    background-color: #fff;
    height: 85vh;
    border-radius: 5px;
  }

  .tableListWrap {
    overflow-y: auto;
    height: 100%;
    padding-bottom: 50px;
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
    margin-top: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
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
</style>
