<script>
  import Page1 from "./점검관리1/Page1.svelte";
  import Page2 from "./자산관리2/Page2.svelte";
  import Page3 from "./취약점관리3/Page3.svelte";

  let currentPage = null;
  let activeMenu = null;
  let isSidebarOpen = false;

  const selectPage = (page, menu) => {
    currentPage = page;
    activeMenu = menu;
    toggleSidebar(); // Close the sidebar after selecting a page
  };

  const togglePage = (page, menu) => {
    if (currentPage === page) {
      // If the same page is selected again, hide the page (toggle off)
      currentPage = null;
      activeMenu = null;
    } else {
      // Otherwise, navigate to the selected page
      currentPage = page;
      activeMenu = menu;
    }
    toggleSidebar(); // Close the sidebar after toggling the page
  };

  const toggleSidebar = () => {
    isSidebarOpen = !isSidebarOpen;
  };
</script>

<div class="container">
  <!-- Sidebar toggle button -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="toggle" on:click="{toggleSidebar}">
    <span class="top_line common"></span>
    <span class="middle_line common"></span>
    <span class="bottom_line common"></span>
  </div>

  <!-- Sidebar -->
  <div class="container_aside {isSidebarOpen ? 'open' : ''}">
    <aside>
      <p></p>
      <!-- Navigation links -->
      <a
        href="javascript:void(0)"
        on:click="{() => togglePage(Page1, '점검관리')}"
        class="{activeMenu === '점검관리' ? 'active' : ''}"
      >
        <i class="fa fa-user-o" aria-hidden="true"></i>
        점검관리
      </a>
      <a
        href="javascript:void(0)"
        on:click="{() => togglePage(Page2, '자산관리')}"
        class="{activeMenu === '자산관리' ? 'active' : ''}"
      >
        <i class="fa fa-laptop" aria-hidden="true"></i>
        자산관리
      </a>
      <a
        href="javascript:void(0)"
        on:click="{() => togglePage(Page3, '취약점관리')}"
        class="{activeMenu === '취약점관리' ? 'active' : ''}"
      >
        <i class="fa fa-clone" aria-hidden="true"></i>
        취약점관리
      </a>
      <a
        href="javascript:void(0)"
        on:click="{() => togglePage(Page2, '점검항목관리')}"
        class="{activeMenu === '점검항목관리' ? 'active' : ''}"
      >
        <i class="fa fa-star-o" aria-hidden="true"></i>
        점검항목관리
      </a>
      <a
        href="javascript:void(0)"
        on:click="{() => togglePage(Page2, '환경설정')}"
        class="{activeMenu === '환경설정' ? 'active' : ''}"
      >
        <i class="fa fa-trash-o" aria-hidden="true"></i>
        환경설정
      </a>
    </aside>

    <!-- Social links -->
    <div class="social">
      <a
        href="https://www.linkedin.com/in/florin-cornea-b5118057/"
        target="_blank"
      >
        <i class="fa fa-linkedin"></i>
      </a>
    </div>
  </div>

  <!-- Main content area -->
  {#if currentPage}
    <div class="right_menu">
      <svelte:component this="{currentPage}" />
    </div>
  {/if}
</div>

<style>
  /* Sidebar styles */
  aside {
    color: #f2f3f4;
    width: 180px;
    padding-left: 20px;
    height: 100vh;
    font-size: 16px;
    font-weight: bold;
    background-color: #2c3e50;
    border: 1px black;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }

  aside a {
    font-size: 16px;
    color: #fff;
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

  .social {
    height: 0;
  }

  .social i:before {
    width: 14px;
    height: 14px;
    font-size: 14px;
    color: #fff;
    background: #2c3e50;
    padding: 10px;
    border-radius: 50%;
    top: 5px;
    right: 5px;
  }

  .container_aside {
    position: fixed;
    top: 0px;
    left: 0;
    width: 160px;
    height: 100vh;
    background-color: #2c3e50;
    transform: translateX(-180px);
    transition: transform 0.3s ease;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  }

  .container_aside.open {
    transform: translateX(0);
  }

  .container {
    display: flex;
    width: 100%;
    padding: 50px;
    align-items: center;
    flex-direction: row;
    width: calc(100% - 160px);
  }

  .right_menu {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: row;
    margin-top: 10px;
  }

  /* Toggle button styles */
  .toggle {
    position: fixed;
    top: 20px;
    left: 15px;
    height: 30px;
    width: 30px;
    z-index: 1000;
    background-color: #fff;
    cursor: pointer;
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }

  .toggle .common {
    position: absolute;
    height: 2px;
    width: 20px;
    background-color: #2c3e50;
    border-radius: 50px;
    transition: 0.3s ease;
  }

  .toggle .top_line {
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .toggle .middle_line {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .toggle .bottom_line {
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .container_aside.open .toggle .top_line {
    left: 2px;
    top: 14px;
    width: 25px;
    transform: rotate(45deg);
  }

  .container_aside.open .toggle .bottom_line {
    left: 2px;
    top: 14px;
    width: 25px;
    transform: rotate(-45deg);
  }

  .container_aside.open .toggle .middle_line {
    opacity: 0;
    transform: translateX(20px);
  }
</style>
