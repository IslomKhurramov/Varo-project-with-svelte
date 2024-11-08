<script>
  let dataArray = [
    {
      hostname: "Host1",
      itemNo: "Item001",
      itemTitle: "Title1",
      itemCriteria: "Criteria1",
      itemStatus: "Status1",
      itemResult: "양호",
    },
    {
      hostname: "Host2",
      itemNo: "Item002",
      itemTitle: "Title2",
      itemCriteria: "Criteria2",
      itemStatus: "Status2",
      itemResult: "취약",
    },
    {
      hostname: "Host3",
      itemNo: "Item003",
      itemTitle: "Title3",
      itemCriteria: "Criteria3",
      itemStatus: "Status3",
      itemResult: "예외처리",
    },
    {
      hostname: "Host4",
      itemNo: "Item004",
      itemTitle: "Title4",
      itemCriteria: "Criteria4",
      itemStatus: "Status4",
      itemResult: "해당없음",
    },
    {
      hostname: "Host5",
      itemNo: "Item005",
      itemTitle: "Title5",
      itemCriteria: "Criteria5",
      itemStatus: "Status5",
      itemResult: "양호",
    },
    {
      hostname: "Host3",
      itemNo: "Item003",
      itemTitle: "Title3",
      itemCriteria: "Criteria3",
      itemStatus: "Status3",
      itemResult: "예외처리",
    },
    {
      hostname: "Host4",
      itemNo: "Item004",
      itemTitle: "Title4",
      itemCriteria: "Criteria4",
      itemStatus: "Status4",
      itemResult: "해당없음",
    },
    {
      hostname: "Host5",
      itemNo: "Item005",
      itemTitle: "Title5",
      itemCriteria: "Criteria5",
      itemStatus: "Status5",
      itemResult: "양호",
    },
  ];
</script>

<section class="tableWrap" style="height: calc(-5vh + 100vh);">
  <div class="tableListWrap">
    <table class="tableList hdBorder">
      <colgroup>
        <col style="width:14%;" />
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
          <th class="text-center" style="font-size: 16px;">이메일</th>
          <th class="text-center" style="font-size: 16px;">이름</th>
          <th class="text-center" style="font-size: 16px;">유저권한</th>
          <th class="text-center" style="font-size: 16px;">부서</th>
          <th class="text-center" style="font-size: 16px;">연락처</th>
          <th class="text-center" style="font-size: 16px;">비밀번호관리</th>
        </tr>
      </thead>
      <tbody>
        {#each dataArray as data, index}
          <tr>
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
            <td class="text-center" style="font-size: 16px;">
              <span class="">
                {data.itemResult}
              </span>
            </td>
            <td
              style="font-size: 16px; display: flex; justify-content: center; align-items: center;"
            >
              <div class="buttonContainer">
                <button type="button" class="btn btnBlue btnSave">
                  비밀번호초기화
                </button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<style>
  * {
    font-size: 16px;
  }

  .tableWrap {
    background-color: #fff;
  }

  .modal-open-wrap {
    display: block;
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(167, 167, 167, 0.6);
  }

  thead {
    position: sticky; /* Make the header sticky */
    top: 0; /* Stick the header to the top */
    z-index: 10; /* Ensure the header is above the scrolling content */
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4); /* Shadow effect for separation */
  }
  dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1103px;
    border: none;
    border-radius: 10px;
    background-color: white;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    animation: svelte-s7onsa-fadeIn 0.3s ease;
    z-index: 100;
  }

  /* Modal backdrop */
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    animation: fadeInBackdrop 0.3s ease;
  }

  tr:hover {
    cursor: pointer;
    background-color: #f4f4f4;
    transition-duration: 0.3s;
  }
  .line-height {
    line-height: 23px;
  }
</style>
