<script>
  import { Router, Route } from "svelte-routing";
  import Header from "./components/Header.svelte";
  import Page1 from "./components/점검관리1/Page1.svelte";
  import Page2 from "./components/자산관리2/Page2.svelte";
  import Page3 from "./components/취약점관리3/Page3.svelte";
  import Page4 from "./components/점검항목관리4/Page4.svelte";
  import Page5 from "./components/환경설정5/Page5.svelte";

  // No need to manage activeMenu here, it will be handled within Header.svelte
</script>

<main>
  <Router>
    <Header />
    <Route path="/" component="{Page1}" />
    <Route path="/page1" component="{Page1}" />
    <Route path="/page2" component="{Page2}" />
    <Route path="/page3" component="{Page3}" />
    <Route path="/page4" component="{Page4}" />
    <Route path="/page5" component="{Page5}" />
  </Router>
</main>

<style>
  main {
    padding-top: 80px; /* Adjust based on your header height */
  }
</style>
