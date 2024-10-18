<script>
  import "../public/assets/css/reset.css";
  import "../public/assets/css/common.css";
  import "../public/assets/css/login.css";

  import { Router, Route, navigate } from "svelte-routing";
  import { onMount } from "svelte";
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

  console.log("$userData:", $userData);

  let openNotificaiton = false;
  let activeMenu = "점검관리";

  $: {
    switch (window.location.pathname) {
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
      case "/page6":
        activeMenu = "환경설정";
        break;
      default:
        activeMenu = "점검관리";
    }
  }

  onMount(() => {
    checkAuth();

    console.log("$userData:", $userData);

    // if ($userData.isLoggedIn) {
    //   console.log("User is logged in:", $userData);
    //   navigate("/");
    // } else {
    //   console.log("User is not logged in.");
    //   navigate("/login");
    // }
  });

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    userData.set({
      isLoggedIn: false,
      userInfo: null,
    });
    navigate("/login"); // Redirect to login
  };
</script>

<Router>
  <!-- {#if $userData.isLoggedIn} -->
  <body>
    <div id="wrap">
      <Header bind:activeMenu />
      <div class="container">
        <nav class="titleWrap">
          <h1>{activeMenu}</h1>
          {#if $userData?.userInfo}
            <section>
              <div class="alarmWrap">
                <button
                  type="button"
                  class="alarm on"
                  on:click={() => {
                    openNotificaiton = !openNotificaiton;
                  }}><img src="./assets/images/icon/alarm.svg" /></button
                >
                <div
                  class="tooltip-modal"
                  style={`display: ${openNotificaiton ? "block" : "none"};`}
                >
                  <h3 class="title">알림</h3>
                  <section class="content">
                    <div>
                      <a href="javascript:void(0);">
                        <div class="title">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry.
                        </div>
                        <div class="day">1일</div>
                      </a>
                    </div>
                    <div>
                      <a href="javascript:void(0);">
                        <div class="title">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry.
                        </div>
                        <div class="day">4일</div>
                      </a>
                    </div>
                    <div>
                      <a href="javascript:void(0);">
                        <div class="title">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry.
                        </div>
                        <div class="day">5주</div>
                      </a>
                    </div>
                    <div>
                      <a href="javascript:void(0);">
                        <div class="title">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry.
                        </div>
                        <div class="day">12주</div>
                      </a>
                    </div>
                    <div>
                      <a href="javascript:void(0);">
                        <div class="title">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry.
                        </div>
                        <div class="day">60주</div>
                      </a>
                    </div>
                  </section>
                </div>
              </div>
              <article>
                <img src="./assets/images/icon/person.svg" />
                <div class="user">
                  <span>{$userData?.userInfo?.user_name}</span>님
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
      </div>
    </div>
  </body>

  <!-- {:else} -->
  <Route path="/login" component={Login} />
  <!-- {/if} -->
</Router>
