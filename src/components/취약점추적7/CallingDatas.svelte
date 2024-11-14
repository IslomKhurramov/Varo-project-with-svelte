<script>
  import getAllTraceByPlan from "../../services/page7/service";
  import allTraceByPlan from "../../services/page7/trace.store";
  import { leftTrackData } from "../../services/page7/trace.store";
  import { getLeftTrackData } from "../../services/page7/service";
  import { onMount } from "svelte";

  onMount(() => {
    getLeftDatas();
  });

  async function getLeftDatas() {
    try {
      const response = await getLeftTrackData();
      console.log("response", response);
      if (response.RESULT === "OK") {
        leftTrackData.set(Object.values(response.CODE));
      }
    } catch (err) {
      await errorAlert(err?.message);
      loading = false;
    }
  }

  async function allTracePlan() {
    try {
      const response = await getAllTraceByPlan();

      if (response.RESULT === "OK") {
        allTraceByPlan.set(Object.values(response.CODE));
      }
    } catch (err) {
      await errorAlert(err?.message);
      loading = false;
    }
  }
</script>
