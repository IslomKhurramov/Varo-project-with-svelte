<script>
  export let projectIndex;
  export let selectedData;
  import FourtMenuInformation from "./FourtMenuInformation.svelte";
  import FourtMenuPassword from "./FourtMenuPassword.svelte";

<<<<<<< HEAD
=======
  export let selectedData;
  export let projectIndex;

>>>>>>> cd9ee2e7b619f3f75373621c402c3f449461da47
  let currentPage = FourtMenuInformation;
  let tabMenu = "사용자관리";
  let setView = "plan";

  const selectPage = (page, menu) => {
    currentPage = page;
    tabMenu = menu;
  };
</script>

<div
  style="height: 100vh; width: 100%;"
  class={`contentsWrap1 ${tabMenu == "시스템기본설정" && "resultView"} ${tabMenu == "공지사항" && "resultView"} ${tabMenu == "자료실" && "resultView"} ${tabMenu == "사용자관리" && "logWrap"}`}
>
  <section
    class="subTabWrap"
    style="height: 50px; background-color: #fff; margin-top: 8px; border-radius: 10px"
  >
    <a
      href="javascript:void(0);"
      class={setView == "plan_accept" ? "active" : ""}
      on:click={async () => {
        try {
          setView = "plan_accept";
          selectPage(FourtMenuPassword);
        } catch (err) {}
      }}
      style="margin-left: 10px;"
    >
      정보변경
    </a>
    <a
      href="javascript:void(0);"
      class={setView == "plan" ? "active" : ""}
      on:click={async () => {
        try {
          setView = "plan";
          selectPage(FourtMenuInformation);
        } catch (err) {}
      }}
    >
      비밀번호변경
    </a>
  </section>

  {#if currentPage}
    <svelte:component this={currentPage} bind:projectIndex bind:selectedData />
  {/if}
</div>

<style>
  * {
    font-size: 16px;
  }

  .btn:hover {
    color: #fff;
    background-color: #0067ff;
  }

  .tableWrap {
    height: calc(100vh - 100px);
    overflow: hidden;
  }

  .tableListWrap {
    overflow: hidden;
  }
</style>
