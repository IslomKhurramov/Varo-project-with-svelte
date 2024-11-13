<script>
  // export let selectPageMain;
  let projectIndex = null;
  let filteredProjects = [];
  let projectData = {};
  let dataArray = [
    {
      hostname: "윈도우에이전트",
      itemNo: "CCE 일반점검",
      itemTitle: "",
      itemCriteria: "",
      itemStatus: "",
      itemResult: "",
    },
    {
      hostname: "리눅스에이전트",
      itemNo: "CCE긴급점검",
      itemTitle: "",
      itemCriteria: "",
      itemStatus: "",
      itemResult: "",
    },
    {
      hostname: "수동점검프로그램",
      itemNo: "에이전트정보수집",
      itemTitle: "",
      itemCriteria: "",
      itemStatus: "",
      itemResult: "",
    },
    {
      hostname: "수동점검 스크립트",
      itemNo: "",
      itemTitle: "",
      itemCriteria: "",
      itemStatus: "",
      itemResult: "",
    },
    {
      hostname: "네트워크장비정보수집 프로그램",
      itemNo: "Item005",
      itemTitle: "",
      itemCriteria: "",
      itemStatus: "",
      itemResult: "",
    },
    {
      hostname: "매뉴얼",
      itemNo: "Item005",
      itemTitle: "",
      itemCriteria: "",
      itemStatus: "",
      itemResult: "",
    },
    {
      hostname: "가이드라인",
      itemNo: "Item005",
      itemTitle: "",
      itemCriteria: "",
      itemStatus: "",
      itemResult: "",
    },
  ];
  let setView = "plan";

  let itemsPerPage = 5;
  let currentPage = 1;
  let totalItems = dataArray.length;
  let totalPages = Math.ceil(totalItems / itemsPerPage);

  $: paginatedData = dataArray.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  let maxPageNumbers = 5;

  $: pages = [];
  $: {
    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

    if (endPage - startPage + 1 < maxPageNumbers) {
      startPage = Math.max(1, endPage - maxPageNumbers + 1);
    }

    pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  }

  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  const selectPage = (page, menu) => {
    currentPage = page;
    tabMenu = menu;
  };

  function downloadCSV() {
    const csvRows = [];
    const headers = Object.keys(filteredProjects[0]);
    csvRows.push(headers.join(",")); // Add headers

    for (const row of filteredProjects) {
      const values = headers.map((header) => {
        const escaped = ("" + row[header]).replace(/"/g, '\\"'); // Escape quotes
        return `"${escaped}"`; // Wrap in quotes
      });
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Create a link to download the file
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "table_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
</script>

<section class="tableWrap" style="height: calc(-100px + 100vh);">
  <div class="tableListWrap">
    <table class="tableList hdBorder">
      <colgroup>
        <col style="width:5%;" />
        <col style="width:14%;" />
        <col style="width:14%;" />
        <col style="width:14%;" />
        <col style="width:14%;" />
      </colgroup>
      <thead>
        <tr>
          <th class="text-center" style="font-size: 16px;">순번</th>
          <th class="text-center" style="font-size: 16px;">용도</th>
          <th class="text-center" style="font-size: 16px;">버전</th>
          <th class="text-center" style="font-size: 16px;">파일명</th>
          <th class="text-center" style="font-size: 16px;">비고</th>
        </tr>
      </thead>
      <tbody>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
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
              style="font-size: 16px; display: flex; justify-content: center; align-items: center;"
            >
              <div>
                <button
                  type="button"
                  class="btn btnPrimary btn_dean"
                  on:click={downloadCSV}
                >
                  <img
                    src="./assets/images/icon/download.svg"
                    class="excel-img"
                  />
                  <span> 파일업로드</span>
                </button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    <nav class="pagination">
      <button
        on:click={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lsaquo;
      </button>

      {#each pages as page}
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

  .tableWrap {
    background-color: #fff;
  }

  thead {
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 150px;
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

  tr:hover {
    cursor: pointer;
    background-color: #f4f4f4;
    transition-duration: 0.3s;
  }
  .line-height {
    line-height: 23px;
  }

  .btn_dean {
    display: flex;
    gap: 10px;
  }

  .btn:hover {
    color: #fff;
    background-color: #0067ff;
  }
  .excel-img {
    filter: invert(45%) sepia(100%) saturate(550%) hue-rotate(195deg)
      brightness(100%) contrast(98%);
  }
</style>
