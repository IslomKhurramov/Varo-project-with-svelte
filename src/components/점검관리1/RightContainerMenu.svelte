<script>
  import FirstMenu from "./HeaderMenu/FirstMenu.svelte";
  import SecondMenu from "./HeaderMenu/SecondMenu.svelte";
  import ThirdMenu from "./HeaderMenu/ThirdMenu.svelte";
  import FourthMenu from "./HeaderMenu/FourthMenu.svelte";
  import FifthMenu from "./HeaderMenu/FifthMenu.svelte";

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
    <div style="width: 200px;" class="header">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3 on:click="{() => selectPage(FifthMenu, '프로그램다운로드')}">
        프로그램다운로드
      </h3>
    </div>
  </div>

  {#if currentPage}
    <div class="right_menu">
      <svelte:component this="{currentPage}" />
    </div>
  {/if}
</div>

<style>
  .navbar {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .header {
    display: flex;
    flex-direction: row;
    gap: 50px;
    padding-left: 40px;
    width: 100%;
    color: #000000;
  }

  .header h3 {
    color: black;
    font-weight: bold;
    font-size: 12px;
    cursor: pointer;
  }
  .header h3 {
    background-image: linear-gradient(to right, #5486d6, #54b3d6 50%, #000 50%);
    background-size: 200% 100%;
    background-position: -100%;
    display: inline-block;
    padding: 5px 0;
    position: relative;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 0.3s ease-in-out;
  }

  .header h3:before {
    content: "";
    background: #54b3d6;
    display: block;
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 0;
    height: 3px;
    transition: all 0.3s ease-in-out;
  }

  .header h3:hover {
    background-position: 0;
  }

  .header h3:hover::before {
    width: 100%;
  }
  .header h3.active {
    color: #3183a0; /* Ensures active text color is visible */
    -webkit-text-fill-color: #3183a0; /* Override webkit text fill */
    background-image: none; /* Remove the gradient on active */
    text-decoration: underline;
  }
</style>
