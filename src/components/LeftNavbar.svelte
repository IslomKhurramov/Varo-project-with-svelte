<script>
  import Page1 from "./점검관리1/Page1.svelte";
  import Page2 from "./자산관리2/Page2.svelte";
  import Page3 from "./취약점관리3/Page3.svelte";
  import Page4 from "./점검항목관리4/Page4.svelte";
  import Page5 from "./대시보드5/Page5.svelte";
  import Page6 from "./환경설정6/Page6.svelte";
  import Page7 from "./취약점추적7/Page7.svelte";

  let currentPage = null;
  let activeMenu = null;

  const selectPage = (page, menu) => {
    currentPage = page;
    activeMenu = menu;
  };
</script>

<div class="container">
  <div class="container_aside">
    <aside>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        href="javascript:void(0)"
        on:click={() => selectPage(Page1, "점검관리")}
        class={activeMenu === "점검관리" ? "active" : ""}
      >
        <i class="fa fa-user-o" aria-hidden="true"></i>
        점검관리
      </a>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        href="javascript:void(0)"
        on:click={() => selectPage(Page2, "자산관리")}
        class={activeMenu === "자산관리" ? "active" : ""}
      >
        <i class="fa fa-laptop" aria-hidden="true"></i>
        자산관리
      </a>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        href="javascript:void(0)"
        on:click={() => selectPage(Page3, "취약점관리")}
        class={activeMenu === "취약점관리" ? "active" : ""}
      >
        <i class="fa fa-clone" aria-hidden="true"></i>
        취약점관리
      </a>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        href="javascript:void(0)"
        on:click={() => selectPage(Page4, "점검항목관리")}
        class={activeMenu === "점검항목관리" ? "active" : ""}
      >
        <i class="fa fa-star-o" aria-hidden="true"></i>
        점검항목관리
      </a>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        href="javascript:void(0)"
        on:click={() => selectPage(Page5, "대시보드")}
        class={activeMenu === "대시보드" ? "active" : ""}
      >
        <i class="fa fa-trash-o" aria-hidden="true"></i>
        대시보드
      </a>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        href="javascript:void(0)"
        on:click={() => selectPage(Page6, "환경설정")}
        class={activeMenu === "환경설정" ? "active" : ""}
      >
        <i class="fa fa-trash-o" aria-hidden="true"></i>
        환경설정
      </a>
      <a
        href="javascript:void(0)"
        on:click={() => selectPage(Page7, "취약점추적")}
        class={activeMenu === "취약점추적" ? "active" : ""}
      >
        <i class="fa fa-trash-o" aria-hidden="true"></i>
        취약점추적
      </a>
    </aside>
  </div>

  <!-- Main content area -->
  {#if currentPage}
    <div class="right_menu">
      <svelte:component this={currentPage} />
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    width: 100%;
    min-height: 100vh;
    box-shadow:
      rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
      rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  }

  /* Sidebar container */
  .container_aside {
    background-color: #f7f9fb;
    color: #343a40;
    width: 250px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    top: 0;
    bottom: 0;
    box-shadow:
      rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
      rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; /* Soft shadow for depth */
    border-right: 1px solid #e0e0e0; /* Subtle border for separation */
  }
  /* Sidebar styles */
  aside {
    font-size: 16px;
    width: 100%;
  }

  aside a {
    font-size: 16px;
    color: #000000;
    display: block;
    padding: 12px;
    padding-left: 30px;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }

  aside a:hover {
    color: #2c3e50;
    background: #fff;
    outline: none;
    position: relative;
    background-color: #fff;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }

  aside a:hover,
  aside a.active {
    color: #2c3e50;
    background: #fff;
    outline: none;
    position: relative;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }

  aside a i {
    margin-right: 5px;
  }

  aside a:hover::after {
    content: "";
    position: absolute;
    background-color: transparent;
    bottom: 100%;
    right: 0;
    height: 35px;
    width: 35px;
    border-bottom-right-radius: 18px;
    box-shadow: 0 20px 0 0 #fff;
  }

  aside a:hover::before {
    content: "";
    position: absolute;
    background-color: transparent;
    top: 38px;
    right: 0;
    height: 35px;
    width: 35px;
    border-top-right-radius: 18px;
    box-shadow: 0 -20px 0 0 #fff;
  }

  aside p {
    margin: 0;
    padding: 40px 0;
  }

  .right_menu {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: row;
  }
</style>
