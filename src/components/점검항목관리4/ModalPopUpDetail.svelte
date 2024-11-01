<script>
  export let selectedItem;
  export let selectedCategory;
  export let selectedSlide;
  export let slides = [];
  export let closeShowModal;
  export let deleteSelectedItem;
  export let selectedChecklist;

  let activeAsset = null;

  $: if (selectedItem && slides && Array.isArray(slides) && slides.length > 0) {
    activeAsset = slides.find(
      (slide) => slide.ccc_item_no === selectedItem.ccc_item_no,
    );
    selectedSlide = activeAsset;

    // Focus on the asset if it exists
    if (activeAsset) {
      setTimeout(() => {
        focusOnAsset(activeAsset.ccc_item_no);
      }, 0);
    }
  }
</script>

<div class="modal">
  <div
    style="height: 930px; 
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 10px;
  scrollbar-width: none;          
  -ms-overflow-style: none;      
  -webkit-overflow-scrolling: touch;"
  >
    <table>
      <tr style="height: 50px; position: sticky;top: -1px;">
        <th class="center-align" style="color: white;background: #0072fd;"
          >구분</th
        >
        <td class="center-align" style="color: white;background: #0072fd;"
          >설명</td
        >
      </tr>
      <tbody>
        {#if selectedItem}
          <tr>
            <th class="center-align">점검항목</th>
            <td class="line-height">{selectedCategory}</td>
          </tr>
          <tr>
            <th class="center-align">항목그룹</th>
            <td class="line-height">{selectedItem.ccc_item_group}</td>
          </tr>
          <tr>
            <th class="center-align">정검목적</th>
            <td class="line-height">{selectedItem.ccc_check_purpose}</td>
          </tr>
          <tr>
            <th class="center-align">보안위협</th>
            <td class="line-height">{selectedItem.ccc_security_threat}</td>
          </tr>
          <tr>
            <th class="center-align">점검내용</th>
            <td class="line-height">{selectedItem.ccc_check_content}</td>
          </tr>
          <tr>
            <th class="center-align">대상시스템</th>
            <td class="line-height">{selectedItem.ccc_target_system}</td>
          </tr>
          <tr>
            <th class="center-align">식별코드</th>
            <td class="line-height">{selectedItem.ccc_item_no}</td>
          </tr>
          <tr>
            <th class="center-align">점검항목</th>
            <td class="line-height">{selectedItem.ccc_item_title}</td>
          </tr>
          <tr>
            <th class="center-align">위험도</th>
            <td class="line-height">{selectedItem.ccc_item_level}</td>
          </tr>
          <tr>
            <th class="center-align">평가기준</th>
            <td class="line-height">
              {@html selectedItem.ccc_item_criteria.replace(/\n/g, "<br/>")}

              {#if selectedChecklist && selectedChecklist.ccg_provide === 1}
                <td class="new_input">
                  <div class="first_col">
                    <p>점검항목</p>
                    <input type="text" />
                  </div>
                  <div class="first_col">
                    <p>점검데이터</p>
                    <input type="text" />
                  </div>
                </td>
              {/if}
            </td>
          </tr>
          <tr>
            <th class="center-align">조치방안</th>
            <td
              class="line-height"
              style="display: flex; height: 100px;width:auto; overflow-x:hidden; overflow-y: auto; flex-direction: column; "
              >{selectedItem.ccc_mitigation_method}</td
            >
          </tr>
          <tr>
            <th class="center-align">조치예시</th>
            <td
              style="display: flex; height: 100px;width:auto; overflow-y: auto; overflow-x:hidden; flex-direction: column;"
              class="line-height"
            >
              {@html selectedItem.ccc_mitigation_example.replace(
                /\n/g,
                "<br/>",
              )}
            </td>
          </tr>
          <tr>
            <th class="center-align">조치시영향도</th>
            <td class="line-height">{selectedItem.ccc_impact || "N/A"}</td>
          </tr>
        {:else}
          <tr>
            <td class="line-height" colspan="2">No data available</td>
          </tr>
        {/if}
      </tbody>
    </table>
    <div style="display: flex; justify-content: space-between">
      {#if closeShowModal}
        <button class="btn modify-btn" on:click={closeShowModal}>Close</button>
      {/if}
      {#if selectedChecklist && selectedChecklist.ccg_provide === 1}
        <div class="buttons">
          <div class="buttonGroup">
            <button class="btn modify-btn">수정하기</button>
            <button on:click={deleteSelectedItem} class="btn delete-btn"
              >삭제하기</button
            >
            <button class="btn close-btn">창닫기</button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  * {
    font-size: 16px;
  }
  .center-align {
    text-align: center;
  }

  .line-height {
    line-height: 23px;
  }
  .modal {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    height: 93%;
    overflow: auto;
    /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); */
    /* max-width: 800px;
      margin: 20px auto; */
    font-family: Arial, sans-serif;
  }
  .menu-container .menu-item.active {
    background-color: #0067ff;
    color: #fff;
    border-color: #0067ff;
  }
  .buttons {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .buttonGroup {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
  .longData {
    height: 150px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .first_col {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }
  .first_col input {
    height: 30px;
    width: 250px;
  }
  .new_input {
    display: flex;
    flex-direction: row;

    align-items: center;
    width: 60%;
    justify-content: space-between;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    margin-bottom: 20px;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 12px 15px;
    text-align: left;
    vertical-align: middle;
  }

  th {
    background-color: #f7fafc;
    font-weight: bold;
    color: #000000;
    width: 15px;
  }

  .mitigation-table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .btn {
    padding: 10px 20px; /* Padding for buttons */
    border: none; /* Remove default border */
    border-radius: 5px; /* Rounded corners */
    font-size: 16px; /* Font size */
    cursor: pointer; /* Pointer cursor on hover */
    transition:
      background-color 0.3s,
      transform 0.2s; /* Transition effects */
    outline: none; /* Remove outline on focus */
  }

  .modify-btn {
    background-color: #4caf50; /* Green background for modify button */
    color: white; /* White text */
  }

  .modify-btn:hover {
    background-color: #45a049; /* Darker green on hover */
    transform: translateY(-2px); /* Lift effect on hover */
  }

  .delete-btn {
    background-color: #f44336; /* Red background for delete button */
    color: white; /* White text */
  }

  .delete-btn:hover {
    background-color: #e53935; /* Darker red on hover */
    transform: translateY(-2px); /* Lift effect on hover */
  }

  .close-btn {
    background-color: #2196f3; /* Blue background for close button */
    color: white; /* White text */
  }
  td {
    width: 230px;
  }

  .close-btn:hover {
    background-color: #1976d2; /* Darker blue on hover */
    transform: translateY(-2px); /* Lift effect on hover */
  }
  .scrollModal {
    display: flex;
    flex-direction: column;
    height: 100%; /* Ensure the modal takes up the full height */
  }

  .new_input {
    margin-top: 10px; /* Add margin for input fields in new checklists */
  }

  .first_col {
    margin-bottom: 10px;
  }

  .buttons {
    margin-top: 20px; /* Add space between the table and buttons */
  }

  .btn {
    padding: 8px 15px; /* Button padding */
    border: 1px solid #007bff; /* Button border */
    background-color: #007bff; /* Button background */
    color: white; /* Button text color */
    cursor: pointer;
  }

  .btn:hover {
    background-color: #0056b3; /* Darker background on hover */
  }

  /* Style the buttons */
  .buttons {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .buttonGroup {
    display: flex;
    gap: 10px;
  }
  .tableForm th {
    background-color: #f7fafc;
  }
  /* Button styles */
  .btn {
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition:
      background-color 0.3s,
      transform 0.2s;
  }

  .modify-btn {
    background-color: #4caf50;
    color: white;
  }

  .modify-btn:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }

  .delete-btn {
    background-color: #f44336;
    color: white;
  }

  .delete-btn:hover {
    background-color: #e53935;
    transform: translateY(-2px);
  }

  .close-btn {
    background-color: #2196f3;
    color: white;
  }

  .close-btn:hover {
    background-color: #1976d2;
    transform: translateY(-2px);
  }

  /* Fixed height for large data sections */

  /* Preformatted text */
  .preformatted-content {
    white-space: pre-wrap; /* Preserve line breaks, but ignore extra spaces */
    word-wrap: break-word;
    margin-left: 0; /* Ensure no extra margin */
    padding-left: 0;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin: 0;
    font-size: 16px; /* Increase font size in preformatted content */
  }

  .menu-wrapper-container {
    overflow: hidden; /* Prevents Swiper from breaking out of bounds */
  }
  .menu-wrapper {
    display: flex;
    flex-wrap: nowrap; /* Ensure no wrapping of slides */
  }
  td {
    font-size: 16px;
  }
</style>
