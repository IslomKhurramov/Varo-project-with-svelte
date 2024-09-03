<script>
  import FirstMenu from "./HeaderMenu/FirstMenu.svelte";
  import SeconMenu from "./HeaderMenu/SecondMenu.svelte";
  import ThirdMenu from "./HeaderMenu/ThirdMenu.svelte";
  import FourthMenu from "./HeaderMenu/FourthMenu.svelte";
  import FifthMenu from "./HeaderMenu/FifthMenu.svelte";
  import SixthMenu from "./HeaderMenu/SixthMenu.svelte";
  import SeventhMenu from "./HeaderMenu/SeventhMenu.svelte";
  import EightMenu from "./HeaderMenu/EightMenu.svelte";

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
        on:click="{() => selectPage(FirstMenu, '시스템기본설정')}"
        class="{activeMenu === '시스템기본설정' ? 'active' : ''}"
      >
        시스템기본설정
      </h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click="{() => selectPage(SeconMenu, '시스템동기화')}"
        class="{activeMenu === '시스템동기화' ? 'active' : ''}"
      >
        시스템동기화
      </h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click="{() => selectPage(ThirdMenu, '라이센스관리')}"
        class="{activeMenu === '라이센스관리' ? 'active' : ''}"
      >
        라이센스관리
      </h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click="{() => selectPage(FourthMenu, '데이터백업')}"
        class="{activeMenu === '데이터백업' ? 'active' : ''}"
      >
        데이터백업
      </h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click="{() => selectPage(FifthMenu, '시스템초기화')}"
        class="{activeMenu === '시스템초기화' ? 'active' : ''}"
      >
        시스템초기화
      </h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click="{() => selectPage(SixthMenu, '로그분석')}"
        class="{activeMenu === '로그분석' ? 'active' : ''}"
      >
        로그분석
      </h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click="{() => selectPage(SeventhMenu, '업데이트')}"
        class="{activeMenu === '업데이트' ? 'active' : ''}"
      >
        업데이트
      </h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click="{() => selectPage(EightMenu, '사용자관리')}"
        class="{activeMenu === '사용자관리' ? 'active' : ''}"
      >
        사용자관리
      </h3>
    </div>
  </div>

  <div class="right_menu">
    {#if currentPage}
      <svelte:component this="{currentPage}" />
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

  /* Right Menu Styling */
  .right_menu {
    padding: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>
