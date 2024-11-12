<script>
  import SixthMenuFirstDetail from "../SixthMenuFirstDetail.svelte";
  import SixthMenuSeconDetail from "../SixthMenuSeconDetail.svelte";

  let setView = "plan";
  let currentPage = SixthMenuFirstDetail; // Avtomatik yuklanishi uchun boshlang'ich qiymat

  const selectPage = (page) => {
    currentPage = page;
  };
</script>

<section class="tableWrap" style="height: calc(-100px + 100vh);">
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
      <svelte:component this={currentPage} />
    {/if}
  </div>
</section>

<style>
  .tableWrap {
    height: calc(100vh - 100px);
    overflow: hidden;
  }

  .tableListWrap {
    overflow: hidden;
  }
</style>
