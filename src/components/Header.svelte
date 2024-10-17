<script>
  import { Link } from "svelte-routing";
  // import { authToken } from "../stores/authToken";
  import { navigate } from "svelte-routing";
  import { userData } from "../stores/user.store";
  import { toggleNav } from "../../public/assets/js/common.js";
  import { toggleMenu } from "../../public/assets/js/common.js";

  export let activeMenu = "점검관리";

  // const handleLogout = () => {
  //   authToken.set(null); // Clear the token, effectively logging the user out
  //   navigate("/login"); // Redirect to login
  // };
</script>

<!-- <main>
  <div class="header2">
    <div class="logo_img">
      <img src="./images/anime.gif" alt="gif" />
      <h3>Varo</h3>
    </div>

    <div class="right_side">
      <img src="./images/user.png" alt="user" class="user_image" />
      {#if $userData?.userInfo}
        <p>{$userData?.userInfo?.user_name}</p>
      {:else}
        <Link to="/login" on:click={() => (activeMenu = "login")}>
          <p>Login</p>
        </Link>
      {/if}
    </div>
  </div>
</main> -->

<header class="headerWrap on">
  <h1 class="logoWrap">
    <Link to="/page1" on:click={() => (activeMenu = "점검관리")}>
      <a href="./index.html"><img src="/assets/images/logo.png" /></a>
    </Link>
  </h1>
  <button type="button" class="menuIsOpenBtn" on:click={toggleNav}
    ><img src="./assets/images/icon/arrow_side.svg" /></button
  >
  <nav class="menuWrap">
    <ul>
      <li class={`menu ${activeMenu === "점검관리" ? "active" : ""}`}>
        <Link to="/page1" on:click={() => (activeMenu = "점검관리")}>
          <a href="./index.html" class="menuItme">
            <div class="iconMenu stroke">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.4035 21.3699L17.3757 19.3835"
                  stroke="#0067FF"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M6.62425 19.3835L4.59644 21.3699"
                  stroke="#0067FF"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M1 13.4055H3.86955"
                  stroke="#0067FF"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M19.7766 5.78772L17.7488 7.77415"
                  stroke="#0067FF"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 2.63007V5.44105"
                  stroke="#0067FF"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M6.2512 7.77415L4.22339 5.78772"
                  stroke="#0067FF"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M22.9999 13.4055H20.1304"
                  stroke="#0067FF"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M13.3247 12.8667C13.626 13.5835 13.2817 14.4081 12.5499 14.7032C11.8182 14.9984 10.9765 14.6611 10.6752 13.9443C10.3739 13.2275 10.7182 12.4029 11.4499 12.1078C12.1817 11.8126 13.0234 12.1499 13.3247 12.8667Z"
                  stroke="#0067FF"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.45 12.1078L9.62305 7.77884"
                  stroke="#0067FF"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.5965 21.37C2.38695 19.4023 1 16.5632 1 13.4055C1 7.45559 5.92606 2.63007 11.9999 2.63007C18.0738 2.63007 22.9999 7.45559 22.9999 13.4055C22.9999 16.5632 21.6129 19.4023 19.4034 21.37"
                  stroke="#0067FF"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span>점검관리</span>
          </a>
        </Link>
      </li>
      <li class={`menu ${activeMenu === "자산관리" ? "active" : ""}`}>
        <Link to="/page2" on:click={() => (activeMenu = "자산관리")}>
          <a href="./asset.html" class="menuItme">
            <div class="iconMenu stroke">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.0479 17.4246H1.95224C1.4264 17.4246 1.00012 17.8515 1.00012 18.3781V19.279C1.00012 19.8056 1.4264 20.2325 1.95224 20.2325H22.0479C22.5737 20.2325 23 19.8056 23 19.279V18.3781C23 17.8515 22.5737 17.4246 22.0479 17.4246Z"
                  stroke="#9197B3"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M2.95989 3.89198H21.0396C21.3895 3.89198 21.6733 4.17623 21.6733 4.5266V17.424H2.32617V4.5266C2.32617 4.17623 2.61002 3.89198 2.95989 3.89198Z"
                  stroke="#9197B3"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M18.4243 12.5615C18.8914 13.3945 19.158 14.356 19.158 15.3793"
                  stroke="#9197B3"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.65125 15.3793C7.65125 12.1976 10.2268 9.61772 13.4047 9.61772C13.8021 9.61772 14.1896 9.65789 14.5641 9.73451"
                  stroke="#9197B3"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15.4952 8.62593C17.1718 8.98248 18.6367 10.0836 19.445 11.5419"
                  stroke="#9197B3"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15.4953 8.62656L14.5642 13.9704L19.4451 11.5419"
                  stroke="#9197B3"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.74683 7.94312V9.13387"
                  stroke="#9197B3"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M6.7887 6.31673V9.13387"
                  stroke="#9197B3"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.82996 7.06071V9.13387"
                  stroke="#9197B3"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M13.4616 17.8547H10.5386"
                  stroke="#9197B3"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span>자산관리</span>
          </a>
        </Link>
      </li>
      <li
        class={`menu ${activeMenu === "취약점관리" ? "active" : ""}`}
        on:click={(e) => toggleMenu(e)}
      >
        <Link to="/page3" on:click={() => (activeMenu = "취약점관리")}>
          <div class="menuItme toggleMenu">
            <div class="iconMenu stroke">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.7186 1.65258C7.04074 1.65258 2.43716 6.25555 2.43716 11.934C2.43716 13.7832 2.92522 15.5176 3.77979 17.017C3.81558 18.6015 2.38841 20.9443 1.00073 21.9353L1.06367 22.2154C1.06367 22.2154 4.97311 22.9336 7.91815 21.0276C9.35087 21.786 10.9847 22.2154 12.7186 22.2154C18.3964 22.2154 23 17.6124 23 11.934C23 6.25555 18.3964 1.65258 12.7186 1.65258Z"
                  stroke="#0067FF"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M18.5945 11.3774V16.9535"
                  stroke="#0067FF"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5.89429 13.9806L10.4966 9.37829L13.4182 12.2993L18.5944 7.1237"
                  stroke="#0067FF"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15.637 13.6351V19.1106"
                  stroke="#0067FF"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.6803 15.0203V19.7091"
                  stroke="#0067FF"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.72351 13.4266V19.1105"
                  stroke="#0067FF"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M6.76672 15.8354V17.5575"
                  stroke="#0067FF"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span class="iconToggle iconMenu stroke">
              취약점관리
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="#0067FF"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </div>
          <ul class="submenu">
            <li><a href="./vulnerability.html">- 조치계획관리</a></li>
            <li><a href="./vulnerability_result.html">- 조치결과관리</a></li>
          </ul>
        </Link>
      </li>
      <li class={`menu ${activeMenu === "점검항목관리" ? "active" : ""}`}>
        <Link to="/page4" on:click={() => (activeMenu = "점검항목관리")}>
          <a href="./inspection_items.html" class="menuItme">
            <div class="iconMenu stroke">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_89_486)">
                  <path
                    d="M11.6707 22.1035C17.4326 22.1035 22.1035 17.4325 22.1035 11.6706C22.1035 5.90871 17.4326 1.23775 11.6707 1.23775C5.90875 1.23775 1.23779 5.90871 1.23779 11.6706C1.23779 17.4325 5.90875 22.1035 11.6707 22.1035Z"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M19.0463 19.0462L22.7623 22.7622"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6.86267 10.9513V14.0719"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11.6707 8.13065V14.142"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16.4772 9.54031V14.1062"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_89_486">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <span>점검항목관리</span>
          </a>
        </Link>
      </li>
      <li
        class={`menu dashboard ${activeMenu === "대시보드" ? "active" : ""} `}
      >
        <Link to="/page5" on:click={() => (activeMenu = "대시보드")}>
          <a href="./dashboard.html" class="menuItme">
            <div class="iconMenu stroke">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_89_466)">
                  <path
                    d="M4.7201 15.7855H1.85828"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M23.4233 15.7855H16.2085"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    opacity="0.2"
                    d="M9.0545 11.2474H1.85828"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M23.4232 11.2474H20.7408"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    opacity="0.2"
                    d="M18.4749 6.70921H1.85828"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    opacity="0.2"
                    d="M23.4232 2.17104H1.85828"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8.21448 11.974V0.576721"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8.21448 22.1417V18.4282"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12.7526 9.24422V0.576721"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12.7526 22.1417V16.3001"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M17.2908 7.80754V0.576721"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M17.2908 22.1417V14.5027"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M21.829 3.45329V0.576721"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M21.829 22.1417V9.96001"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6.22986 17.1421L11.767 11.6049L14.4309 14.2681L23.4232 5.27573"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3.67688 23.4233V0.576721"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    opacity="0.2"
                    d="M23.4233 20.3231H0.576782"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_89_466">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <span>대시보드</span>
          </a>
        </Link>
      </li>
      <li class={`menu setting ${activeMenu === "환경설정" ? "active" : ""}`}>
        <Link to="/page6" on:click={() => (activeMenu = "환경설정")}>
          <a href="#" class="menuItme">
            <div class="iconMenu stroke">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_89_509)">
                  <path
                    d="M8.8562 22.5467C7.03688 22.0034 5.38918 20.9984 4.0734 19.6295C4.49672 19.1274 4.76061 18.5104 4.8313 17.8575C4.90198 17.2046 4.77625 16.5455 4.4702 15.9644C4.16414 15.3834 3.69167 14.9068 3.11326 14.5958C2.53485 14.2848 1.87679 14.1535 1.22331 14.2186C1.07409 13.4894 0.999277 12.7469 1.00001 12.0026C1.00001 10.8531 1.17601 9.74434 1.5038 8.70264H1.55C2.11087 8.70282 2.66253 8.56005 3.15289 8.28781C3.64325 8.01556 4.05613 7.62283 4.35254 7.14669C4.64896 6.67055 4.81913 6.12672 4.84699 5.56655C4.87485 5.00637 4.75947 4.44834 4.51175 3.94515C5.80169 2.74496 7.36105 1.87219 9.0586 1.4003C9.33491 1.94282 9.75591 2.39833 10.275 2.71642C10.7942 3.03452 11.3912 3.2028 12 3.20265C12.6088 3.2028 13.2058 3.03452 13.725 2.71642C14.2441 2.39833 14.6651 1.94282 14.9414 1.4003C16.6389 1.87219 18.1983 2.74496 19.4882 3.94515C19.2387 4.45187 19.1234 5.01415 19.1534 5.57818C19.1834 6.14221 19.3577 6.6891 19.6595 7.16651C19.9613 7.64392 20.3807 8.03586 20.8774 8.30482C21.374 8.57378 21.9314 8.71076 22.4962 8.70264C22.831 9.77061 23.0009 10.8834 23 12.0026C23 12.7616 22.923 13.503 22.7767 14.2191C22.1232 14.154 21.4651 14.2854 20.8867 14.5964C20.3083 14.9074 19.8359 15.3839 19.5298 15.965C19.2237 16.546 19.098 17.2052 19.1687 17.8581C19.2394 18.511 19.5033 19.128 19.9266 19.63C18.6108 20.9987 16.9631 22.0035 15.1438 22.5467C14.9301 21.8808 14.5106 21.2999 13.9456 20.8878C13.3806 20.4758 12.6993 20.2537 12 20.2537C11.3007 20.2537 10.6194 20.4758 10.0544 20.8878C9.48941 21.2999 9.06985 21.8808 8.8562 22.5467Z"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 15.8526C12.5056 15.8526 13.0062 15.7531 13.4734 15.5596C13.9405 15.3661 14.3649 15.0825 14.7224 14.725C15.0799 14.3675 15.3635 13.9431 15.557 13.476C15.7504 13.0089 15.85 12.5082 15.85 12.0026C15.85 11.4971 15.7504 10.9964 15.557 10.5293C15.3635 10.0622 15.0799 9.63779 14.7224 9.28029C14.3649 8.92278 13.9405 8.63919 13.4734 8.44571C13.0062 8.25223 12.5056 8.15265 12 8.15265C10.9789 8.15265 9.99968 8.55827 9.27766 9.28029C8.55565 10.0023 8.15002 10.9816 8.15002 12.0026C8.15002 13.0237 8.55565 14.003 9.27766 14.725C9.99968 15.447 10.9789 15.8526 12 15.8526Z"
                    stroke="#9197B3"
                    stroke-width="1.3"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_89_509">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <span>환경설정</span>
          </a>
        </Link>
      </li>
    </ul>
  </nav>
</header>
