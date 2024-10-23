<script>
  import { onMount } from "svelte";
  import Swiper, { Navigation, Pagination } from "swiper";
  import "swiper/swiper-bundle.min.css";

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
  let itemWidth = 146; // Each menu item width including gap
  let menuWidth = 100; // Total width of the menu
  let menuWrapper;
  let swiperInstance;

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

  onMount(() => {
    // Ensure swiperContainer is bound
    if (swiperContainer) {
      swiperInstance = new Swiper(swiperContainer, {
        modules: [Navigation, Pagination],
        loop: false, // Avoid layout issues caused by looping
        slidesPerView: 4, // Adjust this value to suit your design
        spaceBetween: 10, // Fine-tune spacing to avoid layout shifts
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    }

    // Initialize menu wrapper for scrolling
    menuWrapper = document.getElementById("menuWrapper");

    return () => {
      if (swiperInstance) {
        swiperInstance.destroy(true, true);
      }
    };
  });

  // Function to scroll and focus on the asset
  function focusOnAsset(assetId) {
    const menuItem = document.querySelector(`.menu-item[value="${assetId}"]`);
    if (menuItem) {
      menuItem.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
      setTimeout(() => {
        menuItem.focus();
      }, 300);
    } else {
      console.warn("Menu item not found:", assetId);
    }
  }

  const handleScroll = (direction) => {
    menuWrapper = document.getElementById("menuWrapper");
    if (!menuWrapper) return;
    const maxScroll = menuWrapper.scrollWidth - menuWidth;

    if (direction === "prev") {
      scrollAmount -= itemWidth;
      if (scrollAmount < 0) scrollAmount = 0;
    } else if (direction === "next") {
      scrollAmount += itemWidth;
      if (scrollAmount > maxScroll) scrollAmount = maxScroll;
    }

    menuWrapper.style.transform = `translateX(-${scrollAmount}px)`;
  };

  function handleSlideclick(slide) {
    activeAsset = slide;
    selectedSlide = slide;
    selectedItem = slide; // Update selectedItem as well
  }
</script>

<article class="contentArea mt-0">
  <!-- Menu for selecting the active slide -->
  {#if showSlide}
    <section bind:this={swiperContainer} class="topCon swiper-container">
      <div class="menu-container" style="margin-top:20px">
        <button
          class="arrow-btn"
          id="prevBtn"
          on:click={() => handleScroll("prev")}>◀</button
        >

        <div class="menu-wrapper-container">
          <div class="menu-wrapper" id="menuWrapper" bind:this={menuWrapper}>
            {#each slides as slide}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div
                value={slide.ccc_item_no}
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

  <div class="scrollModal" style="margin-top: 20px;">
    <table class="tableForm">
      <colgroup>
        <col style="width: 8%;" />
        <col style="width: 70%;" />
      </colgroup>
      <tbody>
        {#if selectedItem}
          <tr>
            <th>점검대상</th>
            <td>{selectedCategory}</td>
          </tr>
          <tr>
            <th>항목그룹</th>
            <td
              ><pre
                class="preformatted-content">{selectedItem.ccc_item_group}</pre></td
            >
          </tr>
          <tr>
            <th>정검목적</th>
            <td
              ><pre
                class="preformatted-content">{selectedItem.ccc_check_purpose}</pre></td
            >
          </tr>
          <tr>
            <th>보안위협</th>
            <td
              ><pre
                class="preformatted-content">{selectedItem.ccc_security_threat}</pre></td
            >
          </tr>
          <tr>
            <th>점검내용</th>
            <td
              ><pre
                class="preformatted-content">{selectedItem.ccc_check_content}</pre></td
            >
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
              <pre class="preformatted-content">
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
            <td
              ><pre
                class="preformatted-content">{selectedItem.ccc_mitigation_method}</pre></td
            >
          </tr>
          <tr>
            <th>조치예시</th>
            <td class="longData">
              <pre
                class="preformatted-content longData">{selectedItem.ccc_mitigation_example}</pre>
            </td>
          </tr>
          <tr>
            <th>조치시영향도</th>
            <td
              ><pre class="preformatted-content">{selectedItem.ccc_impact ||
                  "N/A"}</pre></td
            >
          </tr>
        {:else}
          <tr>
            <td colspan="2">No data available</td>
          </tr>
        {/if}
      </tbody>
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
</article>

<style>
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
    width: 155px;
  }
  .new_input {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
  }

  .tableForm pre.mitigation-example {
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
    .tableForm {
      font-size: 14px;
    }
  }

  @media (max-width: 576px) {
    .tableForm {
      font-size: 12px;
    }

    .tableForm th,
    .tableForm td {
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

  .mitigation-example {
    margin: 0;
    padding: 5px;
    white-space: pre-wrap;
    font-size: 16px;
    background-color: #f4f4f4;
  }

  .new_input {
    margin-top: 10px; /* Add margin for input fields in new checklists */
  }

  .first_col {
    margin-bottom: 10px;
  }

  .longData pre {
    white-space: pre-wrap; /* Ensure long data wraps properly */
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
  /* Set fixed layout for the table */
  /* Set fixed layout for the table */
  .tableForm {
    table-layout: fixed; /* Ensures fixed layout */
    width: 100%; /* Full width */
    border-collapse: collapse; /* Collapse borders */
  }

  .tableForm th,
  .tableForm td {
    padding: 10px; /* Padding for cells */
    border: 10px solid #fff; /* Cell borders */
    word-wrap: break-word; /* Wrap content */
    font-size: 16px; /* Increase font size */
    border-radius: 20px;
  }

  .tableForm colgroup col {
    width: 30%; /* Fixed width for the first column */
  }

  .tableForm colgroup col:nth-child(2) {
    width: 70%; /* Fixed width for the second column */
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
    border-radius: 20px;
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
  .longData pre {
    height: 150px;
    overflow-y: auto;
  }

  /* Preformatted text */
  .preformatted-content {
    white-space: pre-wrap;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin: 0;
    font-size: 18px; /* Increase font size in preformatted content */
  }

  /* Responsive styling */
  @media (max-width: 768px) {
    .tableForm {
      font-size: 16px; /* Adjust for smaller screens */
    }
  }

  @media (max-width: 576px) {
    .tableForm {
      font-size: 14px; /* Further reduce font size on small screens */
    }

    .tableForm th,
    .tableForm td {
      padding: 8px;
    }
  }

  .menu-wrapper-container {
    overflow: hidden; /* Prevents Swiper from breaking out of bounds */
  }
  .menu-wrapper {
    display: flex;
    flex-wrap: nowrap; /* Ensure no wrapping of slides */
  }
  .swiper-wrapper {
    display: flex;
    flex-direction: row;
  }

  .swiper-slide {
    flex-shrink: 0; /* Prevents shrinking of slides */
    width: auto; /* or specific widths depending on how many slides you want to show */
  }

  .modal-content {
    z-index: 100; /* Set higher z-index for modal */
  }
</style>
