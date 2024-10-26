<script>
  import FirstMenu from "./HeaderMenu/FirstMenu.svelte";
  import SecondMenu from "./HeaderMenu/SecondMenu.svelte";
  import ThirdMenu from "./HeaderMenu/ThirdMenu.svelte";
  import FourthMenu from "./HeaderMenu/FourthMenu.svelte";
  import FifthMenu from "./HeaderMenu/FifthMenu.svelte";
  import ProjectDetail from "./ProjectDetail.svelte";
  import { navigate } from "svelte-routing";

  export let projectIndex;
  let currentPage = null;
  export let tabMenu = null;

  const selectPage = (page, menu) => {
    currentPage = page;
    tabMenu = menu;
  };
</script>

<div
  class={`contentsWrap ${tabMenu == "결과등록" && "resultCreate"} ${tabMenu == "결과조회/변경" && "resultView"} ${tabMenu == "보고서생성" && "reportCreate"} ${tabMenu == "이력관리" && "logWrap"}`}
>
  <nav class="tabMenu">
    <ul>
      <li class={tabMenu == "결과등록" && "active"}>
        <a
          href="javascript:void(0);"
          on:click={() => selectPage(FirstMenu, "결과등록")}
        >
          결과등록
        </a>
      </li>
      <li class={tabMenu == "결과조회/변경" && "active"}>
        <a
          href="javascript:void(0);"
          on:click={() => selectPage(SecondMenu, "결과조회/변경")}
        >
          결과조회/변경
        </a>
      </li>
      <li class={tabMenu == "보고서생성" && "active"}>
        <a
          href="javascript:void(0);"
          on:click={() => selectPage(ThirdMenu, "보고서생성")}
        >
          보고서생성
        </a>
      </li>
      <li class={tabMenu == "이력관리" && "active"}>
        <a
          href="javascript:void(0);"
          on:click={() => selectPage(FourthMenu, "이력관리")}
        >
          이력관리
        </a>
      </li>
      <li>
        <!-- <a
          href="javascript:void(0);"
          on:click={() => {
            navigate(window.location?.pathname == "/" ? "/page1" : "/");
          }}
        >
          돌아가기
        </a> -->
        <button
          class="btn btnPrimary"
          on:click={() => {
            navigate(window.location?.pathname == "/" ? "/page1" : "/");
          }}
        >
          돌아가기
        </button>
      </li>
    </ul>
  </nav>
  {#if tabMenu !== "no"}
    <svelte:component this={currentPage} bind:projectIndex />
  {:else}
    <ProjectDetail {projectIndex} />
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
</style>
