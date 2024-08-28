<script>
  import { Link } from "svelte-routing";

  export let activeMenu = "";
</script>

<header>
  <div class="header">
    <img src="./images/VaroLogo.png" alt="Logo" />
    <div class="middle_side">
      <Link
        to="/page1"
        on:click="{() => (activeMenu = '점검관리')}"
        class="{activeMenu === '점검관리' ? 'active' : ''}"
      >
        <p>점검관리</p>
      </Link>
      <Link
        to="/page2"
        on:click="{() => (activeMenu = '자산관리')}"
        class="{activeMenu === '자산관리' ? 'active' : ''}"
      >
        <p>자산관리</p>
      </Link>
      <Link
        to="/page3"
        on:click="{() => (activeMenu = '취약점관리')}"
        class="{activeMenu === '취약점관리' ? 'active' : ''}"
      >
        <p>취약점관리</p>
      </Link>
      <Link
        to="/page4"
        on:click="{() => (activeMenu = '점검항목관리')}"
        class="{activeMenu === '점검항목관리' ? 'active' : ''}"
      >
        <p>점검항목관리</p>
      </Link>
      <Link
        to="/page5"
        on:click="{() => (activeMenu = '환경설정')}"
        class="{activeMenu === '환경설정' ? 'active' : ''}"
      >
        <p>환경설정</p>
      </Link>
    </div>
    <div class="right_side">
      <img src="./images/user.png" alt="user" class="user_image" />
      <p>Logged in user</p>
    </div>
  </div>
</header>

<style>
  .header {
    z-index: 10;
    background: #f2f3f4;
    display: flex;
    flex-direction: row;
    height: 80px;
    width: 100%;
    justify-content: space-around;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 0;
    left: 0;
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
  }
  .middle_side {
    display: flex;
    align-items: center;
    gap: 60px;
    color: black;
  }
  .middle_side p {
    color: black;
    font-weight: bold;
  }
  .middle_side p {
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
</style>
