<script>
  import { onMount } from "svelte";

  export let selectedItem;
  export let selectedCategory;
  export let showSlide;
  export let swiperContainer;
  export let selectedSlide;
  export let isNewlyCreatedChecklist;
  export let slides = [];
  export let selected = [];
  export let deleteSelectedItem;
  let activeAsset = null;

  let scrollAmount = 0;
  const itemWidth = 146; // Each menu item width including gap
  const menuWidth = 1260; // Total width of the menu
  let menuWrapper;

  $: if (selectedItem && slides && Array.isArray(slides) && slides.length > 0) {
    activeAsset = slides.find(
      (slide) => slide.ccc_item_no === selectedItem.ccc_item_no,
    );
    selectedSlide = activeAsset;
  }

  const handleScroll = (direction) => {
    if (direction === "prev") {
      scrollAmount -= itemWidth;
      if (scrollAmount < 0) scrollAmount = 0;
    } else if (direction === "next") {
      scrollAmount += itemWidth;
      const maxScroll = menuWrapper.scrollWidth - menuWidth;
      if (scrollAmount > maxScroll) scrollAmount = maxScroll;
    }
    menuWrapper.style.transform = `translateX(-${scrollAmount}px)`;
  };

  function handleSlideclick(slide) {
    activeAsset = slide;

    selectedSlide = slide;
    selectedItem = slide;
  }

  onMount(() => {
    menuWrapper = document.getElementById("menuWrapper");
  });
</script>

<!-- Menu for selecting the active slide -->
{#if showSlide}
  <section bind:this={swiperContainer} class="topCon">
    <div class="menu-container" style="margin-top:20px">
      <button
        class="arrow-btn"
        id="prevBtn"
        on:click={() => handleScroll("prev")}>◀</button
      >

      <div class="menu-wrapper-container" style="width:100%;">
        <!-- Menu items: bind menuWrapper here -->
        <div class="menu-wrapper" id="menuWrapper" bind:this={menuWrapper}>
          {#each slides as slide}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
              value={slide}
              name={slide}
              class="menu-item {activeAsset &&
              activeAsset.ccc_item_no === slide.ccc_item_no
                ? 'active'
                : ''}"
              on:click={() => handleSlideclick(slide)}
            >
              {slide.ccc_item_no}
            </div>
          {/each}
        </div>
      </div>

      <button
        id="nextBtn"
        class="arrow-btn"
        on:click={() => handleScroll("next")}>▶</button
      >
    </div>
  </section>
{/if}

<!-- Render the table based on selectedSlide or selectedItem -->
<div class="modal">
  <div class="scrollModal">
    <table class="mitigation-table">
      {#if selectedItem}
        <tr>
          <th>점검대상</th>
          <td>
            {selectedCategory}
          </td>
        </tr>
        <tr>
          <th>항목그룹</th>
          <td>
            <pre class="mitigation-example">
              {selectedItem.ccc_item_group}
            </pre>
          </td>
        </tr>
        <tr>
          <th>정검목적</th>
          <td>
            <pre class="mitigation-example">
           {selectedItem.ccc_check_purpose}
          </pre></td
          >
        </tr>
        <tr>
          <th>보안위협</th>
          <td>
            <pre class="mitigation-example">
              {selectedItem.ccc_security_threat}
            </pre>
          </td>
        </tr>
        <tr>
          <th>점검내용</th>
          <td>
            <pre class="mitigation-example">
              {selectedItem.ccc_check_content}
            </pre>
          </td>
        </tr>
        <tr>
          <th>대상시스템</th>
          <td>{selectedItem.ccc_target_system}</td>
        </tr>
        <tr>
          <th>식별코드</th>
          <td>{selectedItem.ccc_item_no}</td>
        </tr>
        <tr>
          <th>점검항목</th>
          <td>{selectedItem.ccc_item_title}</td>
        </tr>
        <tr>
          <th>위험도</th>
          <td>{selectedItem.ccc_item_level}</td>
        </tr>
        <tr>
          <th>평가기준</th>
          <td>
            <pre class="mitigation-example">
              {selectedItem.ccc_item_criteria}
            </pre>
            {#if isNewlyCreatedChecklist}
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
          <th>조치방안</th>
          <td>
            <pre class="mitigation-example">
              {selectedItem.ccc_mitigation_method}
            </pre>
          </td>
        </tr>
        <tr>
          <th>조치예시</th>
          <td class="longData">
            <!-- Formatting the detailed mitigation steps here -->
            <pre
              class="mitigation-example longData">{selectedItem.ccc_mitigation_example}</pre>
          </td>
        </tr>
        <tr>
          <th>조치시영향도</th>
          <td>
            <pre class="mitigation-example">
              {selectedItem.ccc_impact || "N/A"}
            </pre>
          </td>
        </tr>
      {:else}
        <tr>
          <td colspan="2">No data available</td>
        </tr>
      {/if}
    </table>
    {#if isNewlyCreatedChecklist}
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

<style>
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
  .modal {
    border-radius: 10px;
    background-color: #f9f9f9;
    padding: 20px;
    max-width: 700px;
    margin: 0 auto;
    margin-top: 20px;
  }
  .scrollModal {
    overflow-y: auto;
    overflow-x: hidden;
    height: 700px;
  }
  .first_col {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }
  .first_col input {
    height: 30px;
    width: 155px;
  }
  .new_input {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    margin-bottom: 20px;
  }

  th,
  td {
    border: 1px solid #dddddd;
    padding: 12px 15px;
    text-align: left;
  }

  th {
    background-color: #f1f1f1;
    color: #333;
    font-weight: bold;
    width: 120px;
  }

  .mitigation-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    text-align: left;
  }

  .mitigation-table th,
  .mitigation-table td {
    padding: 12px 15px;
    border: 1px solid #ddd;
    vertical-align: top;
  }

  .mitigation-table th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  .mitigation-table pre.mitigation-example {
    white-space: pre-wrap; /* Ensures long content wraps */
    background-color: #f8f9fa;
    padding: 10px;
    font-family: "Courier New", Courier, monospace;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 0;
  }

  .mitigation-table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  /* Responsive styling */
  @media (max-width: 768px) {
    .mitigation-table {
      font-size: 14px;
    }
  }

  @media (max-width: 576px) {
    .mitigation-table {
      font-size: 12px;
    }

    .mitigation-table th,
    .mitigation-table td {
      padding: 8px;
    }
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

  .close-btn:hover {
    background-color: #1976d2; /* Darker blue on hover */
    transform: translateY(-2px); /* Lift effect on hover */
  }
</style>
