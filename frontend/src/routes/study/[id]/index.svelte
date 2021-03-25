<script>
  import { onMount } from "svelte";
  import { studyStore } from "../../../stores/studyStore";

  let pid;
  let pressed = false;

  onMount(() => {
    const url = new URL(window.location.href);
    pid = url.searchParams.get("PROLIFIC_PID");
    studyStore.subscribeStudy();
  });

  const onContinue = async () => {
    pressed = true;
    await studyStore.joinStudy(pid);
  };
</script>

<h1>Welcome!</h1>

<p>Ensure your Prolific ID is entered correctly, then press continue.</p>

<label for="pid">Please enter your Prolific ID: </label>
<input name="pid" bind:value={pid} />

<button disapbled={!pressed} on:click={onContinue}>Continue</button>
