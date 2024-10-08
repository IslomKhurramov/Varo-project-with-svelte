<script>
  import { Link } from "svelte-routing";
  // import { authToken } from "../stores/authToken";
  import { navigate } from "svelte-routing";
  import { userData } from "../stores/user.store";

  export let activeMenu = "";

  // const handleLogout = () => {
  //   authToken.set(null); // Clear the token, effectively logging the user out
  //   navigate("/login"); // Redirect to login
  // };
</script>

<main>
  <div class="header2">
    <div class="logo_img">
      <img src="./images/anime.gif" alt="gif" />
      <h3>Varo</h3>
    </div>
    <div class="middle_side">
      <Link
        to="/page1"
        on:click={() => (activeMenu = "점검관리")}
        class={activeMenu === "점검관리" ? "active" : ""}
      >
        <p>점검관리</p>
      </Link>
      <Link
        to="/page2"
        on:click={() => (activeMenu = "자산관리")}
        class={activeMenu === "자산관리" ? "active" : ""}
      >
        <p>자산관리</p>
      </Link>
      <Link
        to="/page3"
        on:click={() => (activeMenu = "취약점관리")}
        class={activeMenu === "취약점관리" ? "active" : ""}
      >
        <p>취약점관리</p>
      </Link>
      <Link
        to="/page4"
        on:click={() => (activeMenu = "점검항목관리")}
        class={activeMenu === "점검항목관리" ? "active" : ""}
      >
        <p>점검항목관리</p>
      </Link>
      <Link
        to="/page5"
        on:click={() => (activeMenu = "대시보드")}
        class={activeMenu === "대시보드" ? "active" : ""}
      >
        <p>대시보드</p>
      </Link>
      <Link
        to="/page6"
        on:click={() => (activeMenu = "환경설정")}
        class={activeMenu === "환경설정" ? "active" : ""}
      >
        <p>환경설정</p>
      </Link>
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
</main>

<style>
  /****************************/
  /****************************/
  main {
    width: 100%;
  }
  .header2 {
    display: flex;
    flex-direction: row;
    height: 60px;
    width: 100%;
    justify-content: space-between;
    background-color: #f7f9fb; /* Add a background color */
    box-shadow:
      rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
      rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
    border-right: 1px solid #e0e0e0;
    position: relative;
    border: 10px;
  }

  img {
    width: auto;
  }

  .user_image {
    width: 30px;
    height: 30px;
  }

  .right_side {
    display: flex;
    flex-direction: row;
    min-width: 150px;
    justify-content: space-around;
    align-items: center;
    margin-right: 10px;
  }

  .middle_side {
    display: flex;
    align-items: center;
    gap: 30px;
  }

  .middle_side p {
    font-size: 12px;
    font-weight: bold;
    background-image: linear-gradient(
      to right,
      #5486d6,
      #54b3d6 50%,
      #000000 50%
    );
    background-size: 200% 100%;
    background-position: -100%;
    display: inline-block;
    padding: 5px 0;
    position: relative;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 0.3s ease-in-out;
  }

  .middle_side p:before {
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

  .middle_side p:hover {
    background-position: 0;
  }

  .middle_side p:hover::before {
    width: 100%;
  }

  /* Logo and title styling */
  .logo_img {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    width: 150px;
    padding: 10px;
    background-color: #f7f9fb; /* Soft background color */
    border-radius: 8px; /* Smooth rounded corners */
    transition:
      box-shadow 0.3s ease,
      transform 0.3s ease;
    cursor: pointer;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05);
  }

  .logo_img img {
    width: 70px; /* Smaller logo for a more balanced look */
    height: auto;
    margin-right: 10px;
  }

  .logo_img h3 {
    font-size: 24px; /* Slightly larger text */
    font-weight: bold;
    color: #343a40; /* Blue accent for branding */
  }
</style>
