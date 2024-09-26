<script>
  import {
    getUserExist,
    setPasswordReset,
  } from "./../../services/login/loginService.js";
  import { login, register } from "../../services/page1/authService";
  import { navigate } from "svelte-routing";
  import { userData } from "../../stores/user.store";
  import { successAlert, errorAlert } from "../../shared/sweetAlert";

  //for LOGIN
  let containerActive = false;
  let tabMenu = "login";
  let email = "";
  let password = "";
  let errorMessage = "";

  let find_user = "";

  //for SignUp
  let username = "";
  let emailSignUp = "";
  let passwordSignUp = "";
  let confirmPasswordSignUp = "";
  let department = "";
  let errorMessageSignUp = "";
  let successMessageSignUp = "";

  //FUNCTION SighUp

  const handleRegister = async () => {
    try {
      console.log("username:", username);
      console.log("emailSignUp:", emailSignUp);
      console.log("passwordSignUp:", passwordSignUp);
      console.log("confirmPasswordSignUp:", confirmPasswordSignUp);
      console.log("department:", department);

      // if (!username || !emailSignUp || !passwordSignUp || !confirmPasswordSignUp || department) {
      //   throw new Error('Please fulfill all inputs!')
      // }

      if (passwordSignUp !== confirmPasswordSignUp) {
        throw new Error("Passwords don't match");
      }

      const response = await register(
        username,
        emailSignUp,
        passwordSignUp,
        department,
      );
      console.log("REGISTER:", response);

      successMessageSignUp = "Registration successful! Redirecting to login...";
      errorMessageSignUp = "";

      // Redirect to login page after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      errorMessageSignUp = err?.message;
      successMessageSignUp = "";
    }
  };

  // Handle login using session-based authentication
  const handleLogin = async () => {
    try {
      await login(email, password);

      userData.set({
        isLoggedIn: true,
        userInfo: "data",
      });

      navigate("/");
    } catch (err) {
      errorMessage = err?.message;
    }
  };

  const findUser = async () => {
    try {
      if (!find_user) throw new Error("이메일 입력하지 않았습니다");
      const result = await getUserExist(find_user);

      await successAlert(result);
      tabMenu = "login";
    } catch (err) {
      errorMessage = err?.message;
    } finally {
      find_user = "";
    }
  };

  const resetPassword = async () => {
    try {
      if (!find_user) throw new Error("이메일 입력하지 않았습니다");
      const result = await setPasswordReset(find_user);

      await successAlert(result);
      tabMenu = "login";
    } catch (err) {
      errorMessage = err?.message;
    } finally {
      find_user = "";
    }
  };

  const registerClick = () => {
    containerActive = true;
  };

  const loginClick = () => {
    containerActive = false;
  };

  $: {
    console.log(tabMenu);
  }
</script>

<div class="container {containerActive ? 'active' : ''}" id="container">
  <div class="form-container sign-up">
    <form on:submit|preventDefault={handleRegister}>
      <h1>Create Account</h1>
      <div class="social-icons">
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a href="#" class="icon"><i class="fa-brands fa-google-plus-g"></i></a>
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a href="#" class="icon"><i class="fa-brands fa-facebook-f"></i></a>
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a href="#" class="icon"><i class="fa-brands fa-github"></i></a>
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a href="#" class="icon"><i class="fa-brands fa-linkedin-in"></i></a>
      </div>
      <span>or use your email for registration</span>
      <input type="text" placeholder="Name" bind:value={username} required />
      <input
        type="email"
        placeholder="Email"
        bind:value={emailSignUp}
        required
      />
      <input
        type="password"
        placeholder="Password"
        bind:value={passwordSignUp}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        bind:value={confirmPasswordSignUp}
        required
      />
      <input
        type="department"
        placeholder="Department"
        bind:value={department}
        required
      />

      <button type="submit">Sign Up</button>
      {#if errorMessageSignUp}
        <p class="error">{errorMessageSignUp}</p>
      {/if}

      {#if successMessageSignUp}
        <p class="success">{successMessageSignUp}</p>
      {/if}
    </form>
  </div>

  <div class="form-container sign-in">
    {#if tabMenu === "find_user"}
      <form on:submit|preventDefault={findUser}>
        <h1>이메일을 입력해 주세요</h1>
        <input type="email" placeholder="Email" bind:value={find_user} />
        <div>
          <button
            on:click={() => {
              tabMenu = "login";
              find_user = "";
            }}>back</button
          >
          <button>send</button>
        </div>
        {#if errorMessage}
          <p class="error">{errorMessage}</p>
        {/if}
      </form>
    {:else if tabMenu === "reset_password"}
      <form on:submit|preventDefault={resetPassword}>
        <h1>이메일을 입력해 주세요</h1>
        <input type="email" placeholder="Email" bind:value={find_user} />
        <div>
          <button
            on:click={() => {
              tabMenu = "login";
              find_user = "";
            }}>back</button
          >
          <button>send</button>
        </div>
        {#if errorMessage}
          <p class="error">{errorMessage}</p>
        {/if}
      </form>
    {:else}
      <form on:submit|preventDefault={handleLogin}>
        <h1>Sign In</h1>
        <div class="social-icons">
          <!-- svelte-ignore a11y-invalid-attribute -->
          <a href="#" class="icon"><i class="fa-brands fa-google-plus-g"></i></a
          >
          <!-- svelte-ignore a11y-invalid-attribute -->
          <a href="#" class="icon"><i class="fa-brands fa-facebook-f"></i></a>
          <!-- svelte-ignore a11y-invalid-attribute -->
          <a href="#" class="icon"><i class="fa-brands fa-github"></i></a>
          <!-- svelte-ignore a11y-invalid-attribute -->
          <a href="#" class="icon"><i class="fa-brands fa-linkedin-in"></i></a>
        </div>
        <span>or use your email and password</span>
        <input type="email" placeholder="Email" bind:value={email} />
        <input type="password" placeholder="Password" bind:value={password} />
        <!-- svelte-ignore a11y-invalid-attribute -->
        <div>
          <a on:click={() => (tabMenu = "find_user")}>아이디찾기</a>
          <a on:click={() => (tabMenu = "reset_password")}>비밀번호초기화</a>
        </div>
        <button type="submit">Sign In</button>
        {#if errorMessage}
          <p class="error">{errorMessage}</p>
        {/if}
      </form>
    {/if}
  </div>

  <div class="toggle-container">
    <div class="toggle">
      <div class="toggle-panel toggle-left">
        <h1>Welcome Back!</h1>
        <p>Enter your personal details to use all of the site's features</p>
        <button class="hidden" on:click={loginClick}>Login</button>
      </div>
      <div class="toggle-panel toggle-right">
        <h1>Hello, Friend!</h1>
        <p>
          Register with your personal details to use all of the site's features
        </p>
        <button class="hidden" on:click={registerClick}>Sign Up</button>
      </div>
    </div>
  </div>
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap");

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Montserrat", sans-serif;
  }

  .container {
    background-color: #fff;

    position: relative;
    overflow: hidden;
    width: 100%;
    min-height: 100vh;
    margin-top: 5pxs;
  }

  .container p {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.3px;
    margin: 20px 0;
  }

  .container span {
    font-size: 12px;
  }

  .container a {
    color: #333;
    font-size: 13px;
    text-decoration: none;
    margin: 15px 0 10px;
  }

  .container button {
    background-color: #512da8;
    color: #fff;
    font-size: 12px;
    padding: 10px 45px;
    border: 1px solid transparent;
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-top: 10px;
    cursor: pointer;
  }

  .container button.hidden {
    background-color: transparent;
    border-color: #fff;
  }

  .container form {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    height: 100%;
  }

  .container input {
    background-color: #eee;
    border: none;
    margin: 8px 0;
    padding: 10px 15px;
    font-size: 13px;
    border-radius: 8px;
    width: 100%;
    outline: none;
  }

  .form-container {
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
  }

  .sign-in {
    left: 0;
    width: 50%;
    z-index: 2;
  }

  .container.active .sign-in {
    transform: translateX(100%);
  }

  .sign-up {
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: 1;
  }

  .container.active .sign-up {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
    animation: move 0.6s;
  }

  @keyframes move {
    0%,
    49.99% {
      opacity: 0;
      z-index: 1;
    }
    50%,
    100% {
      opacity: 1;
      z-index: 5;
    }
  }

  .social-icons {
    margin: 20px 0;
  }

  .social-icons a {
    border: 1px solid #ccc;
    border-radius: 20%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 3px;
    width: 40px;
    height: 40px;
  }

  .toggle-container {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: all 0.6s ease-in-out;
    border-radius: 150px 0 0 100px;
    z-index: 1000;
  }

  .container.active .toggle-container {
    transform: translateX(-100%);
    border-radius: 0 150px 100px 0;
  }

  .toggle {
    background-color: #512da8;
    height: 100%;
    background: linear-gradient(to right, #5c6bc0, #512da8);
    color: #fff;
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transform: translateX(0);
    transition: all 0.6s ease-in-out;
  }

  .container.active .toggle {
    transform: translateX(50%);
  }

  .toggle-panel {
    position: absolute;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 30px;
    text-align: center;
    top: 0;
    transform: translateX(0);
    transition: all 0.6s ease-in-out;
  }

  .toggle-left {
    transform: translateX(-200%);
  }

  .container.active .toggle-left {
    transform: translateX(0);
  }

  .toggle-right {
    right: 0;
    transform: translateX(0);
  }

  .container.active .toggle-right {
    transform: translateX(200%);
  }
</style>
