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

      userData.set({
        isLoggedIn: true,
        userInfo: response?.CODE,
      });

      localStorage.setItem("userInfo", JSON.stringify(response?.CODE));

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
      const response = await login(email, password);

      console.log("handleLogin:", response);

      userData.set({
        isLoggedIn: true,
        userInfo: response?.CODE,
      });

      localStorage.setItem("userInfo", JSON.stringify(response?.CODE));

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

<!-- 
<div class="container {containerActive ? 'active' : ''}" id="container">
  <div class="form-container sign-up">
    <form on:submit|preventDefault={handleRegister}>
      <h1>Create Account</h1>
      <div class="social-icons">
        <a href="#" class="icon"><i class="fa-brands fa-google-plus-g"></i></a>
        <a href="#" class="icon"><i class="fa-brands fa-facebook-f"></i></a>
        <a href="#" class="icon"><i class="fa-brands fa-github"></i></a>
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
          <a href="#" class="icon"><i class="fa-brands fa-google-plus-g"></i></a
          >
          <a href="#" class="icon"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="#" class="icon"><i class="fa-brands fa-github"></i></a>
          <a href="#" class="icon"><i class="fa-brands fa-linkedin-in"></i></a>
        </div>
        <span>or use your email and password</span>
        <input type="email" placeholder="Email" bind:value={email} />
        <input type="password" placeholder="Password" bind:value={password} />
        <div>
          <a
            on:click={() => {
              errorMessage = null;
              tabMenu = "find_user";
            }}>아이디찾기</a
          >
          <a
            on:click={() => {
              errorMessage = null;
              tabMenu = "reset_password";
            }}>비밀번호초기화</a
          >
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
-->

<body>
  <div class="memberWrap loginWrap flex">
    {#if tabMenu === "login"}
      <section>
        <h1>
          <img src="./assets/images/login_logo.svg" />
          Login
        </h1>
        <div class="form">
          <div class="formControl">
            <label for="email">Email</label>
            <input
              type="text"
              placeholder="admin@admin.com"
              id="email"
              name="email"
              bind:value={email}
              required
            />
          </div>
          <div class="formControl">
            <label for="userPw">Password</label>
            <input
              type="password"
              id="userPw"
              placeholder="Your password"
              name="password"
              bind:value={password}
              required
            />
          </div>
          <div class="findIdPw">
            <a
              on:click={() => {
                errorMessage = null;
                tabMenu = "find_user";
              }}>아이디 찾기</a
            >
            <a
              on:click={() => {
                errorMessage = null;
                tabMenu = "reset_password";
              }}>비밀번호 초기화</a
            >
          </div>
        </div>
        {#if errorMessage}
          <p class="error">{errorMessage}</p>
        {/if}
        <div class="btnWrap">
          <a on:click={handleLogin} class="btn loginBtn">로그인</a>
        </div>
        <div class="joinSummary">
          계정이 없으신가요?
          <span
            ><a
              on:click={() => {
                tabMenu = "signup";
              }}>회원가입</a
            > 하기</span
          >
        </div>
      </section>
    {/if}

    {#if tabMenu === "signup"}
      <section>
        <h1>
          <img src="./assets/images/login_logo.svg" />
          Signup
        </h1>
        <div class="form">
          <div class="formControl">
            <label for="email">Email</label>
            <input
              type="text"
              placeholder="admin@admin.com"
              id="email"
              name="email"
              bind:value={emailSignUp}
              required
            />
          </div>
          <div class="formControl">
            <label for="userPw">Password</label>
            <input
              type="password"
              id="userPw"
              placeholder="Your password"
              name="password"
              bind:value={passwordSignUp}
              required
            />
          </div>
          <div class="formControl">
            <label for="userPw">Confirm Password</label>
            <input
              type="password"
              id="userPw"
              placeholder="Your password"
              name="password"
              bind:value={confirmPasswordSignUp}
              required
            />
          </div>
          <div class="findIdPw">
            <a
              on:click={() => {
                errorMessage = null;
                tabMenu = "find_user";
              }}>아이디 찾기</a
            >
            <a
              on:click={() => {
                errorMessage = null;
                tabMenu = "reset_password";
              }}>비밀번호 초기화</a
            >
          </div>
        </div>
        {#if errorMessage}
          <p class="error">{errorMessage}</p>
        {/if}
        <div class="btnWrap">
          <a on:click={handleRegister} class="btn loginBtn">로그인</a>
        </div>
        <div class="joinSummary">
          계정이 있으신가요?
          <span
            ><a
              on:click={() => {
                tabMenu = "login";
              }}>로그인</a
            > 하기</span
          >
        </div>
      </section>
    {/if}
  </div>
</body>
