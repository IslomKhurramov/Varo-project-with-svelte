<script>
  import Page1 from "./점검관리1/Page1.svelte";
  import Page2 from "./자산관리2/Page2.svelte";
  import Page3 from "./취약점관리3/Page3.svelte";

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
      <p></p>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        href="javascript:void(0)"
        on:click="{() => selectPage(Page1, '점검관리')}"
        class="{activeMenu === '점검관리' ? 'active' : ''}"
      >
        <i class="fa fa-user-o" aria-hidden="true"></i>
        점검관리
      </a>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        href="javascript:void(0)"
        on:click="{() => selectPage(Page2, '자산관리')}"
        class="{activeMenu === '자산관리' ? 'active' : ''}"
      >
        <i class="fa fa-laptop" aria-hidden="true"></i>
        자산관리
      </a>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        href="javascript:void(0)"
        on:click="{() => selectPage(Page3, '취약점관리')}"
        class="{activeMenu === '취약점관리' ? 'active' : ''}"
      >
        <i class="fa fa-clone" aria-hidden="true"></i>
        취약점관리
      </a>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        href="javascript:void(0)"
        on:click="{() => selectPage(Page2, '점검항목관리')}"
        class="{activeMenu === '점검항목관리' ? 'active' : ''}"
      >
        <i class="fa fa-star-o" aria-hidden="true"></i>
        점검항목관리
      </a>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        href="javascript:void(0)"
        on:click="{() => selectPage(Page2, '환경설정')}"
        class="{activeMenu === '환경설정' ? 'active' : ''}"
      >
        <i class="fa fa-trash-o" aria-hidden="true"></i>
        환경설정
      </a>
    </aside>

    <div class="social">
      <a
        href="https://www.linkedin.com/in/florin-cornea-b5118057/"
        target="_blank"
      >
        <i class="fa fa-linkedin"></i>
      </a>
    </div>
  </div>
  {#if currentPage}
    <div class="right_menu">
      <svelte:component this="{currentPage}" />
    </div>
  {/if}
</div>

<style>
  aside {
    color: #fff;
    width: 200px;
    padding-left: 20px;
    height: 100vh;
    background-image: linear-gradient(30deg, #0048bd, #44a7fd);
    /* border-top-right-radius: 80px; */
    border: 1px solid black;
  }

  aside a {
    font-size: 12px;
    color: #fff;
    display: block;
    padding: 12px;
    padding-left: 30px;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }

  aside a:hover {
    color: #3f5efb;
    background: #fff;
    outline: none;
    position: relative;
    background-color: #fff;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }
  aside a:hover,
  aside a.active {
    color: #3f5efb;
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

  .social {
    height: 0;
  }

  .social i:before {
    width: 14px;
    height: 14px;
    font-size: 14px;
    position: fixed;
    color: #fff;
    background: #0077b5;
    padding: 10px;
    border-radius: 50%;
    top: 5px;
    right: 5px;
  }

  .container {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .right_menu {
    width: 100%;
    padding-right: 50px;
  }
</style>
