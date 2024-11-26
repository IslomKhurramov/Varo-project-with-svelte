<script>
  import FifthMenuFirst from "../FifthMenuFirst.svelte";
  import FifthMenuSecon from "../FifthMenuSecon.svelte";
  import FifthMenuThird from "../FifthMenuThird.svelte";
  export let tabMenu;

  let setView = "plan";
  let currentPage = FifthMenuFirst;

  const selectPage = (page) => {
    currentPage = page;
  };
</script>

<main class="table-container" style="border-radius: 10px;">
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
            selectPage(FifthMenuFirst);
          }}
        >
          시스템로그
        </a>
        <a
          href="javascript:void(0);"
          class={setView == "plan_accept" ? "active" : ""}
          on:click={() => {
            setView = "plan_accept";
            selectPage(FifthMenuSecon);
          }}
          style="margin-left: 10px;"
        >
          감사로그
        </a>
        <a
          href="javascript:void(0);"
          class={setView == "plan_siroj" ? "active" : ""}
          on:click={() => {
            setView = "plan_siroj";
            selectPage(FifthMenuThird);
          }}
          style="margin-left: 10px;"
        >
          수행명령조회
        </a>
      </section>

      {#if currentPage}
        <svelte:component this={currentPage} />
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
    padding: 20px;
    margin: 10px 0;
    /* width: 100%; */
    height: calc(100vh - 134px);
  }
  .tableListWrap {
    overflow: hidden;
  }
</style>
