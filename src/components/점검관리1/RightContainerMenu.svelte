<script>
  import FirstMenu from "./HeaderMenu/FirstMenu.svelte";
  import SecondMenu from "./HeaderMenu/SecondMenu.svelte";
  import ThirdMenu from "./HeaderMenu/ThirdMenu.svelte";
  import FourthMenu from "./HeaderMenu/FourthMenu.svelte";
  import FifthMenu from "./HeaderMenu/FifthMenu.svelte";
  import ProjectDetail from "./ProjectDetail.svelte";

  let currentPage = null;
  let activeMenu = null;

  const selectPage = (page, menu) => {
    currentPage = page;
    activeMenu = menu;
  };
</script>

<div class="container_page1">
  <div class="navbar">
    <div class="header">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click="{() => selectPage(FirstMenu, '점검결과등록')}"
        class="{activeMenu === '점검결과등록' ? 'active' : ''}"
      >
        점검결과등록
      </h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click="{() => selectPage(SecondMenu, '점검결과조회')}"
        class="{activeMenu === '점검결과조회' ? 'active' : ''}"
      >
        점검결과조회
      </h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click="{() => selectPage(ThirdMenu, '보고서생성')}"
        class="{activeMenu === '보고서생성' ? 'active' : ''}"
      >
        보고서생성
      </h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click="{() => selectPage(FourthMenu, '수행로그')}"
        class="{activeMenu === '수행로그' ? 'active' : ''}"
      >
        수행로그
      </h3>
    </div>
    <div class="header">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click="{() => selectPage(FifthMenu, '프로그램다운로드')}"
        class="{activeMenu === '프로그램다운로드' ? 'active' : ''}"
      >
        프로그램다운로드
      </h3>
    </div>
  </div>

  <div class="right_menu">
    {#if currentPage}
      <svelte:component this="{currentPage}" />
    {:else}
      <ProjectDetail />
    {/if}
  </div>
</div>

<style>
  /* Container Styling */
  .container_page1 {
    padding: 20px;
    background-color: #f9f9f9;
    min-height: 100vh;
  }

  /* Navbar Styling */
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    padding: 10px 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  .header {
    display: flex;
    gap: 40px;
  }

  .header h3 {
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    position: relative;
    color: #333333;
  }

  /* Gradient Effect for Menu Items */
  .header h3 {
    background-image: linear-gradient(to right, #3183a0, #54b3d6 50%, #000 50%);
    background-size: 200% 100%;
    background-position: -100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition:
      background-position 0.3s ease-in-out,
      color 0.3s ease-in-out;
  }

  .header h3::before {
    content: "";
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 0;
    height: 3px;
    background-color: #3183a0;
    transition: width 0.3s ease-in-out;
  }

  /* Hover and Active State */
  .header h3:hover,
  .header h3.active {
    background-position: 0;
    color: #3183a0;
  }

  .header h3:hover::before,
  .header h3.active::before {
    width: 100%;
  }
</style>
