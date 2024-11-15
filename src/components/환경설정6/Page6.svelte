<script>
  import FirstMenu from "./HeaderMenu/FirstMenu.svelte";
  import ThirdMenu from "./HeaderMenu/ThirdMenu.svelte";
  import FourthMenu from "./HeaderMenu/FourthMenu.svelte";
  import FifthMenu from "./HeaderMenu/FifthMenu.svelte";
  import SixthMenu from "./HeaderMenu/SixthMenu.svelte";
  import SeventhMenu from "./HeaderMenu/SeventhMenu.svelte";
  import SecondMenu from "./HeaderMenu/SecondMenu.svelte";
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  let currentView = "default";
  let currentPage = FirstMenu;
  let activeMenu = null;
  let selectedProjectIndex = null; 
  let tabMenu = "시스템기본설정";
  let tab = null;

  onMount(() => {
    tab = new URLSearchParams(window.location.search).get("tab");
    if (tab == "Notice") {
      currentPage = SecondMenu;
      tabMenu = "공지사항";
      currentView = "page";
    }

    if (tab == "Dataroom") {
      currentPage = ThirdMenu;
      tabMenu = "자료실";
      currentView = "page";
    }
  });

  const selectPage = (page, menu) => {
    currentPage = page;
    tabMenu = menu;
    currentView = "page";
    tab = null;
    navigate("/page6");
  };
</script>

<div
  style="height: 100vh; padding-left: 10px; padding-right: 10px;"
  class={`contentsWrap1 ${tabMenu == "시스템기본설정" && "resultView"} ${tabMenu == "공지사항" && "resultView"} ${tabMenu == "자료실" && "resultView"} ${tabMenu == "사용자관리" && "logWrap"}`}
>
  <article class="tabMenu contentArea" style="padding: 0;">
    <ul>
      <li class={tabMenu == "시스템기본설정" && "active"}>
        <a
          href="javascript:void(0);"
          on:click={() => selectPage(FirstMenu, "시스템기본설정")}
        >
          시스템기본설정
        </a>
      </li>
      <li class={tabMenu == "공지사항" && "active"}>
        <a
          href="javascript:void(0);"
          on:click={() => selectPage(SecondMenu, "공지사항")}
        >
          공지사항
        </a>
      </li>
      <li class={tabMenu == "자료실" && "active"}>
        <a
          href="javascript:void(0);"
          on:click={() => selectPage(ThirdMenu, "자료실")}
        >
          자료실
        </a>
      </li>
      <li class={tabMenu == "사용자관리" && "active"}>
        <a
          href="javascript:void(0);"
          on:click={() => selectPage(FourthMenu, "사용자관리")}
        >
          사용자관리
        </a>
      </li>
      <li class={tabMenu == "로그분석" && "active"}>
        <a
          href="javascript:void(0);"
          on:click={() => selectPage(FifthMenu, "로그분석")}
        >
          로그분석
        </a>
      </li>
      <li class={tabMenu == "프로그램관리" && "active"}>
        <a
          href="javascript:void(0);"
          on:click={() => selectPage(SixthMenu, "프로그램관리")}
        >
          프로그램관리
        </a>
      </li>
      <li class={tabMenu == "라이센스관리" && "active"}>
        <a
          href="javascript:void(0);"
          on:click={() => selectPage(SeventhMenu, "라이센스관리")}
        >
          라이센스관리
        </a>
      </li>
    </ul>
  </article>

  <!-- Switch between default view and selected page component -->
  {#if currentView === "default"}
    <FirstMenu selectPageMain={selectPage} bind:activeMenu />
  {:else if currentPage}
    <svelte:component this={currentPage} bind:tabMenu />
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
