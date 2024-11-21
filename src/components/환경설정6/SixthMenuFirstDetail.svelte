<script>
  import { onMount } from "svelte";
  import { getProgramList } from "../../services/page6/serviceArticle";
  import { errorAlert } from "../../shared/sweetAlert";
  import { dataArray } from "../../services/page7/trace.store";

  let itemsPerPage = 15; // Har sahifada ko'rinadigan elementlar soni
  let currentPage = 1; // Joriy sahifa
  let totalItems = 0; // Umumiy elementlar soni
  let totalPages = 0; // Umumiy sahifalar soni
  let error = null;
  let displayedPages = [];

  let sortField = ""; // Saralash uchun maydon
  let sortAscending = true; // Saralash yo'nalishi (o'sish yoki kamayish)

  async function fetchProgramList() {
    try {
      const params = {
        order_usage:
          sortField === "order_usage" ? (sortAscending ? "asc" : "desc") : "",
        order_version:
          sortField === "order_version" ? (sortAscending ? "asc" : "desc") : "",
        order_cdate:
          sortField === "order_cdate" ? (sortAscending ? "asc" : "desc") : "",
        page_count: currentPage,
        list_count: itemsPerPage,
      };
      const response = await getProgramList(params);

      if (response.RESULT === "OK") {
        const data = response.CODE;
        dataArray.set((data.list || []).slice().reverse());

        if (data.total_count !== undefined && data.total_count !== null) {
          totalItems = data.total_count;
          totalPages = Math.ceil(totalItems / itemsPerPage);
        } else {
          totalItems = 0;
          totalPages = 0;
        }

        console.log("Fetched Data:", data);
        console.log("Total Items:", totalItems, "Total Pages:", totalPages);
      } else {
        throw new Error(response.MESSAGE || "Error fetching data");
      }
    } catch (err) {
      error = err.message;
      await errorAlert(error);
    }
  }
  $: {
    const maxPagesToShow = 3; // Ko'rinadigan sahifalar soni
    displayedPages = [];

    if (totalPages > 0) {
      if (currentPage + maxPagesToShow - 1 < totalPages) {
        // Agar oxirgi sahifaga yetmagan bo'lsa
        for (let i = currentPage; i < currentPage + maxPagesToShow; i++) {
          displayedPages.push(i);
        }
        displayedPages.push(totalPages); // Oxirgi sahifani qo'shish
      } else {
        // Agar oxirgi sahifaga yaqin bo'lsa
        for (
          let i = Math.max(1, totalPages - maxPagesToShow + 1);
          i <= totalPages;
          i++
        ) {
          displayedPages.push(i);
        }
      }
    }
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      currentPage = page; // Joriy sahifani yangilang
      fetchProgramList(); // Yangi ma'lumotlarni yuklang
    }
  };

  function toggleSort(field) {
    if (sortField === field) {
      sortAscending = !sortAscending;
    } else {
      sortField = field;
      sortAscending = true;
    }
    fetchProgramList();
  }

  onMount(fetchProgramList);
</script>

<section class="tableWrap_5">
  <div class="tableWrap">
    <table class="tableList">
      <thead>
        <tr>
          <th>순번</th>
          <th on:click={() => toggleSort("order_usage")}
            >용도<svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              style="transform: rotate({sortField === 'order_usage' &&
              sortAscending
                ? '0deg'
                : '180deg'});
                   transition: transform 0.2s;"
              width="16px"
              height="16px"
            >
              <path
                d="M151.6 42.4C145.5 35.8 137 32 128 32s-17.5 3.8-23.6 10.4l-88 96c-11.9 13-11.1 33.3 2 45.2s33.3 11.1 45.2-2L96 146.3 96 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-301.7 32.4 35.4c11.9 13 32.2 13.9 45.2 2s13.9-32.2 2-45.2l-88-96zM320 480l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l224 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32z"
                fill="#0067ff"
              />
            </svg></th
          >
          <th on:click={() => toggleSort("order_version")}
            >버전 <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              style="transform: rotate({sortField === 'order_version' &&
              sortAscending
                ? '0deg'
                : '180deg'});
                   transition: transform 0.2s;"
              width="16px"
              height="16px"
            >
              <path
                d="M151.6 42.4C145.5 35.8 137 32 128 32s-17.5 3.8-23.6 10.4l-88 96c-11.9 13-11.1 33.3 2 45.2s33.3 11.1 45.2-2L96 146.3 96 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-301.7 32.4 35.4c11.9 13 32.2 13.9 45.2 2s13.9-32.2 2-45.2l-88-96zM320 480l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l224 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32z"
                fill="#0067ff"
              />
            </svg></th
          >
          <th>파일명</th>
          <th on:click={() => toggleSort("order_cdate")}
            >날짜 <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              style="transform: rotate({sortField === 'order_cdate' &&
              sortAscending
                ? '0deg'
                : '180deg'});
                   transition: transform 0.2s;"
              width="16px"
              height="16px"
            >
              <path
                d="M151.6 42.4C145.5 35.8 137 32 128 32s-17.5 3.8-23.6 10.4l-88 96c-11.9 13-11.1 33.3 2 45.2s33.3 11.1 45.2-2L96 146.3 96 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-301.7 32.4 35.4c11.9 13 32.2 13.9 45.2 2s13.9-32.2 2-45.2l-88-96zM320 480l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l224 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32z"
                fill="#0067ff"
              />
            </svg></th
          >
        </tr>
      </thead>
      <tbody>
        {#each $dataArray as data, index}
          <tr>
            <td>
              {totalItems - ((currentPage - 1) * itemsPerPage + index)}
            </td>
            <td>{data.cs_category || "N/A"}</td>
            <td>{data.cs_version || "N/A"}</td>
            <td>{data.cs_filename || "N/A"}</td>
            <td>{data.cs_provied_date || "N/A"}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="total-count">
    <p>총 데이터: <strong>{totalItems}</strong>개</p>
  </div>

  <div class="pagination_box">
    <nav class="pagination">
      <button
        on:click={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lsaquo;
      </button>
      {#each displayedPages as page}
        <button
          class:selected={currentPage === page}
          on:click={() => goToPage(page)}
        >
          {page}
        </button>
      {/each}
      <button
        on:click={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &rsaquo;
      </button>
    </nav>
  </div>
</section>

<style>
  * {
    font-size: 16px;
  }

  .tableWrap_5 {
    background-color: #fff;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    height: 78vh;
    border-radius: 5px;
    margin-top: 10px;
  }

  .tableWrap {
    background-color: #fff;
    max-height: 70vh;
    border-radius: 5px;
    overflow-y: auto;
  }

  thead {
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
  }

  .total-count {
    text-align: left;
    margin-top: 10px;
    margin-left: 20px;
    font-size: 16px;
    color: #555;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-bottom: 60px;
  }

  .pagination button {
    border: none;
    padding: 8px 12px;
    margin: 0 4px;
    cursor: pointer;
    border-radius: 5px;
  }

  .pagination button.selected {
    background-color: #007bff;
    color: #fff;
  }

  .pagination button[disabled] {
    cursor: not-allowed;
  }

  .pagination button:hover:not([disabled]) {
    background-color: #d4d4d4;
  }

  th {
    font-size: 16px;
  }
  tr:hover {
    cursor: pointer;
    background-color: #f4f4f4;
    transition-duration: 0.3s;
  }

  .pagination_box {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding: 10px 0;
    background-color: #fff;
    margin-bottom: 40px;
  }

  .pagination button {
    border: none !important;
    padding: 8px 12px;
    margin: 0 4px;
    cursor: pointer;
    border-radius: 5px;
  }

  .pagination button.selected {
    background-color: #007bff;
    color: #fff;
  }

  .pagination button[disabled] {
    cursor: not-allowed;
  }

  .pagination button:hover:not([disabled]) {
    background-color: #d4d4d4;
  }
</style>
