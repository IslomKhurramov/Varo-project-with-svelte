<script>
  import FirstMenu from "./HeaderMenu/FirstMenu.svelte";
  import SecondMenu from "./HeaderMenu/SecondMenu.svelte";
  import ThirdMenu from "./HeaderMenu/ThirdMenu.svelte";
  import FourthMenu from "./HeaderMenu/FourthMenu.svelte";
  import FifthMenu from "./HeaderMenu/FifthMenu.svelte";
  import SixthMenu from "./HeaderMenu/SixthMenu.svelte";
  import SeventhMenu from "./HeaderMenu/SeventhMenu.svelte";
  import { navigate } from "svelte-routing";
  import FourtMenuInformation from "./FourtMenuInformation.svelte";
  import FourtMenuPassword from "./FourtMenuPassword.svelte";

  export let projectIndex;
  let currentPage = null;
  export let tabMenu = null;
  export let setView;

  // Sahifani tanlash va tabni yangilash funksiyasi
  const selectPage = (page, menu) => {
    currentPage = page;
    tabMenu = menu;
  };

  // Orqaga qaytish funksiyasi
  function goBack() {
    navigate("/page6");
    currentPage = null;
    tabMenu = null;
  }
</script>

<div
  style="overflow: scroll; height: 100vh; width: 100%; "
  class={`contentsWrap1 ${tabMenu == "시스템기본설정" && "resultView"} ${tabMenu == "공지사항" && "resultView"} ${tabMenu == "자료실" && "resultView"} ${tabMenu == "사용자관리" && "logWrap"}`}
>
  <nav class="tabMenu">
    <ul>
      <li class={tabMenu == "시스템기본설정" && "active"}>
        <a
          href="javascript:void(0);"
          on:click={() => (selectPage(FirstMenu, "시스템기본설정"), goBack())}
        >
          시스템기본설정
        </a>
      </li>
      <li class={tabMenu == "공지사항" && "active"}>
        <a
          href="javascript:void(0);"
          on:click={() => (selectPage(SecondMenu, "공지사항"), goBack())}
        >
          공지사항
        </a>
      </li>
      <li class={tabMenu == "자료실" && "active"}>
        <a
          href="javascript:void(0);"
          on:click={() => (selectPage(ThirdMenu, "자료실"), goBack())}
        >
          자료실
        </a>
      </li>
      <li class={tabMenu == "사용자관리" && "active"}>
        <a
          href="javascript:void(0);"
          on:click={() => (selectPage(FourthMenu, "사용자관리"), goBack())}
        >
          사용자관리
        </a>
      </li>
      <li class={tabMenu == "로그분석" && "active"}>
        <a
          href="javascript:void(0);"
          on:click={() => (selectPage(FifthMenu, "로그분석"), goBack())}
        >
          로그분석
        </a>
      </li>
      <li class={tabMenu == "프로그램관리" && "active"}>
        <a
          href="javascript:void(0);"
          on:click={() => (selectPage(SixthMenu, "프로그램관리"), goBack())}
        >
          프로그램관리
        </a>
      </li>
      <li class={tabMenu == "라이센스관리" && "active"}>
        <a
          href="javascript:void(0);"
          on:click={() => (selectPage(SeventhMenu, "라이센스관리"), goBack())}
        >
          라이센스관리
        </a>
      </li>
    </ul>
  </nav>
  <section
    class="subTabWrap"
    style="height: 50px; background-color: #fff; margin-top: 8px"
  >
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
      정보변경
    </a>
    <a
      href="javascript:void(0);"
      class={setView == "plan_accept" ? "active" : ""}
      on:click={async () => {
        try {
          setView = "plan_accept";
          selectPage(FourtMenuPassword);
        } catch (err) {}
      }}
    >
      비밀번호변경
    </a>
  </section>

  {#if tabMenu !== "no"}
    <svelte:component this={currentPage} bind:projectIndex />
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
