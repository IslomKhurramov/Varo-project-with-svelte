<script>
  import { Router, Route, navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import Header from "./components/Header.svelte";
  import Page1 from "./components/점검관리1/Page1.svelte";
  import Page2 from "./components/자산관리2/Page2.svelte";
  import Page3 from "./components/취약점관리3/Page3.svelte";
  import Page4 from "./components/점검항목관리4/Page4.svelte";
  import Page6 from "./components/환경설정6/Page6.svelte";
  import Page5 from "./components/대시보드5/Page5.svelte";
  import Footer from "./Footer.svelte";
  import Login from "./components/login/Login.svelte";
  import { checkSession } from "./stores/authToken";

  let isAuthenticated = false;
  let user = null; // Store the user info

  // Check session on component mount
  onMount(async () => {
    const session = await checkSession();
    isAuthenticated = session.isAuthenticated;
    user = session.user; // Store user info if authenticated

    if (!isAuthenticated) {
      navigate("/login"); // Redirect to login if not authenticated
    } else {
      console.log("Authenticated user info:", user); // Log user info to the console
    }
  });
</script>

<main>
  <!-- <Router>
    {#if isAuthenticated}
      <Header class="header" />
      <Route path="/" component="{Page1}" />
      <Route path="/page1" component="{Page1}" />
      <Route path="/page2" component="{Page2}" />
      <Route path="/page3" component="{Page3}" />
      <Route path="/page4" component="{Page4}" />
      <Route path="/page5" component="{Page5}" />
      <Route path="/page6" component="{Page6}" />
    {:else}
      <Route path="/login" component="{Login}" />
    {/if}
  </Router> -->
  <Router>
    <Header class="header" />
    <Route path="/" component="{Page1}" />
    <Route path="/page1" component="{Page1}" />
    <Route path="/page2" component="{Page2}" />
    <Route path="/page3" component="{Page3}" />
    <Route path="/page4" component="{Page4}" />
    <Route path="/page5" component="{Page5}" />
    <Route path="/page6" component="{Page6}" />
  </Router>
</main>

<style>
  main {
    padding-top: 0px; /* Adjust based on your header height */
  }
</style>
