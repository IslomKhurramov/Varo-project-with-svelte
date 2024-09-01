<script>
  import { Link } from "svelte-routing";

  export let activeMenu = "";
  let isScrolled = false;

  window.addEventListener("scroll", () => {
    isScrolled = window.scrollY >= 30;
  });
</script>

<header class:isScrolled>
  <div class="header">
    <div class="video-container">
      <video autoplay muted loop playsinline>
        <source src="./images/cyberback.mp4" type="video/mp4" />
      </video>
    </div>

    <!-- Animated Text Overlay -->
    <div class="text-overlay">
      <div class="words word-1">
        <span>W</span>
        <span>E</span>
        <span>L</span>
        <span>C</span>
        <span>O</span>
        <span>M</span>
        <span>E</span>
      </div>

      <div class="words word-2">
        <span>T</span>
        <span>O</span>
      </div>

      <div class="words word-3">
        <span>V</span>
        <span>A</span>
        <span>R</span>
        <span>O</span>
      </div>
    </div>

    <nav>
      <div class="header2">
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
    </nav>
  </div>
</header>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap");

  /* Global Styles */
  :global(*) {
    box-sizing: border-box;
  }

  header {
    width: 100%;
    height: 300px;
    background-color: #8a8b8c;
    color: #ffffff;
    position: fixed;
    top: 0;
    overflow: hidden;
    z-index: 10;
    transition: all 0.5s ease;
    box-shadow:
      rgba(0, 0, 0, 0.09) 0px 2px 1px,
      rgba(0, 0, 0, 0.09) 0px 4px 2px,
      rgba(0, 0, 0, 0.09) 0px 8px 4px,
      rgba(0, 0, 0, 0.09) 0px 16px 8px,
      rgba(0, 0, 0, 0.09) 0px 32px 16px;
  }

  .video-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 300px;
    overflow: hidden;
    z-index: -1; /* Ensures video is behind the content */
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.1; /* Adjust opacity as needed */
    transition: all 0.3s ease;
  }

  .text-overlay {
    position: absolute;
    display: flex;
    flex-direction: row;
    gap: 20px;
    top: 40%;
    left: 30%;
    transform: translate(-50%, -50%);
    text-align: center;
    z-index: 1;
    opacity: 0.3;
    pointer-events: none; /* Prevents interaction with the overlay */
    transition: all 0.5s ease;
  }

  .words {
    color: #8a8b8c;
    font-size: 0;
    line-height: 1.5;
    font-family: "Archivo Black", sans-serif;
  }

  .words span {
    font-size: 5rem;
    display: inline-block;
    animation: move 3s ease-in-out infinite;
  }

  @keyframes move {
    0% {
      transform: translate(-30%, 0);
    }
    50% {
      text-shadow: 0 25px 50px rgba(0, 0, 0, 0.75);
    }
    100% {
      transform: translate(30%, 0);
    }
  }

  .word-1 span:nth-child(2) {
    animation-delay: 0.3s; /* Shorter delay for smoother transition */
  }

  .word-1 span:nth-child(3) {
    animation-delay: 0.6s;
  }

  .word-1 span:nth-child(4) {
    animation-delay: 0.9s;
  }

  .word-1 span:nth-child(5) {
    animation-delay: 1.2s;
  }

  .word-1 span:nth-child(6) {
    animation-delay: 1.5s;
  }

  .word-1 span:nth-child(7) {
    animation-delay: 1.8s;
  }

  .word-2 span:nth-child(2) {
    animation-delay: 0.3s;
  }

  .word-3 span:nth-child(2) {
    animation-delay: 0.3s;
  }

  .word-3 span:nth-child(3) {
    animation-delay: 0.6s;
  }

  .word-3 span:nth-child(4) {
    animation-delay: 0.9s;
  }

  nav {
    position: absolute;
    bottom: 0;
    height: 80px;
    line-height: 80px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.1);
  }

  /* Sticky Header Styles */
  header.isScrolled {
    height: 60px;
    background-color: rgba(142, 150, 156, 0.9);
    color: #000;
  }

  header.isScrolled .video-container {
    opacity: 0;
    height: 0;
    transition:
      opacity 0.5s ease,
      height 0.5s ease;
  }

  header.isScrolled .text-overlay {
    opacity: 0;
    height: 0;
    pointer-events: none; /* Disable interaction when scrolled */
    transition:
      opacity 0.5s ease,
      height 0.5s ease;
  }

  /****************************/
  .header2 {
    z-index: 20; /* Ensure header2 is on top */
    display: flex;
    flex-direction: row;
    height: 80px;
    width: 100%;
    justify-content: space-around;
    transition:
      background 0.15s ease,
      border-color 0.15s ease;
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
  }

  .middle_side p {
    font-weight: bold;
    color: white; /* Default color */
    transition: color 0.3s ease;
  }

  header.isScrolled .middle_side p {
    background-image: linear-gradient(
      to right,
      #5486d6,
      #54b3d6 50%,
      #000000 50%
    );
  }

  .middle_side p {
    background-image: linear-gradient(
      to right,
      #5486d6,
      #54b3d6 50%,
      #ffffff 50%
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

  header.isScrolled .header2 {
    background: #ffffff; /* Darker background when scrolled */
    border-bottom: 2px solid #545b62; /* Darker border when scrolled */
    margin-top: 10px;
  }
</style>
