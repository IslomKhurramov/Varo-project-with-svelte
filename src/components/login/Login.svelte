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

  let errorMessage = "";
  let email = "";
  let password = "";
  let find_user = "";

  //for SignUp
  let username = "";
  let emailSignUp = "";
  let passwordSignUp = "";
  let confirmPasswordSignUp = "";
  let department = "";
  let successMessageSignUp = "";

  //FUNCTION SighUp

  const handleRegister = async () => {
    try {
      if (passwordSignUp !== confirmPasswordSignUp) {
        throw new Error("Passwords don't match");
      }

      const response = await register(
        username,
        emailSignUp,
        passwordSignUp,
        department,
      );

      await userData.set({
        isLoggedIn: true,
        userInfo: response?.CODE,
      });

      await localStorage.setItem("userInfo", JSON.stringify(response?.CODE));

      successMessageSignUp = "Registration successful! Redirecting to login...";
      errorMessage = "";

      navigate("/");
    } catch (err) {
      errorMessage = err?.message;
      successMessageSignUp = "";
    }
  };

  const handleLogin = async () => {
    try {
      const response = await login(email, password);

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
</script>

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
            <label for="email" style="font-size: 16px;">Email</label>
            <input
              style="font-size: 16px;"
              type="text"
              placeholder="email"
              id="email"
              name="email"
              bind:value={email}
              required
              on:keydown={(event) => {
                if (event.key === "Enter") {
                  if (email && password) {
                    handleLogin();
                  }
                }
              }}
            />
          </div>
          <div class="formControl">
            <label for="userPw" style="font-size: 16px;">Password</label>
            <input
              style="font-size: 16px;"
              type="password"
              id="userPw"
              placeholder="Your password"
              name="password"
              bind:value={password}
              required
              on:keydown={(event) => {
                if (event.key === "Enter") {
                  if (email && password) {
                    handleLogin();
                  }
                }
              }}
            />
          </div>
          <div class="findIdPw">
            <a
              href="javascript:void(0);"
              style="font-size: 16px;"
              on:click={() => {
                email = "";
                password = "";
                find_user = "";
                errorMessage = null;
                username = "";
                emailSignUp = "";
                passwordSignUp = "";
                confirmPasswordSignUp = "";
                department = "";
                successMessageSignUp = "";
                tabMenu = "find_user";
              }}>아이디 찾기</a
            >
            <a
              href="javascript:void(0);"
              style="font-size: 16px;"
              on:click={() => {
                email = "";
                password = "";
                find_user = "";
                errorMessage = null;
                username = "";
                emailSignUp = "";
                passwordSignUp = "";
                confirmPasswordSignUp = "";
                department = "";
                successMessageSignUp = "";
                tabMenu = "reset_password";
              }}>비밀번호 초기화</a
            >
          </div>
          {#if errorMessage}
            <p style="font-size: 16px;" class="error">{errorMessage}</p>
          {/if}
        </div>

        <div class="btnWrap">
          <a
            on:click={handleLogin}
            class="btn loginBtn"
            style="font-size: 16px;">로그인</a
          >
        </div>
        <div class="joinSummary" style="font-size: 16px;">
          계정이 없으신가요?
          <span
            ><a
              href="javascript:void(0);"
              style="font-size: 16px;"
              on:click={() => {
                email = "";
                password = "";
                find_user = "";
                errorMessage = null;
                username = "";
                emailSignUp = "";
                passwordSignUp = "";
                confirmPasswordSignUp = "";
                department = "";
                successMessageSignUp = "";
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
            <label for="email" style="font-size: 16px;">Email</label>
            <input
              style="font-size: 16px;"
              type="text"
              placeholder="email"
              id="email"
              name="email"
              bind:value={emailSignUp}
              required
              on:keydown={(event) => {
                if (event.key === "Enter") {
                  if (emailSignUp && passwordSignUp && confirmPasswordSignUp) {
                    handleRegister();
                  }
                }
              }}
            />
          </div>
          <div class="formControl">
            <label for="userPw" style="font-size: 16px;">Password</label>
            <input
              style="font-size: 16px;"
              type="password"
              id="userPw"
              placeholder="Your password"
              name="password"
              bind:value={passwordSignUp}
              required
              on:keydown={(event) => {
                if (event.key === "Enter") {
                  if (emailSignUp && passwordSignUp && confirmPasswordSignUp) {
                    handleRegister();
                  }
                }
              }}
            />
          </div>
          <div class="formControl">
            <label for="userPw" style="font-size: 16px;">Confirm Password</label
            >
            <input
              style="font-size: 16px;"
              type="password"
              id="userPw"
              placeholder="Your password"
              name="password"
              bind:value={confirmPasswordSignUp}
              required
              on:keydown={(event) => {
                if (event.key === "Enter") {
                  handleRegister();
                }
              }}
            />
          </div>
          <div class="findIdPw">
            <a
              href="javascript:void(0);"
              style="font-size: 16px;"
              on:click={() => {
                email = "";
                password = "";
                find_user = "";
                errorMessage = null;
                username = "";
                emailSignUp = "";
                passwordSignUp = "";
                confirmPasswordSignUp = "";
                department = "";
                successMessageSignUp = "";
                tabMenu = "find_user";
              }}>아이디 찾기</a
            >
            <a
              href="javascript:void(0);"
              style="font-size: 16px;"
              on:click={() => {
                email = "";
                password = "";
                find_user = "";
                errorMessage = null;
                username = "";
                emailSignUp = "";
                passwordSignUp = "";
                confirmPasswordSignUp = "";
                department = "";
                successMessageSignUp = "";
                tabMenu = "reset_password";
              }}>비밀번호 초기화</a
            >
          </div>
          {#if errorMessage}
            <p class="error">{errorMessage}</p>
          {/if}
        </div>

        <div class="btnWrap">
          <a
            on:click={handleRegister}
            class="btn loginBtn"
            href="javascript:void(0);"
            style="font-size: 16px;">회원가입</a
          >
        </div>
        <div class="joinSummary" style="font-size: 16px;">
          계정이 있으신가요?
          <span
            ><a
              href="javascript:void(0);"
              style="font-size: 16px;"
              on:click={() => {
                email = "";
                password = "";
                find_user = "";
                errorMessage = null;
                username = "";
                emailSignUp = "";
                passwordSignUp = "";
                confirmPasswordSignUp = "";
                department = "";
                successMessageSignUp = "";
                tabMenu = "login";
              }}>로그인</a
            > 하기</span
          >
        </div>
      </section>
    {/if}

    {#if tabMenu === "find_user"}
      <section>
        <h1>
          <img src="./assets/images/login_logo.svg" />
          아이디 찾기
        </h1>
        <div class="form">
          <div class="formControl">
            <label for="email" style="font-size: 16px;">Email</label>
            <input
              style="font-size: 16px;"
              type="text"
              placeholder="email"
              id="email"
              name="email"
              bind:value={find_user}
              required
              on:keydown={(event) => {
                if (event.key === "Enter") {
                  if (find_user) {
                    findUser();
                  }
                }
              }}
            />
          </div>
          <div class="findIdPw">
            <a
              href="javascript:void(0);"
              style="font-size: 16px;"
              on:click={() => {
                email = "";
                password = "";
                find_user = "";
                errorMessage = null;
                username = "";
                emailSignUp = "";
                passwordSignUp = "";
                confirmPasswordSignUp = "";
                department = "";
                successMessageSignUp = "";
                tabMenu = "find_user";
              }}>아이디 찾기</a
            >
            <a
              href="javascript:void(0);"
              style="font-size: 16px;"
              on:click={() => {
                email = "";
                password = "";
                find_user = "";
                errorMessage = null;
                username = "";
                emailSignUp = "";
                passwordSignUp = "";
                confirmPasswordSignUp = "";
                department = "";
                successMessageSignUp = "";
                tabMenu = "reset_password";
              }}>비밀번호 초기화</a
            >
          </div>
          {#if errorMessage}
            <p class="error" style="font-size: 16px;">{errorMessage}</p>
          {/if}
        </div>

        <div class="btnWrap">
          <a
            on:click={findUser}
            class="btn loginBtn"
            href="javascript:void(0);"
            style="font-size: 16px;">아이디 찾기</a
          >
        </div>
        <div class="joinSummary" style="font-size: 16px;">
          계정이 있으신가요?
          <span
            ><a
              href="javascript:void(0);"
              style="font-size: 16px;"
              on:click={() => {
                email = "";
                password = "";
                find_user = "";
                errorMessage = null;
                username = "";
                emailSignUp = "";
                passwordSignUp = "";
                confirmPasswordSignUp = "";
                department = "";
                successMessageSignUp = "";
                tabMenu = "login";
              }}>로그인</a
            > 하기</span
          >
        </div>
      </section>
    {/if}

    {#if tabMenu === "reset_password"}
      <section>
        <h1>
          <img src="./assets/images/login_logo.svg" />
          비밀번호 초기화
        </h1>
        <div class="form">
          <div class="formControl">
            <label for="email" style="font-size: 16px;">Email</label>
            <input
              style="font-size: 16px;"
              type="text"
              placeholder="email"
              id="email"
              name="email"
              bind:value={find_user}
              on:keydown={(event) => {
                if (event.key === "Enter") {
                  if (find_user) {
                    resetPassword();
                  }
                }
              }}
            />
          </div>
          <div class="findIdPw">
            <a
              href="javascript:void(0);"
              style="font-size: 16px;"
              on:click={() => {
                email = "";
                password = "";
                find_user = "";
                errorMessage = null;
                username = "";
                emailSignUp = "";
                passwordSignUp = "";
                confirmPasswordSignUp = "";
                department = "";
                successMessageSignUp = "";
                tabMenu = "find_user";
              }}>아이디 찾기</a
            >
            <a
              href="javascript:void(0);"
              style="font-size: 16px;"
              on:click={() => {
                email = "";
                password = "";
                find_user = "";
                errorMessage = null;
                username = "";
                emailSignUp = "";
                passwordSignUp = "";
                confirmPasswordSignUp = "";
                department = "";
                successMessageSignUp = "";
                tabMenu = "reset_password";
              }}>비밀번호 초기화</a
            >
          </div>
          {#if errorMessage}
            <p class="error" style="font-size: 16px;">{errorMessage}</p>
          {/if}
        </div>

        <div class="btnWrap">
          <a
            on:click={resetPassword}
            class="btn loginBtn"
            href="javascript:void(0);"
            style="font-size: 16px;">비밀번호 초기화</a
          >
        </div>
        <div class="joinSummary" style="font-size: 16px;">
          계정이 있으신가요?
          <span
            ><a
              href="javascript:void(0);"
              style="font-size: 16px;"
              on:click={() => {
                email = "";
                password = "";
                find_user = "";
                errorMessage = null;
                username = "";
                emailSignUp = "";
                passwordSignUp = "";
                confirmPasswordSignUp = "";
                department = "";
                successMessageSignUp = "";
                tabMenu = "login";
              }}>로그인</a
            > 하기</span
          >
        </div>
      </section>
    {/if}
  </div>
</body>
