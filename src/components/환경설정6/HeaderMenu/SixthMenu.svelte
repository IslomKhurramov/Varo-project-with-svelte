<script>
  import SixthMenuFirstDetail from "../SixthMenuFirstDetail.svelte";
  import SixthMenuSeconDetail from "../SixthMenuSeconDetail.svelte";

  let setView = "plan";
  let currentPage = SixthMenuFirstDetail; // Avtomatik yuklanishi uchun boshlang'ich qiymat
  let dataArray = [];
  const selectPage = (page) => {
    currentPage = page;
  };
</script>

<main class="table-container" style="border-radius: 10px;">
  <section class="tableWrap">
    <div class="tableListWrap">
      <section
        class="subTabWrap"
        style="height: 50px; background-color: #fff; margin-top: 8px; padding-left: 20px; border-radius: 10px"
      >
        <a
          href="javascript:void(0);"
          class={setView == "plan" ? "active" : ""}
          on:click={() => {
            setView = "plan";
            selectPage(SixthMenuFirstDetail);
          }}
        >
          전체보기
        </a>
        <a
          href="javascript:void(0);"
          class={setView == "plan_accept" ? "active" : ""}
          on:click={() => {
            setView = "plan_accept";
            selectPage(SixthMenuSeconDetail);
          }}
          style="margin-left: 10px;"
        >
          신규업로드
        </a>
      </section>

      {#if currentPage}
        <svelte:component this={currentPage} {dataArray} />
      {/if}
    </div>
  </section>
</main>

<style>
  .tableWrap {
    height: calc(100vh - 100px);
    overflow: hidden;
  }
  .table-container {
    background-color: #ffffff;
    /* padding: 20px; */
    margin: 10px 0;
    /* width: 100%; */
    /* height: calc(100vh - 134px); */
  }
  .tableListWrap {
    overflow: hidden;
  }
</style>
