<script></script>

<header>
  <div class="header">
    <img src="./images/VaroLogo.png" alt="Logo" />
    <div class="right_side">
      <img src="./images/user.png" alt="user" class="user_image" />
      <p>Logged in user</p>
    </div>
  </div>
  <div class="backvideo">
    <img src="./images/photo.jpg" class="photos" />
    <div class="logo-container">
      <h1 id="page-logo">사이버 보안의 미래를 선도하다</h1>
      <p id="page-logo">Empowering the Future of Cybersecurity</p>
    </div>
  </div>
</header>

<style>
  /* Base styles */
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  /* Logo container */
  .logo-container {
    position: absolute;
    top: 50%;
    left: 70%;
    transform: translate(-50%, -50%);
    font-size: 2.5rem;
    white-space: nowrap;
    overflow: hidden;
    width: 80%; /* Adjusts width based on screen size */
    max-width: 600px;
  }

  /* Line animation using ::before */
  .logo-container::before {
    content: "";
    position: absolute;
    top: calc(100% - 2px);
    width: 100%;
    height: 4px;
    background-color: #cf0000;
    transform-origin: center center;
    transform: scaleX(0);
    animation: line-animation 3s ease infinite alternate;
  }

  /* Logo text animation */
  h1#page-logo {
    font:
      bold 2.5rem "Arial",
      sans-serif;
    animation: clip-path-reveal-1 3s ease infinite alternate;
    color: #fff;
    text-align: center;
  }
  p#page-logo {
    font:
      italic 1.5rem "Arial",
      sans-serif;
    animation: clip-path-reveal-1 3s ease infinite alternate;
    color: #fff;
    text-align: center;
  }

  /* Keyframes for line animation */
  @keyframes line-animation {
    0% {
      transform: scaleX(0);
    }
    15% {
      transform: scaleX(0);
    }
    20%,
    25% {
      transform: scaleX(1);
      top: calc(100% - 2px);
    }
    50% {
      transform: scaleX(1);
      top: 0px;
    }
    70% {
      transform: scaleX(0.2);
      top: 0px;
    }
    80%,
    100% {
      transform: scaleX(0.2);
      top: 0px;
    }
  }

  /* Keyframes for text reveal */
  @keyframes clip-path-reveal-1 {
    0%,
    25% {
      clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0% 100%);
    }
    50% {
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
    }
  }
  .photos {
    width: 100%;
    height: auto; /* Make the image responsive */
    max-height: 500px;
  }

  .header {
    z-index: 10; /* Ensure it is above other elements */
    background: #ffffff;
    display: flex;
    flex-direction: row;
    height: 80px;
    width: 100%;
    justify-content: space-around;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
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

  /* Responsive adjustments */
  @media (max-width: 768px) {
    h1#page-logo {
      font-size: 2rem; /* Adjust font size for smaller screens */
    }
    .logo-container {
      width: 90%; /* Increase width for smaller screens */
    }
  }

  @media (max-width: 480px) {
    h1#page-logo {
      font-size: 1.5rem; /* Further reduce font size for mobile screens */
    }
    .logo-container {
      width: 100%; /* Full width on very small screens */
    }
    .photos {
      max-height: 400px; /* Reduce the maximum height of the background image */
    }
  }
</style>
