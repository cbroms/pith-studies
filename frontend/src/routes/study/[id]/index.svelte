<script>
  import { onMount } from "svelte";
  import { studyStore } from "../../../stores/studyStore";

  let pid;
  let pressed = false;

  onMount(() => {
    const url = new URL(window.location.href);
    pid = url.searchParams.get("PROLIFIC_PID");
    studyStore.subscribeStudy(pid);
  });

  const onContinue = async () => {
    pressed = true;
    await studyStore.joinStudy(pid);
  };
</script>

<div class="container-outer">
  <h1>Welcome!</h1>

  <h3>Please enter your Prolific ID. Make sure it is entered correctly before pressing continue. </h3>
  <input bind:value={pid} />

  <button on:click={onContinue}>Continue</button>
</div>
