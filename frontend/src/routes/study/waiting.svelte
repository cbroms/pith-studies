<script>
  import { steps } from "../../steps/steps";
  import { studyStore } from "../../stores/studyStore";

  let clicked = false;

  const onReady = async () => {
    await studyStore.readyComplete($studyStore.pid);
  };
</script>

{#if $studyStore.step === steps.WAITING_ROOM}
  <h1>Waiting for others to join...</h1>
  <p>Please don't leave the page.</p>
{/if}

{#if $studyStore.step === steps.WAITING_ROOM_READY}
  <h1>Press ready to start</h1>
  <button on:click={onReady} disabled={!clicked}>Ready</button>
{/if}

{#if $studyStore.step === steps.WAITING_ROOM_READY_SUBMITTED}
  <h1>Waiting for others to continue...</h1>
  <button disabled>Ready</button>
{/if}
