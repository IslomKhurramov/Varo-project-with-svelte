<script>
  import "../public/assets/css/reset.css";
  import "../public/assets/css/common.css";
  import "../public/assets/css/login.css";

  import { Router, Route, navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import Header from "./components/Header.svelte";
  import Login from "./components/login/Login.svelte";
  import { checkAuth, userData } from "./stores/user.store";
  import LeftNavbar from "./components/LeftNavbar.svelte";

  console.log("$userData:", $userData);

  onMount(() => {
    checkAuth();

    console.log("$userData:", $userData);

    // if ($userData.isLoggedIn) {
    //   console.log("User is logged in:", $userData);
    //   navigate("/");
    // } else {
    //   console.log("User is not logged in.");
    //   navigate("/login");
    // }
  });
</script>

<main>
  <Router>
    <!-- {#if $userData.isLoggedIn} -->
    <Header class="header" />
    <Route path="/" component={Page1} />
    <Route path="/page1" component={Page1} />
    <Route path="/page2" component={Page2} />
    <Route path="/page3" component={Page3} />
    <Route path="/page4" component={Page4} />
    <Route path="/page5" component={Page5} />
    <Route path="/page6" component={Page6} />
    <!-- {:else} -->
    <Route path="/login" component={Login} />
    <!-- {/if} -->
  </Router>
</main>

<style>
  main {
    padding-top: 0px; /* Adjust based on your header height */
  }
</style>
