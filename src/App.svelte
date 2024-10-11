<script>
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

    <LeftNavbar />

    <!-- {:else} -->
    <Route path="/login" component={Login} />
    <!-- {/if} -->
  </Router>
</main>

<style>
  main {
    padding-top: 0px; /* Adjust based on your header height */
    width: 100%;
  }
</style>
