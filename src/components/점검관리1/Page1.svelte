<script>
  import RightContainer from "./RightContainer.svelte";

  let currentPage = null;
  let activeMenu = null;

  const selectPage = (page, menu) => {
    currentPage = page;
    activeMenu = menu;
  };
</script>

<div div class="container">
  <div>
    <div class="container_aside">
      <aside>
        <div class="add_delete_container">
          <div>New Inspection</div>
          <div>Delete history</div>
        </div>

        <a
          href="javascript:void(0)"
          on:click="{() => selectPage(RightContainer, '프로젝트1')}"
          class="{activeMenu === '프로젝트1' ? 'active' : ''}"
        >
          <i class="fa fa-user-o" aria-hidden="true"></i>
          프로젝트 1
        </a>
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a
          href="javascript:void(0)"
          on:click="{() => selectPage(Page2, '자산관리')}"
          class="{activeMenu === '자산관리' ? 'active' : ''}"
        >
          <i class="fa fa-laptop" aria-hidden="true"></i>
          프로젝트 1
        </a>
        <a
          href="javascript:void(0)"
          on:click="{() => selectPage(Page3, '취약점관리')}"
          class="{activeMenu === '취약점관리' ? 'active' : ''}"
        >
          <i class="fa fa-clone" aria-hidden="true"></i>
          프로젝트 1
        </a>
        <a
          href="javascript:void(0)"
          on:click="{() => selectPage(Page2, '점검항목관리')}"
          class="{activeMenu === '점검항목관리' ? 'active' : ''}"
        >
          <i class="fa fa-star-o" aria-hidden="true"></i>
          프로젝트 1
        </a>
        <a
          href="javascript:void(0)"
          on:click="{() => selectPage(Page2, '환경설정')}"
          class="{activeMenu === '환경설정' ? 'active' : ''}"
        >
          <i class="fa fa-trash-o" aria-hidden="true"></i>
          프로젝트 1
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
  </div>

  {#if currentPage}
    <div class="right_menu">
      <svelte:component this="{currentPage}" />
    </div>
  {/if}
</div>

<style>
  .container_aside {
    padding-left: 10px;
  }
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 40px;
    width: 100%;
  }
  aside {
    color: #fff;
    width: 120px;
    padding-left: 5px;
    padding-right: 5px;
    height: 100vh;
    background-image: linear-gradient(30deg, #0048bd, #44a7fd);

    border: 1px solid black;
  }
  .add_delete_container {
    padding-bottom: 10px;
  }
  aside a {
    font-size: 12px;
    color: #fff;
    display: block;
    padding: 12px 10px;
    font-weight: 600;
    -webkit-tap-highlight-color: transparent;
  }

  aside a:hover {
    margin-top: 3px;
    text-decoration: underline;
  }
  aside a:hover,
  aside a.active {
    text-decoration: underline;
    margin-top: 3px;
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
    /* border-bottom-right-radius: 18px; */
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
    /* border-top-right-radius: 18px; */
    box-shadow: 0 -20px 0 0 #fff;
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
