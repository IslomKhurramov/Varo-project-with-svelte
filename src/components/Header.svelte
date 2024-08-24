<script></script>

<header>
  <img src="./images/VaroLogo.png" alt="Logo" />
  <div class="right_side">
    <img src="./images/user.png" alt="user" class="user_image" />
    <p>Logged in user</p>
  </div>
</header>

<style>
  header {
    display: flex;
    flex-direction: row;
    height: 120px;
    background-color: #fff;
    width: 100%;
    justify-content: space-around;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    position: fixed;
    z-index: 1000;
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
</style>
