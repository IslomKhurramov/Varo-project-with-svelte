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
    width: 100%;
    justify-content: space-around;
    box-shadow: 5px 10px 18px #888888;
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
