<script>
  import "../public/assets/css/reset.css";
  import "../public/assets/css/common.css";
  import "../public/assets/css/login.css";

  import { Router, Route, navigate } from "svelte-routing";
  import { beforeUpdate, onDestroy, onMount } from "svelte";
  import Header from "./components/Header.svelte";
  import Login from "./components/login/Login.svelte";
  import { checkAuth, userData } from "./stores/user.store";
  import LeftNavbar from "./components/LeftNavbar.svelte";
  import Page1 from "./components/점검관리1/Page1.svelte";
  import Page2 from "./components/자산관리2/Page2.svelte";
  import Page3 from "./components/취약점관리3/Page3.svelte";
  import Page4 from "./components/점검항목관리4/Page4.svelte";
  import Page5 from "./components/대시보드5/Page5.svelte";
  import Page6 from "./components/환경설정6/Page6.svelte";
  import {
    decryptData,
    getUserAllMessages,
  } from "./services/login/loginService";
  import { logout } from "./services/page1/authService";
  import Page7 from "./components/취약점추적7/Page7.svelte";

  let openNotification = false;
  let activeMenu = "점검관리";
  let nofiticationData = [];
  let currentPath = "";
  let currentSearch = "";

  beforeUpdate(() => {
    if (
      currentPath !== window.location.pathname ||
      currentSearch !== window.location.search
    ) {
      currentPath = window.location.pathname;
      currentSearch = window.location.search;
      updateActiveMenu();
    }
  });

  // URL 변경 감지를 위한 interval 설정
  onMount(() => {
    const interval = setInterval(() => {
      if (
        currentPath !== window.location.pathname ||
        currentSearch !== window.location.search
      ) {
        currentPath = window.location.pathname;
        currentSearch = window.location.search;
        updateActiveMenu();
      }
    }, 100);

    return () => clearInterval(interval);
  });

  const updateActiveMenu = () => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get("tab");

    if (path === "/page6" || tab) {
      activeMenu = "환경설정";
    } else {
      switch (path) {
        case "/page2":
          activeMenu = "자산관리";
          break;
        case "/page3":
          activeMenu = "취약점관리";
          break;
        case "/page4":
          activeMenu = "점검항목관리";
          break;
        case "/page5":
          activeMenu = "대시보드";
          break;
        case "/page7":
          activeMenu = "취약점추적";
          break;
        default:
          activeMenu = "점검관리";
      }
    }
  };

  $: {
    updateActiveMenu();
  }

  onMount(() => {
    const path = new URLSearchParams(window.location.search).get("path");
    const tab = new URLSearchParams(window.location.search).get("tab");

    // Initial menu selection
    if (tab) {
      activeMenu = "환경설정";
    } else if (path === "page1") {
      activeMenu = "점검관리";
    }
  });

  onMount(async () => {
    checkAuth();
    if (!$userData.isLoggedIn) {
      navigate("/login");
    }
  });

  function daysAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 7) {
      return `${diffInDays}일`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks}주`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months}개월`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `${years}년`;
    }
  }

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("userInfo");
    document.cookie =
      "sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    userData.set({
      isLoggedIn: false,
      userInfo: null,
    });
    navigate("/login"); // Redirect to login
  };

  const getNotify = async () => {
    try {
      nofiticationData = await getUserAllMessages();
    } catch (error) {}
  };

  $: {
    if ($userData.isLoggedIn) {
      getNotify();
    }
  }
</script>

<Router>
  {#if $userData.isLoggedIn}
    <body>
      <div id="wrap">
        <Header bind:activeMenu />
        <div class="container">
          <nav class="titleWrap">
            <h1>{activeMenu}</h1>
            {#if $userData?.userInfo}
              <section>
                <div class="alarmWrap">
                  <button type="button" class="alarm on notification">
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <img src="./assets/images/icon/alarm.svg" />
                  </button>
                  <div class="tooltip-modal">
                    <h3 class="title">알림</h3>
                    <section
                      class="content"
                      style="height: 290px;overflow: auto;"
                    >
                      {#each nofiticationData as data}
                        <div>
                          <!-- svelte-ignore a11y-invalid-attribute -->
                          <a href="javascript:void(0);">
                            <div class="title">
                              {data?.am_message}
                            </div>
                            <div class="day">{daysAgo(data.am_cdate)}</div>
                          </a>
                        </div>
                      {/each}
                    </section>
                  </div>
                </div>
                <article class="user-box-menu">
                  <!-- svelte-ignore a11y-missing-attribute -->
                  <img src="./assets/images/icon/person.svg" />
                  <div class="user" style="min-width: 60px;font-size: 16px;">
                    <span style="font-size: 16px;"
                      >{decryptData($userData?.userInfo?.user_name)}
                    </span>님
                  </div>
                  <div class="logout-menu">
                    <button on:click={handleLogout} class="logout-button">
                      로그아웃
                    </button>
                  </div>
                </article>
              </section>
            {/if}
          </nav>

          <Route path="/" component={Page1} />
          <Route path="/page1" component={Page1} />
          <Route path="/page2" component={Page2} />
          <Route path="/page3" component={Page3} />
          <Route path="/page4" component={Page4} />
          <Route path="/page5" component={Page5} />
          <Route path="/page6" component={Page6} />
          <Route path="/page7" component={Page7} />
        </div>
      </div>
    </body>
  {:else}
    <Route path="/login" component={Login} />
  {/if}
</Router>

<style>
  .tooltip-modal {
    display: none;
  }
  .alarmWrap:hover .tooltip-modal {
    display: block;
  }

  .user-box-menu {
    cursor: pointer;
    position: relative;
  }

  .user-box-menu {
    position: relative;
    display: inline-block; /* Allows hover effect */
  }

  .logout-menu {
    cursor: pointer;
    display: none; /* Hidden by default */
    /* margin-top: 5px; */
    position: absolute;
    right: 0;
    top: 100%; /* Position it below the user box */
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 100;
    /* padding: 10px; */
    border-radius: 5px;
  }

  .user-box-menu:hover .logout-menu {
    display: block; /* Show on hover */
  }

  .logout-button {
    font-size: 16px;
    cursor: pointer;
    background-color: white; /* Logout button color */
    color: #9197b3; /* Button text color */
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    transition: background-color 0.3s;
  }

  .logout-button:hover {
    background-color: #0067ff; /* Darker color on hover */
    color: white;
  }
</style>
